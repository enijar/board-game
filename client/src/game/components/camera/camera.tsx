import React from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import cameraConfig from "@/game/config/camera";

type Props = {
  children?: React.ReactNode;
};

export default function Camera({ children }: Props) {
  return (
    <>
      <PerspectiveCamera makeDefault position={cameraConfig.position}>
        <group position-z={cameraConfig.position.z * -1}>{children}</group>
      </PerspectiveCamera>
      <OrbitControls makeDefault />
    </>
  );
}
