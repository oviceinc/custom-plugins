import { Stack, Typography } from "@mui/material";
import { RssFeedItem } from "../hooks/useRssFeeds";
import { format } from "date-fns";

type ArticleViewProps = {
  rssFeedItem: RssFeedItem;
};
export const ArticleView = ({ rssFeedItem }: ArticleViewProps) => {
  return (
    <Stack
      sx={{
        backgroundColor: "#E6E5E5",
        borderWidth: "medium",
        borderStyle: "solid",
        borderColor: "#B8B8B8",
        borderRadius: "10px",
        textAlign: "left",
        padding: 2,
      }}
      spacing={3}
    >
      <Stack>
        <Typography variant="body2">
          {format(new Date(rssFeedItem.isoDate), "PPpp")}
        </Typography>
        <Typography variant="h5" fontWeight={"bold"}>
          {rssFeedItem.title}
        </Typography>
        {(rssFeedItem.author || rssFeedItem.creator) && (
          <Typography variant="body2">{`By ${(
            rssFeedItem.author || rssFeedItem.creator
          )?.replace("/u/", "")}`}</Typography>
        )}
      </Stack>

      <Typography
        variant="body2"
        sx={{ overflow: "auto" }}
        dangerouslySetInnerHTML={{ __html: rssFeedItem.content }}
      />
    </Stack>
  );
};
