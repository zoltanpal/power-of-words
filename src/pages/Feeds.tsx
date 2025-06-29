import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
      alert("Please select date range")
      return
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
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
        },
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
    <div>
      <div className="flex gap-2">
        <div className="flex">
          <DateRangePicker value={range} onChange={(r) => setRange(r)} />
        </div>
        <div className="flex">
          <SourceSelectorMulti value={sources} onChange={setSources} />
        </div>
        <div className="flex">
        <Input
            id="free-text"
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="e.g. economy, Ukraine, AI"
            className="w-56"
          />
        </div>
        <div className="flex">
          <Button
            size="sm"
            onClick={() => {
              setPage(1);
              fetchFeeds();
            }}
            className="text-white bg-blue-500 hover:bg-blue-600"
          >
            <SearchIcon /> Search
          </Button>
        </div>
      </div>

      <Separator className="my-4" />

      <div>
        {apiData?.total > itemsPerPage && (
          <CustomPagination
            page={page}
            setPage={setPage}
            total={apiData.total}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        )}

        {loadingFeeds ? (
          <Loading text="Loading data..." />
        ) : (
          <FeedList feeds={apiData?.feeds || []} freeText={freeText} />
        )}

        {apiData?.total > itemsPerPage && (
          <CustomPagination
            page={page}
            setPage={setPage}
            total={apiData.total}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
          />
        )}
      </div>
    </div>
  );
}
