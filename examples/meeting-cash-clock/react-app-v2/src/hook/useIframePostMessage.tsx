import { useCallback } from "react";
import { Meeting, OviceClient } from "../context/MeetingContext";
import { GetParticipantsRequest } from "../page/type";

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
    (
      message:
        | OviceEmitToOthersRequest
        | OviceEmitToRequest
        | GetParticipantsRequest
    ) => {
      window.parent.postMessage(message, "*");
    },
    []
  );
};

export const useGetParticipantsRequest = () => {
  const iframePostMessage = useIframePostMessage();
  return useCallback(() => {
    iframePostMessage({
      type: "ovice_get_participants",
    });
  }, [iframePostMessage]);
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
