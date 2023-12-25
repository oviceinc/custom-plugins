import { Stack } from "@mui/material";
import { TopBar } from "../component/v2/TopBar";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { PlayerPage } from "./PlayerPage";
import { FileUploadPage } from "./FileUploadPage";
import { SongListPage } from "./SongListPage";
import { useGetSongs } from "../hooks/api";
import { useSoundTrackContext } from "../context";
import { useGlobalAudioPlayer } from "react-use-audio-player";

type Pages = "upload" | "player" | "songList";
export const SoundtrackPage = () => {
  const { objectId, currentSong, setCurrentSong } = useSoundTrackContext();
  const [page, setPage] = useState<Pages>("player");
  const { data, loading, error } = useGetSongs(objectId);
  const {
    load,
    isLoading,
    playing,
    loop,
    looping,
    seek,
    duration,
    setVolume,
    getPosition,
    volume,
    setRate,
    togglePlayPause,
  } = useGlobalAudioPlayer();
  const songIndexRef = useRef(0);
  const mountedRef = useRef(false);
  const [shuffle, setSchuffle] = useState(false);

  const onBack = useCallback(() => {
    setPage("player");
  }, []);

  const onMenu = useCallback(() => {
    setPage("songList");
  }, []);

  const onUpload = useCallback(() => {
    setPage("upload");
  }, []);

  const onShuffle = useCallback(() => {
    setSchuffle(true);
  }, []);

  const onSkipNext = useCallback(() => {
    if (data?.songs.length === songIndexRef.current + 1) {
      songIndexRef.current = 0;
    } else {
      songIndexRef.current += 1;
    }
    console.log(songIndexRef.current);
    setCurrentSong(data?.songs[songIndexRef.current]);
  }, [data?.songs, setCurrentSong]);

  const onSkipPrevious = useCallback(() => {
    if (songIndexRef.current === 0) {
      songIndexRef.current = Number(data?.songs.length) - 1 || 0;
    } else {
      songIndexRef.current -= 1;
    }
    setCurrentSong(data?.songs[songIndexRef.current]);
  }, [data?.songs, setCurrentSong]);

  const onSongEnded = useCallback(() => {
    if (shuffle) {
      const randomIndex = Math.floor(
        Math.random() * (Number(data?.songs?.length) - 1)
      );
      songIndexRef.current = randomIndex;
      setCurrentSong(data?.songs[randomIndex]);
    }
  }, [data?.songs, setCurrentSong, shuffle]);

  const renderPage = useMemo(() => {
    switch (page) {
      case "upload":
        return <FileUploadPage />;
      case "player":
        return (
          <PlayerPage
            isPlaying={playing}
            onPause={togglePlayPause}
            onPlay={togglePlayPause}
            onShuffle={onShuffle}
            onSkipNext={onSkipNext}
            onSkipPrevious={onSkipPrevious}
            onUpload={onUpload}
            setVolume={setVolume}
            volume={volume}
            isLoading={isLoading}
          />
        );
      case "songList":
        return <SongListPage loading={loading} songs={data?.songs ?? []} />;
    }
  }, [
    page,
    playing,
    togglePlayPause,
    onShuffle,
    onSkipNext,
    onSkipPrevious,
    onUpload,
    setVolume,
    volume,
    isLoading,
    loading,
    data?.songs,
  ]);

  const pageTitle = useMemo(() => {
    let pageTitle: string | undefined = undefined;
    if (page === "upload") {
      pageTitle = "Upload Files";
    } else if (page === "songList") {
      pageTitle = "Song List";
    }
    return pageTitle;
  }, [page]);

  useEffect(() => {
    if (currentSong) {
      load(currentSong.url, {
        format: currentSong.name.split(".").pop() || "mp3",
        initialVolume: 0.3,
        html5: true,
        autoplay: true,
        onend: onSongEnded,
      });
    }
  }, [currentSong, load, onSongEnded]);

  useEffect(() => {
    if (data?.songs.length && !mountedRef.current) {
      mountedRef.current = true;
      setCurrentSong(data?.songs[0]);
    }
  }, [data?.songs, setCurrentSong]);

  return (
    <Stack spacing={4} paddingTop={4} paddingLeft={3} paddingRight={3}>
      <TopBar
        onBack={page !== "player" ? onBack : undefined}
        onMenu={page === "player" ? onMenu : undefined}
        title={pageTitle}
      />
      {renderPage}
    </Stack>
  );
};
