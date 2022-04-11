import React from "react";
import useListener from "@/game/hooks/use-listener";
import { Action } from "@/game/types";

type UseAction = {
  actions: Action[];
  has: (action: Action) => boolean;
};

export default function useActions(): UseAction {
  const [actions, setActions] = React.useState<Action[]>([]);

  function getActionFromKey(key: string) {
    let action: Action;
    switch (key.toLocaleLowerCase()) {
      case "w":
      case "arrowup":
        action = Action.up;
        break;
      case "s":
      case "arrowdown":
        action = Action.down;
        break;
      case "a":
      case "arrowleft":
        action = Action.left;
        break;
      case "d":
      case "arrowright":
        action = Action.right;
        break;
    }
    return action;
  }

  useListener("keydown", (event) => {
    const action = getActionFromKey(event.key);
    if (action === undefined) return;
    setActions((actions) => {
      if (actions.includes(action)) return actions;
      return [...actions, action];
    });
  });

  useListener("keyup", (event) => {
    const action = getActionFromKey(event.key);
    if (action === undefined) return;
    setActions((actions) => {
      return actions.filter((item) => item !== action);
    });
  });

  return React.useMemo(() => {
    return {
      actions,
      has(action) {
        return actions.includes(action);
      },
    };
  }, [actions]);
}
