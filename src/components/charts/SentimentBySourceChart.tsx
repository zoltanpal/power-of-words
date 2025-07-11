// @ts-nocheck

import { useEffect, useRef } from "react";
import Highcharts from "highcharts";

export type SentimentBySourceData = {
  Positive: number[];
  Neutral: number[];
  Negative: number[];
};

interface Props {
  data: SentimentBySourceData;
  startDate: string;
  endDate: string;
}

const sources = [
  "444.hu",
  "telex.hu",
  "24.hu",
  "origo.hu",
  "hirado.hu",
  "magyarnemzet.hu",
  "index.hu",
];

export default function SentimentBySourceChart({ data, startDate, endDate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Highcharts.Chart | null>(null);

  // Initialize chart once
  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = Highcharts.chart(containerRef.current as HTMLElement, {
      chart: {
        type: "bar",
      },
      title: {
        text: "Sentiment per Source",
      },
      subtitle: {
          text: startDate + ' - ' + endDate
      },
      xAxis: {
        categories: sources,
      },
      yAxis: {
        min: 0,
        title: {
          text: "# of feeds over time",
        },
      },
      legend: {
        reversed: true,
      },
      plotOptions: {
        series: {
          stacking: "normal",
          dataLabels: {
            enabled: true,
          },
        },
      },
      series: [
        { name: "Negative", data: data.Negative, color: "#FA7070" },
        { name: "Neutral", data: data.Neutral, color: "#FFEC9E" },
        { name: "Positive", data: data.Positive, color: "#8DECB4" },
      ],
      credits: {
        enabled: false,
      },
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  // Update series data dynamically
  useEffect(() => {
    if (!chartRef.current) return;

    const series = chartRef.current.series;
    if (series.length >= 3) {
      series[0].setData(data.Negative, true);
      series[1].setData(data.Neutral, true);
      series[2].setData(data.Positive, true);
    }
  }, [data]);

  return (
    <div
      ref={containerRef}
      className="sentiment-chart-container"
      style={{ display: "block", width: "100%", height: "400px" }}
    />
  );
}
