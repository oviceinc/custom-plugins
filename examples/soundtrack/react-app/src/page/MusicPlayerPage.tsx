import { useGlobalAudioPlayer } from "react-use-audio-player";
import { MusicPlayer } from "../component/v1/MusicPlayer";
import { useCallback, useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";

export const MusicPlayerPage = () => {
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
  const frameRef = useRef<ReturnType<typeof setTimeout> | undefined>();
  const rateRef = useRef<number>(1);
  const [position, setPosition] = useState(0);
  const [name, setName] = useState("");

  const onFastForward = useCallback(() => {
    if (rateRef.current >= 2) {
      return setRate(2);
    }
    rateRef.current += 0.5;
    return setRate(rateRef.current);
  }, [setRate]);

  const onBackForward = useCallback(() => {
    if (rateRef.current <= 0.5) {
      return setRate(0.5);
    }
    rateRef.current -= 0.5;
    return setRate(rateRef.current);
  }, [setRate]);

  const handleLoop = useCallback(() => {
    loop(!looping);
  }, [loop, looping]);

  const onUpload = useCallback(
    (file: File) => {
      const objectURL = URL.createObjectURL(file);
      setName(file.name);
      load(objectURL, {
        format: file.name.split(".").pop() || "mp3",
        initialVolume: 0.3,
      });
    },
    [load]
  );

  const animate = useCallback(() => {
    setPosition(getPosition());
    // frameRef.current = requestAnimationFrame(animate);
  }, [getPosition]);

  const onChangePosition = useCallback(
    (value: number) => {
      seek(value);
      setPosition(value);
    },
    [seek]
  );
  useEffect(() => {
    if (playing) {
      frameRef.current = setInterval(() => {
        setPosition(getPosition());
      }, duration);
    }

    return () => {
      clearInterval(frameRef.current);
      frameRef.current = undefined;
    };
  }, [animate, duration, getPosition, playing]);

  return (
    <Stack alignItems={"center"} justifyContent={"center"} height={"100vh"}>
      <MusicPlayer
        loading={isLoading}
        fileName={name}
        isLooping={looping}
        isPlaying={playing}
        duration={duration}
        position={position}
        volume={volume}
        setVolume={setVolume}
        setPosition={onChangePosition}
        onBackForward={onBackForward}
        onFastForward={onFastForward}
        onLoop={handleLoop}
        onPause={togglePlayPause}
        onStart={togglePlayPause}
        onUpload={onUpload}
      />
    </Stack>
  );
};
