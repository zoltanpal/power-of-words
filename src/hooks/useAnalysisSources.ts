import { useEffect, useMemo, useState } from "react";
import { fetchSources } from "@/lib/live_news_analysis/analysis-api";
import { useAnalysisSession } from "@/hooks/useAnalysisSession";
import type { AnalysisSource } from "@/lib/live_news_analysis/analysis-types";

export type SourceOption = {
  value: string;
  label: string;
};

export function useAnalysisSources() {
  const { state, setState } = useAnalysisSession();

  const [loadingSources, setLoadingSources] = useState(false);
  const [allSources, setAllSources] = useState<AnalysisSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSources = async () => {
      setLoadingSources(true);
      setError(null);

      try {
        const result = await fetchSources();
        setAllSources(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("Error fetching sources:", err);
        setAllSources([]);
        setError(err instanceof Error ? err.message : "Failed to load sources");
      } finally {
        setLoadingSources(false);
      }
    };

    loadSources();
  }, []);

  const sourceOptions: SourceOption[] = useMemo(() => {
    const currentLang = state.language.toLowerCase();

    return allSources
      .filter((source) => (source.lang ?? "").toLowerCase() === currentLang)
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((source) => ({
        value: String(source.id),
        label: source.name,
      }));
  }, [allSources, state.language]);

  useEffect(() => {
    const allowedIds = new Set(sourceOptions.map((option) => option.value));

    setState((prev) => ({
      ...prev,
      selectedSourceIds: prev.selectedSourceIds.filter((id) =>
        allowedIds.has(id)
      ),
    }));
  }, [sourceOptions, setState]);

  const effectiveSourceIds = useMemo(() => {
    const allIds = sourceOptions.map((option) => option.value);

    return state.selectedSourceIds.length > 0
      ? state.selectedSourceIds
      : allIds;
  }, [state.selectedSourceIds, sourceOptions]);

  return {
    loadingSources,
    allSources,
    sourceOptions,
    effectiveSourceIds,
    error,
  };
}