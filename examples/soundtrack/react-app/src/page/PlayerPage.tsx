import { Avatar, Box, Stack, Typography } from "@mui/material";
import { PlayerView } from "../component/v2/PlayerView";
import defaultImage from "../assets/default_song_img.jpg";
type PlayerPageProps = {
  onUpload: () => void;
};

export const PlayerPage = ({ onUpload }: PlayerPageProps) => {
  return (
    <Stack spacing={2} alignItems={"center"} justifyContent={"center"}>
      <Avatar
        alt="Song Image"
        src={defaultImage}
        sx={{ width: "220px", height: "220px" }}
      />
      <Stack alignItems={"center"} justifyContent={"center"}>
        <Typography textAlign={'center'} variant={"h5"}>All I Want For Christmas Is You</Typography>
        <Typography textAlign={'center'} variant={"subtitle1"} color="gray">
          Mariah Carey
        </Typography>
      </Stack>
      <PlayerView onUpload={onUpload} />
    </Stack>
  );
};
