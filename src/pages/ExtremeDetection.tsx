import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";

import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import Loading from "@/components/elements/Loading";
import { Separator } from "@/components/ui/separator";

import { DateRangePicker } from "@/components/elements/DateRangePicker";
import { SourceSelectorMulti } from "@/components/elements/SourceSelectorMulti";

import ExtremesScatterChart from "@/components/charts/ExtremesScatterChart";


const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function ExtremeDetection() {
  const [loadingData, setLoadingData] = useState(false);
  const [apiData, setApiData] = useState<any>(null);


  const [range, setRange] = useState<{ from: Date; to: Date }>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 6);
    return { from, to };
  });

  const [sources, setSources] = useState<string[]>([]);
  //const [words, setWords] = useState<string[]>([]);

  const onSearch = () => {
    fetchData()
  };

  const fetchData = async () => {
    const start = range.from.toISOString().split("T")[0];
    const end = range.to.toISOString().split("T")[0];

    const params = new URLSearchParams({
      start_date: start,
      end_date: end,
    });

    // if (words.length > 0) {
    //   params.set("words", words.join(','));
    // }

    if (sources.length > 0) {
      params.set("sources", sources.join(","));
    }

    fetchExtremes(params)

    }

    const fetchExtremes = async(apiParams: URLSearchParams) => {
      setLoadingData(true);
      const url = `${API_HOST}/extreme_sentiments?${apiParams.toString()}`;
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        });

        const result = await response.json();
        setApiData(result)
        //console.log("Search result (extreme_sentiments):", result);
      } catch (err) {
        console.error("Error fetching feeds:", err);
      } finally {
        setLoadingData(false);
      }
    }

    useEffect(() => {
      fetchData();
    }, []);

    return (
        <>
            <p className="text-muted-foreground mb-3 mt-0">
            Find articles with extremely high or low sentiment values to detect biased or emotional content.
            </p>
          <div className="flex gap-2">
            <div className="flex">
              <DateRangePicker value={range} onChange={(r) => setRange(r)} />
            </div>
            <div className="flex">
              <SourceSelectorMulti value={sources} onChange={setSources} />
            </div>
            <div className="flex mt-0.5">
            <Button size="sm" onClick={onSearch} className="text-white bg-blue-500 hover:bg-blue-600">
                <SearchIcon /> Search
            </Button>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="mt-4 space-y-6">
            <Card className="gap-2">
              <CardContent className="px-2 mt-0 pt-0">
                  {loadingData ? (
                    <Loading text="Loading data..." />
                  ) : apiData ? (
                      <>
                        <ExtremesScatterChart startDate={range.from.toISOString().split("T")[0]} endDate={range.to.toISOString().split("T")[0]} data={apiData} />
                      </>             
                  ) : (
                  <p className="text-muted-foreground text-sm">No data loaded.</p>
                  )}
              </CardContent>
            </Card>
          </div>

        </>
    )
} 
