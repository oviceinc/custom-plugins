import React, { createContext, useContext, useState } from "react";
import { Song } from "../hooks/api";

type SoundtrackContextType = {
  objectId: string;
  currentSong: Song | undefined;
  setObjectId: React.Dispatch<React.SetStateAction<string>>;
  setCurrentSong: React.Dispatch<React.SetStateAction<Song | undefined>>;
};

export const SoundtrackContext = createContext<
  SoundtrackContextType | undefined
>(undefined);

export const useSoundTrackContext = () => {
  const meetingContext = useContext(SoundtrackContext);
  if (!meetingContext) {
    throw new Error("MeetingContext does not exist");
  }
  return meetingContext;
};

export const SoundtrackProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // TODO: objectId should be empty string
  const [objectId, setObjectId] = useState("1122");
  const [currentSong, setCurrentSong] = useState<Song | undefined>();

  return (
    <SoundtrackContext.Provider
      value={{ objectId, currentSong, setObjectId, setCurrentSong }}
    >
      {children}
    </SoundtrackContext.Provider>
  );
};
