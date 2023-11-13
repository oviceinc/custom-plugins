import Paper from "@mui/material/Paper";
import { ReactElement } from "react";
type ContainerProps = {
  children: ReactElement;
};
export const Container = ({ children }: ContainerProps) => {
  return <Paper elevation={3}>{children}</Paper>;
};
