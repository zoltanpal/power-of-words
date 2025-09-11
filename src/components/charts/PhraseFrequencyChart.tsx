import { useEffect, useRef } from "react";
import Highcharts from "highcharts";


export type PhraseFrequencyData = {};
  

interface Props {
    seriesData: PhraseFrequencyData;
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

  
export default function PhraseFrequencyChart({ seriesData, startDate, endDate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Highcharts.Chart | null>(null);

  const series = Object.entries(seriesData).map(([phrase, freqs]) => ({
    name: phrase,
    data: freqs
  }));

  console.log('Series data:', series);

  // Initialize chart once
  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = Highcharts.chart(containerRef.current as HTMLElement, {
      chart: {
        type: "bar",
      },
      title: {
        text: "Phrase Frequency Trends",
      },
      subtitle: {
          text: startDate + ' - ' + endDate
      },
      xAxis: {
        categories: sources,
        title: {
            text: null
        },
      },
      yAxis: {
        min: 3,
        title: {
          text: "fgdfs",
        },
        labels: {
            overflow: 'justify'
        },
      },
      plotOptions: {
        bar: {
            borderRadius: '50%',
            dataLabels: {
                enabled: true
            },
            groupPadding: 0.1
        }
    },
      series: series,
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

  }, [seriesData]);

  return (
    <div
      ref={containerRef}
      className="phrase-frequency-chart-container"
      style={{ display: "block", width: "100%", height: "800px" }}
    />
  );

}