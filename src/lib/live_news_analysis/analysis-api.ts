// This module provides functions to interact with the backend API for live news analysis.

const DEV_API_HOST = import.meta.env.VITE_DEV_SAPI_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${API_TOKEN}`,
  };
}

export async function fetchSources() {
  const res = await fetch(`https://api.palzoltan.net/power_of_words/sources`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch sources: ${res.status}`);
  }

  return res.json();
}

export async function startAnalysis(params: {
  language: string;
  sourceIds: string[];
}) {
  const search = new URLSearchParams({
    lang: params.language,
  });

  params.sourceIds.forEach((id) => {
    search.append("source_ids", id);
  });

  const res = await fetch(`${DEV_API_HOST}/start_analysis?${search.toString()}`, {
    headers: getAuthHeaders(),
  });

  if (!res.ok) {
    throw new Error(`Start analysis failed: ${res.status}`);
  }

  return res.json();
}

export async function fetchAnalysisProgress(jobId: string) {
  const res = await fetch(
    `${DEV_API_HOST}/results/${jobId}?page=0&page_size=1`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(`Progress fetch failed: ${res.status}`);
  }

  return res.json();
}

export async function fetchAnalysisAll(jobId: string) {
  const res = await fetch(
    `${DEV_API_HOST}/results/${jobId}?include_all=true`,
    {
      headers: getAuthHeaders(),
    }
  );

  if (!res.ok) {
    throw new Error(`Full result fetch failed: ${res.status}`);
  }

  return res.json();
}