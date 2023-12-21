import { Box, IconButton, Stack } from "@mui/material";
import { BackArrow, MenuList } from "../icons";

type TopBarProps = {
  onBack?: () => void;
  onMenu?: () => void;
};
export const TopBar = ({ onBack, onMenu }: TopBarProps) => {
  return (
    <Box>
      {onBack && (
        <IconButton onClick={onBack}>
          <BackArrow />
        </IconButton>
      )}
      {onMenu && (
        <IconButton sx={{ float: "right" }} onClick={onMenu}>
          <MenuList />
        </IconButton>
      )}
    </Box>
  );
};
