import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  page: number;
  setPage: (page: number) => void;
  total: number;
  itemsPerPage: number;
  setItemsPerPage: (val: number) => void;
};

export default function CustomPagination({
  page,
  setPage,
  total,
  itemsPerPage,
  setItemsPerPage,
}: Props) {
  const totalPages = Math.ceil(total / itemsPerPage);

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) setPage(p);
  };

  const renderPageNumbers = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", page - 1, page, page + 1, "...", totalPages);
      }
    }

    return pages.map((p, idx) =>
      typeof p === "number" ? (
        <Button
          key={idx}
          size="sm"
          variant={p === page ? "default" : "outline"}
          onClick={() => goToPage(p)}
        >
          {p}
        </Button>
      ) : (
        <span key={idx} className="px-2 text-sm text-muted-foreground">
          {p}
        </span>
      )
    );
  };

  return (
    <div className="my-4 flex justify-end items-center gap-4 flex-wrap">
      {/* Rows per page selector */}
      <div className="flex items-center gap-2 text-sm">
        <span>Rows per page:</span>
        <Select
          value={String(itemsPerPage)}
          onValueChange={(val) => setItemsPerPage(Number(val))}
        >
          <SelectTrigger className="w-[80px] h-8 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 30, 50].map((opt) => (
              <SelectItem key={opt} value={String(opt)}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page info */}
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages || 1}
      </span>

      {/* Page buttons */}
      <div className="flex gap-1 items-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => goToPage(1)}
          disabled={page === 1}
        >
          {`<<`}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => goToPage(page - 1)}
          disabled={page === 1}
        >
          {`<`}
        </Button>

        {renderPageNumbers()}

        <Button
          size="sm"
          variant="outline"
          onClick={() => goToPage(page + 1)}
          disabled={page === totalPages}
        >
          {`>`}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => goToPage(totalPages)}
          disabled={page === totalPages}
        >
          {`>>`}
        </Button>
      </div>
    </div>
  );
}
