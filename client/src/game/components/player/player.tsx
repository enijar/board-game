import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import useActions from "@/game/hooks/use-actions";
import { Action } from "@/game/types";
import playerState from "@/game/state/player";
import playerConfig from "@/game/config/player";
import { Direction } from "@/types";

function TextureAnimator(
  texture: THREE.Texture,
  tilesHoriz: number,
  tilesVert: number,
  numTiles: number,
  tileDispDuration: number
) {
  // note: texture passed by reference, will be updated by the update function.

  this.tilesHorizontal = tilesHoriz;
  this.tilesVertical = tilesVert;
  // how many images does this spritesheet contain?
  //  usually equals tilesHoriz * tilesVert, but not necessarily,
  //  if there at blank tiles at the bottom of the spritesheet.
  this.numberOfTiles = numTiles;
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1 / this.tilesHorizontal, 1 / this.tilesVertical);

  // how long should each image be displayed?
  this.tileDisplayDuration = tileDispDuration;

  // how long has the current image been displayed?
  this.currentDisplayTime = 0;

  // which image is currently being displayed?
  this.currentTile = 0;

  this.update = function (milliSec: number) {
    this.currentDisplayTime += milliSec;
    while (this.currentDisplayTime > this.tileDisplayDuration) {
      this.currentDisplayTime -= this.tileDisplayDuration;
      this.currentTile++;
      if (this.currentTile == this.numberOfTiles) this.currentTile = 0;
      const currentColumn = this.currentTile % this.tilesHorizontal;
      texture.offset.x = currentColumn / this.tilesHorizontal;
      const currentRow = Math.floor(this.currentTile / this.tilesHorizontal);
      texture.offset.y = currentRow / this.tilesVertical;
    }
  };
}

export default function Player() {
  const actions = useActions();

  const { canvas, ctx, texture } = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const texture = new THREE.Texture(canvas);
    return { canvas, ctx, texture };
  }, []);

  React.useEffect(() => {
    const sprite = new Image();
    sprite.onload = () => updateSprite();
    sprite.src = "/assets/player.png";

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

      if (playerState.direction === Direction.none) {
        frameX = 0;
      }

      if (playerState.direction === Direction.up) {
        frameY = 3;
      }

      if (playerState.direction === Direction.down) {
        frameY = 0;
      }

      if (playerState.direction === Direction.left) {
        frameY = 1;
      }

      if (playerState.direction === Direction.right) {
        frameY = 2;
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
    playerState.velocity.set(0, 0, 0);
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
