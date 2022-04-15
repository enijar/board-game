import * as THREE from "three";
import { Direction, PlayerState } from "@/game/types";

const playerState: PlayerState = {
  direction: Direction.none,
  position: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  speed: 0.1,
};

export default playerState;
