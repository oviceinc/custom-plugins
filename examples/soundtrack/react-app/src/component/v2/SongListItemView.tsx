import { IconButton, Stack, Typography } from "@mui/material";
import { Play, Trash } from "../icons";

type SongListItemViewProps = {
  name: string;
  artist: string;
  onPlay?: () => void;
  onRemove?: () => void;
};
export const SongListItemView = ({
  name,
  artist,
  onPlay,
  onRemove,
}: SongListItemViewProps) => {
  return (
    <Stack
      width={"100%"}
      spacing={1}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Stack>
        <Typography noWrap variant="subtitle1">
          {name}
        </Typography>
        <Typography noWrap variant="caption" color={"gray"}>
          {artist}
        </Typography>
      </Stack>
      <Stack gap={1} flexDirection={"row"} alignItems={"center"}>
        <IconButton onClick={onPlay}>
          <Play />
        </IconButton>
        <IconButton onClick={onRemove}>
          <Trash />
        </IconButton>
      </Stack>
    </Stack>
  );
};
