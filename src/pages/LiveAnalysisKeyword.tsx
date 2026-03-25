import { useState } from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ClearableInput } from "@/components/ui/cleareable-input";
import Loading from "@/components/elements/Loading";

const API_HOST = "https://devapi.palzoltan.net/sentiment_analyzer/live";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function LiveAnalysisKeyword() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultsAggregated, setResultsAggregated] = useState<any>(null);
  const [windowRangeValue, setWindowRangeValue] = useState<number[]>([6]);
  const [error, setError] = useState("");

  const fetchAggregated = async () => {
    const trimmedQuery = query.trim().toLowerCase();

    const params = new URLSearchParams({
      query: trimmedQuery,
      window_hours: windowRangeValue[0].toString(),
    });

    const url = `${API_HOST}/analyze?${params.toString()}`;

    try {
      setLoading(true);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const result = await response.json();
      console.log("API response:", result);
      setResultsAggregated(result);
    } catch (err) {
      console.error("Error starting analysis:", err);
      setResultsAggregated(null);
      setError("Something went wrong while fetching the analysis.");
    } finally {
      setLoading(false);
    }
  };

  const onSearch = () => {
    if (!query.trim()) {
      setError("Please provide a search input.");
      setResultsAggregated(null);
      setLoading(false);
      return;
    }

    setError("");
    fetchAggregated();
  };

  return (
    <>
      <div className="my-2">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-[320px] shrink-0">
            <ClearableInput
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (error) setError("");
              }}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="e.g. Tesla, NVDA, oil prices"
              className={`w-full text-2xl h-9 px-2 ${
                error ? "border-red-500 focus-visible:ring-red-500" : ""
              }`}
              autoComplete="off"
            />
            {error && <p className="mt-1 text-sm text-red-500 absolute">{error}</p>}
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
                  max={36}
                  step={1}
                  onValueChange={setWindowRangeValue}
                />
              </div>

              <span className="text-xs text-muted-foreground">36</span>
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
        ) : resultsAggregated ? (
          <>
            <h2 className="mb-4 text-xl font-semibold">Aggregated Results</h2>
            <div className="space-y-4">
              <pre>{JSON.stringify(resultsAggregated, null, 2)}</pre>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}