import { Badge } from "@/components/ui/badge"
import clsx from "clsx"

type Props = {
  sentiment: "positive" | "neutral" | "negative"
  //sentiment: string
}

export function SentimentBadge({ sentiment }: Props) {

    const baseClasses = "w-24 justify-center text-sm/3 p-3"

    const colorClasses = {
      positive: "bg-green-50 text-green-900 border-green-600",
      neutral: "bg-gray-50 text-gray-900 border-gray-600",
      negative: "bg-red-50 text-red-900 border-red-600",
    }
  
  return (
    <Badge variant="outline" className={clsx(baseClasses, colorClasses[sentiment])}>
      {sentiment.toUpperCase()}
    </Badge>
  )
}
