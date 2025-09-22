import { useState } from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClearableInput } from "@/components/ui/cleareable-input";
import { PopupAlert } from "@/components/ui/popup-alert";
import Loading from "@/components/elements/Loading";
import SingleSelectDropdown from "@/components/elements/SingleSelectDropdown";
import { SentimentBadge } from "@/components/elements/SentimentBadge";
import { formatDate } from "@/lib/utils";

//const API_HOST = import.meta.env.VITE_API_HOST_SENTIMENT;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;


export default function LiveAnalysisKeyword() {
  const [freeText, setFreeText] = useState("");
  const [language, setLanguage] = useState("hun");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [showAlert, setShowAlert] = useState(false);

  const onSearch = () => {
    if (!freeText.trim()) {
      setShowAlert(true);
      return;
    }
    fetchData();
  };

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      word: freeText,
      lang: language,
    });

    try {
      const res = await fetch(`https://devapigo.palzoltan.net/sentiments/news_search?${params.toString()}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = await res.json();
      setResults(data);
      console.log(data)
      setLoading(false);
    } catch (err) {
      console.error("Error starting analysis:", err);
      setLoading(false);
    }
  }

  /*
  const [jobId, setJobId] = useState<string | null>(null);
  const [completed, setCompleted] = useState(0);
  const [total, setTotal] = useState(0);
  const [showAlert, setShowAlert] = useState(false);

  const [page, setPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(50);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStartAnalysis = async () => {
    setLoading(true);
    setResults(null);
    setPage(0); // reset pagination
    const today = new Date();
    const params = new URLSearchParams({
      start_date: format(addDays(today, -30), "yyyy-MM-dd"),
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
      setLoading(false);
    }
  };

  const pollJobResults = async () => {
    if (!jobId) return;
    try {
      const res = await fetch(`${API_HOST}/results/${jobId}?page=${page}&page_size=${itemsPerPage}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const data = await res.json();
      setCompleted(data.completed);
      setTotal(data.total);

      if (data.completed === data.total) {
        setResults(data);
        setLoading(false);
        if (pollingRef.current) clearInterval(pollingRef.current);
      }
    } catch (err) {
      console.error("Polling error:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (jobId && completed < total) {
      interval = setInterval(pollJobResults, 3000);
      pollingRef.current = interval;
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [jobId, completed, total]);

  useEffect(() => {
    const fetchPage = async () => {
      if (!jobId || completed < total) return;

      try {
        const res = await fetch(`${API_HOST}/results/${jobId}?page=${page}&page_size=${itemsPerPage}`, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Error fetching page:", err);
      }
    };
    fetchPage();
  }, [page, itemsPerPage, jobId, completed, total]);

  const onSearch = () => {
    if (!freeText.trim()) {
      setShowAlert(true);
      return;
    }
    fetchStartAnalysis();
  };
  */

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
        Start a background analysis for a keyword. You'll see the results once all are processed.
      </p>

      <div className="space-y-4 my-2">
        <div className="flex flex-wrap gap-2 items-center">
          <div className="min-w-[180px]">
            <ClearableInput
              value={freeText}
              onChange={(e) => setFreeText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              placeholder="e.g. economy, Ukraine, AI"
              className="w-56"
              autoComplete="off"
            />
          </div>
          <div className="min-w-[180px]">
            <SingleSelectDropdown
              options={[
                { value: "hun", label: "Hungarian" },
                { value: "eng", label: "English" },
              ]}
              placeholder="Language"
              defaultValue="hun"
              onChange={setLanguage}
            />
          </div>

          <Button
            size="sm"
            onClick={onSearch}
            className="text-white bg-blue-500 hover:bg-blue-600"
          >
            <SearchIcon className="mr-2 h-4 w-4" />
            Search news
          </Button>
        </div>
      </div>

      <div className="my-5">
        {loading ? (
          <Loading text="Analyzing feeds, please wait..." />
        ) : results?.length > 0 ? (
          <>
            <ul className="divide-y divide-muted border rounded-md">
              {results.map((item: any, idx: number) => {
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
                        sentiment={item.sentiment_key }
                      />
                    </div>
                  </li>
                );
              })}
            </ul>


          </>
        ) : null}
      </div>
    </>
  );
}
