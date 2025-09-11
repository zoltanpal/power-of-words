import { useEffect, useRef } from "react";
import Highcharts from "highcharts";
import TreemapModule from "highcharts/modules/treemap"

interface Props {
  data: any;
  date_str: string;
}


export default function PhraseFrequencyChart({ data, date_str }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Highcharts.Chart | null>(null);

  // Initialize chart once
  useEffect(() => {
    if (!containerRef.current) return;

    chartRef.current = Highcharts.chart(containerRef.current as HTMLElement, {
      title: {
          text: date_str,
          align: 'left'
      },
      subtitle: {
          text:
              '',
          align: 'left'
      },
      tooltip: {
          useHTML: true,
          pointFormat: '...<b>{point.name}</b> is \
              <b>{point.value}...</b>'
      },
      series: [{
        type: 'treemap',
        name: '...',
        allowTraversingTree: true,
        alternateStartingDirection: true,
        dataLabels: {
            format: '{point.name}',
            style: {
                textOutline: 'none'
            }
        },
        borderRadius: 3,
        nodeSizeBy: 'leaf',
        levels: [{
            level: 1,
            layoutAlgorithm: 'sliceAndDice',
            groupPadding: 3,
            dataLabels: {
                headers: true,
                enabled: true,
                style: {
                    fontSize: '0.6em',
                    fontWeight: 'normal',
                    textTransform: 'uppercase',
                    color: 'var(--highcharts-neutral-color-100, #000)'
                }
            },
            borderRadius: 3,
            borderWidth: 1,
            colorByPoint: true

        }, {
            level: 2,
            dataLabels: {
                enabled: true,
                inside: false
            }
        }],
        data: [{
            id: 'A',
            name: '444.hu',
            color: '#d7f4e7ff'
        }, {
            id: 'B',
            name: 'telex.hu',
            color: '#cff5a9ff'
        }, {
            id: 'C',
            name: 'index.hu',
            color: '#d3cdffff'
        }, {
            id: 'D',
            name: '24.hu',
            color: '#f1f4c3ff'
        }, {
            id: 'E',
            name: 'origo.hu',
            color: '#ffd7f7ff'
        }, {
            name: 'Orbán Viktor',
            parent: 'A',
            value: 9
        }, {
            name: 'magyar péter',
            parent: 'A',
            value: 6
        }, {
            name: 'hadházy ákos',
            parent: 'A',
            value: 3
        }, {
            name: 'sample 43',
            parent: 'B',
            value: 11
        }, {
            name: 'sample 32',
            parent: 'B',
            value: 9
        }, {
            name: 'sample 21',
            parent: 'B',
            value: 6
        }, {
            name: 'sample 143',
            parent: 'C',
            value: 5
        }, {
            name: 'sample 432',
            parent: 'C',
            value: 4
        }, {
            name: 'sample 6721',
            parent: 'C',
            value: 3
        }, {
            name: 'sample 143',
            parent: 'D',
            value: 5
        }, {
            name: 'sample 432',
            parent: 'D',
            value: 4
        }, {
            name: 'sample 6721',
            parent: 'D',
            value: 3
        }]
    }],
    });

    return () => {
      chartRef.current?.destroy();
    };
  }, []);

  // Update series data dynamically
  useEffect(() => {

  }, [data]);

  return (
    <div
      ref={containerRef}
      className="phrase-freq-chart-container"
      style={{ display: "block", width: "100%", height: "400px" }}
    />
  );
}
