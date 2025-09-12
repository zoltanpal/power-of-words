import * as React from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Row = {
  source: string;
  phrase: string;
  year: number;
  date_group: number; // 1..12
  freq: number;
  rnk: number;
};

type Props = {
  data: Row[];
};

const MONTHS = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthName(n: number) {
  return MONTHS[n] || `Month ${n}`;
}

// Utility to group by month -> source
function groupByMonthAndSource(rows: Row[]) {
  const byMonth = new Map<number, Map<string, Row[]>>();
  for (const r of rows) {
    if (!byMonth.has(r.date_group)) byMonth.set(r.date_group, new Map());
    const bySource = byMonth.get(r.date_group)!;
    if (!bySource.has(r.source)) bySource.set(r.source, []);
    bySource.get(r.source)!.push(r);
  }
  // Sort inside groups by rank asc, then freq desc
  for (const [, bySource] of byMonth) {
    for (const [src, arr] of bySource) {
      arr.sort((a, b) => (a.rnk - b.rnk) || (b.freq - a.freq));
      bySource.set(src, arr);
    }
  }
  return byMonth;
}

export default function TrendingPhrasesTable({ data }: Props) {
  const [q, setQ] = React.useState("");

  // Filter by phrase (case-insensitive), then stable sort by month, source, rank
  const filtered = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    let r = needle ? data.filter(d => d.phrase.toLowerCase().includes(needle)) : data.slice();
    r.sort((a, b) => {
      if (a.date_group !== b.date_group) return a.date_group - b.date_group;
      if (a.source !== b.source) return a.source.localeCompare(b.source);
      if (a.rnk !== b.rnk) return a.rnk - b.rnk;
      return b.freq - a.freq;
    });
    return r;
  }, [data, q]);

  // Group for rendering
  const grouped = React.useMemo(() => groupByMonthAndSource(filtered), [filtered]);

  // After adding a month header row, the data rows have 4 columns:
  // [Source (rowSpan), Rank, Phrase, Frequency]
  const DATA_COLS = 4;

  // Collect months with at least one row (in ascending month order)
  const months = React.useMemo(
    () => Array.from(grouped.keys()).sort((a, b) => a - b),
    [grouped]
  );

  return (
    <section className="space-y-4">
      {/* Search */}
      <div className="flex flex-col gap-1 max-w-md">
        <Label htmlFor="phraseSearch">Search phrase</Label>
        <Input
          id="phraseSearch"
          placeholder="Type to filter phrases…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="rounded-2xl border shadow-sm">
        <Table>
          {/* Header for data columns only (not month) */}
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Source</TableHead>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Phrase</TableHead>
              <TableHead className="w-[120px] text-right">Frequency</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {months.length === 0 ? (
              <TableRow>
                <TableCell colSpan={DATA_COLS} className="text-center py-10 text-sm text-muted-foreground">
                  No rows match your search.
                </TableCell>
              </TableRow>
            ) : (
              months.map((m) => {
                const bySource = grouped.get(m)!;
                const sources = Array.from(bySource.keys()).sort((a, b) => a.localeCompare(b));

                return (
                  <React.Fragment key={`month-${m}`}>
                    {/* Month header row spanning all columns */}
                    <TableRow>
                      <TableCell
                        colSpan={DATA_COLS}
                        className="bg-muted/60 font-semibold"
                      >
                        {monthName(m)} {bySource.values().next()?.value?.[0]?.year ?? ""}
                      </TableCell>
                    </TableRow>

                    {/* Rows grouped by source with rowSpan on the source cell */}
                    {sources.map((src) => {
                      const rows = bySource.get(src)!; // already sorted by rnk asc
                      return rows.map((r, idx) => (
                        <TableRow key={`row-${m}-${src}-${r.rnk}-${r.phrase}-${idx}`}>
                          {/* Source with rowSpan only on first row of this source block */}
                          {idx === 0 && (
                            <TableCell rowSpan={rows.length} className="align-top font-medium">
                              {src}
                            </TableCell>
                          )}
                          <TableCell>#{r.rnk}</TableCell>
                          <TableCell>{r.phrase}</TableCell>
                          <TableCell className="text-right">{r.freq}</TableCell>
                        </TableRow>
                      ));
                    })}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
