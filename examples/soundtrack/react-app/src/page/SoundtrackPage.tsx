import { Grid, Stack } from "@mui/material";
import { TopBar } from "../component/v2/TopBar";
import { useCallback, useMemo, useState, useEffect, useRef } from "react";
import { PlayerPage } from "./PlayerPage";
import { FileUploadPage } from "./FileUploadPage";
import { SongListPage } from "./SongListPage";
import { useGetSongs } from "../hooks/api";
import { useSoundTrackContext } from "../context";
import { useGlobalAudioPlayer } from "react-use-audio-player";

type Pages = "uploadSong" | "songList";
export const SoundtrackPage = () => {
  const { objectId, currentSong, setCurrentSong } = useSoundTrackContext();
  const [page, setPage] = useState<Pages>("songList");
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

  const onMenu = useCallback(() => {
    setPage("songList");
  }, []);

  const onUpload = useCallback(() => {
    setPage("uploadSong");
  }, []);

  const onShuffle = useCallback((value: boolean) => {
    console.log("onShuffle", value);
    setSchuffle(value);
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
      case "uploadSong":
        return <FileUploadPage />;
      case "songList":
        return <SongListPage loading={loading} songs={data?.songs ?? []} />;
    }
  }, [page, loading, data?.songs]);

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
    if (data?.songs?.length && !mountedRef.current) {
      mountedRef.current = true;
      setCurrentSong(data?.songs[0]);
    }
  }, [data?.songs, setCurrentSong]);

  return (
    <Grid
      container
      paddingTop={10}
      paddingLeft={3}
      paddingRight={3}
      height={"100vh"}
      wrap="wrap"
    >
      <Grid item xs={6}>
        <Stack spacing={2} width={"100%"}>
          <TopBar
            onUploadSong={onUpload}
            onSongList={onMenu}
            isSongList={page === "songList"}
            isUploadSong={page === "uploadSong"}
          />

          <PlayerPage
            isPlaying={playing}
            onPause={togglePlayPause}
            onPlay={togglePlayPause}
            onShuffle={onShuffle}
            onSkipNext={onSkipNext}
            onSkipPrevious={onSkipPrevious}
            setVolume={setVolume}
            volume={volume}
            isLoading={isLoading}
            onLoop={loop}
            loop={looping}
            duration={duration}
            position={getPosition()}
            setPosition={seek}
            shuffle={shuffle}
          />
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <Stack width={"100%"}>{renderPage}</Stack>
      </Grid>
    </Grid>
  );
};
