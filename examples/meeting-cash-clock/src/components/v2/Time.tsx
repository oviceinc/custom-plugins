import { Stack, Typography } from "@mui/material";
import { Box } from "./Box";

type TimeProps = {
  hours: string;
  minutes: string;
  seconds: string;
};

const TimeUnit = ({ time, unit }: { time: string; unit: string }) => {
  return (
    <Stack alignItems={"center"} spacing={2}>
      <Box padding={4}>
        <Typography color={"#808080"} variant="h4" fontWeight={600}>
          {time}
        </Typography>
      </Box>
      <Typography color={"#808080"} variant="body2" fontWeight={400}>
        {unit}
      </Typography>
    </Stack>
  );
};
export const Time = ({ hours, minutes, seconds }: TimeProps) => {
  return (
    <Stack flexDirection={"row"} gap={2} alignItems={"center"} justifyContent={'center'}>
      <TimeUnit time={hours} unit={"Hours"} />
      <TimeUnit time={minutes} unit={"Minutes"} />
      <TimeUnit time={seconds} unit={"Seconds"} />
    </Stack>
  );
};
