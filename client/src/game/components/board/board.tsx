import React from "react";
import * as THREE from "three";
import Tile from "@/game/components/board/tile";
import tiles from "@/game/config/tiles";

type Props = {
  width?: number;
  height?: number;
  originalWidth?: number;
  originalHeight?: number;
};

export default function Board({
  width = 4,
  height = 4,
  originalWidth = 500,
  originalHeight = 500,
}: Props) {
  const [hoveringTileId, setHoveringTileId] = React.useState(0);
  const [selectedTileId, setSelectedTileId] = React.useState(0);

  const scale = width / originalWidth;

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
      position={[0, 0.2, 0]}
    >
      <mesh>
        <planeBufferGeometry args={[width, height]} />
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
                setHoveringTileId(tile.id);
              }}
              onPointerOut={(event) => {
                event.stopPropagation();
                setHoveringTileId(0);
              }}
              onPointerDown={(event) => {
                event.stopPropagation();
                setSelectedTileId(selectedTileId === tile.id ? 0 : tile.id);
              }}
            />
          );
        })}
      </group>
    </group>
  );
}
