import { Stack } from "@mui/material";
import { Participant } from "./type";
import { ParticipantView } from "./ParticipantView";

type ParticipantListProps = {
  participants: Participant[];
};
export const ParticipantList = ({ participants }: ParticipantListProps) => {
  return (
    <Stack padding={2} justifyContent={"center"} sx={{ backgroundColor: "#E0E0E0" }}>
      {participants.map((participant, index) => (
        <ParticipantView
          key={index}
          name={participant.name}
          totalTime={participant.totalTime}
          cost={participant.cost}
        />
      ))}
    </Stack>
  );
};
