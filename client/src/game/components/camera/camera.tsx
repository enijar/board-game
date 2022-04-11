import React from "react";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import Minimap from "@/game/components/minimap/minimap";
import cameraConfig from "@/game/config/camera";

export default function Camera() {
  return (
    <PerspectiveCamera makeDefault position={cameraConfig.position}>
      <Minimap />
      <OrbitControls makeDefault />
    </PerspectiveCamera>
  );
}
