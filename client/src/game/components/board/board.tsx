import React from "react";
import * as THREE from "three";
import Tile from "@/game/components/board/tile";

type Props = {
  width?: number;
  height?: number;
  originalWidth?: number;
  originalHeight?: number;
};

const tiles = [
  {
    id: 1,
    x: 61.5,
    y: 310.5,
    width: 209,
    height: 160.5,
  },
  {
    id: 2,
    x: 222,
    y: 39.5,
    width: 257.5,
    height: 358,
  },
  {
    id: 3,
    x: 26.5,
    y: 147.5,
    width: 244,
    height: 163.5,
  },
  {
    id: 4,
    x: 117.5,
    y: 31.5,
    width: 153,
    height: 162,
  },
  {
    id: 5,
    x: 39.5,
    y: 54.5,
    width: 104,
    height: 107,
  },
];

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
    (tile): THREE.ColorRepresentation => {
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
              onPointerOver={() => {
                setHoveringTileId(tile.id);
              }}
              onPointerOut={() => {
                setHoveringTileId(0);
              }}
              onPointerDown={() => {
                setSelectedTileId(tile.id);
              }}
            />
          );
        })}
      </group>
    </group>
  );
}
