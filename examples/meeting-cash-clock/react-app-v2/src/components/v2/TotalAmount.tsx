import { Typography } from "@mui/material";
import { Box } from "./Box";

export const TotalAmount = ({ total}: { total: number }) => {
  return (
    <Box
      flexDirection={"row"}
      paddingLeft={4}
      paddingRight={4}
      alignItems={"center"}
      gap={1}
      justifyContent={"center"}
      width={"-webkit-fill-available"}
    >
      <Typography color={"#202020"} fontWeight={"600"} variant="subtitle1">
        Total
      </Typography>
      <Typography variant="h5" color={"#199999"} fontWeight={"600"}>
        {`$${total.toFixed(2)}`}
      </Typography>
    </Box>
  );
};
