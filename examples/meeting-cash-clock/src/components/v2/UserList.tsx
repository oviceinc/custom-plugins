import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Participant } from "../type";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { timeFormat } from "../../page/util";
import { User } from "../icons";
type UserListProps = {
  participants: Participant[];
};
export const UserList = ({ participants }: UserListProps) => {
  return (
    <Accordion
      sx={{ width: "-webkit-fill-available", borderRadius: "6px" }}
      elevation={0}
    >
      <AccordionSummary
        sx={{
          backgroundColor: "#E2EBF1",
          borderTopRightRadius: "6px",
          borderTopLeftRadius: "6px",
        }}
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Stack
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"center"}
          gap={1}
        >
          <User color="#0F5987" />
          <Typography variant="subtitle2" fontWeight={600} color={"#0F5987"}>
            User List
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack
          paddingLeft={2}
          paddingRight={2}
          spacing={1}
          height={180}
          overflow={"auto"}
        >
          {participants.map((participant, index) => (
            <Grid container key={index} alignItems={'center'}>
              <Grid item xs={4} textAlign={"left"}>
                <Typography color={"#0F5987"} fontWeight={600} noWrap>
                  {participant.name}
                </Typography>
              </Grid>
              <Grid item xs={4} textAlign={"end"}>
                <Typography
                  variant="body2"
                  color={"#202020"}
                  fontWeight={400}
                >{`${timeFormat(Number(participant.totalTime))}`}</Typography>
              </Grid>
              <Grid item xs={4} textAlign={"right"}>
                <Typography
                  variant="body2"
                  color={"#202020"}
                  fontWeight={600}
                >{`$${Number(participant.cost).toFixed(2)}`}</Typography>
              </Grid>
            </Grid>
          ))}
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
