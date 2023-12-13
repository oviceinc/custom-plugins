import { Container, Stack } from "@mui/material";
import "./App.css";
import { FeedList } from "./FeedList";
import { NavigationTopBar } from "./components/NavigationTopBar";
import { useCallback, useState } from "react";
import { RssFeedItem } from "./hooks/useRssFeeds";
import { AddFeedsView } from "./components/AddFeedsView";
import { ArticleView } from "./components/ArticleView";
import { useMessageEventListener } from "./hooks/useMessageEventListener";
import { useLocalStorage } from "./hooks/useLocalStorage";
type OvicePayloadType = {
  objectId: string;
};

type OviceEvent = {
  type: "ovice_participant_subscribed" | "ovice_participant_joined";
  payload: OvicePayloadType;
};

const defaultFeedUrlsValue: string[] = [];
function App() {
  const [step, setStep] = useState<"listFeed" | "addFeed" | "viewItem">(
    "listFeed"
  );

  const [selectedFeedItem, setSelectedFeedItem] = useState<
    RssFeedItem | undefined
  >();
  const [rssFeedUrl, setRssFeedUrl] = useState<string>("");
  const [objectId, setObjectId] = useState<string | undefined>();

  const {
    updateValue,
    value: feedUrls,
    getValue,
  } = useLocalStorage<string[]>(defaultFeedUrlsValue);
  useMessageEventListener(
    useCallback(
      (messageEvent: MessageEvent) => {
        const data: OviceEvent = messageEvent.data;
        if (
          data.type === "ovice_participant_joined" ||
          data.type === "ovice_participant_subscribed"
        ) {
          setObjectId(data.payload.objectId);
          getValue(`rss-reader-${data.payload.objectId}`);
        }
      },
      [getValue]
    )
  );

  const handleOnAddNewFeed = useCallback(() => {
    setStep("addFeed");
  }, []);

  const handleOnGoBack = useCallback(() => {
    setStep("listFeed");
  }, []);

  const handleOnRssFeedItemClick = useCallback((rssFeedItem: RssFeedItem) => {
    setSelectedFeedItem(rssFeedItem);
    setStep("viewItem");
  }, []);

  const handleOnAddFeedUrl = useCallback(() => {
    if (!rssFeedUrl.trim()) {
      return;
    }
    const newFeedUrls = [...feedUrls];
    newFeedUrls.push(rssFeedUrl);
    updateValue(`rss-reader-${objectId}`, newFeedUrls);
    setRssFeedUrl("");
  }, [feedUrls, objectId, rssFeedUrl, updateValue]);

  const handleOnDeleteFeed = useCallback(
    (index: number) => {
      const newFeedUrls = [...feedUrls];
      newFeedUrls.splice(index, 1);
      updateValue(`rss-reader-${objectId}`, newFeedUrls);
    },
    [feedUrls, objectId, updateValue]
  );

  return (
    <div className="App">
      <Container maxWidth="sm" sx={{ backgroundColor: "white" }}>
        <Stack spacing={1} padding={1}>
          <NavigationTopBar
            step={step}
            onAdd={handleOnAddNewFeed}
            onGoBack={handleOnGoBack}
          />
          {step === "addFeed" && (
            <AddFeedsView
              onAddRssFeedUrl={handleOnAddFeedUrl}
              rssFeedUrl={rssFeedUrl}
              onChangeRssFeedUrl={setRssFeedUrl}
              feedUrls={feedUrls}
              onDelete={handleOnDeleteFeed}
            />
          )}
          {step === "listFeed" && (
            <FeedList
              feedUrls={feedUrls}
              onRssFeedItemClick={handleOnRssFeedItemClick}
            />
          )}
          {step === "viewItem" && selectedFeedItem && (
            <ArticleView rssFeedItem={selectedFeedItem} />
          )}
        </Stack>
      </Container>
    </div>
  );
}

export default App;
