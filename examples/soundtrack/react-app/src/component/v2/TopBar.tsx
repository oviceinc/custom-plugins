import { Box, IconButton, Stack, Typography } from "@mui/material";
import { BackArrow, MenuList } from "../icons";

type TopBarProps = {
  onBack?: () => void;
  onMenu?: () => void;
  title?: string;
};
export const TopBar = ({ title, onBack, onMenu }: TopBarProps) => {
  return (
    <Box>
      {onBack && (
        <Stack gap={1} flexDirection={"row"} alignItems={"center"}>
          <IconButton onClick={onBack}>
            <BackArrow />
          </IconButton>
          {title && <Typography variant="subtitle1">{title}</Typography>}
        </Stack>
      )}
      {onMenu && (
        <IconButton sx={{ float: "right" }} onClick={onMenu}>
          <MenuList />
        </IconButton>
      )}
    </Box>
  );
};
