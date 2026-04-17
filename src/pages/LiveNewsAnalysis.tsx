import { useMemo, useState } from "react";
import { BarChart3Icon, ListIcon, TargetIcon } from "lucide-react";

import SingleSelectDropdown from "@/components/elements/SingleSelectDropdown";
import { SourceSelectorMulti } from "@/components/elements/SourceSelectorMulti";
import WordCloudChart from "@/components/charts/WordCloudChart";
// import SentimentBySourceChart from "@/components/charts/SentimentBySourceChart";
import { CardSentimentSimple } from "@/components/elements/CardSentimentSimple";
import { Button } from "@/components/ui/button";
import Loading from "@/components/elements/Loading";
import { FeedList } from "@/components/elements/FeedList2";
import CustomPagination from "@/components/elements/CustomPagination";

import {
  AnalysisSessionProvider,
  useAnalysisSession,
} from "@/hooks/useAnalysisSession";
import { useAnalysisSources } from "@/hooks/useAnalysisSources";
import { useAnalysisJob } from "@/hooks/useAnalysisJob";
import { useAnalysisData } from "@/hooks/useAnalysisData";

import {
  Card,
  // CardHeader,
  // CardTitle,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// import { TopFeeds } from "@/components/elements/TopFeeds";



type AnalysisTab = "overview" | "feeds" | "sources";

function LiveAnalysisPageContent() {
  const { state, setState, resetState } = useAnalysisSession();
  const { sourceOptions, effectiveSourceIds, loadingSources, error: sourceError } =
    useAnalysisSources();
  const { start } = useAnalysisJob();
  const { items, feedItems, mostCommonWords, sentimentsCount, isReady } =
    useAnalysisData();

  const [activeTab, setActiveTab] = useState<AnalysisTab>("overview");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);

  const paginatedFeedItems = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return feedItems.slice(startIndex, endIndex);
  }, [feedItems, page, itemsPerPage]);

  const handleStartAnalysis = async () => {
    setPage(1);

    await start({
      language: state.language,
      sourceIds: effectiveSourceIds,
    });
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setPage(1);
  };

  const selectedSourceLabel = useMemo(() => {
    if (state.selectedSourceIds.length === 0) {
      return "All sources";
    }

    if (state.selectedSourceIds.length === 1) {
      const match = sourceOptions.find(
        (option) => option.value === state.selectedSourceIds[0]
      );
      return match?.label ?? "1 source selected";
    }

    return `${state.selectedSourceIds.length} sources selected`;
  }, [state.selectedSourceIds, sourceOptions]);

  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-xl border p-4">
        <div>
          <h1 className="text-xl font-semibold">Live News Analysis</h1>
          <p className="text-sm text-muted-foreground">
            ...
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="min-w-[180px]">
            <SingleSelectDropdown
              options={[
                { value: "hun", label: "Hungarian" },
                { value: "eng", label: "English" },
                { value: "dan", label: "Danish" },
              ]}
              placeholder="Language"
              defaultValue={state.language}
              onChange={(value) =>
                setState((prev) => ({
                  ...prev,
                  language: value,
                  selectedSourceIds: [],
                }))
              }
            />
          </div>

          <div className="min-w-[130px]">
            <SourceSelectorMulti
              value={state.selectedSourceIds}
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

          <div>
            <Button
              size="default"
              onClick={handleStartAnalysis}
              disabled={state.loadingAnalysis || loadingSources}
              className="text-white bg-blue-500 hover:bg-blue-600"
            >
              {/* <SearchIcon className="mr-1 h-4 w-4" /> */}
              Start Analysis
            </Button>
          </div>

          <div>
            <Button
              variant="outline"
              size="default"
              onClick={() => {
                setPage(1);
                setActiveTab("feeds");
                resetState();
              }}
              disabled={state.loadingAnalysis}
            >
              Reset
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <div>
            <span className="font-medium text-foreground">Language:</span>{" "}
            {state.language}
          </div>
          <div>
            <span className="font-medium text-foreground">Sources:</span>{" "}
            {selectedSourceLabel}
          </div>
          {state.fetchedAt && (
            <div>
              <span className="font-medium text-foreground">Fetched:</span>{" "}
              {new Date(state.fetchedAt).toLocaleString()}
            </div>
          )}
        </div>

        {sourceError && (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            Failed to load sources: {sourceError}
          </div>
        )}

        {/* {state.jobId && (
          <div className="text-sm text-muted-foreground">
            Job ID: {state.jobId}
          </div>
        )} */}

        {state.loadingAnalysis && (
          <div className="rounded-md border px-3 py-3">
            <div className="text-sm">
              {state.completed} / {state.total} completed
            </div>
            <Loading text="Processing feeds..." />
          </div>
        )}

        {state.status === "failed" && state.error && (
          <div className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.error}
          </div>
        )}

        {state.status === "completed" && (
          <div className="rounded-md border bg-green-50 px-3 py-2 text-sm">
            Analysis completed. Loaded <span className="font-medium">{items.length}</span>{" "}
            items.
          </div>
        )}
      </div>

      <div className="space-y-4 rounded-xl border p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={activeTab === "overview" ? "default" : "outline"}
            onClick={() => setActiveTab("overview")}
            disabled={!isReady}
          >
            <TargetIcon className="mr-1 h-4 w-4" />
            Overview
          </Button>

          <Button
            variant={activeTab === "feeds" ? "default" : "outline"}
            onClick={() => setActiveTab("feeds")}
            disabled={!isReady}
          >
            <ListIcon className="mr-1 h-4 w-4" />
            Feeds
          </Button>

          <Button
            variant={activeTab === "sources" ? "default" : "outline"}
            onClick={() => setActiveTab("sources")}
            disabled={!isReady}
          >
            <BarChart3Icon className="mr-1 h-4 w-4" />
            Trends
          </Button>


        </div>

        {!isReady && !state.loadingAnalysis && (
          <div className="rounded-md border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            Start an analysis to load raw data and unlock the visual tabs.
          </div>
        )}

        {isReady && activeTab === "feeds" && (
          <div className="space-y-4">
            {/* <div className="text-sm font-medium">Feed items: {feedItems.length}</div> */}

            {feedItems.length > itemsPerPage && (
              <div className="overflow-x-auto">
                <CustomPagination
                  page={page}
                  setPage={setPage}
                  total={feedItems.length}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={handleItemsPerPageChange}
                />
              </div>
            )}

            <FeedList feeds={paginatedFeedItems} language={state.language} />

            {feedItems.length > itemsPerPage && (
              <div className="overflow-x-auto">
                <CustomPagination
                  page={page}
                  setPage={setPage}
                  total={feedItems.length}
                  itemsPerPage={itemsPerPage}
                  setItemsPerPage={handleItemsPerPageChange}
                />
              </div>
            )}
          </div>
        )}

        {isReady && activeTab === "sources" && (
          <div className="space-y-4">
            <div className="text-sm font-medium">Sentiment by source</div>

            {/* <SentimentBySourceChart data={sentimentBySource} /> */}
          </div>
        )}

        {isReady && activeTab === "overview" && (
          <div className="space-y-4">
            <div className="flex flex-col-reverse lg:flex-row gap-4">
              <div className="w-full lg:w-1/4 flex flex-col gap-2 px-4 py-2">

                <CardSentimentSimple
                  title="Positive"
                  value={sentimentsCount.find((s) => s.name === "positive")?.value}
                  type="positive"
                  loading={false}
                />

                <CardSentimentSimple
                  title="Negative"
                  value={sentimentsCount.find((s) => s.name === "negative")?.value}
                  type="negative"
                  loading={false}
                />

                <CardSentimentSimple
                  title="Neutral"
                  value={sentimentsCount.find((s) => s.name === "neutral")?.value}
                  type="neutral"
                  loading={false}
                />

              </div>

              <div className="w-full lg:w-3/4">
                <Card className="h-full min-h-[300px]">
                  <CardContent className="px-2 h-full">
                      <WordCloudChart seriesData={mostCommonWords} startDate="" endDate="" />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="px-4">
                  <CardTitle className="text-2xl">Top 5 Positive Feeds</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pt-0 -mt-5">
                  {/* <TopFeeds value={topPositiveFeeds} loading={false} /> */}
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="px-4">
                  <CardTitle className="text-2xl">Top 5 Negative Feeds</CardTitle>
                </CardHeader>
                <CardContent className="px-3 pt-0 -mt-5">
                  {/* <TopFeeds value={topNegativeFeeds} loading={false} /> */}
                </CardContent>
              </Card>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function LiveAnalysisPage() {
  return (
    <AnalysisSessionProvider>
      <LiveAnalysisPageContent />
    </AnalysisSessionProvider>
  );
}