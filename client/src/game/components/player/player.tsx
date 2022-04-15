import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import useActions from "@/game/hooks/use-actions";
import { Action } from "@/game/types";
import playerState from "@/game/state/player";
import playerConfig from "@/game/config/player";
import { Direction } from "@/types";
import { asset } from "@/utils";

export default function Player() {
  const actions = useActions();

  const { canvas, ctx, texture } = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    return { canvas, ctx, texture };
  }, []);

  React.useEffect(() => {
    const sprite = new Image();
    sprite.onload = () => updateSprite();
    sprite.src = asset("/assets/player.png");

    const frameDelay = 1000 / 8;
    const framesX = 4;
    const framesY = 4;

    let nextFrame: number;
    let frameY = 0;
    let frameX = 0;
    let lastFrameTime = 0;

    // @todo clean this up or move it to own file
    function updateSprite() {
      nextFrame = requestAnimationFrame(updateSprite);

      const frameWidth = sprite.width / framesX;
      const frameHeight = sprite.height / framesY;

      canvas.width = frameWidth;
      canvas.height = frameHeight;

      const now = Date.now();
      if (now - lastFrameTime < frameDelay) return;
      lastFrameTime = now;

      switch (playerState.direction) {
        case Direction.none:
          frameX = 0;
          break;
        case Direction.up:
          frameY = 3;
          break;
        case Direction.down:
          frameY = 0;
          break;
        case Direction.left:
          frameY = 1;
          break;
        case Direction.right:
          frameY = 2;
          break;
      }

      ctx.clearRect(0, 0, frameWidth, frameHeight);

      ctx.drawImage(
        sprite,
        frameWidth * frameX,
        frameHeight * frameY,
        frameWidth,
        frameHeight,
        0,
        0,
        frameWidth,
        frameHeight
      );

      if (++frameX > framesX - 1) {
        frameX = 0;
      }

      texture.needsUpdate = true;
    }

    return () => cancelAnimationFrame(nextFrame);
  }, [canvas, ctx, texture]);

  useFrame(() => {
    let direction: Direction = 0;
    for (let i = 0, length = actions.length; i < length; i++) {
      switch (actions[i]) {
        case Action.up:
          direction = Direction.up;
          break;
        case Action.down:
          direction = Direction.down;
          break;
        case Action.left:
          direction = Direction.left;
          break;
        case Action.right:
          direction = Direction.right;
          break;
      }
    }
    switch (direction) {
      case Direction.none:
        playerState.velocity.set(0, 0, 0);
        break;
      case Direction.up:
        playerState.velocity.y = 1;
        break;
      case Direction.down:
        playerState.velocity.y = -1;
        break;
      case Direction.left:
        playerState.velocity.x = -1;
        break;
      case Direction.right:
        playerState.velocity.x = 1;
        break;
      default:
        playerState.velocity.set(0, 0, 0);
    }
    playerState.direction = direction;
  });

  return (
    <group>
      <mesh>
        <planeBufferGeometry args={[playerConfig.width, playerConfig.height]} />
        <meshBasicMaterial depthWrite={false} transparent map={texture} />
      </mesh>
    </group>
  );
}
