import { useSoundTrackContext } from "../context";
import { useMessageEventListener } from "../hooks/useMessageEventListener";
import { useCallback } from "react";
import { SoundtrackPage } from "./SoundtrackPage";
import { Typography, Stack } from "@mui/material";

export const MainPage = () => {
  const { objectId, setObjectId } = useSoundTrackContext();
  useMessageEventListener(
    useCallback(
      (event: MessageEvent) => {
        if (event.data.type === "ovice_participants") {
          const objectId = event.data.participants[0].objectId;
          setObjectId(objectId);
        }
      },
      [setObjectId]
    )
  );

  if (!objectId) {
    return (
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        sx={{ height: "100vh" }}
      >
        <Typography textAlign={"center"} variant="h5">
          Please connect to object
        </Typography>
      </Stack>
    );
  }

  return <SoundtrackPage />;
};
