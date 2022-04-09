import React from "react";
import * as THREE from "three";

export default function Board() {
  return (
    <group>
      <mesh>
        <planeBufferGeometry />
        <meshBasicMaterial color="crimson" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
