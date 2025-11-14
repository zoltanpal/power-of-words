import { useState, useEffect } from "react";

import Loading from "@/components/elements/Loading";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;


export default function OverallStatistics() {
    const [loadingData, setLoadingData] = useState(false);
    const [apiData, setApiData] = useState<any[]>([]);


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoadingData(true);

        try {
            const response = await fetch(`${API_HOST}/overall_statistics`, {
                headers: { Authorization: `Bearer ${API_TOKEN}` },
            });
            const result = await response.json();
            setApiData(result ?? []);
        } catch (err) {
            console.error("Error fetching overall statistics:", err);
        } finally {
            setLoadingData(false);
        }
    };

    return (
        <div>
            {loadingData ? (
                <Loading />
            ) : (
                <div>
                    <p className="text-muted-foreground mb-3 text-justify flex items-center gap-2">
                        This page shows a high-level overview of the entire dataset, 
                        including time coverage, total number of news articles, sources, 
                        and overall sentiment distribution.
                    </p>
                    <table className="mb-4 w-full table-auto border-collapse">
                        <tr><th colspan>Dataset Coverage</th></tr>
                        <tr>
                            
                            <td className="border px-4 py-2 text-left">First feed date</td>
                            <td className="border px-4 py-2 text-left">{apiData.first_feed_date}</td>
                        </tr>
                    </table>



                    <pre>{JSON.stringify(apiData, null, 2)}</pre>
                </div>
            )}
        </div>
    )

}