import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import useActions from "@/game/hooks/use-actions";
import { Action, Direction } from "@/game/types";
import playerState from "@/game/state/player";
import playerConfig from "@/game/config/player";
import { asset } from "@/utils";

type Props = {
  color?: string;
};

export default function Player({ color = "#ffd700" }: Props) {
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
    sprite.src = asset("/assets/player/knight.png");

    type Config = {
      [id: string]: {
        fps: number;
        frames: number;
        startX: number;
        startY: number;
        width: number;
        height: number;
      };
    };

    const config: Config = {
      idle: {
        fps: 8,
        frames: 4,
        startX: 0,
        startY: 22,
        width: 15,
        height: 22,
      },
      run: {
        fps: 24,
        frames: 4,
        startX: 0,
        startY: 0,
        width: 15,
        height: 22,
      },
    };

    let nextFrame: number;

    let lastFrameTime = 0;
    let id = "idle";
    let scaleX = 1;
    let scaleY = 1;
    let frameX = 0;
    let frameY = 0;

    // @todo clean this up or move it to own file
    function updateSprite() {
      nextFrame = requestAnimationFrame(updateSprite);

      const frameDelay = 1000 / config[id].fps;
      const frameWidth = config[id].width;
      const frameHeight = config[id].height;
      const frames = config[id].frames;
      const startX = config[id].startX;
      const startY = config[id].startY;

      canvas.width = frameWidth;
      canvas.height = frameHeight;

      const now = Date.now();
      if (now - lastFrameTime < frameDelay) return;
      lastFrameTime = now;

      switch (playerState.direction) {
        case Direction.none:
          id = "idle";
          break;
        case Direction.right:
          scaleX = 1;
          id = "run";
          break;
        case Direction.left:
          scaleX = -1;
          id = "run";
          break;
        case Direction.down:
          id = "run";
          break;
        case Direction.up:
          id = "run";
          break;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.globalCompositeOperation = "destination-atop";
      ctx.globalAlpha = 0.25;

      ctx.fillStyle = color;
      ctx.fillRect(0, 0, frameWidth, frameHeight);

      ctx.globalAlpha = 1;

      ctx.save();

      ctx.scale(scaleX, scaleY);

      ctx.drawImage(
        sprite,
        startX + frameWidth * frameX,
        startY + frameHeight * frameY,
        frameWidth,
        frameHeight,
        0,
        0,
        frameWidth * scaleX,
        frameHeight * scaleY
      );

      if (++frameX > frames - 1) {
        frameX = startX;
      }

      ctx.restore();

      texture.needsUpdate = true;
    }

    return () => cancelAnimationFrame(nextFrame);
  }, [canvas, ctx, texture, color]);

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
