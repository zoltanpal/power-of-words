import { dynamicCategorizeSentimentScore, dynamicCategorizeStdDev } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type SentimentData = {
  source_name: string;
  keyword: string;
  mention_count: number;
  net_sentiment_score: number;
  sentiment_std_dev: number;
};

export default function SentimentBreakdownDataTable({ data }: { data: SentimentData[] }) {
  return (
    <div className="overflow-x-auto mt-6">
      <table className="table-auto w-full border border-gray-200 text-xs sm:text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="px-3 sm:px-4 py-2 border">📰 Source</th>
            <th className="px-3 sm:px-4 py-2 border">🔁 Mentions</th>
            <th className="px-3 sm:px-4 py-2 border">📊 Net Sentiment</th>
            <th className="px-3 sm:px-4 py-2 border">📉 Std. Deviation</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const sentimentValues = data.map((d) => d.net_sentiment_score);
            const stdDevs = data.map((d) => d.sentiment_std_dev);

            const sentimentMin = Math.min(...sentimentValues);
            const sentimentMax = Math.max(...sentimentValues);

            const stdMin = Math.min(...stdDevs);
            const stdMax = Math.max(...stdDevs);

            const score = dynamicCategorizeSentimentScore(
              item.net_sentiment_score,
              sentimentMin,
              sentimentMax
            );
            const deviation = dynamicCategorizeStdDev(
              item.sentiment_std_dev,
              stdMin,
              stdMax
            );

            return (
              <tr
                key={item.source_name}
                className="border-t hover:bg-gray-100"
              >
                <td className="px-3 sm:px-4 py-2 font-medium">
                  {item.source_name}
                </td>
                <td className="px-3 sm:px-4 py-2">{item.mention_count}</td>
                <td className="px-3 sm:px-4 py-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-default">
                          {item.net_sentiment_score.toFixed(3)} —{" "}
                          <span className="font-semibold">{score.label}</span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        {score.meaning}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                <td className="px-3 sm:px-4 py-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-default">
                          {item.sentiment_std_dev.toFixed(2)} —{" "}
                          <span className="font-semibold">
                            {deviation.label}
                          </span>
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        {deviation.meaning}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
