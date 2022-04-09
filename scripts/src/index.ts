import * as fs from "node:fs/promises";
import * as path from "node:path";
import { createCanvas, loadImage } from "canvas";
import config from "./config";
import { colorInRange, colorToString } from "./utils";
import { Color, Point } from "./types";

(async () => {
  try {
    const canvas = createCanvas(0, 0);
    const ctx = canvas.getContext("2d");

    const image = await loadImage(path.join(config.paths.storage, "test.png"));

    canvas.width = image.width;
    canvas.height = image.height;

    const offset = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1];
    const thickness = 1;
    const x = 5;
    const y = 5;

    const outlineColorThreshold = 0.2;
    const outlineColor: Color = [255, 0, 0, 255];

    for (let i = 0, length = offset.length; i < length; i += 2) {
      ctx.drawImage(
        image,
        x + offset[i] * thickness,
        y + offset[i + 1] * thickness
      );
    }

    ctx.globalCompositeOperation = "source-in";
    ctx.fillStyle = colorToString(outlineColor);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(image, x, y);

    const { data, width } = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const points: Point[] = [];

    for (let i = 0, length = data.length; i < length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      const color: Color = [r, g, b, a];
      if (colorInRange(color, outlineColor, outlineColorThreshold)) {
        const x = (i / 4) % width;
        const y = Math.floor(i / 4 / width);
        points.push([x, y]);
      }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colorToString(outlineColor);
    const pointSize = 1;
    for (let i = 0, length = points.length; i < length; i++) {
      const [x, y] = points[i];
      ctx.fillRect(x, y, pointSize, pointSize);
    }

    await fs.writeFile(
      path.join(config.paths.storage, "out.png"),
      canvas.toBuffer()
    );

    await fs.writeFile(
      path.join(config.paths.storage, "points.json"),
      JSON.stringify(points, null, 2)
    );

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
