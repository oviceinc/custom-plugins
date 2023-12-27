import {
  Box,
  CircularProgress,
  IconButton,
  Slider,
  Stack,
  ToggleButton,
  Typography,
  styled,
  useTheme,
} from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import LoopIcon from "@mui/icons-material/Loop";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PauseIcon from "@mui/icons-material/Pause";
import {
  FastForwardRounded,
  FastRewindRounded,
  VolumeDownRounded,
  VolumeUpRounded,
} from "@mui/icons-material";
type MusicPlayerProps = {
  fileName: string;
  isPlaying: boolean;
  loading?: boolean;
  duration: number;
  volume: number;
  setVolume: (value: number) => void;
  position: number;
  isLooping: boolean;
  onStart: () => void;
  onPause: () => void;
  onLoop: () => void;
  onUpload: (file: File) => void;
  onFastForward: () => void;
  onBackForward: () => void;
  setPosition: (value: number) => void;
};

const WallPaper = styled("div")({
  position: "absolute",
  width: "100%",
  height: "100%",
  top: 0,
  left: 0,
  overflow: "hidden",
  background: "linear-gradient(rgb(255, 38, 142) 0%, rgb(255, 105, 79) 100%)",
  transition: "all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s",
  "&:before": {
    content: '""',
    width: "140%",
    height: "140%",
    position: "absolute",
    top: "-40%",
    right: "-50%",
    background:
      "radial-gradient(at center center, rgb(62, 79, 249) 0%, rgba(62, 79, 249, 0) 64%)",
  },
  "&:after": {
    content: '""',
    width: "140%",
    height: "140%",
    position: "absolute",
    bottom: "-50%",
    left: "-30%",
    background:
      "radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)",
    transform: "rotate(30deg)",
  },
});

const TinyText = styled(Typography)({
  fontSize: "0.75rem",
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

const CoverImage = styled("div")({
  width: 100,
  height: 100,
  objectFit: "cover",
  overflow: "hidden",
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: "rgba(0,0,0,0.08)",
  "& > img": {
    width: "100%",
  },
});

const Widget = styled("div")(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: "100%",
  margin: "auto",
  position: "relative",
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.4)",
  backdropFilter: "blur(40px)",
}));
export const MusicPlayer = ({
  isPlaying,
  fileName,
  loading,
  isLooping,
  position,
  duration,
  volume,
  onStart,
  onPause,
  onLoop,
  onUpload,
  onBackForward,
  onFastForward,
  setPosition,
  setVolume,
}: MusicPlayerProps) => {
  const theme = useTheme();

  function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
    return formattedTime;
  }

  const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    ev.preventDefault();
    const file = ev.target.files?.[0];
    if (!file) {
      return;
    }
    onUpload(file);
  };
  const mainIconColor = theme.palette.mode === "dark" ? "#fff" : "#000";
  const lightIconColor =
    theme.palette.mode === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)";

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      <Widget>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography noWrap>
            <b>{fileName}</b>
          </Typography>
        </Box>
        <Slider
          aria-label="time-indicator"
          size="small"
          value={position}
          min={0}
          step={1}
          valueLabelFormat={formatDuration(position)}
          valueLabelDisplay="auto"
          max={duration}
          onChange={(_, value) => setPosition(value as number)}
          sx={{
            color: theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
            height: 4,
            "& .MuiSlider-thumb": {
              width: 8,
              height: 8,
              transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
              "&:before": {
                boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
              },
              "&:hover, &.Mui-focusVisible": {
                boxShadow: `0px 0px 0px 8px ${
                  theme.palette.mode === "dark"
                    ? "rgb(255 255 255 / 16%)"
                    : "rgb(0 0 0 / 16%)"
                }`,
              },
              "&.Mui-active": {
                width: 20,
                height: 20,
              },
            },
            "& .MuiSlider-rail": {
              opacity: 0.28,
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(position)}</TinyText>
          <TinyText>-{formatDuration(duration - position)}</TinyText>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: -1,
          }}
        >
          <ToggleButton
            value={"loop"}
            selected={isLooping}
            size="small"
            onChange={() => {
              onLoop();
            }}
          >
            <LoopIcon />
          </ToggleButton>
          <IconButton onClick={onBackForward}>
            <FastRewindRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          {!isPlaying ? (
            <IconButton onClick={onStart}>
              {loading ? (
                <CircularProgress sx={{ color: mainIconColor }} />
              ) : (
                <PlayCircleIcon
                  sx={{ fontSize: "3rem" }}
                  htmlColor={mainIconColor}
                />
              )}
            </IconButton>
          ) : (
            <IconButton onClick={onPause}>
              <PauseIcon sx={{ fontSize: "3rem" }} htmlColor={mainIconColor} />
            </IconButton>
          )}
          <IconButton onClick={onFastForward}>
            <FastForwardRounded fontSize="large" htmlColor={mainIconColor} />
          </IconButton>
          <IconButton role="button" component="label">
            <input
              type="file"
              accept="audio/*"
              style={{ display: "none" }}
              onChange={onInputChange}
            />
            <FileUploadIcon />
          </IconButton>
        </Box>

        <Stack
          spacing={2}
          direction="row"
          sx={{ mb: 1, px: 1 }}
          alignItems="center"
        >
          <VolumeDownRounded htmlColor={lightIconColor} />
          <Slider
            aria-label="Volume"
            value={volume}
            onChange={(_, value) => setVolume(value as number)}
            step={0.1}
            max={1}
            sx={{
              color:
                theme.palette.mode === "dark" ? "#fff" : "rgba(0,0,0,0.87)",
              "& .MuiSlider-track": {
                border: "none",
              },
              "& .MuiSlider-thumb": {
                width: 24,
                height: 24,
                backgroundColor: "#fff",
                "&:before": {
                  boxShadow: "0 4px 8px rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible, &.Mui-active": {
                  boxShadow: "none",
                },
              },
            }}
          />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
      </Widget>
      <WallPaper />
    </Box>
  );
};
