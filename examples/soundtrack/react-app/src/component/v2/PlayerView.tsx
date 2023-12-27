import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import { IconButton, Slider, Stack, CircularProgress } from "@mui/material";
import { Pause, Play, Shuffle, Upload, VolumeDown, VolumeUp } from "../icons";

export type PlayerViewProps = {
  volume?: number;
  setVolume?: (value: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onSkipNext?: () => void;
  onSkipPrevious?: () => void;
  onShuffle?: () => void;
  onUpload?: () => void;
  isPlaying?: boolean;
  isLoading?: boolean;
};
export const PlayerView = ({
  volume,
  setVolume,
  onPause,
  onPlay,
  onShuffle,
  onSkipNext,
  onSkipPrevious,
  onUpload,
  isPlaying,
  isLoading,
}: PlayerViewProps) => {
  console.log(volume)
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
          value={volume}
          step={0.1}
          max={1}
          onChange={(_, value) => setVolume?.(value as number)}
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
        {isPlaying ? (
          <IconButton onClick={onPause}>
            <Pause />
          </IconButton>
        ) : (
          <IconButton disabled={isLoading} onClick={onPlay}>
            {isLoading ? <CircularProgress /> : <Play width={64} height={64} />}
          </IconButton>
        )}
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
