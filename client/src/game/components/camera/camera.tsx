import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import cameraConfig from "@/game/config/camera";
import playerState from "@/game/state/player";
import mapConfig from "@/game/config/map";
import playerConfig from "@/game/config/player";

type Props = {
  children?: React.ReactNode;
};

export default function Camera({ children }: Props) {
  const [min, max] = React.useMemo(() => {
    return [
      new THREE.Vector3(
        mapConfig.width * -0.5,
        mapConfig.height * -0.5 + playerConfig.height * 0.5,
        0
      ),
      new THREE.Vector3(mapConfig.width * 0.5, mapConfig.height * 0.5, 0),
    ];
  }, []);

  useFrame(({ camera }) => {
    playerState.position
      .add(playerState.velocity.multiplyScalar(playerState.speed))
      .clamp(min, max);
    camera.position.copy(playerState.position);
    camera.position.z = cameraConfig.position.z;
    camera.rotation.set(0, 0, 0);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={cameraConfig.position}>
        <group position-z={cameraConfig.position.z * -1}>{children}</group>
      </PerspectiveCamera>
    </>
  );
}
