import React from "react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Camera from "@/game/components/camera/camera";
import Map from "@/game/components/map/map";
import Player from "@/game/components/player/player";

export default function Game() {
  return (
    <Canvas flat linear dpr={1}>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Map />
        <Player />
        <Camera />
      </React.Suspense>
    </Canvas>
  );
}
