import { Skeleton, Stack } from "@mui/material";
import { memo } from "react";

export const LoadingSkeleton = memo(() => {
  return (
    <Stack spacing={1}>
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
      <Skeleton variant="rectangular" height={60} />
    </Stack>
  );
});

LoadingSkeleton.displayName = "LoadingSkeleton";
