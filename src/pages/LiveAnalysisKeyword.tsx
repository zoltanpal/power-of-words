import { useState } from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ClearableInput } from "@/components/ui/cleareable-input";
import Loading from "@/components/elements/Loading";

const API_HOST = "https://devapi.palzoltan.net/sentiment_analyzer/live";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const sentimentLabelMap: Record<string, string> = {
  positive: "Positive",
  negative: "Negative",
  neutral: "Neutral",
  mostly_positive: "Mostly Positive",
  mostly_negative: "Mostly Negative",
  mixed: "Mixed",
};


export default function LiveAnalysisKeyword() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  // const [resultsAggregated, setResultsAggregated] = useState<any>(null);
  // const [resultsHeadlines, setResultsHeadlines] = useState<any>(null);
  // const [resultsSentimentChange, setResultsSentimentChange] = useState<any>(null);

  const [results, setResults] = useState<{
    aggregated: any;
    headlines: any;
    sentimentChange: any;
  }>({
    aggregated: null,
    headlines: null,
    sentimentChange: null,
  });

  const [windowRangeValue, setWindowRangeValue] = useState<number[]>([6]);
  const [error, setError] = useState("");

  const buildUrl = (endpoint: string) => {
    const params = new URLSearchParams({
      query: query.trim().toLowerCase(),
      window_hours: windowRangeValue[0].toString(),
      ai_summary: "true",
    });

    return `${API_HOST}/${endpoint}?${params.toString()}`;
  };

  const fetchData = async (endpoint: string) => {
    const response = await fetch(buildUrl(endpoint), {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });

    if (!response.ok) {
      throw new Error(`${endpoint} failed with status ${response.status}`);
    }

    return response.json();
  };

  const onSearch = async () => {
    if (!query.trim()) {
      setError("Please provide a search input.");
      setResults({
        aggregated: null,
        headlines: null,
        sentimentChange: null,
      });
      return;
    }

    setError("");
    setLoading(true);

    try {
      const [aggregated, headlines, sentimentChange] = await Promise.all([
        fetchData("analyze"),
        fetchData("headlines"),
        fetchData("sentiment_change"),
      ]);

      setResults({
        aggregated,
        headlines,
        sentimentChange,
      });

      console.log("Aggregated API response:", aggregated);
      console.log("Headlines API response:", headlines);
      console.log("Sentiment Change API response:", sentimentChange);
    } catch (err) {
      console.error("Error fetching live analysis:", err);
      setResults({
        aggregated: null,
        headlines: null,
        sentimentChange: null,
      });
      setError("Something went wrong while fetching the analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="my-2">
        <div className="flex flex-wrap items-end gap-3">
          <div className="relative w-[320px] shrink-0">
            <ClearableInput
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="e.g. Tesla, NVDA, oil prices"
              className={`h-9 w-full px-2 text-2xl ${
                error ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              autoComplete="off"
            />
            {error && <p className="absolute mt-1 text-sm text-red-500">{error}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="window-hours" className="text-sm">
              Window hours <b>{windowRangeValue[0]}</b>
            </Label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">6</span>

              <div className="w-[220px]" dir="rtl">
                <Slider
                  id="window-hours"
                  value={windowRangeValue}
                  min={6}
                  max={72}
                  step={3}
                  onValueChange={setWindowRangeValue}
                />
              </div>

              <span className="text-xs text-muted-foreground">72</span>
            </div>
          </div>

          <Button
            size="sm"
            onClick={onSearch}
            disabled={loading}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            <SearchIcon className="mr-1 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      <div className="my-5">
        {loading ? (
          <Loading text="Analyzing feeds, please wait..." />
        ) : results.aggregated || results.headlines || results.sentimentChange ? (
          <>
            <h1 className="text-2xl font-bold text-red-400">
              {sentimentLabelMap[results.aggregated.summary.label]}
            </h1>

            <p className="text-muted-foreground">
                {results.headlines.ai_summary}
            </p>

            <div></div>
            <h2 className="mb-4 text-xl font-semibold">Aggregated Results</h2>
            <div className="space-y-4">
              <pre>{JSON.stringify(results.aggregated, null, 2)}</pre>
            </div>

            <div>
              <h2 className="mb-4 mt-8 text-xl font-semibold">Headlines</h2>

              <pre>{JSON.stringify(results.headlines, null, 2)}</pre>
            </div>

            <div>
              <h2 className="mb-4 mt-8 text-xl font-semibold">Sentiment Change</h2>
              <pre>{JSON.stringify(results.sentimentChange, null, 2)}</pre>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}