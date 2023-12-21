import { IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import { Trash, Waiting } from "../icons";
import DoneIcon from "@mui/icons-material/Done";

type UploadingFileViewProps = {
  name: string;
  progressText: string;
  progress: number;
  onRemove: () => void;
};

export const UploadingFileView = ({
  name,
  onRemove,
  progress,
  progressText,
}: UploadingFileViewProps) => {
  return (
    <Stack
      sx={{ backgroundColor: "#F8F7F9", borderRadius: "12px" }}
      spacing={1}
      padding={3}
    >
      <Stack
        flexDirection={"row"}
        alignContent={"center"}
        justifyContent={"space-between"}
      >
        <Typography noWrap variant="subtitle1">
          {name}
        </Typography>
        <IconButton onClick={onRemove}>
          <Trash color="#0F5987" />
        </IconButton>
      </Stack>
      <Stack
        flexDirection={"row"}
        alignContent={"center"}
        justifyContent={"space-between"}
      >
        <Typography variant="subtitle1" color={"gray"}>
          {progressText}
        </Typography>
        <Stack flexDirection={'row'} alignItems={'center'}>
          {progress === 100 ? (
            <>
              <Waiting />
              <Typography variant="subtitle1" color={"gray"}>
                {"Uploading..."}
              </Typography>
            </>
          ) : (
            <>
              <DoneIcon sx={{ color: "#36D8D8" }} />

              <Typography
                textAlign={"center"}
                variant="subtitle1"
                color={"gray"}
              >
                {"Completed"}
              </Typography>
            </>
          )}
        </Stack>
      </Stack>
      {progress > 0 && (
        <LinearProgress
          sx={{ height: 10, borderRadius: "20px" }}
          variant="determinate"
          value={progress}
        />
      )}
    </Stack>
  );
};
