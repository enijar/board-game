import React from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { ThreeEvent, useLoader } from "@react-three/fiber";
import { a, useSpring } from "@react-spring/three";

type Props = {
  image: string;
  scale?: number;
  x?: number;
  y?: number;
  color: string;
  onPointerOver?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerDown?: (event: ThreeEvent<PointerEvent>) => void;
};

export default function Tile({
  image,
  scale = 1,
  x = 0,
  y = 0,
  color,
  onPointerOver,
  onPointerOut,
  onPointerDown,
}: Props) {
  const svg = useLoader(SVGLoader, image);

  const [props, set] = useSpring(() => {
    return { color };
  });

  React.useEffect(() => {
    set.start({ color });
  }, [color]);

  return (
    <group
      scale={scale}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
    >
      <group position={[x, y, 0]}>
        {svg.paths.map((path, index) => {
          const shapes = SVGLoader.createShapes(path);
          return (
            <React.Fragment key={index}>
              {shapes.map((shape, index) => {
                return (
                  <mesh key={index} scale={[1, -1, 1]}>
                    <shapeBufferGeometry args={[shape]} />
                    <a.meshBasicMaterial
                      color={props.color}
                      side={THREE.DoubleSide}
                      depthWrite={false}
                    />
                  </mesh>
                );
              })}
            </React.Fragment>
          );
        })}
      </group>
    </group>
  );
}
