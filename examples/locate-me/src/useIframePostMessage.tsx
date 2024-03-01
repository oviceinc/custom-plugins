import { useCallback } from "react";

export const useIframePostMessage = () => {
  return useCallback((message: { type: string }) => {
    window.parent.postMessage(message, "*");
  }, []);
};

export const useGetParticipantsRequest = () => {
  const iframePostMessage = useIframePostMessage();
  return useCallback(() => {
    iframePostMessage({
      type: "ovice_get_participants",
    });
  }, [iframePostMessage]);
};
