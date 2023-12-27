import React from "react";
import { Button, Stack, Typography } from "@mui/material";
import { MusicNote } from "../icons";
import AddIcon from "@mui/icons-material/Add";
type Props = {
  onChange: (f: File) => void;
};
export const FileDropZone = ({ onChange }: Props) => {
  const onInputChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    ev.preventDefault();
    const file = ev.target.files?.[0];
    if (!file) {
      return;
    }
    onChange(file);
    return;
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      component="div"
      sx={{
        borderStyle: "dashed",
        borderColor: "#B3CEDE",
        borderWidth: "2px",
        borderRadius: "12px",
      }}
      spacing={2}
      padding={3}
      onDragOver={(ev) => {
        ev.preventDefault();
      }}
      onDrop={(ev) => {
        ev.preventDefault();
        const file = ev.dataTransfer.files?.[0];
        if (!file) {
          return;
        }
        return onChange(file);
      }}
    >
      <MusicNote width={"24"} />
      <Typography variant="h6">
        {"Choose a file or drag & drop it here"}
      </Typography>
      <Typography color="GrayText" letterSpacing={0.15} variant="body2">
        {"MP3 formats and up to 50MB"}
      </Typography>
      <Stack alignItems={"center"}>
        <Button
          variant="outlined"
          color="primary"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
            padding: 1,
            fontSize: 14,
            fontWeight: 500,
            height: 44,
            width: 166,
          }}
        >
          <input
            role={"button"}
            style={{ display: "none" }}
            value=""
            type="file"
            onChange={onInputChange}
            data-testid="layout-file-input"
            accept="image/x-png,image/png,image/jpeg"
          />
          <AddIcon width={11} height={11} />
          {"Browser File"}
        </Button>
      </Stack>
    </Stack>
  );
};
