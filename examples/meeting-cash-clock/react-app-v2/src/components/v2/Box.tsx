import { Stack, StackProps } from "@mui/material";

export const Box: React.FC<StackProps> = ({ children, ...props }) => {
  return (
    <Stack
      padding={2}
      justifyContent={"center"}
      sx={{ backgroundColor: "#FFFFFF" }}
      borderRadius={"6px"}
      border={"1px solid"}
      borderColor={"#E7E3E9"}
      {...props}
    >
      {children}
    </Stack>
  );
};
