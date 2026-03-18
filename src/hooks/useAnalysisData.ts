// This hook processes the raw analysis data from the session and transforms it into 
// formats suitable for different components. 
// It also provides a ready state to indicate when the data is fully processed and available for use in the UI.
import { useMemo } from "react";
import { useAnalysisSession } from "@/hooks/useAnalysisSession";
import {
  toFeedList,
  toSentimentDistribution,
  toSentimentBySource,
  toSentimentsCount,
  toMostCommonWords,
  toTopFeedItems,
} from "@/lib/live_news_analysis/analysis-transformers";

export function useAnalysisData() {
  const { state } = useAnalysisSession();

  const items = state.items
  
  const feedItems = useMemo(() => toFeedList(items), [items]);
  
  const sentimentBySource = useMemo(() => toSentimentBySource(items), [items]);

  const sentimentsCount = useMemo(() => toSentimentsCount(items), [items]);
  const mostCommonWords = useMemo(() => toMostCommonWords(items), [items]);
  const topPositiveFeeds = useMemo(() => toTopFeedItems(items, "positive"), [items]);
  const topNegativeFeeds = useMemo(() => toTopFeedItems(items, "negative"), [items]);

  console.log(topPositiveFeeds)


  const sentimentDistribution = useMemo(
    () => toSentimentDistribution(items),
    [items]
  );

  return {
    items,
    feedItems,
    sentimentBySource,
    sentimentDistribution,
    sentimentsCount,
    mostCommonWords,
    topPositiveFeeds,
    topNegativeFeeds,
    isReady: state.status === "completed" && state.items.length > 0,
  };
}