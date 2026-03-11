// This module provides functions to transform raw analysis data into suitable formats for UI components.

import type { AnalysisItem } from "./analysis-types";

export function toFeedList(items: AnalysisItem[]) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.feed.published || 0).getTime();
    const bTime = new Date(b.feed.published || 0).getTime();
    return bTime - aTime;
  });
}

export function toSourceBreakdown(items: AnalysisItem[]) {
  const map = new Map<string, number>();

  items.forEach((item) => {
    const key = item.feed.source_name || "Unknown";
    map.set(key, (map.get(key) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function toSentimentDistribution(items: AnalysisItem[]) {
  const map = new Map<string, number>();

  items.forEach((item) => {
    const key = item.sentiment?.sentiment_key || "unknown";
    map.set(key, (map.get(key) || 0) + 1);
  });

  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}