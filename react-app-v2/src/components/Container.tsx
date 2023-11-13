import { Stack } from "@mui/material";
import { ReactElement } from "react";
type ContainerProps = {
  children: ReactElement;
};
export const Container = ({ children }: ContainerProps) => {
  return (
    <Stack
      justifyContent={"center"}
      sx={{
        position: "absolute",
        backgroundColor: "white",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {children}
    </Stack>
  );
};
