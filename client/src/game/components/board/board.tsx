import React from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import Tile from "@/game/components/board/tile";
import { TileType } from "@/types";

type Props = {
  width?: number;
  height?: number;
  originalWidth?: number;
  originalHeight?: number;
  tiles?: TileType[];
};

export default function Board({
  originalWidth = 1200,
  originalHeight = 800,
  tiles = [],
}: Props) {
  const [hoveringTileId, setHoveringTileId] = React.useState(0);
  const [selectedTileId, setSelectedTileId] = React.useState(0);

  const { camera, size } = useThree();
  const sceneSize = React.useMemo(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const fov = THREE.MathUtils.degToRad(cam.fov);
    const height = 2 * Math.tan(fov / 2) * 5;
    const width = height * cam.aspect;
    return { width, height };
  }, [camera, size]);

  const mapSize = React.useMemo(() => {
    if (sceneSize.width < sceneSize.height) {
      const aspect = originalHeight / originalWidth;
      return { width: sceneSize.width, height: sceneSize.width * aspect };
    }
    const aspect = originalWidth / originalHeight;
    return { width: sceneSize.height * aspect, height: sceneSize.height };
  }, [sceneSize, originalWidth, originalHeight]);

  const scale = React.useMemo(() => {
    if (sceneSize.width < sceneSize.height) {
      return sceneSize.width / originalWidth;
    }
    return sceneSize.height / originalHeight;
  }, [sceneSize, originalWidth, originalHeight]);

  const getColor = React.useCallback(
    (tile) => {
      if (selectedTileId === tile.id) {
        return "#00ff00";
      }
      if (hoveringTileId === tile.id) {
        return "#999999";
      }
      return "#000000";
    },
    [selectedTileId, hoveringTileId]
  );

  return (
    <group
      rotation={[THREE.MathUtils.degToRad(-15), 0, 0]}
      position={[0, Math.min(mapSize.width, mapSize.height) * 0.06, 0]}
      onPointerDown={() => {
        setSelectedTileId(0);
      }}
    >
      <mesh>
        <planeBufferGeometry args={[mapSize.width, mapSize.height]} />
        <meshBasicMaterial
          color="crimson"
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <group>
        {tiles.map((tile) => {
          const x = THREE.MathUtils.mapLinear(
            tile.x,
            0,
            originalWidth,
            originalWidth * -0.5,
            originalWidth * 0.5
          );
          const y = THREE.MathUtils.mapLinear(
            tile.y,
            0,
            originalHeight,
            originalHeight * 0.5,
            originalHeight * -0.5
          );
          return (
            <Tile
              key={tile.id}
              image={`/tiles/${tile.id}.svg`}
              color={getColor(tile)}
              scale={scale}
              x={x}
              y={y}
              onPointerOver={(event) => {
                event.stopPropagation();
                document.body.style.cursor = "pointer";
                setHoveringTileId(tile.id);
              }}
              onPointerOut={(event) => {
                event.stopPropagation();
                document.body.style.cursor = "auto";
                setHoveringTileId(0);
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
                document.body.style.cursor = "pointer";
                setSelectedTileId(selectedTileId === tile.id ? 0 : tile.id);
              }}
            />
          );
        })}
      </group>
    </group>
  );
}
