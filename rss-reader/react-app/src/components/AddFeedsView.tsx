import { IconButton, Stack, TextField, Typography } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
export type AddFeedsViewProps = {
  feedUrls: string[];
  rssFeedUrl: string;
  onChangeRssFeedUrl: (feedUrl: string) => void;
  onAddRssFeedUrl: () => void;
  onDelete?: (index: number) => void;
};
export const AddFeedsView = ({
  rssFeedUrl,
  onChangeRssFeedUrl,
  feedUrls,
  onDelete,
  onAddRssFeedUrl,
}: AddFeedsViewProps) => {
  return (
    <Stack>
      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        padding={2}
        sx={{
          backgroundColor: "#E6E5E5",
          borderWidth: "thin",
          borderStyle: "solid",
          borderColor: "#B8B8B8",
          borderRadius: "10px",
        }}
      >
        <Typography variant="body2">{"Feed URL"}</Typography>
        <TextField
          fullWidth
          value={rssFeedUrl}
          variant="outlined"
          size="small"
          type="url"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onAddRssFeedUrl();
            }
          }}
          onChange={(e) => onChangeRssFeedUrl(e.target.value)}
        />
      </Stack>
      <Stack padding={3} sx={{
          backgroundColor: "#E6E5E5",
          borderWidth: "thin",
          borderStyle: "solid",
          borderColor: "#B8B8B8",
          borderRadius: "10px",
        }}>
        <Stack
          sx={{
            backgroundColor: "white",
            borderWidth: "thin",
            borderStyle: "solid",
            borderColor: "#B8B8B8",
            borderRadius: "10px",
          }}
          padding={1}
        >
          {feedUrls.map((feedUrl, index) => {
            return (
              <Stack
                alignItems={"center"}
                key={index}
                flexDirection={"row"}
                justifyContent={"space-between"}
                sx={{
                  borderWidth: "thin",
                  borderBottomStyle: "solid",
                  borderBottomColor: "#B8B8B8",

                }}
              >
                <Typography variant="body2" sx={{wordBreak: 'break-all'}}>{feedUrl}</Typography>
                <IconButton onClick={() => onDelete?.(index)}>
                  <DeleteForeverIcon color="error"/>
                </IconButton>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </Stack>
  );
};
