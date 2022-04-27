import * as THREE from "three";

export function updateVelocity(keys: string[], velocity: THREE.Vector3) {
  velocity.set(0, 0, 0);
  keys.forEach((key) => {
    if (key === "w") velocity.z = -1;
    if (key === "s") velocity.z = 1;
    if (key === "a") velocity.x = -1;
    if (key === "d") velocity.x = 1;
  });
}
