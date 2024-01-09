import { Box, Stack, ToggleButton } from "@mui/material";
import { Upload, MenuList } from "../icons";

type TopBarProps = {
  onUploadSong?: (value: boolean) => void;
  onSongList?: (value: boolean) => void;
  isSongList?: boolean;
  isUploadSong?: boolean;
};
export const TopBar = ({
  onUploadSong,
  onSongList,
  isSongList,
  isUploadSong,
}: TopBarProps) => {
  return (
    <Stack
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <ToggleButton
        sx={{ border: 0, "&.Mui-selected": { backgroundColor: "#D7F7F7" } }}
        value={!isSongList}
        selected={isSongList}
        onChange={(_event, value) => onSongList?.(value)}
      >
        <MenuList color={isSongList ? "#199999" : undefined} />
      </ToggleButton>
      <ToggleButton
        sx={{ border: 0, "&.Mui-selected": { backgroundColor: "#D7F7F7" } }}
        value={!isUploadSong}
        selected={isUploadSong}
        onChange={(_event, value) => onUploadSong?.(value)}
      >
        <Upload color={isUploadSong ? "#199999" : undefined} />
      </ToggleButton>
    </Stack>
  );
};
