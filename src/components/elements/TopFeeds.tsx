import { formatDate } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table";

import { Loader2 } from "lucide-react";

type TopFeedItem = {
  title: string;
  name: string;
  published: string;
};

type Props = {
  value: TopFeedItem[];
  loading: boolean;
};

export function TopFeeds({ value = [], loading }: Props) {
  return (
    <Table>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-6">
              <Loader2 className="animate-spin mx-auto w-5 h-5" />
            </TableCell>
          </TableRow>
        ) : value.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
              No data available.
            </TableCell>
          </TableRow>
        ) : (
          value.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="whitespace-normal break-words">
                <div className="mb-1">{item.title}</div>
                <label className="text-xs text-gray-600 block">
                  {formatDate(item.published)} &bull; {item.name}
                </label>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
