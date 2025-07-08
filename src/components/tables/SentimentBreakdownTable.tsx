// components/SentimentBreakdownTable.tsx
import { Card, CardContent } from "@/components/ui/card";
import { categorizeSentimentScore, categorizeSentimentStdDev } from "@/lib/utils";

type SentimentData = {
  source_name: string;
  keyword: string;
  mention_count: number;
  net_sentiment_score: number;
  sentiment_std_dev: number;
};

export default function SentimentBreakdownTable({ data }: { data: SentimentData[] }) {
  return (
    <div className="grid gap-2">
      {data.map((item) => {
        const stdCategory = categorizeSentimentStdDev(item.sentiment_std_dev);
        const scoreCategory = categorizeSentimentScore(item.net_sentiment_score);

        return (
          <Card key={item.source_name} className="p-4">
            <CardContent className="p-0">
              <h3 className="text-lg font-semibold mb-2">{item.source_name}</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium">🔍 Keyword:</p>
                  <p>{item.keyword}</p>
                </div>
                <div>
                  <p className="font-medium">📈 Mentions:</p>
                  <p>{item.mention_count}</p>
                </div>
                <div>
                  <p className="font-medium">📊 Net Sentiment:</p>
                    <p>
                    {item.net_sentiment_score.toFixed(3)} —{" "}
                    <span className="font-semibold">{scoreCategory.label}</span>
                    </p>
                    <p className="text-muted-foreground text-xs">{scoreCategory.meaning}</p>
                </div>
                <div>
                  <p className="font-medium">📉 Std. Deviation:</p>
                  <p>
                    {item.sentiment_std_dev.toFixed(2)} — <span className="font-semibold">{stdCategory.label}</span>
                  </p>
                  <p className="text-muted-foreground text-xs">{stdCategory.meaning}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
