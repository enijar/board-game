import React from "react";
import * as THREE from "three";
import Tile from "@/game/components/board/tile";

export default function Board() {
  const [hoveringTile, setHoveringTile] = React.useState(false);

  return (
    <group
      rotation={[THREE.MathUtils.degToRad(-15), 0, 0]}
      position={[0, 0.2, 0]}
    >
      <mesh>
        <planeBufferGeometry args={[6, 4]} />
        <meshBasicMaterial
          color="crimson"
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <Tile
        image="/tile.svg"
        color={hoveringTile ? "#999999" : "#000000"}
        onPointerOver={() => {
          setHoveringTile(true);
        }}
        onPointerOut={() => {
          setHoveringTile(false);
        }}
        onPointerDown={() => {
          console.log("onPointerDown");
        }}
      />
    </group>
  );
}
