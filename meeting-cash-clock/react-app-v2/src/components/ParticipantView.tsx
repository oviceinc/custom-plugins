import { Stack, Typography } from "@mui/material";
import { timeFormat } from "../page/util";

type ParticipantViewProps = {
  name: string;
  totalTime?: number;
  cost?: number;
};
export const ParticipantView = ({
  name,
  totalTime,
  cost,
}: ParticipantViewProps) => {
  return (
    <Stack
      flexDirection={"row"}
      gap={1}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Typography variant="body2">{name}</Typography>
      {totalTime !== undefined && (
        <Typography variant="body2">{`| ${timeFormat(totalTime)}`}</Typography>
      )}
      {cost !== undefined && (
        <Typography variant="body2">{`| $${cost.toFixed(2)}`}</Typography>
      )}
    </Stack>
  );
};
