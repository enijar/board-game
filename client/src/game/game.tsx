import React from "react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Board from "@/game/components/board/board";
import Camera from "@/game/components/camera";
import tiles from "@/game/config/tiles";

export default function Game() {
  return (
    <Canvas flat linear dpr={1}>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Board tiles={tiles} />
        <Camera />
      </React.Suspense>
    </Canvas>
  );
}
