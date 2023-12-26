import { Button, Stack } from "@mui/material";

type ControlProps = {
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  onClear: () => void;
  isRunning: boolean;
  isStarted: boolean;
  isPaused: boolean;
  isStoped: boolean;
};
export const Control = ({
  isPaused,
  isRunning,
  isStarted,
  isStoped,
  onClear,
  onPause,
  onResume,
  onStart,
  onStop,
}: ControlProps) => {
  return (
    <Stack
      flexDirection={"row"}
      gap={5}
      justifyContent={"center"}
      alignItems={"center"}
    >
      {!isStarted && (
        <Button
          sx={{
            backgroundColor: "#36D8D8",
            color: "black",
            borderRadius: "8px",
            textTransform: "none",
          }}
          variant="contained"
          onClick={onStart}
          disableElevation
        >
          Start
        </Button>
      )}

      {isRunning && !isPaused && (
        <Button
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#0F5987",
            borderRadius: "8px",
            border: "1px solid #0F5987",
            textTransform: "none",
          }}
          variant="contained"
          onClick={onPause}
          disableElevation
        >
          Pause
        </Button>
      )}
      {isPaused && (
        <Button
          sx={{
            backgroundColor: "#0F5987",
            borderRadius: "8px",
            textTransform: "none",
          }}
          variant="contained"
          onClick={onResume}
          disableElevation
        >
          Resume
        </Button>
      )}
      {!isStoped && isStarted && (
        <Button
          sx={{
            backgroundColor: "#EB3F34",
            borderRadius: "8px",
            textTransform: "none",
          }}
          variant="contained"
          onClick={onStop}
          disableElevation
        >
          Stop
        </Button>
      )}
      {isStoped && !isRunning && (
        <Button
          sx={{
            backgroundColor: "#36D8D8",
            color: "black",
            borderRadius: "8px",
            textTransform: "none",
          }}
          variant="contained"
          onClick={onClear}
          disableElevation
        >
          Clear
        </Button>
      )}
    </Stack>
  );
};
