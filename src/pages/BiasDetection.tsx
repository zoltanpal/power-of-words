import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClearableInput } from "@/components/ui/cleareable-input";
import Loading from "@/components/elements/Loading";

import SingleSelectDropdown from "@/components/elements/SingleSelectDropdown";
import SentimentBreakdownDataTable from "@/components/tables/SentimentBreakdownDataTable";
//import SentimentBreakdownTable from "@/components/tables/SentimentBreakdownTable";
import { getDateRange } from "@/lib/utils";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const monthOptions = [
  { label: "Last 3 months", value: "last_3_months" },
  { label: "Last 6 months", value: "last_6_months" },
  { label: "Last 12 months", value: "last_12_months" },
  { label: "This Year", value: "ytd" },
  { label: "Previous Year", value: "last_year" },
];

export default function BiasDetection() {
    const [loadingData, setLoadingData] = useState(false);
    const [selectedRange, setSelectedRange] = useState<string>("last_3_months");
    const [word, setWord] = useState<string>("brüsszel");
    const [apiData, setApiData] = useState<any[]>([]);

    const onSearch = () => {
      if (!word || word.trim().length === 0) {
        alert("Please enter a keyword or phrase");
        return;
      }
      fetchData();
    };

      useEffect(() => {
        fetchData();
      }, []);

    const fetchData = async () => {
      const { start, end } = getDateRange(selectedRange);

      const params = new URLSearchParams({
        start_date: start,
        end_date: end,
        word: word,
      });

      setLoadingData(true);

      try {
        const response = await fetch(`${API_HOST}/bias_detection?${params.toString()}`, {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        const result = await response.json();
        setApiData(result ?? []);
      } catch (err) {
        console.error("Error fetching feeds:", err);
      } finally {
        setLoadingData(false);
      }
    };


    return (
      <div>
        <p className="text-muted-foreground mb-3 text-justify flex items-center gap-2">
          This report analyzes how different Hungarian news outlets cover a given keyword based on sentiment. 
          It helps highlight potential bias by comparing tone (positive/negative) and consistency across sources.
        </p>
    
        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
          <div className="w-full sm:w-auto">
            <SingleSelectDropdown
              options={monthOptions}
              placeholder="Select range"
              defaultValue="last_3_months"
              onChange={(value) => setSelectedRange(value)}
            />
          </div>
    
          <div className="w-full sm:w-64">
            <ClearableInput
              id="word"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  fetchData();
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
              onClick={onSearch}
              className="w-full sm:w-auto text-white bg-blue-500 hover:bg-blue-600"
            >
              <SearchIcon className="mr-1" /> Search
            </Button>
          </div>
        </div>
    
        {/* Results */}
        <div className="mt-3">
          {loadingData ? (
            <Loading text="Loading data..." />
          ) : apiData.length > 0 ? (
            <SentimentBreakdownDataTable data={apiData} />
          ) : (
            <p className="text-muted-foreground text-lg text-center py-8">
              No data found for the selected keyword and date range.
            </p>
          )}
        </div>
      </div>
    );
    
} 