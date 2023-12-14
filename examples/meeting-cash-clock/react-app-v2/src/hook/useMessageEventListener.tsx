import { useEffect, useRef } from "react";
import { useGetParticipantsRequest } from "./useIframePostMessage";

export const useMessageEventListener = (
  handleMessage: (event: MessageEvent) => void
) => {
  const sendGetParticipantsRequest = useGetParticipantsRequest();
  const initializedRef = useRef(false);

  useEffect(() => {
    const eventListener = (event: MessageEvent) => {
      handleMessage(event);
    };

    window.addEventListener("message", eventListener);
    if (!initializedRef.current) {
      sendGetParticipantsRequest();
      initializedRef.current = true;
    }
    return () => {
      window.removeEventListener("message", eventListener);
    };
  }, [handleMessage, sendGetParticipantsRequest]);
};
