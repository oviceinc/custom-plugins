import { useCallback } from "react";
import { Meeting, OviceClient } from "../context/MeetingContext";

type CustomPluginEmitToOthersData = {
  source: string;
  event: string;
  objectId: string;
  message: unknown;
};

type CustomPluginEmitToData = {
  to: string;
} & CustomPluginEmitToOthersData;

export type OviceEmitToOthersRequest = {
  type: "ovice_broadcast_message";
  payload: CustomPluginEmitToOthersData;
};

export type OviceEmitToRequest = {
  type: "ovice_emit_message";
  payload: CustomPluginEmitToData;
};

export const useIframePostMessage = () => {
  return useCallback(
    (message: OviceEmitToOthersRequest | OviceEmitToRequest) => {
      window.parent.postMessage(message, "*");
    },
    []
  );
};

export const usePostMessageMeetingDetails = () => {
  const iframePostMessage = useIframePostMessage();
  return useCallback(
    (meeting: Meeting, currentUser: OviceClient) => {
      iframePostMessage({
        type: "ovice_broadcast_message",
        payload: {
          objectId: currentUser.objectId,
          source: currentUser.id.toString(),
          event: "meeting_details",
          message: meeting,
        },
      });
    },
    [iframePostMessage]
  );
};
