import React from "react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Camera from "@/game/components/camera/camera";
import Player from "@/game/components/player/player";

export default function Game() {
  return (
    <Canvas flat linear dpr={1}>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Camera />
        <Player />
      </React.Suspense>
    </Canvas>
  );
}
