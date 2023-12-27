import { Avatar, Stack, Typography } from "@mui/material";
import { PlayerView, PlayerViewProps } from "../component/v2/PlayerView";
import defaultImage from "../assets/default_song_img.jpg";
import { useSoundTrackContext } from "../context";
import { toImage } from "../utils";
type PlayerPageProps = {
  onUpload: () => void;
} & PlayerViewProps;

export const PlayerPage = ({
  onUpload,
  isPlaying,
  onPause,
  onPlay,
  onShuffle,
  onSkipNext,
  onSkipPrevious,
  isLoading,
  setVolume,
  volume
}: PlayerPageProps) => {
  const { currentSong } = useSoundTrackContext();
  return (
    <Stack spacing={2} alignItems={"center"} justifyContent={"center"}>
      <Avatar
        alt="Song Image"
        src={currentSong?.image ? toImage(currentSong.image) : defaultImage}
        sx={{ width: "220px", height: "220px" }}
      />
      <Stack alignItems={"center"} justifyContent={"center"}>
        <Typography textAlign={"center"} variant={"h5"}>
          {currentSong?.title ?? currentSong?.name}
        </Typography>
        <Typography textAlign={"center"} variant={"subtitle1"} color="gray">
          {currentSong?.artist}
        </Typography>
      </Stack>
      <PlayerView
        isPlaying={isPlaying}
        onPause={onPause}
        onPlay={onPlay}
        onShuffle={onShuffle}
        onSkipNext={onSkipNext}
        onSkipPrevious={onSkipPrevious}
        onUpload={onUpload}
        isLoading={isLoading}
        volume={volume}
        setVolume={setVolume}
      />
    </Stack>
  );
};
