import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";

import {
  Card,
  CardContent
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { DateRangePicker } from "@/components/elements/DateRangePicker";
import Loading from "@/components/elements/Loading";

import SentimentBySourceChart from "@/components/charts/SentimentBySourceChart";
import SentimentOverTimeChart from "@/components/charts/SentimentOverTimeChart";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

type TrendsData = {
  Negative: number[];
  Neutral: number[];
  Positive: number[];
};

export default function Trends() {
  const [range, setRange] = useState<{ from: Date; to: Date }>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 6);
    return { from, to };
  });

  const [freeText, setFreeText] = useState<string | undefined>();
  const [loading, setLoading] = useState({ source: false, date: false });
  const [trends, setTrends] = useState<{
    source: TrendsData | null;
    date: TrendsData | null;
  }>({ source: null, date: null });

  const fetchData = async (groupBy: "source" | "date") => {
    const start = range.from.toISOString().split("T")[0];
    const end = range.to.toISOString().split("T")[0];

    setLoading((prev) => ({ ...prev, [groupBy]: true }));

    const params = new URLSearchParams({
      start_date: start,
      end_date: end,
      group_by: groupBy,
    });

    if (freeText) {
      params.append("free_text", freeText);
    }

    try {
      const response = await fetch(`${API_HOST}/get_sentiment_grouped?${params}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const result = await response.json();
      setTrends((prev) => ({ ...prev, [groupBy]: result }));
    } catch (err) {
      console.error(`Error fetching ${groupBy} trends:`, err);
    } finally {
      setLoading((prev) => ({ ...prev, [groupBy]: false }));
    }
  };

  const onSearch = () => {
    fetchData("source");
    fetchData("date");
  };

  useEffect(() => {
    onSearch();
  }, []);

  return (
    <div className="space-y-6 px-2 md:px-4">
      {/* Filters */}
      <div className="w-full flex flex-wrap items-end justify-start gap-x-4 gap-y-3">
        <div className="min-w-[200px]">
          <DateRangePicker value={range} onChange={(r) => setRange(r)} />
        </div>

        <div className="min-w-[200px]">
          <Input
            id="free-text"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
            autoComplete="off"
            placeholder="e.g. economy, Ukraine, AI"
            className="w-full"
          />
        </div>

        <div>
          <Button
            size="sm"
            onClick={onSearch}
            className="text-white bg-blue-500 hover:bg-blue-600"
          >
            <SearchIcon className="mr-1 w-4 h-4" />
            Search
          </Button>
        </div>
      </div>

      <Separator />

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-4">
            {loading.source ? (
              <Loading text="" />
            ) : trends.source ? (
              <SentimentBySourceChart 
              startDate={range.from.toISOString().split("T")[0]}
              endDate={range.to.toISOString().split("T")[0]}
              data={trends.source} />
            ) : (
              <p className="text-muted-foreground text-sm">No data loaded.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            {loading.date ? (
              <Loading text="" />
            ) : trends.date ? (
              <SentimentOverTimeChart
                startDate={range.from.toISOString().split("T")[0]}
                endDate={range.to.toISOString().split("T")[0]}
                data={trends.date}
              />
            ) : (
              <p className="text-muted-foreground text-sm">No data loaded.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
