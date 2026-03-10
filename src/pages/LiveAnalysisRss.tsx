import { useEffect, useMemo, useRef, useState } from "react";
import SingleSelectDropdown from "@/components/elements/SingleSelectDropdown";
import { SourceSelectorMulti } from "@/components/elements/SourceSelectorMulti";
import { Button } from "@/components/ui/button";
import Loading from "@/components/elements/Loading";
import { FeedList } from "@/components/elements/FeedList";
import { SearchIcon } from "lucide-react";

import {
  useAnalysisSession,
  type AnalysisResult,
} from "@/hooks/useAnalysisSession";

const DEV_API_HOST = import.meta.env.VITE_DEV_SAPI_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

type ApiSource = {
  id: number | string;
  name: string;
  lang: string;
};

type SourceOption = {
  value: string;
  label: string;
};

export default function LiveAnalysisRss() {
  const { state, setState } = useAnalysisSession();

  const [loadingSources, setLoadingSources] = useState(false);
  const [allSources, setAllSources] = useState<ApiSource[]>([]);

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const language = state.language;
  const selectedSourceIds = state.selectedSourceIds;
  const jobId = state.jobId;
  const loadingAnalysis = state.loadingAnalysis;
  const completed = state.completed;
  const total = state.total;
  const analysisResult = state.analysisResult;

  useEffect(() => {
    const fetchSourcesOnce = async () => {
      setLoadingSources(true);

      try {
        const url = `https://api.palzoltan.net/power_of_words/sources`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch sources: ${res.status}`);
        }

        const result = await res.json();
        setAllSources(Array.isArray(result) ? result : []);
      } catch (e) {
        console.error("Error fetching sources:", e);
        setAllSources([]);
      } finally {
        setLoadingSources(false);
      }
    };

    fetchSourcesOnce();
  }, []);

  const sourceOptions: SourceOption[] = useMemo(() => {
    const lang = language.toLowerCase();

    return allSources
      .filter((source) => (source.lang ?? "").toLowerCase() === lang)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((source) => ({
        value: String(source.id),
        label: source.name,
      }));
  }, [allSources, language]);

  useEffect(() => {
    const allowed = new Set(sourceOptions.map((option) => option.value));

    setState((prev) => ({
      ...prev,
      selectedSourceIds: prev.selectedSourceIds.filter((id) =>
        allowed.has(id)
      ),
    }));
  }, [sourceOptions, setState]);

  const effectiveSourceIds = useMemo(() => {
    const allIds = sourceOptions.map((option) => option.value);
    return selectedSourceIds.length > 0 ? selectedSourceIds : allIds;
  }, [selectedSourceIds, sourceOptions]);

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  };

  const fetchStartAnalysis = async () => {
    const params = new URLSearchParams({
      lang: language,
    });

    effectiveSourceIds.forEach((id) => {
      params.append("source_ids", id);
    });

    const res = await fetch(
      `${DEV_API_HOST}/start_analysis?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Start analysis failed: ${res.status}`);
    }

    return res.json();
  };

  const pollJobResults = async (currentJobId: string) => {
    try {
      const res = await fetch(`${DEV_API_HOST}/results/${currentJobId}`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Polling failed: ${res.status}`);
      }

      const data: AnalysisResult = await res.json();

      const nextCompleted = data.completed ?? 0;
      const nextTotal = data.total ?? 0;

      setState((prev) => ({
        ...prev,
        completed: nextCompleted,
        total: nextTotal,
      }));

      if (nextCompleted >= nextTotal && nextTotal > 0) {
        setState((prev) => ({
          ...prev,
          analysisResult: data,
          loadingAnalysis: false,
          completed: nextCompleted,
          total: nextTotal,
        }));
        stopPolling();
      }
    } catch (err) {
      console.error("Polling error:", err);
      setState((prev) => ({
        ...prev,
        loadingAnalysis: false,
      }));
      stopPolling();
    }
  };

  useEffect(() => {
    if (!jobId || !loadingAnalysis) return;

    pollJobResults(jobId);

    pollingRef.current = setInterval(() => {
      pollJobResults(jobId);
    }, 2000);

    return () => {
      stopPolling();
    };
  }, [jobId, loadingAnalysis]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const fetchFeeds = async () => {
    stopPolling();

    setState((prev) => ({
      ...prev,
      jobId: null,
      completed: 0,
      total: 0,
      analysisResult: null,
      loadingAnalysis: true,
    }));

    try {
      const data = await fetchStartAnalysis();

      setState((prev) => ({
        ...prev,
        jobId: data.job_id ?? null,
        completed: data.completed ?? 0,
        total: data.total ?? 0,
        loadingAnalysis: true,
      }));
    } catch (err) {
      console.error("Error starting analysis:", err);
      setState((prev) => ({
        ...prev,
        loadingAnalysis: false,
      }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        <div className="flex">
          <SingleSelectDropdown
            options={[
              { value: "hun", label: "Hungarian" },
              { value: "eng", label: "English" },
              { value: "dan", label: "Danish" },
            ]}
            placeholder="Language"
            defaultValue={language}
            onChange={(value) =>
              setState((prev) => ({
                ...prev,
                language: value,
              }))
            }
          />
        </div>

        <div className="flex">
          <SourceSelectorMulti
            value={selectedSourceIds}
            onChange={(value) =>
              setState((prev) => ({
                ...prev,
                selectedSourceIds: value,
              }))
            }
            options={sourceOptions}
            disabled={loadingSources || sourceOptions.length === 0}
            placeholder={
              loadingSources
                ? "Loading sources..."
                : sourceOptions.length === 0
                  ? "No sources"
                  : "Select sources"
            }
            allLabel="All sources"
          />
        </div>

        <div className="sm:w-auto">
          <Button
            size="default"
            onClick={fetchFeeds}
            disabled={loadingAnalysis}
            className="sm:w-auto text-white bg-blue-500 hover:bg-blue-600"
          >
            <SearchIcon />
            Start Analysis
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {jobId && (
          <div className="text-sm text-muted-foreground">
            Job ID: {jobId}
          </div>
        )}

        {loadingAnalysis && (
          <div className="text-sm">
            {completed} / {total} completed. Please wait...
            <Loading text="Processing..." />
          </div>
        )}

        {!loadingAnalysis && analysisResult && (
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Completed: {analysisResult.completed ?? completed} /{" "}
              {analysisResult.total ?? total}
            </div>

            {/* <FeedList feeds={analysisResult?.items || []}  searchedText="" /> */}

            <pre className="rounded-md border p-4 text-xs overflow-auto bg-muted">
              {JSON.stringify(analysisResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}