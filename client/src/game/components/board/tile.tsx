import React from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { ThreeEvent, useLoader } from "@react-three/fiber";

type Props = {
  image: string;
  scale?: number;
  color: THREE.ColorRepresentation;
  onPointerOver?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerOut?: (event: ThreeEvent<PointerEvent>) => void;
  onPointerDown?: (event: ThreeEvent<PointerEvent>) => void;
};

export default function Tile({
  image,
  color,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  scale = 0.005,
}: Props) {
  const svg = useLoader(SVGLoader, image);

  return (
    <group
      scale={[scale, scale * -1, scale]}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
    >
      {svg.paths.map((path, index) => {
        const shapes = SVGLoader.createShapes(path);
        return (
          <React.Fragment key={index}>
            {shapes.map((shape, index) => {
              return (
                <mesh key={index}>
                  <shapeBufferGeometry
                    ref={(shapeGeometry) => {
                      if (shapeGeometry === null) return;
                      shapeGeometry.center();
                    }}
                    args={[shape]}
                  />
                  <meshBasicMaterial
                    color={color}
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
  );
}
