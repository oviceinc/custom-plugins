import { Stack } from "@mui/material";
import { ReactElement } from "react";
type ContainerProps = {
  children: ReactElement;
};
export const Container = ({ children }: ContainerProps) => {
  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        // position: "absolute",
        backgroundColor: "#F9F9F9",
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
        minHeight: "100vh"
      }}
    >
      {children}
    </Stack>
  );
};
