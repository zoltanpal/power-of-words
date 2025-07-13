import { Badge } from "@/components/ui/badge"
import clsx from "clsx"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { 
    ArrowUp, 
    ArrowDown, 
    Zap, 
    //TrendingDown, 
    //TrendingUp 
    } from "lucide-react"

type Props = {
    delta: number
    percent: number
    prev_value: number
  }

export function TrendPercentBadge({ delta, percent, prev_value }: Props) {
    const isUp   = delta != null && delta > 0;
    const isDown = delta != null && delta < 0;
    const TrendIcon = isUp
      ? ArrowUp
      : isDown
      ? ArrowDown
      : Zap;
    const trendColor = isUp
      ? "text-green-500"
      : isDown
      ? "text-red-500"
      : "text-gray-400";

    const tooltip = isUp
      ? `Increased compared to previous period (${prev_value} feeds)`
      : `Decreased compared to previous period (${prev_value} feeds)`

    const baseClasses = "inline-flex items-center rounded-md"

    // const colorClasses = {
    //   positive: "bg-green-50 text-green-900 border-green-600",
    //   neutral: "bg-gray-50 text-gray-900 border-gray-600",
    //   negative: "bg-red-50 text-red-900 border-red-600",
    // }
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant="outline" className={clsx(baseClasses)}>
          <TrendIcon className={`${trendColor} w-5 h-5`} />{percent.toFixed(1)}%
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>


  )
}
