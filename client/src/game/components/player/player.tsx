import React from "react";
import { useFrame } from "@react-three/fiber";
import useActions from "@/game/hooks/use-actions";
import { Action } from "@/game/types";
import playerState from "@/game/state/player";
import playerConfig from "@/game/config/player";

export default function Player() {
  const actions = useActions();

  useFrame(() => {
    playerState.velocity.set(0, 0, 0);
    for (let i = 0, length = actions.length; i < length; i++) {
      switch (actions[i]) {
        case Action.up:
          playerState.velocity.y = -1;
          break;
        case Action.down:
          playerState.velocity.y = 1;
          break;
        case Action.left:
          playerState.velocity.x = 1;
          break;
        case Action.right:
          playerState.velocity.x = -1;
          break;
      }
    }
  });

  return (
    <group>
      <mesh>
        <planeBufferGeometry args={[playerConfig.width, playerConfig.height]} />
        <meshBasicMaterial color="crimson" depthWrite={false} />
      </mesh>
    </group>
  );
}
