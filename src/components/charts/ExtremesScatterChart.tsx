// @ts-nocheck

import { useEffect, useRef } from "react";
import Highcharts from "highcharts";

function transformData(data) {
  const sentimentColorMap = {
    positive: "green",
    negative: "red",
    neutral: "gray",
  };

  const seriesMap = {};

  for (const item of data) {
    const source = item.source;
    const score = item.sentiment_compound;

    if (!seriesMap[source]) {
      seriesMap[source] = [];
    }

    seriesMap[source].push({
      x: new Date(item.published).getTime(), // X-axis: time
      y: score, // Y-axis: sentiment score
      title: item.title,
      sentiment: item.sentiment_key,
      sentiment_value: item.sentiment_value,
      color: sentimentColorMap[item.sentiment_key],
      date: item.published,
      source: source,
    });
  }

  return Object.entries(seriesMap).map(([source, points]) => ({
    name: source,
    data: points,
  }));
}

export default function ExtremesScatterChart({ startDate, endDate, data }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Highcharts.Chart | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = Highcharts.chart(containerRef.current as HTMLElement, {
      chart: {
        type: 'scatter',
        zoomType: 'xy',
      },
      title: {
        text: "Extreme Sentiment Articles Over Time",
      },
      subtitle: {
        text: `${startDate} - ${endDate}`,
      },
      xAxis: {
        type: "datetime",
        title: {
          text: "Published Date",
        },
        labels: {
          format: "{value:%b %e}",
        },
      },
      yAxis: {
        title: {
          text: "Sentiment Score",
        },
        min: -1,
        max: 1,
      },
      legend: {
        enabled: true,
      },
      tooltip: {
        useHTML: true,
        formatter: function () {
          return `
            <b>${this.series.name}</b><br/>
            <b>Date:</b> ${Highcharts.dateFormat('%Y-%m-%d %H:%m', this.point.x)}<br/>
            <b>Title:</b> ${this.point.title}<br/>
            <b>Sentiment:</b> ${this.point.sentiment_value}<br/>
            <b>Score:</b> ${this.point.y}
          `;
        },
      },
      series: transformData(data),
    });

    return () => chartRef.current?.destroy();
  }, [data]);

  useEffect(() => {
    if (!chartRef.current) return;

    const transformed = transformData(data);
    while (chartRef.current.series.length) {
      chartRef.current.series[0].remove(false);
    }
    transformed.forEach((s) => chartRef.current!.addSeries(s, false));
    chartRef.current.redraw();
  }, [data]);

  return (
    <div
      ref={containerRef}
      className="sentiment-chart-container"
      style={{ display: "block", width: "100%", height: "400px" }}
    />
  );
}
