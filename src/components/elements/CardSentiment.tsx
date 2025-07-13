import { 
  Frown, 
  MehIcon, 
  SmileIcon
  } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardAction,
  CardFooter,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { TrendPercentBadge } from "./TrendPercentBadge";

type Props = {
  title: string;
  curr_value?: number;
  prev_value?: number;
  type: "positive" | "negative" | "neutral";
  loading: boolean;
};

const typeStyleMap = {
  positive: "text-5xl text-green-600",
  negative: "text-5xl text-red-600",
  neutral: "text-5xl text-blue-600",
};


export function CardSentiment({ title, curr_value, prev_value, type, loading }: Props) {
  const delta = 
    curr_value != null && prev_value != null 
      ? curr_value - prev_value 
      : 0;

  const percent =
    delta != null && prev_value
      ? (delta / prev_value) * 100
      : undefined;


  return (
    <Card className="flex min-h-[6rem] min-w-[18rem] py-3 pl-0 gap-2">
      <CardHeader className="px-4">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="mt-0 pt-0"># of {title} feeds</CardDescription>
        <CardAction className="text-2lg">
          {type === "positive" && <SmileIcon className="text-green-500 " />}
          {type === "negative" && <Frown className="text-red-500" />}
          {type === "neutral" && <MehIcon className="text-gray-500" />}
        </CardAction>
      </CardHeader>
      <CardContent className="flex items-center justify-center font-bold">
        {loading ? (
          <Loader2 className="animate-spin w-8 h-8" />
        ) : (
            <span className={`${typeStyleMap[type]} block my-1`}>
              {curr_value?.toLocaleString() ?? "–"}
            </span>          
        )}
      </CardContent>
      <CardFooter className="px-4 flex justify-end">
        {!loading && percent != null && prev_value != null && (
          <TrendPercentBadge
            delta={delta}
            percent={percent}
            prev_value={prev_value}
          />
        )}
      </CardFooter>
    </Card>
  );
}
