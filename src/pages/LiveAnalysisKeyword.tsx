import { useState, useEffect, useRef } from "react";
import { format, addDays } from "date-fns";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PopupAlert } from "@/components/ui/popup-alert";
import Loading from "@/components/elements/Loading";
import SingleSelectDropdown from "@/components/elements/SingleSelectDropdown";
import { SentimentBadge } from "@/components/elements/SentimentBadge";
import { getMaxEntry, formatDate } from "@/lib/utils";

const API_HOST = import.meta.env.VITE_API_HOST_SENTIMENT;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

type Sentiment = "positive" | "neutral" | "negative";
const isSentiment = (s: string): s is Sentiment =>
  ["positive", "neutral", "negative"].includes(s);

export default function LiveJobBasedAnalysis() {
  const [freeText, setFreeText] = useState("");
  const [language, setLanguage] = useState("hu");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [jobId, setJobId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStartAnalysis = async () => {
    setLoading(true);
    setResults([]);
    const today = new Date();
    const params = new URLSearchParams({
      start_date: format(addDays(today, -7), "yyyy-MM-dd"),
      word: freeText,
      lang: language,
    });

    try {
      const res = await fetch(`${API_HOST}/start_analysis?${params.toString()}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = await res.json();
      setJobId(data.job_id);
      setCompleted(data.completed);
      setTotal(data.total);
    } catch (err) {
      console.error("Error starting analysis:", err);
      setResults([]);
      setLoading(false);
    }
  };

  const pollJobResults = async () => {
    if (!jobId) return;
    try {
      const res = await fetch(`${API_HOST}/results/${jobId}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = await res.json();
      setCompleted(data.completed);
      setTotal(data.total);

      // Only show results once completed
      if (data.completed === data.total) {
        setResults(data.results || []);
        setLoading(false);
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    } catch (err) {
      console.error("Polling error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jobId && completed < total) {
      pollingRef.current = setInterval(pollJobResults, 3000);
      return () => pollingRef.current && clearInterval(pollingRef.current);
    }
  }, [jobId, completed, total]);

  const onSearch = () => {
    if (!freeText.trim()) {
      setShowAlert(true);
      return;
    }
    fetchStartAnalysis();
  };

  return (
    <>
      <PopupAlert
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title="Warning"
        message="Please provide a search input"
        variant="destructive"
      />

      <p className="text-muted-foreground mb-3 text-justify flex items-center gap-2">
        Search for news by entering a word or phrase below, and analyze the results 
          to get real-time sentiment predictions from various sources.
      </p>

      <div className="space-y-4 my-2">
        <div className="flex flex-wrap gap-2 items-center">
          <Input
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="e.g. economy, Ukraine, AI"
            className="w-56"
            autoComplete="off"
          />
          <SingleSelectDropdown
            options={[
              { value: "hu", label: "Hungarian" },
              { value: "da", label: "Danish" },
              { value: "en", label: "English" },
              
            ]}
            placeholder="Language"
            defaultValue="hu"
            onChange={setLanguage}
          />
          <Button
            size="sm"
            onClick={onSearch}
            className="text-white bg-blue-500 hover:bg-blue-600"
          >
            <SearchIcon className="mr-2 h-4 w-4" />
            Search for news and analyze
          </Button>
        </div>
      </div>

      <div className="my-5">
        {loading ? (
          <Loading text="Analyzing feeds, please wait..." />
        ) : results.length > 0 ? (
          <ul className="divide-y divide-muted border rounded-md">
            {results.map((item, idx) => {
              const topSentiment = getMaxEntry(item.sentiments ?? {})[0];
              return (
                <li
                  key={idx}
                  className="p-4 flex flex-col sm:flex-row justify-between hover:bg-gray-50 sm:items-center gap-2"
                >
                  <div>
                    <p className="text-xl">{item.title}</p>
                    <span className="font-mono text-gray-500 subpixel-antialiased not-italic">
                      {formatDate(item.published)} • {item.source?.toLowerCase()}
                    </span>
                  </div>
                  <div className="mx-6">
                    <SentimentBadge
                      sentiment={isSentiment(topSentiment) ? topSentiment : "neutral"}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </>
  );
}
