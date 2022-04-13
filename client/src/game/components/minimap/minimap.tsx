import React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import mapConfig from "@/game/config/map";
import playerConfig from "@/game/config/player";
import cameraConfig from "@/game/config/camera";
import minimapConfig from "@/game/config/minimap";
import playerState from "@/game/state/player";

export default function Minimap() {
  const groupRef = React.createRef<THREE.Group>();
  const playerMeshRef = React.createRef<THREE.Mesh>();

  const { size, camera } = useThree();

  React.useEffect(() => {
    const group = groupRef.current;
    const cam = camera as THREE.PerspectiveCamera;
    const fov = THREE.MathUtils.degToRad(cam.fov);
    const height = 2 * Math.tan(fov / 2) * cameraConfig.position.z;
    const width = height * cam.aspect;
    group.position.set(
      width * -0.5 + minimapConfig.width * 0.5 + 0.5,
      height * -0.5 + minimapConfig.height * 0.5 + 0.5,
      group.position.z
    );
  }, [size, camera]);

  useFrame(() => {
    const playerMesh = playerMeshRef.current;
    playerMesh.position
      .copy(playerState.position)
      .multiplyScalar(minimapConfig.width / mapConfig.width);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <planeBufferGeometry
          args={[minimapConfig.width, minimapConfig.height]}
        />
        <meshBasicMaterial color="black" depthWrite={false} />
      </mesh>
      <mesh ref={playerMeshRef}>
        <planeBufferGeometry
          args={[
            playerConfig.width * (minimapConfig.width / mapConfig.width),
            playerConfig.height * (minimapConfig.height / mapConfig.height),
          ]}
        />
        <meshBasicMaterial color="crimson" depthWrite={false} />
      </mesh>
    </group>
  );
}
