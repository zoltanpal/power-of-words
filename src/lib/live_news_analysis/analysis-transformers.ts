// This module provides functions to transform raw analysis data into suitable formats for UI components.

// import { removeStopwords } from "stopword";
import { removeStopwords, eng, dan, hun } from "stopword";


import type { AnalysisItem } from "./analysis-types";

export function toFeedList(items: AnalysisItem[]) {
  return [...items].sort((a, b) => {
    const aTime = new Date(a.feed.published || 0).getTime();
    const bTime = new Date(b.feed.published || 0).getTime();
    return bTime - aTime;
  });
}

export function toSentimentBySource(items: AnalysisItem[]) {
  // const map = new Map<string, number>();

  items.forEach((item) => {
    console.log(item.feed.title, item.feed.published);
  });

  return {}

}

export function toSentimentDistribution(items: AnalysisItem[]) {
  const map = new Map<string, number>();

  items.forEach((item) => {
    const key = item.sentiment?.sentiment_key || "unknown";
    map.set(key, (map.get(key) || 0) + 1);
  });

  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export function toSentimentsCount(items: AnalysisItem[]) {
  const map = new Map<string, number>();

  items.forEach((item) => {
    console.log(item)
    // TODO: this is a temporary solution, we should use the sentiment_key instead of compound_label
    const key = item.sentiment?.compound_label || "unknown"; 
    map.set(key, (map.get(key) || 0) + 1);
  });

  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));

}

export function toMostCommonWords(items: AnalysisItem[]) {
  const words = items.flatMap((item) =>
    item.feed.title
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .split(/\s+/)
  );

  const filtered = removeStopwords(words, [...eng, ...dan, ...hun]);

  const map = new Map<string, number>();

  filtered.forEach((word) => {
    if (!word) return;
    map.set(word, (map.get(word) || 0) + 1);
  });

  return [...map.entries()]
    .map(([name, weight]) => ({ name, weight }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 20);
}