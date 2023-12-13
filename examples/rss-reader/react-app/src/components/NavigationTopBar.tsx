import { IconButton, Stack, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

type NavigationTopBarProps = {
  onAdd?: () => void;
  onGoBack?: () => void;
  step: "listFeed" | "addFeed" | "viewItem";
};
export const NavigationTopBar = ({
  step,
  onAdd,
  onGoBack,
}: NavigationTopBarProps) => {
  return (
    <Stack
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      {step === "listFeed" && (
        <Typography variant="body2">{"Feeder"}</Typography>
      )}
      {step === "addFeed" && (
        <Typography variant="body2">{"Add Feed"}</Typography>
      )}
      {step === "listFeed" && (
        <IconButton
          sx={{
            width: "30px",
            height: "30px",
            borderRadius: 0,
            backgroundColor: "#E6E5E5",
          }}
          onClick={onAdd}
        >
          <AddIcon />
        </IconButton>
      )}

      {step !== "listFeed" && (
        <IconButton
          sx={{
            width: "30px",
            height: "30px",
            borderRadius: 0,
            backgroundColor: "#E6E5E5",
          }}
          onClick={onGoBack}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
      )}
    </Stack>
  );
};
