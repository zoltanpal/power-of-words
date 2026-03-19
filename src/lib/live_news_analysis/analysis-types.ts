export type AnalysisSource = {
  id: number | string;
  name: string;
  lang?: string;
};

export type AnalysisFeed = {
  title: string;
  link: string;
  published?: string | null;
  rss_url?: string | null;
  source_id?: number | string | null;
  source_name?: string | null;
  source_web?: string | null;
};

export type AnalysisSentiment =
  | {
      sentiment_label?: string;
      sentiment_value?: number;
      sentiment_compound?: number;
    }
  | null;

export type AnalysisItem = {
  feed: AnalysisFeed;
  sentiment: AnalysisSentiment;
};

export type AnalysisResultResponse = {
  job_id: string;
  status: "running" | "completed" | "failed";
  completed: number;
  total: number;
  error?: string | null;
  items?: AnalysisItem[];
};

export type AnalysisSessionState = {
  language: string;
  selectedSourceIds: string[];
  jobId: string | null;
  loadingAnalysis: boolean;
  status: "idle" | "running" | "completed" | "failed";
  completed: number;
  total: number;
  items: AnalysisItem[];
  error: string | null;
  fetchedAt: string | null;
};