import React from "react";
import useListener from "@/game/hooks/use-listener";

export default function useKeys(allowedKeys: string[]): string[] {
  const keysRef = React.useRef<string[]>([]);

  useListener("keydown", (event) => {
    const keys = keysRef.current;
    const key = event.key.toLowerCase();
    if (!allowedKeys.includes(key) || keys.includes(key)) return;
    keys.push(key);
  });

  useListener("keyup", (event) => {
    const keys = keysRef.current;
    const key = event.key.toLowerCase();
    const index = keys.indexOf(key);
    if (index === -1) return;
    keys.splice(index, 1);
  });

  return keysRef.current;
}
