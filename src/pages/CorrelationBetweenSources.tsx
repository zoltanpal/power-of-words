import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

import Loading from "@/components/elements/Loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SingleSelectDropdown from "@/components/elements/SingleSelectDropdown";
import CorrelationHeatmapChart from "@/components/charts/CorrelationHeatmapChart";
import { getDateRange } from "@/lib/utils";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const monthOptions = [
  { label: "Last 3 months", value: "last_3_months" },
  { label: "Last 6 months", value: "last_6_months" },
  { label: "Last 12 months", value: "last_12_months" },
  { label: "This Year", value: "ytd" },
  { label: "Previous Year", value: "last_year" },
];


export default function CorrelationBetweenSources() {
  const [loadingData, setLoadingData] = useState(false);
  const [selectedRange, setSelectedRange] = useState<string>("last_3_months");
  const { start, end } = getDateRange(selectedRange);

  const [word, setWord] = useState<string>("ukrajna");
  const [apiData, setApiData] = useState<any[]>([]);

  const onSearch = () => {
    if (!word || word.trim().length === 0) {
      alert("Please enter a keyword or phrase");
      return;
    }
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = async () => {
    const params = new URLSearchParams({
      start_date: start,
      end_date: end,
      word: word,
    });

    setLoadingData(true);

    try {
      const response = await fetch(`${API_HOST}/correlation_between_sources_avg_compound?${params.toString()}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const result = await response.json();
      setApiData(result ?? []);
    } catch (err) {
      console.error("Error fetching feeds:", err);
    } finally {
      setLoadingData(false);
    }
  };


  return (
    <>
      <p className="text-muted-foreground mb-3 text-justify flex items-center gap-2">
        This heatmap shows how similarly different news sources talk about selected topics over time.
        The correlation is calculated using monthly average sentiment scores.
      </p>
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 items-end">
        <SingleSelectDropdown
          options={monthOptions}
          placeholder="Select range"
          defaultValue="last_3_months"
          onChange={(value) => setSelectedRange(value)}
        />
        <Input
          id="word"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              fetchData();
            }
          }}
          placeholder="e.g. economy, Ukraine, AI"
          autoComplete="off"
          className="w-56"
        />
        <Button
          size="sm"
          onClick={onSearch}
          className="text-white bg-blue-500 hover:bg-blue-600"
        >
          <SearchIcon className="mr-1" /> Search
        </Button>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        {/* Chart Card */}
        <div className="sm:w-2/3 flex flex-col">
          <Card>
            <CardContent className="px-2 py-4 min-h-100">
              {loadingData ? (
                <Loading text="Loading data..." />
              ) : apiData.length > 0 ? (
                <CorrelationHeatmapChart 
                startDate={start}
                endDate={end}
                data={apiData} />
              ) : (
                <p className="text-muted-foreground text-lg text-center py-8">
                  No data found for the selected keyword and date range.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Heatmap Description */}
        <div className="sm:w-1/3">
            <h1 className="text-2xl">📌 What It Tells You</h1>
          <ul className="my-3 ml-4 list-disc [&>li]:mt-2 text-l text-muted-foreground">
            <li>
              Each square compares how similarly two news sources report on the selected topic(s) over time.
              <ul className="ml-5 list-disc [&>li]:mt-1">
                <li><b>Dark Blue (+1.00):</b> Very similar sentiment (both positive/negative in same months).</li>
                <li><b>White (0.00):</b> No clear pattern — not related.</li>
                <li><b>Red (–1.00):</b> Opposite sentiment — when one is positive, the other is negative.</li>
                <li>The number inside each square shows the strength of connection (from –1 to +1).</li>
              </ul>
            </li>
            <li>
              Diagonal cells (like <i>index.hu vs index.hu</i>) always show <b>+1.00</b> — perfect match with itself.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
