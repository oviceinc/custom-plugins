import { useEffect, useRef } from "react";

export const useMessageEventListener = (
  handleMessage: (event: MessageEvent) => void
) => {
  const initializedRef = useRef(false);

  useEffect(() => {
    const eventListener = (event: MessageEvent) => {
      handleMessage(event);
    };

    window.addEventListener("message", eventListener);
    if (!initializedRef.current) {
      window.parent.postMessage(
        {
          type: "ovice_get_participants",
        },
        "*"
      );
      initializedRef.current = true;
    }
    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, [handleMessage]);
};
