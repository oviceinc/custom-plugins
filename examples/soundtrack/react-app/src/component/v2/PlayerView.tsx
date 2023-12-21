import React from "react";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { IconButton, Slider, Stack } from "@mui/material";
import { Pause, Play, Shuffle, Upload, VolumeDown, VolumeUp } from "../icons";

type PlayerViewProps = {
  onPlay?: () => void;
  onPause?: () => void;
  onSkipNext?: () => void;
  onSkipPrevious?: () => void;
  onShuffle?: () => void;
  onUpload?: () => void;
};
export const PlayerView = ({
  onPause,
  onPlay,
  onShuffle,
  onSkipNext,
  onSkipPrevious,
  onUpload,
}: PlayerViewProps) => {
  return (
    <Stack alignItems={"center"} width={"100%"}>
      <Stack
        spacing={2}
        width={"70%"}
        direction="row"
        sx={{ mb: 1 }}
        alignItems="center"
      >
        <VolumeDown width={24} />
        <Slider
          sx={{
            height: 6,
            "& .MuiSlider-thumb": {
              height: 16,
              width: 16,
            },
          }}
          value={20}
        />
        <VolumeUp width={24} />
      </Stack>
      <Stack
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={2}
      >
        <IconButton onClick={onShuffle}>
          <Shuffle />
        </IconButton>
        <IconButton onClick={onSkipPrevious}>
          <SkipPreviousIcon />
        </IconButton>

        <IconButton onClick={onPause}>
          <Pause />
        </IconButton>
        <IconButton onClick={onSkipNext}>
          <SkipNextIcon />
        </IconButton>
        <IconButton onClick={onUpload}>
          <Upload />
        </IconButton>
      </Stack>
    </Stack>
  );
};
