import { useEffect } from "react";

export const useMessageEventListener = (
  handleMessage: (event: MessageEvent) => void
) => {
  useEffect(() => {
    const eventListener = (event: MessageEvent) => {
      handleMessage(event);
    };

    window.addEventListener("message", eventListener);

    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, [handleMessage]);
};
