import { useState } from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TagInput } from "@/components/ui/tag-input";

import { DateRangePicker } from "@/components/elements/DateRangePicker";
import { SourceSelectorMulti } from "@/components/elements/SourceSelectorMulti";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function AdvancedAnalytics() {

    const [range, setRange] = useState<{ from: Date; to: Date }>(() => {
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - 6);
        return { from, to };
    });

    const [sources, setSources] = useState<string[]>([]);
    const [words, setWords] = useState<string[]>([]);

    const onSearch = () => {
      if (!words || words.length == 0) {
        alert("Please add at least one word")
        return
      }
      fetchData()
    };

    const fetchData = async () => {
      const start = range.from.toISOString().split("T")[0];
      const end = range.to.toISOString().split("T")[0];

      const params = new URLSearchParams({
        start_date: start,
        end_date: end,
      });

      if (words.length > 0) {
        params.set("words", words.join(','));
      }

      if (sources.length > 0) {
        params.set("sources", sources.join(","));
      }

      fetchExtremes(params);

    }
    
    const fetchExtremes = async(apiParams: URLSearchParams) => {
      const url = `${API_HOST}/correlation_between_sources?${apiParams.toString()}`;
      
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        });

        const result = await response.json();
        console.log("Search result:", result);
      } catch (err) {
        console.error("Error fetching feeds:", err);
      } finally {
        //setLoadingFeeds(false);
      }
    }

    return (
        <>
            <div className="flex gap-2">
              <div className="flex">
                <DateRangePicker value={range} onChange={(r) => setRange(r)} />
              </div>
              <div className="flex">
                <SourceSelectorMulti value={sources} onChange={setSources} />
              </div>
              <div className="flex">
                <TagInput value={words} onChange={setWords} placeholder="Add words" />
              </div>
              <div className="flex">
                <Button size="sm" onClick={onSearch} className="text-white bg-blue-500 hover:bg-blue-600">
                    <SearchIcon /> Search
                </Button>
              </div>
            </div>
        
        </>
    )
} 