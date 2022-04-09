import React from "react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Board from "@/game/components/board";
import Camera from "@/game/components/camera";

export default function Game() {
  return (
    <Canvas flat linear>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Board />
        <Camera />
      </React.Suspense>
    </Canvas>
  );
}
