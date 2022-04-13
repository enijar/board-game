import * as THREE from "three";

export type Point = [x: number, y: number];

export type TileType = {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export enum Direction {
  none = 0,
  up = 1,
  down = 2,
  left = 3,
  right = 4,
}

export type PlayerState = {
  direction: Direction;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  speed: number;
};
