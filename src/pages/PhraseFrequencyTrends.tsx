import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { addDays } from "date-fns"
import { Button } from "@/components/ui/button";
import Loading from "@/components/elements/Loading";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import PhraseFrequencyChart from "@/components/charts/PhraseFrequencyChart";

import { DateRangePicker } from "@/components/elements/DateRangePicker";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

const sources = [
  "444.hu",
  "telex.hu",
  "24.hu",
  "origo.hu",
  "hirado.hu",
  "magyarnemzet.hu",
  "index.hu",
];

export default function PhraseFrequencyTrends() {
    const [loadingData, setLoadingData] = useState(false);
    const [apiData, setApiData] = useState<any[]>([]);
    const [dateGroup, setDateGroup] = useState<string>("month");
    const [chartData, setChartData] = useState<Record<string, number[]>>({});
    const [range, setRange] = useState<{ from: Date; to: Date }>(() => {
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - 6);
        return { from, to };
    });


    const dateStrChart = range.from.toLocaleDateString() + ' - ' + range.to.toLocaleDateString();
    const onSearch = () => {
        fetchData();
      };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!apiData || apiData.length === 0) return;
        


    }, [apiData]);


    const fetchData = async () => {
        const start = range.from.toISOString().split("T")[0];
        const end = range.to.toISOString().split("T")[0];
        const apiParams = new URLSearchParams({
            start_date: start,
            end_date: end,
            date_group: dateGroup,
        });

        setLoadingData(true);

      try {
        const response = await fetch(`${API_HOST}/phrase_frequency_trends?${apiParams.toString()}`, {
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
                    <div className="mt-4">
                        <PhraseFrequencyChart data={chartData} date_str={dateStrChart} />
                        
                        <pre>{JSON.stringify(apiData, null, 2)}</pre>
                    </div>
                ) : (
                    <p className="text-muted-foreground text-lg text-center py-8">
                      No data found for the selected keyword and date range.
                    </p>
                  )}
            </div>
        </div>
    )


}