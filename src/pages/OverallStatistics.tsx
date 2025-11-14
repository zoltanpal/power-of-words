import { useState, useEffect } from "react";

import Loading from "@/components/elements/Loading";

const API_HOST = import.meta.env.VITE_API_HOST;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function OverallStatistics() {
    const [loadingData, setLoadingData] = useState(false);
    const [apiData, setApiData] = useState<any>({});

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
            <p className="text-muted-foreground mb-3 text-justify flex items-center gap-2">
                This page shows a high-level overview of the entire dataset, 
                including time coverage, total number of news articles, sources, 
                and overall sentiment distribution.
            </p>
            {loadingData ? (
                <Loading />
            ) : (

                    <div className="overflow-x-auto mt-6">
                        <table className="w-200 table-auto border-collapse text-sm mb-6">
                        <thead>
                            <tr>
                            <th
                                colSpan={2}
                                className="text-left py-1.5 px-2 bg-gray-100 text-gray-700 border-b"
                            >
                                📅 Dataset Coverage
                            </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            <tr className="hover:bg-gray-50">
                                <td className="py-2 px-4 w-70 font-medium bg-gray-50 text-gray-700 border-r rounded-l-md">First feed date</td>
                                <td className="py-2 px-4">
                                    {apiData.first_feed_date?.slice(0, 10)}
                                </td>
                            </tr>

                            <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4 font-medium bg-gray-50 text-gray-700 border-r rounded-l-md">Last feed date</td>
                            <td className="py-2 px-4">
                                {apiData.last_feed_date?.slice(0, 10)}
                            </td>
                            </tr>

                            <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4 font-medium bg-gray-50 text-gray-700 border-r rounded-l-md">Time span (days)</td>
                            <td className="py-2 px-4">
                                {apiData.time_span_days?.toLocaleString()}
                            </td>
                            </tr>

                            {/* Counts Header */}
                            <tr>
                            <th
                                colSpan={2}
                                className="text-left py-1.5 px-2 bg-gray-100 text-gray-700 border-t"
                            >
                                🔢 Counts
                            </th>
                            </tr>

                            <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4 font-medium bg-gray-50 text-gray-700 border-r rounded-l-md">Total feeds</td>
                            <td className="py-2 px-4">
                                {apiData.total_feeds?.toLocaleString()}
                            </td>
                            </tr>

                            <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4 font-medium bg-gray-50 text-gray-700 border-r rounded-l-md">Total sources</td>
                            <td className="py-2 px-4">
                                {apiData.total_sources?.toLocaleString()}
                            </td>
                            </tr>

                            <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4 font-medium bg-gray-50 text-gray-700 border-r rounded-l-md">Total positives (percentage)</td>
                            <td className="py-2 px-4">
                                {apiData.total_positive?.toLocaleString()} ({apiData.pct_positive}%)
                            </td>
                            </tr>

                            <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4 font-medium bg-gray-50 text-gray-700 border-r rounded-l-md">Total negative (percentage)</td>
                            <td className="py-2 px-4">
                                {apiData.total_negative?.toLocaleString()} ({apiData.pct_negative}%)
                            </td>
                            </tr>

                            <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4 font-medium bg-gray-50 text-gray-700 border-r rounded-l-md">Total neutral (percentage)</td>
                            <td className="py-2 px-4">
                                {apiData.total_neutral?.toLocaleString()} ({apiData.pct_neutral}%)
                            </td>
                            </tr>

                            {/* Activity Header */}
                            <tr>
                            <th
                                colSpan={2}
                                className="text-left py-1.5 px-2 bg-gray-100 text-gray-700 border-t"
                            >
                                📈 Activity
                            </th>
                            </tr>

                            <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4 font-medium bg-gray-50 text-gray-700 border-r rounded-l-md">Average feeds per day</td>
                            <td className="py-2 px-4">
                                {apiData.avg_feeds_per_day?.toLocaleString()}
                            </td>
                            </tr>

                            <tr className="hover:bg-gray-50">
                            <td className="py-2 px-4 font-medium bg-gray-50 text-gray-700 border-r rounded-l-md">Most active source</td>
                            <td className="py-2 px-4">{apiData.most_active_source_name}</td>
                            </tr>
                        </tbody>
                        </table>                        
                    </div>
            )}
        </div>
    )

}