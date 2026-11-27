import { Avatar, Stack, Typography } from "@mui/material";
import { PlayerView, PlayerViewProps } from "../component/v2/PlayerView";
import defaultImage from "../assets/default_song_img.jpg";
import { useSoundTrackContext } from "../context";
import { toImage } from "../utils";
type PlayerPageProps = PlayerViewProps;

export const PlayerPage = ({
  isPlaying,
  onPause,
  onPlay,
  onShuffle,
  onSkipNext,
  onSkipPrevious,
  isLoading,
  setVolume,
  onLoop,
  loop,
  shuffle,
  duration,
  position,
  setPosition,
  volume,
}: PlayerPageProps) => {
  const { currentSong } = useSoundTrackContext();
  return (
    <Stack
      spacing={2}
      alignItems={"center"}
      justifyContent={"center"}
      width={"100%"}
    >
      <Avatar
        alt="Song Image"
        src={currentSong?.image ? toImage(currentSong.image) : defaultImage}
        sx={{
          width: "100%",
          height: "100%",
          maxWidth: 220,
          maxHeight: 220,
          aspectRatio: "1/1",
        }}
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
        onLoop={onLoop}
        isLoading={isLoading}
        volume={volume}
        setVolume={setVolume}
        duration={duration}
        position={position}
        setPosition={setPosition}
        loop={loop}
        shuffle={shuffle}
      />
    </Stack>
  );
};
