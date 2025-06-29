// @ts-nocheck

import { useEffect, useRef } from "react"
import Highcharts from "highcharts"
import WordcloudModule from "highcharts/modules/wordcloud"
//import * as WordcloudModule from "highcharts/modules/wordcloud"

//WordcloudModule.default(Highcharts)

export type WordCloudDatum = {
  name: string
  weight?: number
  value?: number
}

interface Props {
  seriesData: WordCloudDatum[]
  startDate?: string
  endDate?: string
}

export default function WordCloudChart({
  seriesData,
  startDate,
  endDate,
}: Props) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!Array.isArray(seriesData) || !chartRef.current) return

    Highcharts.chart(chartRef.current, {
      chart: {
        type: "wordcloud",
      },
      title: {
        text: "Wordcloud over time",
        align: "center",
      },
      subtitle: {
        text: startDate && endDate ? `${startDate} - ${endDate}` : "",
      },
      tooltip: {
        headerFormat:
          '<span style="font-size: 16px"><b>{point.key}</b></span><br>',
      },
      series: [
        {
          type: "wordcloud",
          name: "Occurrences",
          data: seriesData,
          rotation: {
            from: -20,
            to: 20,
            orientations: 10,
          },
        },
      ],
      accessibility: {
        enabled: false,
      },
      credits: {
        enabled: false,
      },
    })
  }, [seriesData, startDate, endDate])

  return (
    <div
      ref={chartRef}
      className="word-cloud-chart-container"
      style={{ width: "100%", height: "400px" }}
    />
  )
}
