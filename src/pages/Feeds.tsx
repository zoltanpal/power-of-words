import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ClearableInput } from "@/components/ui/cleareable-input";

import { DateRangePicker } from "@/components/elements/DateRangePicker";
import { SourceSelectorMulti } from "@/components/elements/SourceSelectorMulti";
import { FeedList } from "@/components/elements/FeedList";
import Loading from "@/components/elements/Loading";
import CustomPagination from "@/components/elements/CustomPagination";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function Feeds() {
  const [loadingFeeds, setLoadingFeeds] = useState(false);
  const [apiData, setApiData] = useState<any>(null);

  const [range, setRange] = useState<{ from: Date; to: Date }>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 6);
    return { from, to };
  });

  const [sources, setSources] = useState<string[]>([]);
  const [freeText, setFreeText] = useState<string>("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);

  useEffect(() => {
    fetchFeeds();
  }, [page, itemsPerPage]);

  const fetchFeeds = async () => {
    if (!range.from || !range.to) {
      alert("Please select date range");
      return;
    }

    setLoadingFeeds(true);

    const start = range.from.toISOString().split("T")[0];
    const end = range.to.toISOString().split("T")[0];
    const apiParams = new URLSearchParams({
      start_date: start,
      end_date: end,
      page: page.toString(),
      items_per_page: itemsPerPage.toString(),
    });

    if (sources.length > 0) {
      apiParams.set("sources", sources.join(","));
    }

    if (freeText) {
      apiParams.set("free_text", freeText);
    }

    const url = `${API_HOST}/feeds?${apiParams.toString()}`;

    try {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });
      const result = await response.json();
      setApiData(result);
    } catch (err) {
      console.error("Error fetching feeds:", err);
    } finally {
      setLoadingFeeds(false);
    }
  };

  return (
    <div className="space-y-6 px-2 sm:px-3 md:px-4">
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-2 sm:gap-4">
        <div className="w-full sm:w-auto">
          <DateRangePicker value={range} onChange={(r) => setRange(r)} />
        </div>
  
        <div className="w-full sm:w-auto">
          <SourceSelectorMulti value={sources} onChange={setSources} />
        </div>
  
        <div className="w-full sm:w-60">
          <ClearableInput
            id="free-text"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchFeeds();
              }
            }}
            placeholder="e.g. economy, Ukraine, AI"
            autoComplete="off"
            className="w-full"
          />
        </div>
  
        <div className="w-full sm:w-auto">
          <Button
            size="sm"
            onClick={() => {
              setPage(1);
              fetchFeeds();
            }}
            className="w-full sm:w-auto text-white bg-blue-500 hover:bg-blue-600"
          >
            <SearchIcon className="mr-1 w-4 h-4" />
            Search
          </Button>
        </div>
      </div>
  
      <Separator />
  
      {/* Results */}
      <div>
        {apiData?.total > itemsPerPage && (
          <div className="overflow-x-auto">
            <CustomPagination
              page={page}
              setPage={setPage}
              total={apiData.total}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )}
  
        {loadingFeeds ? (
          <Loading text="Loading data..." />
        ) : (
          <FeedList feeds={apiData?.feeds || []} freeText={freeText} />
        )}
  
        {apiData?.total > itemsPerPage && (
          <div className="overflow-x-auto">
            <CustomPagination
              page={page}
              setPage={setPage}
              total={apiData.total}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
  
}
