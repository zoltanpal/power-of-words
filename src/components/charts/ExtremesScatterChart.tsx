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

    // Process each data item and categorize it by source
    for (const item of data) {
        const source = item.source;
        if (!seriesMap[source]) {
            seriesMap[source] = [];
        }

        seriesMap[source].push({
            x: source, // Set the source as the x value
            y: item.sentiment_compound, // Sentiment score
            title: item.title, // Article title
            sentiment: item.sentiment_key, // Sentiment type
            sentiment_value: item.sentiment_value, // Sentiment value (e.g., positive, negative)
            color: sentimentColorMap[item.sentiment_key], // Color based on sentiment
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

  // Initialize chart once
  useEffect(() => {
    if (!containerRef.current) return;

    // Get the unique sources for xAxis categories
    const uniqueSources = [...new Set(data.map((item) => item.source))];

    chartRef.current = Highcharts.chart(containerRef.current as HTMLElement, {
        chart: {
            type: 'scatter',
            zoomType: 'xy',
        },
        title: {
            text: "Articles with Extremely High or Low Sentiment Values",
        },
        subtitle: {
            text: `${startDate} - ${endDate}`,
        },
        xAxis: {
            categories: uniqueSources,
            title: {
                text: "Source",
            },
            labels: {
                rotation: -45,
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
                    <b>Title:</b> ${this.point.title}<br/>
                    <b>Sentiment:</b> ${this.point.sentiment_value}<br/>
                    <b>Date:</b> ${this.point.x} <br/> <!-- Display source as date -->
                    <b>Sentiment Score:</b> ${this.point.y}
                `;
            },
        },
        series: transformData(data),
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, [data]);

  // Update series data dynamically
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
