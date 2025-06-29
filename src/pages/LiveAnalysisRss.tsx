import { useState } from "react";
import { SearchIcon } from "lucide-react";
import { formatDate, getMaxEntry } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/tag-input";

import Loading from "@/components/elements/Loading";
import SingleSelectDropdown from "@/components/elements/SingleSelectDropdown";
import { SentimentBadge } from "@/components/elements/SentimentBadge";

//const API_HOST = import.meta.env.VITE_API_HOST;
const DEVAPI_HOST = import.meta.env.VITE_DEVAPI_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

type Sentiment = "positive" | "neutral" | "negative";

const isSentiment = (s: string): s is Sentiment =>
  ["positive", "neutral", "negative"].includes(s);


export default function LiveAnalysisRss() {
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [apiData, setApiData] = useState<any[]>([]);
  const [rssUrls, setrssUrls] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("hu");

  const [hasSearched, setHasSearched] = useState(false);
  //const [showAlert, setShowAlert] = useState(false);

  const onSearch = () => {

    fetchData();
  };

  const fetchData = async () => {
    setLoadingFeeds(true);
    setHasSearched(true);

    const url = `${DEVAPI_HOST}/sentiment_analyzer/analyze_text`;

    console.log(rssUrls)


    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });
      const result = await response.json();
      console.log(language)
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
        <p className="text-muted-foreground max-w-2xl my-3">
        </p>
        
      <div className="flex gap-2">
        <div className="flex">
          <TagInput value={rssUrls} onChange={setrssUrls} placeholder="Add RSS url(s)" />
        </div>
        <div className="flex">
          <SingleSelectDropdown
              options={[
                { value: "hu", label: "Hungarian" },
                { value: "en", label: "English" },
                { value: "dk", label: "Danish" },
              ]}
              placeholder="Language"
              defaultValue="hu"
              onChange={(value) => setLanguage(value)}
            />
        </div>
        <div className="flex">
        <Button size="sm" onClick={onSearch} className="text-white bg-blue-500 hover:bg-blue-600">
            <SearchIcon /> Search for news and analyze
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
