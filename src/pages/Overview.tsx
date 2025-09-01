import { useState, useEffect } from "react";
import { getWindow } from "@/lib/dateRanges";
import type { DateRange } from '@/lib/dateRanges'
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CardSentiment } from "@/components/elements/CardSentiment";
import { TopFeeds } from "@/components/elements/TopFeeds";
import WordCloudChart from "@/components/charts/WordCloudChart";
import Loading from "@/components/elements/Loading";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const getDateRange = (daysAgo: number) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - daysAgo);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
};

type SentimentData = {
  positive_sentiments: number;
  negative_sentiments: number;
  neutral_sentiments: number;
};

type mostCommonWordData = {
  name: string;
  weight: number;
};

type TopFeedItem = {
  title: string;
  source_name: string;
  published: string;
};

export default function Overview() {
  const [range, setRange] = useState<"7" | "30">("7");
  const { start, end } = getDateRange(Number(range));

  const currentWindow: DateRange = getWindow(parseInt(range));
  const previousWindow: DateRange = getWindow(parseInt(range), parseInt(range));

  const [sentiments, setSentiments] = useState<SentimentData | null>(null);
  const [prevSentiments, setPrevSentiments] = useState<SentimentData | null>(null);
  const [topFeeds, setTopFeeds] = useState<{ positive: TopFeedItem[]; negative: TopFeedItem[] }>({
    positive: [],
    negative: [],
  });

  const [mostCommonWords, setMostCommonWords] = useState<mostCommonWordData[]>([]);
  const [loadingSentiments, setLoadingSentiments] = useState({
    positive: false,
    negative: false,
    neutral: false,
  });
  const [loadingFeeds, setLoadingFeeds] = useState({
    positive: false,
    negative: false,
  });
  const [loadingMostCommonWords, setLoadingMostCommonWords] = useState(false);


  const fetchSentiments = async () => {
    setLoadingSentiments({ positive: true, negative: true, neutral: true });
    try {
      const response = await fetch(
        `${API_HOST}/count_sentiments?start_date=${currentWindow.start}&end_date=${currentWindow.end}`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      const result = await response.json();
      setSentiments(result);
    } catch (err) {
      console.error("Error fetching sentiment data:", err);
    } finally {
      setLoadingSentiments({ positive: false, negative: false, neutral: false });
    }
  };

  const fetchPrevSentiments = async () => {
    try {
      const response = await fetch(
        `${API_HOST}/count_sentiments?start_date=${previousWindow.start}&end_date=${previousWindow.end}`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      const result = await response.json();
      setPrevSentiments(result);
    } catch (err) {
      console.error("Error fetching sentiment data:", err);
    } finally {
      //
    }
  };

  const fetchTopFeeds = async (sentiment: "positive" | "negative") => {
    setLoadingFeeds((prev) => ({ ...prev, [sentiment]: true }));
    try {
      const response = await fetch(
        `${API_HOST}/top_feeds?start_date=${start}&end_date=${end}&pos_neg=${sentiment}`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      const result = await response.json();
      setTopFeeds((prev) => ({ ...prev, [sentiment]: result }));
    } catch (err) {
      console.error(`Error fetching ${sentiment} feeds:`, err);
    } finally {
      setLoadingFeeds((prev) => ({ ...prev, [sentiment]: false }));
    }
  };

  const fetchMostCommonWords = async () => {
    setLoadingMostCommonWords(true);
    try {
      const response = await fetch(
        `${API_HOST}/most_common_words?start_date=${start}&end_date=${end}&nm_common=40`,
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );
      const result: Array<{ word: string; count: number }> = await response.json();

      setMostCommonWords(
        result.map(({ word, count }) => ({
          name: word,
          weight: count,
        }))
      );
    } catch (err) {
      console.error("Error fetching most_common_words:", err);
    } finally {
      setLoadingMostCommonWords(false);
    }
  };

  useEffect(() => {
    fetchSentiments();
    fetchPrevSentiments();
    fetchTopFeeds("positive");
    fetchTopFeeds("negative");
    fetchMostCommonWords();
  }, [range]);

  return (
    <div className="space-y-6 px-2 md:px-4">
      <ToggleGroup
        variant="outline"
        type="single"
        value={range}
        onValueChange={(val) => val && setRange(val as "7" | "30")}
        className="inline-flex items-center justify-center text-sm"
      >
        <ToggleGroupItem value="7" className="bg-gray-100 text-gray-500 data-[state=on]:bg-white data-[state=on]:text-black">
          Last 7 Days
        </ToggleGroupItem>
        <ToggleGroupItem value="30" className="bg-gray-100 text-gray-500 data-[state=on]:bg-white data-[state=on]:text-black">
          Last 30 Days
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex flex-col-reverse lg:flex-row gap-4">
        <div className="w-full lg:w-1/4 flex flex-col gap-2">
          <CardSentiment 
            title="Positive" 
            curr_value={sentiments?.positive_sentiments} 
            prev_value={prevSentiments?.positive_sentiments}
            type="positive" 
            loading={loadingSentiments.positive} 
          />
          <CardSentiment 
            title="Negative" 
            curr_value={sentiments?.negative_sentiments} 
            prev_value={prevSentiments?.negative_sentiments}
            type="negative" 
            loading={loadingSentiments.negative} 
          />
          <CardSentiment 
            title="Neutral" 
            curr_value={sentiments?.neutral_sentiments} 
            prev_value={sentiments?.negative_sentiments} 
            type="neutral" 
            loading={loadingSentiments.neutral} 
          />
        </div>

        <div className="w-full lg:w-3/4">
          <Card className="h-full min-h-[300px]">
            <CardContent className="px-2 h-full">
              {loadingMostCommonWords ? (
                <Loading text="" />
              ) : mostCommonWords?.length > 0 ? (
                <WordCloudChart seriesData={mostCommonWords} startDate={start} endDate={end} />
              ) : (
                <p className="text-muted-foreground text-sm">No data loaded.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="px-4">
            <CardTitle className="text-2xl">Top 5 Positive Feeds</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pt-0 -mt-5">
            <TopFeeds value={topFeeds.positive} loading={loadingFeeds.positive} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="px-4 pb-1">
            <CardTitle className="text-2xl">Top 5 Negative Feeds</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pt-0 -mt-5">
            <TopFeeds value={topFeeds.negative} loading={loadingFeeds.negative} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
