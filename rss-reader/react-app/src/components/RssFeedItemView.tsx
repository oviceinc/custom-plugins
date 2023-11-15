import { Stack, Typography } from "@mui/material";
import { RssFeedItem } from "../hooks/useRssFeeds";
import { useCallback, useMemo } from "react";
import { format } from "date-fns";

type RssFeedItemViewProps = {
  rssFeedItem: RssFeedItem;
  feedTitle?: string;
  onItemClick?: (rssFeedItem: RssFeedItem) => void;
};
export const RssFeedItemView = ({
  feedTitle,
  rssFeedItem,
  onItemClick,
}: RssFeedItemViewProps) => {
  const handleOnClick = useCallback(() => {
    onItemClick?.(rssFeedItem);
  }, [onItemClick, rssFeedItem]);

  const formattedDate = useMemo(() => {
    return format(new Date(rssFeedItem.isoDate), "PPpp");
  }, [rssFeedItem.isoDate]);
  return (
    <Stack
      onClick={handleOnClick}
      padding={1}
      sx={{
        backgroundColor: "#E6E5E5",
        borderWidth: "thin",
        borderStyle: "solid",
        borderColor: "#B8B8B8",
        borderRadius: "10px",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      <Typography fontWeight={"bold"} variant="body1">
        {rssFeedItem.title}
      </Typography>
      {/* <Typography variant="caption">{feedTitle}</Typography> */}
      <Typography
        variant="caption"
        sx={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
        }}
      >
        {rssFeedItem.contentSnippet}
      </Typography>
      <Typography alignSelf={"end"} variant="caption">
        {formattedDate}
      </Typography>
    </Stack>
  );
};
