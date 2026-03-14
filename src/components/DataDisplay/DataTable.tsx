import React from "react";
import {
  type ColumnPinningState,
  type ColumnSizingState,
  type ColumnDef,
  type OnChangeFn,
  type SortingState,
  type Table as TanStackTable,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronUp,
  IconChevronsLeft,
  IconChevronsRight,
} from "@tabler/icons-react";
import { Button } from "../Forms/Button";
import { Input } from "../Forms/Input";
import { useControllableState } from "../../internal/useControllableState";
import { cn } from "../../utils/cn";

const densityClassMap = {
  sm: {
    cell: "px-sm py-sm text-xs",
    header: "px-sm py-sm text-xs",
  },
  md: {
    cell: "px-md py-md text-sm",
    header: "px-md py-md text-sm",
  },
} as const;

interface SelectionCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  indeterminate?: boolean;
}

const SelectionCheckbox = React.forwardRef<HTMLInputElement, SelectionCheckboxProps>(
  ({ indeterminate = false, className, ...props }, ref) => {
    const localRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      if (localRef.current) {
        localRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    return (
      <input
        ref={(node) => {
          localRef.current = node;

          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        type="checkbox"
        className={cn("h-4 w-4 rounded border-default text-primary focus:ring-2 focus:ring-primary/20", className)}
        {...props}
      />
    );
  },
);

SelectionCheckbox.displayName = "SelectionCheckbox";

type PinnedPosition = false | "left" | "right";

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function getPinnedCellStyles(column: {
  getIsPinned: () => PinnedPosition;
  getStart: (position: "left") => number;
  getAfter: (position: "right") => number;
}) {
  const pinned = column.getIsPinned();

  if (!pinned) {
    return undefined;
  }

  return {
    left: pinned === "left" ? `${column.getStart("left")}px` : undefined,
    position: "sticky" as const,
    right: pinned === "right" ? `${column.getAfter("right")}px` : undefined,
  };
}

function getPinnedCellClassName(
  column: {
    getIsPinned: () => PinnedPosition;
    getIsFirstColumn?: (position: "right") => boolean;
    getIsLastColumn?: (position: "left") => boolean;
  },
  region: "header" | "cell",
) {
  const pinned = column.getIsPinned();

  if (!pinned) {
    return undefined;
  }

  return cn(
    "relative",
    region === "header" ? "bg-surface-subtle" : "bg-inherit",
    pinned === "left" &&
      column.getIsLastColumn?.("left") &&
      "border-r border-default shadow-[2px_0_0_0_theme(colors.surface.DEFAULT)]",
    pinned === "right" &&
      column.getIsFirstColumn?.("right") &&
      "border-l border-default shadow-[-2px_0_0_0_theme(colors.surface.DEFAULT)]",
  );
}

function joinIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(" ") || undefined;
}

function getHeaderAccessibilityLabel(header: {
  column: {
    id: string;
    columnDef: { header?: unknown };
    getNextSortingOrder?: () => false | "asc" | "desc";
  };
}) {
  const headerContent = header.column.columnDef.header;
  const headerLabel =
    typeof headerContent === "string" && headerContent.trim().length > 0 ? headerContent : header.column.id;
  const nextSortingOrder = header.column.getNextSortingOrder?.();

  if (nextSortingOrder === "desc") {
    return `Sort ${headerLabel} descending`;
  }

  if (nextSortingOrder === false) {
    return `Clear sorting for ${headerLabel}`;
  }

  return `Sort ${headerLabel} ascending`;
}

export interface DataTableProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageSize?: number;
  enablePagination?: boolean;
  showColumnBorders?: boolean;
  enableRowSelection?: boolean;
  enableGlobalFilter?: boolean;
  loading?: boolean;
  loadingRows?: number;
  emptyState?: React.ReactNode;
  errorState?: React.ReactNode;
  density?: keyof typeof densityClassMap;
  stickyHeader?: boolean;
  globalFilterPlaceholder?: string;
  enableColumnResizing?: boolean;
  enableColumnPinning?: boolean;
  columnResizeMode?: "onChange" | "onEnd";
  columnSizing?: ColumnSizingState;
  defaultColumnSizing?: ColumnSizingState;
  onColumnSizingChange?: (state: ColumnSizingState) => void;
  columnPinning?: ColumnPinningState;
  defaultColumnPinning?: ColumnPinningState;
  onColumnPinningChange?: (state: ColumnPinningState) => void;
  getRowId?: (originalRow: TData, index: number) => string;
  rowClassName?: string | ((row: TData, rowIndex: number) => string | undefined);
  scrollContainerRef?: React.Ref<HTMLDivElement>;
  toolbar?: React.ReactNode | ((table: TanStackTable<TData>) => React.ReactNode);
}

export const DataTable = React.forwardRef(
  <TData, TValue>(
    {
      columns,
      data,
      pageSize = 10,
      enablePagination = true,
      showColumnBorders = false,
      enableRowSelection = false,
      enableGlobalFilter = false,
      loading = false,
      loadingRows = 5,
      emptyState = "No results.",
      errorState,
      density = "md",
      stickyHeader = false,
      globalFilterPlaceholder = "Search all columns...",
      enableColumnResizing = false,
      enableColumnPinning = false,
      columnResizeMode = "onChange",
      columnSizing,
      defaultColumnSizing,
      onColumnSizingChange,
      columnPinning,
      defaultColumnPinning,
      onColumnPinningChange,
      getRowId,
      rowClassName,
      scrollContainerRef,
      toolbar,
      className,
      role: regionRole,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledBy,
      "aria-describedby": ariaDescribedBy,
      ...props
    }: DataTableProps<TData, TValue>,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const tableId = React.useId();
    const summaryId = `${tableId}-summary`;
    const liveRegionId = `${tableId}-live-region`;
    const captionId = `${tableId}-caption`;
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [currentColumnSizing, setCurrentColumnSizing] = useControllableState<ColumnSizingState>({
      value: columnSizing,
      defaultValue: defaultColumnSizing ?? {},
      onChange: onColumnSizingChange,
    });
    const [currentColumnPinning, setCurrentColumnPinning] = useControllableState<ColumnPinningState>({
      value: columnPinning,
      defaultValue:
        defaultColumnPinning ??
        (enableColumnPinning && enableRowSelection ? { left: ["__select"], right: [] } : { left: [], right: [] }),
      onChange: onColumnPinningChange,
    });
    const columnSizingRef = React.useRef(currentColumnSizing);
    const columnPinningRef = React.useRef(currentColumnPinning);
    const sizing = densityClassMap[density];

    React.useEffect(() => {
      columnSizingRef.current = currentColumnSizing;
    }, [currentColumnSizing]);

    React.useEffect(() => {
      columnPinningRef.current = currentColumnPinning;
    }, [currentColumnPinning]);

    const handleColumnSizingChange = React.useCallback<OnChangeFn<ColumnSizingState>>(
      (updaterOrValue) => {
        const nextValue =
          typeof updaterOrValue === "function" ? updaterOrValue(columnSizingRef.current) : updaterOrValue;

        setCurrentColumnSizing(nextValue);
      },
      [setCurrentColumnSizing],
    );

    const handleColumnPinningChange = React.useCallback<OnChangeFn<ColumnPinningState>>(
      (updaterOrValue) => {
        const nextValue =
          typeof updaterOrValue === "function" ? updaterOrValue(columnPinningRef.current) : updaterOrValue;

        setCurrentColumnPinning(nextValue);
      },
      [setCurrentColumnPinning],
    );

    const selectionColumn = React.useMemo<ColumnDef<TData, unknown>>(
      () => ({
        id: "__select",
        enableHiding: false,
        enableResizing: false,
        enableSorting: false,
        size: 44,
        header: ({ table }) => (
          <div className="flex justify-center">
            <SelectionCheckbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={table.getIsSomePageRowsSelected()}
              onChange={table.getToggleAllPageRowsSelectedHandler()}
              aria-label="Select all rows on the current page"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex justify-center">
            <SelectionCheckbox
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              indeterminate={row.getIsSomeSelected()}
              onChange={row.getToggleSelectedHandler()}
              aria-label={`Select row ${row.index + 1}`}
            />
          </div>
        ),
      }),
      [],
    );

    const resolvedColumns = React.useMemo<ColumnDef<TData, any>[]>(
      () =>
        enableRowSelection
          ? [selectionColumn, ...(columns as ColumnDef<TData, any>[])]
          : (columns as ColumnDef<TData, any>[]),
      [columns, enableRowSelection, selectionColumn],
    );

    const table = useReactTable({
      data,
      columns: resolvedColumns,
      state: {
        sorting,
        rowSelection,
        globalFilter,
        columnSizing: currentColumnSizing,
        columnPinning: currentColumnPinning,
      },
      columnResizeMode,
      enableColumnPinning,
      enableColumnResizing,
      enableRowSelection,
      getRowId,
      onRowSelectionChange: setRowSelection,
      onSortingChange: setSorting,
      onGlobalFilterChange: setGlobalFilter,
      onColumnSizingChange: handleColumnSizingChange,
      onColumnPinningChange: handleColumnPinningChange,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      getFilteredRowModel: getFilteredRowModel(),
      getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
      initialState: {
        pagination: {
          pageSize,
        },
      },
    });

    const toolbarContent = typeof toolbar === "function" ? toolbar(table) : toolbar;
    const visibleColumns = table.getVisibleLeafColumns().length;
    const filteredRows = table.getFilteredRowModel().rows;
    const rows = table.getRowModel().rows;
    const selectedCount = table.getSelectedRowModel().rows.length;
    const filteredCount = filteredRows.length;
    const pageIndex = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount() || 1;
    const showStateRow = !!errorState || (!loading && rows.length === 0);
    const resultsSummary = enablePagination
      ? `Showing ${rows.length} of ${filteredCount} filtered result${filteredCount === 1 ? "" : "s"} on page ${pageIndex + 1} of ${pageCount}.`
      : `Showing ${rows.length} of ${filteredCount} filtered result${filteredCount === 1 ? "" : "s"}.`;
    const selectionSummary = enableRowSelection
      ? `${selectedCount} row${selectedCount === 1 ? "" : "s"} selected.`
      : undefined;
    const statusSummary = loading
      ? "Loading table rows."
      : errorState
        ? "The table is showing an error state."
        : filteredCount === 0
          ? "No table results are available."
          : (joinIds(resultsSummary, selectionSummary)?.replaceAll?.("  ", " ") ??
            [resultsSummary, selectionSummary].filter(Boolean).join(" "));
    const tableRegionLabel = typeof ariaLabel === "string" && ariaLabel.trim().length > 0 ? ariaLabel : "Data table";
    const regionDescription = joinIds(ariaDescribedBy, summaryId);

    return (
      <div
        ref={ref}
        role={regionRole ?? "region"}
        aria-label={ariaLabelledBy ? undefined : tableRegionLabel}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={regionDescription}
        aria-busy={loading || undefined}
        className={cn("w-full", className)}
        {...props}
      >
        <p id={summaryId} className="sr-only">
          {statusSummary}
        </p>
        <div id={liveRegionId} className="sr-only" aria-live="polite" aria-atomic="true">
          {statusSummary}
        </div>
        {enableGlobalFilter || toolbarContent ? (
          <div className="mb-md flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
            {enableGlobalFilter ? (
              <Input
                placeholder={globalFilterPlaceholder}
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-sm"
                aria-label="Search table"
              />
            ) : (
              <div />
            )}
            {toolbarContent ? <div>{toolbarContent}</div> : null}
          </div>
        ) : null}

        <div className="overflow-hidden rounded-xl border border-default bg-surface shadow-sm">
          <div
            ref={(node) => assignRef(scrollContainerRef, node)}
            aria-busy={loading || undefined}
            className={cn(stickyHeader || enableColumnPinning ? "max-h-[26rem] overflow-auto" : "overflow-x-auto")}
          >
            <table
              aria-describedby={summaryId}
              aria-busy={loading || undefined}
              className="min-w-full text-left"
              style={{
                width: enableColumnResizing ? table.getTotalSize() : undefined,
              }}
            >
              <caption id={captionId} className="sr-only">
                {tableRegionLabel}. {statusSummary}
              </caption>
              <thead
                className={cn(
                  "border-b border-default bg-surface-subtle text-foreground-muted",
                  stickyHeader && "sticky top-0 z-10 backdrop-blur-sm",
                )}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort();
                      const isSorted = header.column.getIsSorted();

                      return (
                        <th
                          key={header.id}
                          scope="col"
                          aria-sort={
                            canSort
                              ? isSorted === "asc"
                                ? "ascending"
                                : isSorted === "desc"
                                  ? "descending"
                                  : "none"
                              : undefined
                          }
                          className={cn(
                            "group font-medium whitespace-nowrap transition-colors",
                            sizing.header,
                            showColumnBorders && "border-r border-default last:border-r-0",
                            getPinnedCellClassName(header.column, "header"),
                          )}
                          style={{
                            ...getPinnedCellStyles(header.column),
                            width: header.getSize(),
                            zIndex: header.column.getIsPinned() ? (stickyHeader ? 30 : 20) : undefined,
                          }}
                        >
                          {header.isPlaceholder ? null : (
                            <div className="relative flex items-center gap-sm">
                              {canSort ? (
                                <button
                                  type="button"
                                  onClick={header.column.getToggleSortingHandler()}
                                  className={cn(
                                    "flex min-w-0 flex-1 items-center gap-sm rounded-md text-left transition-colors outline-none",
                                    "hover:text-foreground focus-visible:ring-2 focus-visible:ring-primary/20",
                                  )}
                                  aria-label={getHeaderAccessibilityLabel(header)}
                                >
                                  <span className="flex min-w-0 items-center gap-sm">
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    <span
                                      aria-hidden="true"
                                      className="flex origin-center flex-col text-foreground-subtle"
                                    >
                                      {isSorted === "asc" ? (
                                        <IconChevronUp className="h-4 w-4 text-primary" />
                                      ) : isSorted === "desc" ? (
                                        <IconChevronDown className="h-4 w-4 text-primary" />
                                      ) : (
                                        <div className="flex flex-col -space-y-1.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                                          <IconChevronUp className="h-3 w-3" />
                                          <IconChevronDown className="h-3 w-3" />
                                        </div>
                                      )}
                                    </span>
                                  </span>
                                </button>
                              ) : (
                                <div className="flex min-w-0 flex-1 items-center gap-sm">
                                  {flexRender(header.column.columnDef.header, header.getContext())}
                                </div>
                              )}
                              {enableColumnResizing && header.column.getCanResize() ? (
                                <div
                                  role="separator"
                                  aria-orientation="vertical"
                                  aria-label={`Resize ${String(header.column.id)} column`}
                                  onDoubleClick={() => header.column.resetSize()}
                                  onMouseDown={(event) => {
                                    event.stopPropagation();
                                    header.getResizeHandler()(event);
                                  }}
                                  onTouchStart={(event) => {
                                    event.stopPropagation();
                                    header.getResizeHandler()(event);
                                  }}
                                  className={cn(
                                    "absolute top-0 right-0 h-full w-2 cursor-col-resize touch-none opacity-0 transition-opacity select-none group-hover:opacity-100",
                                    header.column.getIsResizing() && "opacity-100",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "absolute top-1/2 right-0 h-[70%] w-px -translate-y-1/2 bg-border-strong",
                                      header.column.getIsResizing() && "bg-primary",
                                    )}
                                  />
                                </div>
                              ) : null}
                            </div>
                          )}
                        </th>
                      );
                    })}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border-default text-foreground">
                {loading
                  ? Array.from({ length: loadingRows }, (_, rowIndex) => (
                      <tr key={`loading-row-${rowIndex}`} aria-hidden="true">
                        {Array.from({ length: visibleColumns }, (_, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={cn(sizing.cell, showColumnBorders && "border-r border-default last:border-r-0")}
                          >
                            <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
                          </td>
                        ))}
                      </tr>
                    ))
                  : null}

                {!loading && !showStateRow
                  ? rows.map((row) => (
                      <tr
                        key={row.id}
                        data-state={row.getIsSelected() ? "selected" : undefined}
                        className={cn(
                          "transition-colors hover:bg-surface-subtle/80",
                          row.getIsSelected() && "bg-primary/5",
                          typeof rowClassName === "function" ? rowClassName(row.original, row.index) : rowClassName,
                        )}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className={cn(
                              "relative",
                              sizing.cell,
                              showColumnBorders && "border-r border-default last:border-r-0",
                              getPinnedCellClassName(cell.column, "cell"),
                            )}
                            style={{
                              ...getPinnedCellStyles(cell.column),
                              width: cell.column.getSize(),
                              zIndex: cell.column.getIsPinned() ? 10 : undefined,
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  : null}

                {showStateRow ? (
                  <tr>
                    <td
                      colSpan={Math.max(visibleColumns, 1)}
                      className={cn(
                        "text-center text-foreground-muted",
                        density === "sm" ? "px-sm py-lg text-xs" : "px-md py-xl text-sm",
                      )}
                    >
                      {errorState ?? emptyState}
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-sm px-sm py-md text-sm text-foreground-muted md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-sm">
            <span>
              Showing {rows.length} of {filteredCount} result
              {filteredCount === 1 ? "" : "s"}
            </span>
            {enableRowSelection ? <span>{selectedCount} selected</span> : null}
          </div>
          {enablePagination && table.getPageCount() > 1 ? (
            <div className="flex items-center gap-sm">
              <span className="mr-xs">
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-sm"
                title="First page"
                aria-label="Go to first page"
              >
                <IconChevronsLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-sm"
                title="Previous page"
                aria-label="Go to previous page"
              >
                <IconChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-sm"
                title="Next page"
                aria-label="Go to next page"
              >
                <IconChevronRight className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-sm"
                title="Last page"
                aria-label="Go to last page"
              >
                <IconChevronsRight className="h-5 w-5" />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    );
  },
) as (<TData, TValue>(
  props: DataTableProps<TData, TValue> & React.RefAttributes<HTMLDivElement>,
) => React.ReactElement) & { displayName?: string };

DataTable.displayName = "DataTable";
