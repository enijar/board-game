import React from "react";
import { useFrame } from "@react-three/fiber";
import useActions from "@/game/hooks/use-actions";
import { Action } from "@/game/types";
import playerState from "@/game/state/player";

export default function Player() {
  const actions = useActions();

  useFrame(() => {
    playerState.velocity.set(0, 0, 0);
    if (actions.has(Action.left)) {
      playerState.velocity.x = 1;
    }
    if (actions.has(Action.right)) {
      playerState.velocity.x = -1;
    }
    if (actions.has(Action.up)) {
      playerState.velocity.y = -1;
    }
    if (actions.has(Action.down)) {
      playerState.velocity.y = 1;
    }
  });

  return (
    <group>
      <mesh>
        <planeBufferGeometry />
        <meshBasicMaterial color="crimson" depthWrite={false} />
      </mesh>
    </group>
  );
}
