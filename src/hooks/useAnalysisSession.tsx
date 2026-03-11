import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  loadAnalysisSession,
  saveAnalysisSession,
} from "@/lib/live_news_analysis/analysis-storage";
import type { AnalysisItem, AnalysisSessionState } from "@/lib/live_news_analysis/analysis-types";

type AnalysisSessionContextType = {
  state: AnalysisSessionState;
  setState: React.Dispatch<React.SetStateAction<AnalysisSessionState>>;
  resetState: () => void;
};

const defaultState: AnalysisSessionState = {
  language: "hun",
  selectedSourceIds: [],
  jobId: null,
  loadingAnalysis: false,
  status: "idle",
  completed: 0,
  total: 0,
  items: [],
  error: null,
  fetchedAt: null,
};

const AnalysisSessionContext = createContext<AnalysisSessionContextType | undefined>(
  undefined
);

export function AnalysisSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AnalysisSessionState>(() => {
    const stored = loadAnalysisSession();
    return stored ?? defaultState;
  });

  useEffect(() => {
    saveAnalysisSession(state);
  }, [state]);

  const resetState = () => {
    setState(defaultState);
  };

  const value = useMemo(
    () => ({
      state,
      setState,
      resetState,
    }),
    [state]
  );

  return (
    <AnalysisSessionContext.Provider value={value}>
      {children}
    </AnalysisSessionContext.Provider>
  );
}

export function useAnalysisSession() {
  const context = useContext(AnalysisSessionContext);

  if (!context) {
    throw new Error(
      "useAnalysisSession must be used within an AnalysisSessionProvider"
    );
  }

  return context;
}

export function useAnalysisItems(): AnalysisItem[] {
  const { state } = useAnalysisSession();
  return state.items;
}