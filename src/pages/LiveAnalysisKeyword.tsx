import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { addDays, format } from "date-fns";
import { formatDate, getMaxEntry } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PopupAlert } from "@/components/ui/popup-alert";

import Loading from "@/components/elements/Loading";
import SingleSelectDropdown from "@/components/elements/SingleSelectDropdown";
import { SentimentBadge } from "@/components/elements/SentimentBadge";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

type Sentiment = "positive" | "neutral" | "negative";

const isSentiment = (s: string): s is Sentiment =>
  ["positive", "neutral", "negative"].includes(s);

export default function LiveAnalysisKeyword() {
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [apiData, setApiData] = useState<any[]>([]);
  const [freeText, setFreeText] = useState<string>("");
  const [language, setLanguage] = useState<string>("hu");

  const [hasSearched, setHasSearched] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const onSearch = () => {
    if (!freeText.trim()) {
      setShowAlert(true);
      return;
    }
    fetchData();
  };

  const fetchData = async () => {
    setLoadingFeeds(true);
    setHasSearched(true);

    const today = new Date();
    const apiParams = new URLSearchParams({
      start_date: format(addDays(today, -30), "yyyy-MM-dd"),
      word: freeText,
      lang: language,
    });

    const url = `${API_HOST}/ondemand_feed_analyse?${apiParams.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      const result = await response.json();
      setApiData(result ?? []);
    } catch (err) {
      console.error("Error fetching feeds:", err);
      setApiData([]);
    } finally {
      setLoadingFeeds(false);
    }
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
            id="free-text"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="e.g. economy, Ukraine, AI"
            autoComplete="off"
            className="w-56"
          />

          <SingleSelectDropdown
            options={[
              { value: "hu", label: "Hungarian" },
              { value: "en", label: "English" },
            ]}
            placeholder="Language"
            defaultValue="hu"
            onChange={(value) => setLanguage(value)}
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
        {loadingFeeds ? (
          <Loading text="Searching news and analyzing..." />
        ) : hasSearched && apiData.length === 0 ? (
          <div className="text-muted-foreground text-center py-6 text-2xl">
            No feed data available.
          </div>
        ) : apiData.length > 0 ? (
          <ul className="divide-y divide-muted border rounded-md">
            {apiData.map((feed: any, idx: number) => {
              const topSentiment = getMaxEntry(feed.sentiments)[0];
              return (
                <li
                  key={idx}
                  className="p-4 flex flex-col sm:flex-row justify-between hover:bg-gray-50 sm:items-center gap-2"
                >
                  <div>
                    <p className="text-xl">{feed.title}</p>
                    <span className="font-mono text-gray-500 subpixel-antialiased not-italic">
                      {formatDate(feed.published)} •{" "}
                      {feed.source?.toLowerCase()}
                    </span>
                  </div>
                  <div className="mx-6">
                    <SentimentBadge
                      sentiment={
                        isSentiment(topSentiment) ? topSentiment : "neutral"
                      }
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
