import React from "react";
import * as THREE from "three";
import mapConfig from "@/game/config/map";
import { asset } from "@/utils";
import playerState from "@/game/state/player";

export default function Map() {
  const objectUrlRef = React.useRef<string | null>(null);

  const { canvas, ctx, texture } = React.useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const texture = new THREE.Texture(canvas);
    texture.minFilter = THREE.NearestFilter;
    texture.magFilter = THREE.NearestFilter;
    return { canvas, ctx, texture };
  }, []);

  React.useEffect(() => {
    const tiles: number[][] = [];

    for (let y = 0; y < mapConfig.height; y++) {
      tiles.push([]);
      for (let x = 0; x < mapConfig.width; x++) {
        tiles[y].push(THREE.MathUtils.randInt(1, 8));
      }
    }

    let nextFrame: number;

    (async () => {
      type Images = {
        [id: number]: HTMLImageElement;
      };
      const images: Images = {};
      for (let id = 1; id <= 8; id++) {
        await new Promise((resolve) => {
          images[id] = new Image();
          images[id].onload = resolve;
          images[id].src = asset(`/assets/map/${id}.png`);
        });
      }

      canvas.width = mapConfig.width * mapConfig.tile.width;
      canvas.height = mapConfig.height * mapConfig.tile.height;

      for (let y = 0; y < mapConfig.height; y++) {
        for (let x = 0; x < mapConfig.width; x++) {
          const image = images[tiles[y][x]];
          ctx.drawImage(
            image,
            x * mapConfig.tile.width,
            y * mapConfig.tile.height,
            mapConfig.tile.width,
            mapConfig.tile.height
          );
        }
      }

      const map = new Image();

      function render() {
        nextFrame = requestAnimationFrame(render);
        if (objectUrlRef.current === null) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.globalCompositeOperation = "destination-atop";
        ctx.globalAlpha = 0.25;

        const x = THREE.MathUtils.mapLinear(
          playerState.position.x,
          mapConfig.width * -0.5,
          mapConfig.width * 0.5,
          0,
          canvas.width
        );
        const y = THREE.MathUtils.mapLinear(
          playerState.position.y,
          mapConfig.height * 0.5,
          mapConfig.height * -0.5,
          0,
          canvas.height
        );

        const xIndex = Math.floor(x / mapConfig.tile.width);
        const yIndex = Math.floor(y / mapConfig.tile.height);

        ctx.fillStyle = "#ffd700";
        ctx.fillRect(
          xIndex * mapConfig.tile.width,
          yIndex * mapConfig.tile.height,
          mapConfig.tile.width,
          mapConfig.tile.height
        );

        ctx.globalAlpha = 1;

        ctx.drawImage(map, 0, 0, canvas.width, canvas.height);

        texture.needsUpdate = true;
      }

      canvas.toBlob(async (blob) => {
        if (objectUrlRef.current !== null) {
          URL.revokeObjectURL(objectUrlRef.current);
        }
        objectUrlRef.current = URL.createObjectURL(blob);
        map.onload = () => render();
        map.src = objectUrlRef.current;
      });
    })();
    return () => {
      if (objectUrlRef.current !== null) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      cancelAnimationFrame(nextFrame);
    };
  }, [texture, canvas, ctx]);

  return (
    <group>
      <mesh>
        <planeBufferGeometry args={[mapConfig.width, mapConfig.height]} />
        <meshBasicMaterial depthWrite={false} map={texture} />
      </mesh>
    </group>
  );
}
