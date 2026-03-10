import { useEffect, useState } from "react";

const STORAGE_KEY = "live-news-analysis";

export type AnalysisResult = {
  job_id?: string;
  completed?: number;
  total?: number;
  results?: any[];
  [key: string]: any;
};

export type PersistedAnalysisState = {
  language: string;
  selectedSourceIds: string[];
  jobId: string | null;
  loadingAnalysis: boolean;
  completed: number;
  total: number;
  analysisResult: AnalysisResult | null;
};

const defaultState: PersistedAnalysisState = {
  language: "hun",
  selectedSourceIds: [],
  jobId: null,
  loadingAnalysis: false,
  completed: 0,
  total: 0,
  analysisResult: null,
};

function readSessionState(): PersistedAnalysisState {
  try {
    if (typeof window === "undefined") {
      return defaultState;
    }

    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw);

    return {
      ...defaultState,
      ...parsed,
    };
  } catch (error) {
    console.error("Failed to read analysis session:", error);
    return defaultState;
  }
}

export function useAnalysisSession() {
  const [state, setState] = useState<PersistedAnalysisState>(() =>
    readSessionState()
  );

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save analysis session:", error);
    }
  }, [state]);

  const clearSession = () => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear analysis session:", error);
    }

    setState(defaultState);
  };

  return {
    state,
    setState,
    clearSession,
  };
}