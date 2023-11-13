import { createContext, useContext, useMemo, useState } from "react";
import { OvicePayloadType } from "../page/type";

type MeetingStatus = "ready" | "started" | "ended" | "paused";
export type Participant = {
  id: string;
  name: string;
  timeSpent: number | null;
  totalCost: number | null;
  left: boolean;
};
export type Meeting = {
  id: string;
  costPerHour: number;
  startTime?: number | null;
  elapsedTime?: number | null;
  status: MeetingStatus;
  participants: Participant[];
};

export type OviceClient = OvicePayloadType;

interface OnboardingContextValue {
  meeting: Meeting | undefined;
  setMeeting: React.Dispatch<React.SetStateAction<Meeting | undefined>>;
  currentUser: OviceClient | undefined;
  setCurrentUser: React.Dispatch<React.SetStateAction<OviceClient | undefined>>;
}

const MeetingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

export const useMeetingContext = () => {
  const meetingContext = useContext(MeetingContext);
  if (!meetingContext) {
    throw new Error("MeetingContext does not exist");
  }
  return meetingContext;
};

export const MeetingContextProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [meeting, setMeeting] = useState<Meeting | undefined>(undefined);
  const [currentUser, setCurrentUser] = useState<OviceClient | undefined>();

  const meetingConext = useMemo(() => {
    return {
      meeting,
      setMeeting,
      currentUser,
      setCurrentUser,
    };
  }, [currentUser, meeting]);
  return (
    <MeetingContext.Provider value={meetingConext}>
      {children}
    </MeetingContext.Provider>
  );
};
