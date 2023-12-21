import { Stack } from "@mui/material";
import { FileDropZone } from "../component/v2/FileDropZone";
import { UploadingFileView } from "../component/v2/UploadingFileView";
import { useCallback, useState } from "react";

export const FileUploadPage = () => {
  const [files, setFiles] = useState<File[]>([]);
  const onUpload = useCallback((file: File) => {
    console.log(file.name);
    setFiles((prev) => [...prev, file]);
  }, []);
  return (
    <Stack padding={2} spacing={2}>
      <FileDropZone onChange={onUpload} />
      {files.map((f: File) => (
        <UploadingFileView
          key={f.name}
          name="qwdqwd"
          progress={20}
          onRemove={console.log}
          progressText="qwdqwdqwd"
        />
      ))}
    </Stack>
  );
};
