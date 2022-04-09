import { Color } from "./types";

export function colorToString(color: Color): string {
  return `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
}

export function colorInRange(a: Color, b: Color, threshold: number): boolean {
  const minR = b[0] - b[0] * threshold;
  const maxR = b[0] + b[0] * threshold;
  const minG = b[1] - b[1] * threshold;
  const maxG = b[1] + b[1] * threshold;
  const minB = b[2] - b[2] * threshold;
  const maxB = b[2] + b[2] * threshold;
  const minA = b[3] - b[3] * threshold;
  const maxA = b[3] + b[3] * threshold;
  return (
    a[0] >= minR &&
    a[0] <= maxR &&
    a[1] >= minG &&
    a[1] <= maxG &&
    a[2] >= minB &&
    a[2] <= maxB &&
    a[3] >= minA &&
    a[3] <= maxA
  );
}
