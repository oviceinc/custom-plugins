import { SongListView } from "../component/v2/SongListView";
import { useCallback } from "react";
import { Song, useDeleteSong } from "../hooks/api";
import { useSoundTrackContext } from "../context";
import { CircularProgress, Stack } from "@mui/material";

type SongListPageProps = {
  songs: Song[];
  loading?: boolean;
};
export const SongListPage = ({ loading, songs }: SongListPageProps) => {
  const { objectId, setCurrentSong } = useSoundTrackContext();
  const { deleteSong, loading: deleteLoading } = useDeleteSong();
  const onPlaySong = useCallback(
    (song: Song) => {
      setCurrentSong(song);
    },
    [setCurrentSong]
  );
  const onRemoveSong = useCallback(
    (song: Song) => {
      deleteSong(objectId, song.id, song.name);
    },
    [deleteSong, objectId]
  );
  if (loading) {
    return (
      <Stack alignItems={"center"} alignContent={"center"}>
        <CircularProgress />
      </Stack>
    );
  }
  return (
    <SongListView
      songs={songs}
      onPlaySong={onPlaySong}
      onRemoveSong={onRemoveSong}
      loading={deleteLoading}
    />
  );
};
