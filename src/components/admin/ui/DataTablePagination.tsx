"use client";

import { useId, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@@/components/ui/button";
import { Input } from "@@/components/ui/input";
import { cn } from "@@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@@/components/ui/select";

export const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export type ShowTotal = (total: number, range: [number, number]) => string;

type DataTablePaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
  showTotal?: ShowTotal;
  showQuickJumper?: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
};

export default function DataTablePagination({
  page,
  pageSize,
  total,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  showTotal,
  showQuickJumper = false,
  onPageChange,
  onPageSizeChange,
  className,
}: DataTablePaginationProps) {
  const selectId = useId();
  const jumperId = useId();
  const [jumpValue, setJumpValue] = useState("");

  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), pageCount);
  const from = total === 0 ? 0 : (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  const submitJump = () => {
    const next = Number(jumpValue);
    if (Number.isInteger(next) && next >= 1 && next <= pageCount) {
      onPageChange(next);
    }
    setJumpValue("");
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-border px-3 py-3 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {showTotal
          ? showTotal(total, [from, to])
          : `${from}-${to} of ${total}`}
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor={selectId} className="text-sm text-muted-foreground">
            Rows
          </label>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger id={selectId} className="h-8 w-[74px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showQuickJumper ? (
          <div className="flex items-center gap-2">
            <label htmlFor={jumperId} className="text-sm text-muted-foreground">
              Go to
            </label>
            <Input
              id={jumperId}
              inputMode="numeric"
              className="h-8 w-16"
              value={jumpValue}
              onChange={(event) => setJumpValue(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submitJump();
                }
              }}
              onBlur={submitJump}
            />
          </div>
        ) : null}

        <div className="flex items-center gap-1">
          <span className="mr-2 text-sm text-muted-foreground">
            Page {current} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="First page"
            disabled={current <= 1}
            onClick={() => onPageChange(1)}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Previous page"
            disabled={current <= 1}
            onClick={() => onPageChange(current - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Next page"
            disabled={current >= pageCount}
            onClick={() => onPageChange(current + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Last page"
            disabled={current >= pageCount}
            onClick={() => onPageChange(pageCount)}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
