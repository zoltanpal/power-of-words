import { useState, useEffect } from "react";
// import { SearchIcon } from "lucide-react";

// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";

// import { DateRangePicker } from "@/components/elements/DateRangePicker";
// import { SourceSelectorMulti } from "@/components/elements/SourceSelectorMulti";
// import { FeedList } from "@/components/elements/FeedList";
import Loading from "@/components/elements/Loading";
import CustomPagination from "@/components/elements/CustomPagination";

const API_HOST = import.meta.env.VITE_DEVAPI_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;


export default function RawDataViewer() {
    const [loadingFeedData, setLoadingFeedData] = useState(false);
    const [feedData, setFeedData] = useState<any>(null);

    // const [sources, setSources] = useState<string[]>([]);
    // const [freeText, setFreeText] = useState<string>("");
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(30);

    const [openRowId, setOpenRowId] = useState(null);

    const toggleRow = (id) => {
      setOpenRowId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        fetchFeedData();
      }, [page, itemsPerPage]);


    const fetchFeedData = async () => {

        const params = new URLSearchParams({
            page: page.toString(),
            items_per_page: itemsPerPage.toString(),
        });

        setLoadingFeedData(true);

        try {
        const response = await fetch(`${API_HOST}/raw_data?${params.toString()}`, {
            headers: { Authorization: `Bearer ${API_TOKEN}` },
        });
        const result = await response.json();
        setFeedData(result ?? []);
        } catch (err) {
            console.error("Error fetching feeds:", err);
        } finally {
            setLoadingFeedData(false);
        }
    };
    
    return (
        <>
              <div>
                {feedData?.total > itemsPerPage && (
                  <CustomPagination
                    page={page}
                    setPage={setPage}
                    total={feedData.total}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                  />
                )}
        
                {loadingFeedData ? (
                  <Loading text="Loading data..." />
                ) : (
                    <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-gray-100 text-left">
                    <tr>
                        <th colSpan={4} className="px-0 py-2 border text-center">Feed Info</th>
                        <th colSpan={4} className="px-0 py-2 border text-center">Sentiment Summary</th>
                      </tr>  
                      <tr>
                      <th className="px-4 py-2 border">Title</th>
                        <th className="px-4 py-2 border">Source</th>
                        <th className="px-4 py-2 border">Category</th>
                        <th className="px-4 py-2 border">Published</th>
                        <th className="px-4 py-2 border">Label</th>
                        <th className="px-4 py-2 border">Score</th>
                        <th className="px-4 py-2 border">Compound</th>
                        <th className="px-4 py-2 border">Raw JSON</th>
                      </tr>
                    </thead>
                    <tbody>
                      {feedData?.feeds.map((item) => {
                        const isOpen = openRowId === item.feed.id;

                        return (
                          <tr key={item.feed.id} className="border-t hover:bg-gray-100">
                            <td className="px-4 py-2 font-medium">{item.feed.title}</td>
                            <td className="px-4 py-2">{item.source.name}</td>
                            <td className="px-4 py-2">{item.feed_categories.name}</td>
                            <td className="px-4 py-2">{item.feed.published}</td>
                            <td className="px-4 py-2">{item.feed_sentiments.sentiment_key}</td>
                            <td className="px-4 py-2">{item.feed_sentiments.sentiment_value}</td>
                            <td className="px-4 py-2">{item.feed_sentiments.sentiment_compound}</td>
                            <td className="px-4 py-2">
                                <button
                                onClick={() => toggleRow(item.feed.id)}
                                className="text-xs text-blue-600 underline cursor-pointer"
                                >
                                {isOpen ? "Hide JSON" : "Show JSON"}
                                </button>
                                {isOpen && (
                                <pre className="mt-2 text-xs text-gray-700 whitespace-pre-wrap max-w-xs overflow-auto">
                                    {JSON.stringify(item.feed_sentiments.sentiments, null, 2)}
                                </pre>
                                )}
                            </td>
                        </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
        
                {feedData?.total > itemsPerPage && (
                  <CustomPagination
                    page={page}
                    setPage={setPage}
                    total={feedData.total}
                    itemsPerPage={itemsPerPage}
                    setItemsPerPage={setItemsPerPage}
                  />
                )}
              </div>
        </>
    )

}