import { useState, useEffect } from "react";
import Parser from "rss-parser";

const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

export type RssFeedItem = {
  author: string;
  creator: string;
  content: string;
  contentSnippet: string;
  id?: string;
  pubDate: string;
  link: string;
  title: string;
  isoDate: string;
  categories?: string | string[];
};

export type RssFeed = {
  title: string;
  link: string;
  description?: string;
  items: RssFeedItem[];
};

export const useRssFeeds = (urls: string[]) => {
  const [feeds, setFeeds] = useState<RssFeed[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        setLoading(true);
        setError(null);

        const parser = new Parser();
        const promises = urls.map(async (url) => {
          try {
            const feed = await parser.parseURL(CORS_PROXY + url);
            return feed;
          } catch (parseError) {
            console.error(`Error parsing feed from ${url}:`, parseError);
            return null;
          }
        });

        const fetchedFeeds = (await Promise.all(promises)).filter(Boolean);
        setFeeds(fetchedFeeds as []);
        setLoading(false);
        setError(null);
      } catch (error) {
        setFeeds([]);
        setLoading(false);
        setError("Error fetching RSS feeds");
      }
    };

    fetchFeeds();
  }, [urls]);

  return { feeds, loading, error };
};
