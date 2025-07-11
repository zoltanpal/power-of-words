// @ts-nocheck

import { useEffect, useRef } from "react";
import Highcharts from "highcharts";

type Props = {
  startDate: string;
  endDate: string;
  data: {
    Positive: number[];
    Neutral: number[];
    Negative: number[];
  };
};

export default function SentimentOverTimeChart({ startDate, endDate, data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Highcharts.Chart | null>(null);

  const generateCategories = (start: string, end: string): string[] => {
    const dates: string[] = [];

    const [startYear, startMonth, startDay] = start.split("-").map(Number);
    const [endYear, endMonth, endDay] = end.split("-").map(Number);

    const startDateObj = new Date(startYear, startMonth - 1, startDay);
    const endDateObj = new Date(endYear, endMonth - 1, endDay);

    while (startDateObj <= endDateObj) {
      const yyyy = startDateObj.getFullYear();
      const mm = String(startDateObj.getMonth() + 1).padStart(2, "0");
      const dd = String(startDateObj.getDate()).padStart(2, "0");
      dates.push(`${yyyy}-${mm}-${dd}`);
      startDateObj.setDate(startDateObj.getDate() + 1);
    }

    return dates;
  };

  // Initialize chart once
  useEffect(() => {
    if (!containerRef.current) return;

    const categories = generateCategories(startDate, endDate);

    chartRef.current = Highcharts.chart(containerRef.current as HTMLElement, {
      chart: {
        type: "area",
      },
      title: {
        text: "Sentiment Over Time",
      },
      subtitle: {
          text: startDate + ' - ' + endDate
      },
      xAxis: {
        categories,
      },
      yAxis: {
        min: 0,
        title: {
          text: "# of feeds over time",
        },
      },
      tooltip: {
        shared: true,
        headerFormat: '<span style="font-size:12px"><b>{point.key}</b></span><br>',
      },
      plotOptions: {
        area: {
          stacking: "normal",
          lineColor: "#666666",
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: "#666666",
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
    // We intentionally exclude `data` to only init once
  }, []);

  // Dynamically update series data & categories
  useEffect(() => {
    if (!chartRef.current) return;

    const categories = generateCategories(startDate, endDate);

    chartRef.current.xAxis[0].setCategories(categories, false);

    const [neg, neu, pos] = chartRef.current.series;

    neg.setData(data.Negative, false);
    neu.setData(data.Neutral, false);
    pos.setData(data.Positive, false);

    chartRef.current.redraw();
  }, [data, startDate, endDate]);

  return (
    <div
      ref={containerRef}
      className="sentiment-chart-container"
      style={{ minHeight: "300px", width: "100%", height: "100%" }}
    />
  );
}
