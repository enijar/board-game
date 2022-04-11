import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import playerState from "@/game/state/player";

type Props = {
  width?: number;
  height?: number;
};

export default function Map({ width = 200, height = 200 }: Props) {
  const texture = useTexture("/assets/map.png");
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat = new THREE.Vector2(100, 100);

  const [min, max] = React.useMemo(() => {
    return [
      new THREE.Vector3(width * -0.5, height * -0.5, 0),
      new THREE.Vector3(width * 0.5, height * 0.5, 0),
    ];
  }, [width, height]);

  const groupRef = React.useRef<THREE.Group>();

  useFrame(() => {
    const group = groupRef.current;
    group.position.add(playerState.velocity.multiplyScalar(playerState.speed));
    group.position.clamp(min, max);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeBufferGeometry args={[width, height]} />
        <meshBasicMaterial depthWrite={false} map={texture} />
      </mesh>
    </group>
  );
}
