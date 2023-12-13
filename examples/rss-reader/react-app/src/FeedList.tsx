import { Fragment } from "react";
import { RssFeedItem, useRssFeeds } from "./hooks/useRssFeeds";
import { RssFeedItemView } from "./components/RssFeedItemView";
import { Stack, Typography } from "@mui/material";
import { LoadingSkeleton } from "./components/LoadingSkeleton";
type FeedListProps = {
  onRssFeedItemClick: (rssFeedItem: RssFeedItem) => void;
  feedUrls: string[];
};
export const FeedList = ({ onRssFeedItemClick, feedUrls }: FeedListProps) => {
  const { feeds, loading, error } = useRssFeeds(feedUrls);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Typography fontWeight={"bold"} variant="h5">
        {`Error: ${error}`}
      </Typography>
    );
  }

  return (
    <Stack>
      {feeds.length === 0 && (
        <Typography variant="h6">No results found.</Typography>
      )}
      {feeds.map((feed, index) => (
        <Fragment key={index}>
          {feed.items.length === 0 && (
            <Typography variant="h6">No results found.</Typography>
          )}
          {feed.items.map((item) => {
            return (
              <RssFeedItemView
                key={item.isoDate}
                feedTitle={feed.title}
                rssFeedItem={item}
                onItemClick={onRssFeedItemClick}
              />
            );
          })}
        </Fragment>
      ))}
    </Stack>
  );
};
