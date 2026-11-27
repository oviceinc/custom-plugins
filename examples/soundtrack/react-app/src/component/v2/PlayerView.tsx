import {
  IconButton,
  Slider,
  Stack,
  CircularProgress,
  ToggleButton,
} from "@mui/material";
import {
  Loop,
  Pause,
  Play,
  Shuffle,
  SkipNext,
  SkipPrevious,
  VolumeDown,
  VolumeUp,
} from "../icons";

export type PlayerViewProps = {
  volume?: number;
  position?: number;
  duration?: number;
  setVolume?: (value: number) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onSkipNext?: () => void;
  onSkipPrevious?: () => void;
  setPosition?: (value: number) => void;
  onShuffle?: (value: boolean) => void;
  onLoop?: (value: boolean) => void;
  isPlaying?: boolean;
  isLoading?: boolean;
  shuffle?: boolean;
  loop?: boolean;
};
export const PlayerView = ({
  volume,
  setVolume,
  onPause,
  onPlay,
  onShuffle,
  onSkipNext,
  onSkipPrevious,
  setPosition,
  onLoop,
  isPlaying,
  isLoading,
  duration,
  position,
  shuffle,
  loop,
}: PlayerViewProps) => {
  console.log(volume);
  return (
    <Stack alignItems={"center"} width={"100%"}>
      <Slider
        sx={{
          height: 6,
          "& .MuiSlider-thumb": {
            height: 16,
            width: 16,
          },
        }}
        value={position}
        step={1}
        max={duration}
        onChange={(_, value) => setPosition?.(value as number)}
      />
      <Stack
        spacing={2}
        width={"90%"}
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
        justifyContent={"space-between"}
        width={"100%"}
        flexWrap={"wrap"}
      >
        <ToggleButton
          sx={{ border: 0, "&.Mui-selected": { backgroundColor: "#D7F7F7" } }}
          value={!shuffle}
          selected={shuffle}
          onChange={(_event, value) => onShuffle?.(value)}
        >
          <Shuffle color={shuffle ? "#199999" : undefined} />
        </ToggleButton>
        <IconButton onClick={onSkipPrevious}>
          <SkipPrevious />
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
          <SkipNext />
        </IconButton>
        <ToggleButton
          sx={{ border: 0, "&.Mui-selected": { backgroundColor: "#D7F7F7" } }}
          value={!loop}
          selected={loop}
          onChange={(_event, value) => onLoop?.(value)}
        >
          <Loop color={shuffle ? "#199999" : undefined} />
        </ToggleButton>
      </Stack>
    </Stack>
  );
};
