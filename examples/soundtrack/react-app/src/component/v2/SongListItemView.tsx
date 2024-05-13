import { IconButton, Stack, Typography } from "@mui/material";
import { Play, Trash } from "../icons";

export type SongListItemViewProps = {
  name: string;
  artist: string;
  onPlay?: () => void;
  onRemove?: () => void;
  loading?: boolean;
};
export const SongListItemView = ({
  name,
  artist,
  onPlay,
  onRemove,
  loading,
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
        <IconButton disabled={loading} onClick={onRemove}>
          <Trash />
        </IconButton>
      </Stack>
    </Stack>
  );
};
