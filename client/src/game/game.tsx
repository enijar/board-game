import React from "react";
import { Canvas } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import Board from "@/game/components/board/board";
import Camera from "@/game/components/camera";

export default function Game() {
  const tiles = React.useMemo(() => {
    fetch("/board.svg")
      .then((res) => res.text())
      .then((svg) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, "image/svg+xml");
        const [, , width, height] = doc.firstElementChild
          .getAttribute("viewBox")
          .split(" ")
          .map((n) => parseFloat(n));
        console.log({ width, height });
      });
    return [];
  }, []);

  React.useEffect(() => {
    console.log(tiles);
  }, [tiles]);

  return (
    <Canvas flat linear dpr={1}>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Board />
        <Camera />
      </React.Suspense>
    </Canvas>
  );
}
