import { Stack } from "@mui/material";
import { TopBar } from "../component/v2/TopBar";
import { useCallback, useState } from "react";
import { PlayerPage } from "./PlayerPage";
import { FileUploadPage } from "./FileUploadPage";

type Pages = "upload" | "player";
export const MainPage = () => {
  const [page, setPage] = useState<Pages>("player");

  const onBack = useCallback(() => {
    setPage("player");
  }, []);

  const onMenu = useCallback(() => {
    // setPage("upload");
  }, []);

  const onUpload = useCallback(() => {
    setPage("upload");
  }, []);

  return (
    <Stack spacing={4} paddingTop={4} paddingLeft={3} paddingRight={3}>
      <TopBar
        onBack={page !== "player" ? onBack : undefined}
        onMenu={page === "player" ? onMenu : undefined}
      />
      {page === "player" ? (
        <PlayerPage onUpload={onUpload} />
      ) : (
        <FileUploadPage />
      )}
    </Stack>
  );
};
