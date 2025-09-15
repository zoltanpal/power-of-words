import { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ClearableInput } from "@/components/ui/cleareable-input";
import Loading from "@/components/elements/Loading";

import { DateRangePicker } from "@/components/elements/DateRangePicker";
import { SourceSelectorMulti } from "@/components/elements/SourceSelectorMulti";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;


export default function WordCoOccurences() {
    const [loadingData, setLoadingData] = useState(false);
    const [word, setWord] = useState<string>("putyin");
    const [apiData, setApiData] = useState<any[]>([]);
    const [range, setRange] = useState<{ from: Date; to: Date }>(() => {
        const to = new Date();
        const from = new Date();
        from.setDate(to.getDate() - 6);
        return { from, to };
    });
    const [sources, setSources] = useState<string[]>([]);


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
        const start = range.from.toISOString().split("T")[0];
        const end = range.to.toISOString().split("T")[0];
        const apiParams = new URLSearchParams({
            start_date: start,
            end_date: end,
            word: word,
        });

        setLoadingData(true);

        if (sources.length > 0) {
            apiParams.set("sources", sources.join(","));
        }


      try {
        const response = await fetch(`${API_HOST}/word_co_occurences?${apiParams.toString()}`, {
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
        The table shows words that frequently appear together with a specific target word (e.g., "putyin") in the titles of news articles.
      </p>

      {/* Filter Section */}
      <div className="flex flex-wrap justify-start items-end gap-2">
        <div className="min-w-[200px]">
          <DateRangePicker value={range} onChange={(r) => setRange(r)} />
        </div>

        <div className="min-w-[150px]">
          <SourceSelectorMulti value={sources} onChange={setSources} />
        </div>
            <div className="flex">
              <ClearableInput
                id="word"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    fetchData();
                  }
                }}
                placeholder="e.g. economy, Ukraine, AI"
                className="w-56"
                autoComplete="off"
              />
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


          <div className="mt-3">
              {loadingData ? (
                <Loading text="Loading data..." />
              ) : apiData.length > 0 ? (
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                    <div className="sm:w-2/3 flex flex-col">

                        <table className="min-w-full border border-gray-200 text-sm">
                            <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="px-4 py-2 border">Word (occurences)</th>
                                <th className="px-4 py-2 border"># of Positive</th>
                                <th className="px-4 py-2 border"># of Negative</th>
                                <th className="px-4 py-2 border"># of Neutral</th>
                            </tr>
                            </thead>
                            <tbody>
                            {apiData.map((item) => {

                                return (
                                <tr key={item.co_word} className="border-t hover:bg-gray-100">
                                    <td className="px-4 py-2 font-medium">{item.co_word}&nbsp;({item.co_occurrence})</td>
                                    <td className="px-4 py-2">{item.positive_count}</td>
                                    <td className="px-4 py-2">{item.negative_count}</td>
                                    <td className="px-4 py-2">{item.neutral_count}</td>
                                </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                    <div className="sm:w-1/3">
                        <h1 className="text-2xl">📌 What It Tells You</h1>
                        <ul className="my-3 ml-4 list-disc [&>li]:mt-2 text-l text-muted-foreground">
                            <li>
                                <b>Which topics/words are most commonly mentioned</b> in connection with the target word (e.g., <blockquote>"putyin"</blockquote>)
                            </li>
                            <li>
                                Detect <b>narrative patterns</b> in news (e.g., if "putyin" often appears with 
                                "háború", "orosz", "támadás", and mostly in negative sentiment)
                            </li>
                            <li>
                                Whether those <b>co-mentions are framed positively or negatively</b> in the news title
                            </li>
                            <li>
                                Gives <b>contextual insight</b> into how the target word is used in headlines
                            </li>
                        </ul>
                    </div>
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