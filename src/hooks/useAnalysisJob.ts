import { useCallback, useEffect, useRef } from "react";
import {
  fetchAnalysisAll,
  fetchAnalysisProgress,
  startAnalysis,
} from "@/lib/live_news_analysis/analysis-api";
import { useAnalysisSession } from "@/hooks/useAnalysisSession";

type StartAnalysisParams = {
  language: string;
  sourceIds: string[];
};

export function useAnalysisJob() {
  const { state, setState } = useAnalysisSession();
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const start = useCallback(
    async ({ language, sourceIds }: StartAnalysisParams) => {
      stopPolling();

      setState((prev) => ({
        ...prev,
        language,
        selectedSourceIds: sourceIds,
        jobId: null,
        loadingAnalysis: true,
        status: "running",
        completed: 0,
        total: 0,
        items: [],
        error: null,
        fetchedAt: null,
      }));

      try {
        const data = await startAnalysis({
          language,
          sourceIds,
        });

        setState((prev) => ({
          ...prev,
          jobId: data.job_id ?? null,
          loadingAnalysis: true,
          status: data.status ?? "running",
          completed: data.completed ?? 0,
          total: data.total ?? 0,
          error: data.error ?? null,
        }));
      } catch (err) {
        console.error("Error starting analysis:", err);

        setState((prev) => ({
          ...prev,
          loadingAnalysis: false,
          status: "failed",
          error:
            err instanceof Error ? err.message : "Failed to start analysis",
        }));
      }
    },
    [setState, stopPolling]
  );

  const loadAllResults = useCallback(
    async (jobId: string) => {
      try {
        const data = await fetchAnalysisAll(jobId);

        setState((prev) => ({
          ...prev,
          loadingAnalysis: false,
          status: data.status ?? "completed",
          completed: data.completed ?? prev.completed,
          total: data.total ?? prev.total,
          items: data.items ?? [],
          error: data.error ?? null,
          fetchedAt: new Date().toISOString(),
        }));
      } catch (err) {
        console.error("Error fetching full analysis result:", err);

        setState((prev) => ({
          ...prev,
          loadingAnalysis: false,
          status: "failed",
          error:
            err instanceof Error
              ? err.message
              : "Failed to fetch full analysis result",
        }));
      }
    },
    [setState]
  );

  const pollOnce = useCallback(
    async (jobId: string) => {
      try {
        const data = await fetchAnalysisProgress(jobId);

        const nextStatus = data.status ?? "running";
        const nextCompleted = data.completed ?? 0;
        const nextTotal = data.total ?? 0;
        const nextError = data.error ?? null;

        setState((prev) => ({
          ...prev,
          status: nextStatus,
          completed: nextCompleted,
          total: nextTotal,
          error: nextError,
        }));

        if (nextStatus === "failed") {
          stopPolling();

          setState((prev) => ({
            ...prev,
            loadingAnalysis: false,
            status: "failed",
            error: nextError || "Analysis failed",
          }));

          return;
        }

        if (nextStatus === "completed" || (nextTotal > 0 && nextCompleted >= nextTotal)) {
          stopPolling();
          await loadAllResults(jobId);
        }
      } catch (err) {
        console.error("Polling error:", err);

        stopPolling();

        setState((prev) => ({
          ...prev,
          loadingAnalysis: false,
          status: "failed",
          error: err instanceof Error ? err.message : "Polling failed",
        }));
      }
    },
    [loadAllResults, setState, stopPolling]
  );

  useEffect(() => {
    if (!state.jobId || !state.loadingAnalysis) return;

    pollOnce(state.jobId);

    pollingRef.current = setInterval(() => {
      pollOnce(state.jobId as string);
    }, 2000);

    return () => {
      stopPolling();
    };
  }, [state.jobId, state.loadingAnalysis, pollOnce, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    start,
    stopPolling,
  };
}