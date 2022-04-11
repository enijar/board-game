import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import playerState from "@/game/state/player";
import mapConfig from "@/game/config/map";

export default function Map() {
  const texture = useTexture("/assets/map.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat = new THREE.Vector2(
    mapConfig.width * 0.5,
    mapConfig.height * 0.5
  );

  const [min, max] = React.useMemo(() => {
    return [
      new THREE.Vector3(mapConfig.width * -0.5, mapConfig.height * -0.5, 0),
      new THREE.Vector3(mapConfig.width * 0.5, mapConfig.height * 0.5, 0),
    ];
  }, []);

  const groupRef = React.useRef<THREE.Group>();

  useFrame(() => {
    const group = groupRef.current;
    playerState.position
      .add(playerState.velocity.multiplyScalar(playerState.speed))
      .clamp(min, max);
    group.position.copy(playerState.position);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeBufferGeometry args={[mapConfig.width, mapConfig.height]} />
        <meshBasicMaterial depthWrite={false} map={texture} />
      </mesh>
    </group>
  );
}
