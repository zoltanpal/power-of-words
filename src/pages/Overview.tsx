import { useState, useEffect } from "react";
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
    name: string,
    weight: number
}

type TopFeedItem = {
  title: string;
  name: string;
  published: string;
};

export default function Overview() {

  const [range, setRange] = useState<"7" | "30">("7");
  const { start, end } = getDateRange(Number(range))
  const [sentiments, setSentiments] = useState<SentimentData | null>(null);

  const [loadingSentiments, setLoadingSentiments] = useState({
    positive: false,
    negative: false,
    neutral: false,
  });

  const [topFeeds, setTopFeeds] = useState<{
    positive: TopFeedItem[];
    negative: TopFeedItem[];
  }>({
    positive: [],
    negative: [],
  });

  const [mostCommonWords, setMostCommonWords] = useState<mostCommonWordData[]>([])
  const [loadingMostCommonWords, setLoadingMostCommonWords] = useState(false)

  const [loadingFeeds, setLoadingFeeds] = useState({
    positive: false,
    negative: false,
  });

  const fetchSentiments = async () => {
    const { start, end } = getDateRange(Number(range));
    const url = `${API_HOST}/count_sentiments?start_date=${start}&end_date=${end}`;
    setLoadingSentiments({ positive: true, negative: true, neutral: true });

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const result = await response.json();
      setSentiments(result);
    } catch (err) {
      console.error("Error fetching sentiment data:", err);
    } finally {
      setLoadingSentiments({ positive: false, negative: false, neutral: false });
    }
  };

  const fetchTopFeeds = async (sentiment: "positive" | "negative") => {
    const { start, end } = getDateRange(Number(range));
    const url = `${API_HOST}/top_feeds?start_date=${start}&end_date=${end}&pos_neg=${sentiment}`;
    setLoadingFeeds((prev) => ({ ...prev, [sentiment]: true }));

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const result = await response.json();
      setTopFeeds((prev) => ({ ...prev, [sentiment]: result }));
      console.log(result)
    } catch (err) {
      console.error(`Error fetching ${sentiment} feeds:`, err);
    } finally {
      setLoadingFeeds((prev) => ({ ...prev, [sentiment]: false }));
    }
  };

  const fetchMostCommonWords = async() => {
    const { start, end } = getDateRange(Number(range));
    const url = `${API_HOST}/most_common_words?start_date=${start}&end_date=${end}&nm_common=40`;
    setLoadingMostCommonWords(true)

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const result: [string, number][] = await response.json()
      const transformed = result.map(([word, count]) => ({
        name: word,
        weight: count,
      }))
      setMostCommonWords(transformed)
    } catch (err) {
      console.error(`Error fetching most_common_words:`, err);
    } finally {
      setLoadingMostCommonWords(false)
    }
  }

  useEffect(() => {
    fetchSentiments();
    fetchTopFeeds("positive");
    fetchTopFeeds("negative");
    fetchMostCommonWords();
  }, [range]);


  return (
    <div className="space-y-6">
      <ToggleGroup
        variant="outline"
        type="single"
        value={range}
        onValueChange={(val) => val && setRange(val as "7" | "30")}
        className="inline-flex items-center justify-center text-sm"
      >
        <ToggleGroupItem value="7" className="bg-gray-100 text-gray-500 data-[state=on]:bg-white data-[state=on]:text-black">Last 7 Days</ToggleGroupItem>
        <ToggleGroupItem value="30" className="bg-gray-100 text-gray-500 data-[state=on]:bg-white data-[state=on]:text-black">Last 30 Days</ToggleGroupItem>
      </ToggleGroup>


      <div className="flex flex-col sm:flex-row gap-4">
        <div className="sm:w-1/5 flex flex-col gap-2">
          <CardSentiment
            title="Positive"
            value={sentiments?.positive_sentiments}
            type="positive"
            loading={loadingSentiments.positive}
          />
          <CardSentiment
            title="Negative"
            value={sentiments?.negative_sentiments}
            type="negative"
            loading={loadingSentiments.negative}
          />
          <CardSentiment
            title="Neutral"
            value={sentiments?.neutral_sentiments}
            type="neutral"
            loading={loadingSentiments.neutral}
          />
        </div>

        {/* Right side – word cloud */}
        <div className="w-4/5 gap-2">
          <Card className="h-full">
            <CardContent className="px-2 mt-0 pt-0 h-full">
              {loadingMostCommonWords ? (
                <Loading text="" />
              ) : mostCommonWords ? (
                <WordCloudChart
                  seriesData={mostCommonWords}
                  startDate={start}
                  endDate={end}
                />
              ) : (
                <p className="text-muted-foreground text-sm">No data loaded.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="gap-2">
          <CardHeader className="px-4 -my-3">
            <CardTitle className="text-2xl">Top 5 Positive Feeds</CardTitle>
          </CardHeader>
          <CardContent className="px-3 mt-0 pt-0">
            <TopFeeds
              value={topFeeds.positive}
              loading={loadingFeeds.positive}
            />
          </CardContent>
        </Card>

        <Card className="gap-2">
          <CardHeader className="px-4 -my-3">
            <CardTitle className="text-2xl">Top 5 Negative Feeds</CardTitle>
          </CardHeader>
          <CardContent className="px-3 mt-0 pt-0">
            <TopFeeds
              value={topFeeds.negative}
              loading={loadingFeeds.negative}
            />
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
