// This hook processes the raw analysis data from the session and transforms it into 
// formats suitable for different components. 
// It also provides a ready state to indicate when the data is fully processed and available for use in the UI.
import { useMemo } from "react";
import { useAnalysisSession } from "@/hooks/useAnalysisSession";
import {
  toFeedList,
  toSentimentDistribution,
  toSentimentBySource,
} from "@/lib/live_news_analysis/analysis-transformers";

export function useAnalysisData() {
  const { state } = useAnalysisSession();

  const items = state.items
  
  const feedItems = useMemo(() => toFeedList(items), [items]);
  
  const sentimentBySource = useMemo(() => toSentimentBySource(items), [items]);

  const sentimentDistribution = useMemo(
    () => toSentimentDistribution(items),
    [items]
  );

  return {
    items,
    feedItems,
    sentimentBySource,
    sentimentDistribution,
    isReady: state.status === "completed" && state.items.length > 0,
  };
}