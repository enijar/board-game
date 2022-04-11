import React from "react";

export default function useListener<K extends keyof WindowEventMap>(
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions
) {
  const listenerRef = React.useRef(listener);
  React.useMemo(() => {
    listenerRef.current = listener;
  }, [listener]);

  const optionsRef = React.useRef(options);
  React.useMemo(() => {
    optionsRef.current = options;
  }, [options]);

  React.useEffect(() => {
    window.addEventListener(type, listenerRef.current, optionsRef.current);
    return () => {
      window.removeEventListener(type, listenerRef.current, optionsRef.current);
    };
  }, [type]);
}
