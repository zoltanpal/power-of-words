// This module provides functions to save/load the analysis session state using sessionStorage.

import type { AnalysisSessionState } from "./analysis-types";

const STORAGE_KEY = "live-analysis-session";

export function loadAnalysisSession(): AnalysisSessionState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function saveAnalysisSession(state: AnalysisSessionState) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    console.error("Failed to save analysis session");
  }
}

export function clearAnalysisSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    console.error("Failed to clear analysis session");
  }
}