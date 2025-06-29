// @ts-nocheck

import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import HighchartsHeatmap from "highcharts/modules/heatmap";


function transformHeatmapData(data) {
  const sources = [...new Set(data.map((item) => item.sourcename))];
  const sourceIndex = Object.fromEntries(sources.map((s, i) => [s, i]));

  const matrix = {};

  // Group by keyword
  for (const item of data) {
    const key = `${item.word}__${item.month}`;
    if (!matrix[key]) matrix[key] = {};
    matrix[key][item.sourcename] = item.avg_compound;
  }

  // Now calculate pairwise correlation for each key (word + month)
  const correlations = {};
  for (const [key, row] of Object.entries(matrix)) {
    const keys = Object.keys(row);
    for (let i = 0; i < keys.length; i++) {
      for (let j = 0; j < keys.length; j++) {
        const si = keys[i];
        const sj = keys[j];
        if (!correlations[si]) correlations[si] = {};
        if (!correlations[si][sj]) correlations[si][sj] = [];

        correlations[si][sj].push([row[si], row[sj]]);
      }
    }
  }

  // Pearson correlation function
  function pearson(xyPairs) {
    const x = xyPairs.map((p) => p[0]);
    const y = xyPairs.map((p) => p[1]);
    const n = x.length;
    const avgX = x.reduce((a, b) => a + b, 0) / n;
    const avgY = y.reduce((a, b) => a + b, 0) / n;
    const cov = x.reduce((sum, xi, i) => sum + (xi - avgX) * (y[i] - avgY), 0);
    const stdX = Math.sqrt(x.reduce((sum, xi) => sum + (xi - avgX) ** 2, 0));
    const stdY = Math.sqrt(y.reduce((sum, yi) => sum + (yi - avgY) ** 2, 0));
    return stdX && stdY ? cov / (stdX * stdY) : 0;
  }

  // Convert to Highcharts format
  const heatmapData = [];

  for (const [si, row] of Object.entries(correlations)) {
    for (const [sj, values] of Object.entries(row)) {
      heatmapData.push({
        x: sourceIndex[si],
        y: sourceIndex[sj],
        value: parseFloat(pearson(values).toFixed(2)),
      });
    }
  }

  return { sources, heatmapData };
}

export default function CorrelationHeatmapChart({ data, startDate, endDate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Highcharts.Chart | null>(null);

  useEffect(() => {
    if (!Array.isArray(data) || !containerRef.current) return
    
    const { sources, heatmapData } = transformHeatmapData(data);

    chartRef.current = Highcharts.chart(containerRef.current as HTMLElement, {
      chart: {
        type: "heatmap",
        plotBorderWidth: 1,
      },
      title: {
        text: "Correlation Between Sources (Monthly Avg. Sentiment)",
      },
      subtitle: {
        text: `${startDate} - ${endDate}`,
      },
      xAxis: {
        categories: sources,
        title: false,
      },
      yAxis: {
        categories: sources,
        title: false,
        reversed: true,
      },
      colorAxis: {
        min: -1,
        max: 1,
        stops: [
          [0, "#ff0000"],
          [0.5, "#ffffff"],
          [1, "#0000ff"],
        ],
      },
      legend: {
        align: "right",
        layout: "vertical",
        margin: 0,
        verticalAlign: "top",
        y: 25,
        symbolHeight: 200,
      },
      tooltip: {
        formatter: function () {
          return `<b>${this.series.xAxis.categories[this.point.x]}</b> vs <b>${this.series.yAxis.categories[this.point.y]}</b><br/>Correlation: <b>${this.point.value}</b>`;
        },
      },
      series: [
        {
          name: "Source Correlation",
          borderWidth: 1,
          data: heatmapData,
          dataLabels: {
            enabled: true,
            format: "{point.value}",
          },
        },
      ],
    });

    return () => chartRef.current?.destroy();
  }, [data]);

  return (
    <div
      ref={containerRef}
      className="sentiment-chart-container"
      style={{ display: "block", width: "100%", height: "500px" }}
    />
  );
}
