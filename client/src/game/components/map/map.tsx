import React from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import mapConfig from "@/game/config/map";

export default function Map() {
  const texture = useTexture("/assets/map.png");

  React.useMemo(() => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat = new THREE.Vector2(
      mapConfig.width * 0.5,
      mapConfig.height * 0.5
    );
  }, [texture]);

  return (
    <group>
      <mesh>
        <planeBufferGeometry args={[mapConfig.width, mapConfig.height]} />
        <meshBasicMaterial depthWrite={false} map={texture} />
      </mesh>
    </group>
  );
}
