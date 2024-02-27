import { Stack } from "@mui/material";
import { FileDropZone } from "../component/v2/FileDropZone";
import { UploadingFileView } from "../component/v2/UploadingFileView";
import { useCallback, useState } from "react";
import { useDeleteSong, useUploadSong } from "../hooks/api";
import { useSoundTrackContext } from "../context";

type SongInfo = { id: string; name: string; totalkb: number; link?: string };
export const FileUploadPage = () => {
  const { objectId } = useSoundTrackContext();
  const [files, setFiles] = useState<SongInfo[]>([]);
  const [currentFileUploading, setCurrentFileUploading] = useState<
    File | undefined
  >();
  const { mutate, cancelRequest, progressInfo } = useUploadSong();
  const { deleteSong, loading: deleteLoading } = useDeleteSong();
  const onUpload = useCallback(
    (file: File) => {
      setCurrentFileUploading(file);
      mutate(file, objectId)
        .then((data) => {
          console.log(data);
          setCurrentFileUploading(undefined);
          setFiles((prev) => [
            ...prev,
            {
              id: data.data.fileId,
              name: data.data.fileName,
              totalkb: Math.round(file.size / 1024),
            },
          ]);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [mutate, objectId]
  );
  const onCancelRequest = useCallback(() => {
    setCurrentFileUploading(undefined);
    cancelRequest();
  }, [cancelRequest]);

  const onRemoveSong = useCallback(
    (song: SongInfo) => {
      deleteSong(objectId, song.id, song.name)
        .then((data) => {
          setFiles((prev) => prev.filter((item) => item.id !== song.id));
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [deleteSong, objectId]
  );
  return (
    <Stack padding={2} spacing={2}>
      <FileDropZone onChange={onUpload} />
      {currentFileUploading && (
        <UploadingFileView
          name={currentFileUploading.name}
          progress={progressInfo.progress}
          progressText={`${progressInfo.kbUploaded} / ${progressInfo.kbTotal} KB`}
          onRemove={progressInfo.progress === 100 ? undefined : onCancelRequest}
        />
      )}
      {files.reverse().map((songInfo: SongInfo) => (
        <UploadingFileView
          key={songInfo.id}
          name={songInfo.name}
          progress={100}
          progressText={`${songInfo.totalkb} / ${songInfo.totalkb} KB`}
          completed
          onRemove={() => onRemoveSong(songInfo)}
          loading={deleteLoading}
        />
      ))}
    </Stack>
  );
};
