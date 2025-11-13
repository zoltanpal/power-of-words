import { useState, useEffect } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert"
import _ from "lodash";

import { SearchIcon } from "lucide-react";
import { addDays } from "date-fns"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import Loading from "@/components/elements/Loading";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SourceSelectorMulti } from "@/components/elements/SourceSelectorMulti";
import { DateRangePicker } from "@/components/elements/DateRangePicker";

// const API_HOST = import.meta.env.VITE_API_HOST;
const VITE_DEVAPI_HOST = import.meta.env.VITE_DEVAPI_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function PhraseFrequencyTrends() {
    const [loadingData, setLoadingData] = useState(false);
    const [apiData, setApiData] = useState<any[]>([]);
    const [dateGroup, setDateGroup] = useState<string>("month");
    const [sources, setSources] = useState<string[]>([]);

    const [groupedByPhrase, setGroupedByPhrase] = useState<any[]>([]);

    const [excludeName, setExcludeName] = useState(true);
    const [range, setRange] = useState<{ from: Date; to: Date }>(() => {
        const from = new Date();
        const to = new Date();

        from.setDate(to.getDate() - 30);
        return { from, to };
    });

    const onSearch = () => {
        fetchData();
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!apiData?.length) return;


        const groupedBySource = _.groupBy(apiData, "source");
        const groupedByDate = _.groupBy(apiData, "date_group");

        // const groupedByPhrase = _.groupBy(apiData, "phrase");
        setGroupedByPhrase(Object.values(_.groupBy(apiData, "phrase")));
        
        // console.log("grouped groupedByPhrase:", groupedByPhrase);
        // console.log("grouped groupedByDate:", groupedByDate);

    }, [apiData]);


    const fetchData = async () => {
        const start = range.from.toISOString().split("T")[0];
        const end = range.to.toISOString().split("T")[0];
        const apiParams = new URLSearchParams({
            start_date: start,
            end_date: end,
            date_group: dateGroup,
        });

        if (sources.length > 0) {
            apiParams.set("sources", sources.join(","));
        }
        if (excludeName) {
            apiParams.set("exclude_name", "true");
        }
      
        setLoadingData(true);

        try {
            const response = await fetch(`${VITE_DEVAPI_HOST}/phrase_frequency_trends?${apiParams.toString()}`, {
                headers: { Authorization: `Bearer ${API_TOKEN}` },
            });
            const result = await response.json();
            setApiData(result ?? []);
            console.log("Fetched phrase frequency trends:", result);
        } catch (err) {
            console.error("Error fetching feeds:", err);
        } finally {
            setLoadingData(false);
        }
    };

    return (
        <div>
            <Alert className='border-destructive bg-destructive/10 
                text-destructive rounded-none border-0 border-l-6 mb-2'>
                <AlertTitle>No data yet!</AlertTitle>
            </Alert>
            <div className="mb-4">
                <p className="text-muted-foreground mb-3 text-justify flex items-center gap-2">
                    Discover which phrases appear most often in news headlines. 
                    This view highlights weekly or monthly trends to show how certain expressions gain emphasis across 
                    different sources.
                </p>
            </div>
            <div className="flex flex-wrap justify-start items-end gap-2">
                <div className="min-w-[200px]">
                    <DateRangePicker 
                        value={range} 
                        onChange={(r) => setRange(r)} 
                        startDate={addDays(new Date(), -59)}
                        endDate={new Date()}
                        predefinedRanges={[
                            { label: "Last 60 Days", range: () => ({ from: addDays(new Date(), -59), to: new Date() }) },
                            { label: "Last 90 Days", range: () => ({ from: addDays(new Date(), -89), to: new Date() }) },
                            { label: "Year to Date", range: () => ({ from: new Date(new Date().getFullYear(), 0, 1), to: new Date() }) },
                        ]}
                    />
                </div>
                <div className="min-w-[150px]">
                    <SourceSelectorMulti value={sources} onChange={setSources} />
                </div>
                <div className="mr-2">
                    <ToggleGroup
                        variant="outline"
                        type="single"
                        value={dateGroup}
                        onValueChange={(val) => val && setDateGroup(val as "week" | "month")}
                        className="inline-flex items-center justify-center text-sm"
                    >
                        <ToggleGroupItem value="week" className="bg-gray-100 text-gray-500 data-[state=on]:bg-white data-[state=on]:text-black">
                            by Week
                        </ToggleGroupItem>
                        <ToggleGroupItem value="month" className="bg-gray-100 text-gray-500 data-[state=on]:bg-white data-[state=on]:text-black">
                            by Month
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <div className="flex items-center gap-2 py-2">
                    <Checkbox 
                        id="excludeName" 
                        checked={excludeName} 
                        onCheckedChange={(val) => setExcludeName(!!val)} 
                    />
                    <label htmlFor="excludeName" className="">
                        Exclude names
                    </label>
                </div>
                <div>
                    <Button
                        size="sm"
                        onClick={onSearch}
                        className="text-white bg-blue-500 hover:bg-blue-600"
                    >
                        <SearchIcon className="mr-1" /> Search
                    </Button>
                </div>
            </div>
            <div>
                {loadingData ? (
                    <Loading text="Loading data..." />
                ) : apiData.length > 0 ? (
                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <div className="sm:w-2/3 flex flex-col">
                            <div className="mt-4">
                            {groupedByPhrase.map((item) => (
                                    <>
                                        {item}
                                        {/* {item.phrase} - {item.freq} occurrences - {item.source}, week: {item.date_group} */}
                                    </>

                            ))}
                            </div>
                        </div>
                        {/* <div className="sm:w-1/3 pt-22">
                            <h1 className="text-2xl">📌 What This Table Shows</h1>
                            <ul className="my-3 ml-4 list-disc [&>li]:mt-2 text-l text-muted-foreground">
                                <li>The <b>most frequent phrases</b> appearing in Hungarian news headlines.</li>
                                <li>Grouped by <b>time period (month or week)</b>, so you can see how topics change over time.</li>
                                <li>Within each period, phrases are listed by <b>news source</b>.</li>
                                <li><b>Rank</b> indicates the order of importance in that source for the period.</li>
                                <li><b>Frequency</b> shows how many times the phrase was mentioned.</li>
                            </ul>
                        </div> */}
                    </div>
                ) : (
                    <p className="text-muted-foreground text-lg text-center py-8">
                        No data found.
                    </p>
                )}
            </div>
        </div>
    )
}
