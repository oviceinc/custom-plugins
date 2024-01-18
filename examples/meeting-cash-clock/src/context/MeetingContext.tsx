import { createContext, useContext, useMemo, useState } from "react";
import { OvicePayloadType } from "../page/type";
import { v4 as uuidv4 } from "uuid";

type MeetingStatus = "ready" | "started" | "ended" | "paused";
export type Participant = {
  id: string;
  name: string;
  owner: boolean;
  isSelf: boolean;
  timeSpent: number;
  elapsedTime: number;
  joinedAt: number | null;
  leftAt: number | null;
  totalCost: number | null;
  left: boolean;
};
export type Meeting = {
  id: string;
  costPerHour: number;
  hasOwner: boolean;
  startTime?: number | null;
  elapsedTime?: number | null;
  status: MeetingStatus;
  participants: Participant[];
};

export type OviceClient = OvicePayloadType;

interface OnboardingContextValue {
  meeting: Meeting;
  setMeeting: React.Dispatch<React.SetStateAction<Meeting>>;
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
  const [meeting, setMeeting] = useState<Meeting>({
    id: uuidv4(),
    costPerHour: 0,
    status: "ready",
    hasOwner: false,
    participants: [],
  });
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
