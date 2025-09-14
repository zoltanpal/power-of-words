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
  date_group: number; // month (1..12) or ISO week (1..53)
  freq: number;
  rnk: number;
};

type GroupMode = "auto" | "month" | "week";

type Props = {
  data: Row[];
  /** Controls how to label date_group. "auto" infers week if any date_group > 12. */
  groupMode?: GroupMode;
};

const MONTHS = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function monthName(n: number) {
  return MONTHS[n] || `Month ${n}`;
}

function inferMode(data: Row[]): Exclude<GroupMode, "auto"> {
  // If any date_group > 12, treat as ISO week
  return data.some(d => d.date_group > 12) ? "week" : "month";
}

function formatDateGroupLabel(mode: Exclude<GroupMode, "auto">, dg: number, year?: number) {
  if (mode === "month") {
    return `${monthName(dg)}${year ? ` ${year}` : ""}`;
  }
  // week mode
  const wk = String(dg).padStart(2, "0");
  return `Week ${wk}${year ? `, ${year}` : ""}`;
}

// Utility to group by date_group -> source
function groupByDateGroupAndSource(rows: Row[]) {
  const byGroup = new Map<number, Map<string, Row[]>>();
  for (const r of rows) {
    if (!byGroup.has(r.date_group)) byGroup.set(r.date_group, new Map());
    const bySource = byGroup.get(r.date_group)!;
    if (!bySource.has(r.source)) bySource.set(r.source, []);
    bySource.get(r.source)!.push(r);
  }
  // Sort inside groups by rank asc, then freq desc
  for (const [, bySource] of byGroup) {
    for (const [src, arr] of bySource) {
      arr.sort((a, b) => (a.rnk - b.rnk) || (b.freq - a.freq));
      bySource.set(src, arr);
    }
  }
  return byGroup;
}

export default function TrendingPhrasesTable({ data, groupMode = "auto" }: Props) {
  const [q, setQ] = React.useState("");

  // Decide label mode
  const labelMode: Exclude<GroupMode, "auto"> = React.useMemo(
    () => (groupMode === "auto" ? inferMode(data) : groupMode),
    [data, groupMode]
  );

  // Filter by phrase (case-insensitive), then stable sort by group, source, rank
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
  const grouped = React.useMemo(() => groupByDateGroupAndSource(filtered), [filtered]);

  // After adding a date-group header row, the data rows have 4 columns:
  // [Source (rowSpan), Rank, Phrase, Frequency]
  const DATA_COLS = 4;

  // Collect date_groups with at least one row (ascending)
  const groups = React.useMemo(
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

      <div className=" border shadow-sm">
        <Table className=" border-gray-200 text-sm">
          {/* Header for data columns only (not date group) */}
          <TableHeader className="bg-gray-100 text-left">
            <TableRow>
              <TableHead className="w-[180px]">Source</TableHead>
              <TableHead className="w-[80px]">Rank</TableHead>
              <TableHead>Phrase</TableHead>
              <TableHead className="w-[120px] text-right">Frequency</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {groups.length === 0 ? (
              <TableRow>
                <TableCell colSpan={DATA_COLS} className="text-center py-10 text-sm text-muted-foreground">
                  No rows match your search.
                </TableCell>
              </TableRow>
            ) : (
              groups.map((dg) => {
                const bySource = grouped.get(dg)!;
                const sources = Array.from(bySource.keys()).sort((a, b) => a.localeCompare(b));

                // Try to pick a consistent year for the label from the first row in this group
                const anyRows = bySource.values().next().value as Row[] | undefined;
                const year = anyRows && anyRows[0] ? anyRows[0].year : undefined;
                const label = formatDateGroupLabel(labelMode, dg, year);

                return (
                  <React.Fragment key={`group-${dg}`}>
                    {/* Date-group header spanning all columns */}
                    <TableRow>
                      <TableCell
                        colSpan={DATA_COLS}
                        className="bg-muted/60 font-semibold"
                      >
                        {label}
                      </TableCell>
                    </TableRow>

                    {/* Rows grouped by source with rowSpan on the source cell */}
                    {sources.map((src) => {
                      const rows = bySource.get(src)!; // already sorted by rnk asc
                      return rows.map((r, idx) => (
                        <TableRow key={`row-${dg}-${src}-${r.rnk}-${r.phrase}-${idx}`}>
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
