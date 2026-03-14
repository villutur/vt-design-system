import React from "react";
import { cn } from "../../utils/cn";

export interface TableColumn<T> {
  id?: string;
  header: React.ReactNode;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
  headerClassName?: string;
  cellClassName?: string;
  width?: number | string;
  align?: "left" | "center" | "right";
}

const densityClassMap = {
  sm: {
    header: "px-sm py-sm text-xs",
    cell: "px-sm py-sm text-xs",
  },
  md: {
    header: "px-md py-md text-sm",
    cell: "px-md py-md text-sm",
  },
} as const;

export interface TableProps<
  T,
> extends React.TableHTMLAttributes<HTMLTableElement> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  onRowClick?: (row: T) => void;
  loading?: boolean;
  loadingRows?: number;
  emptyState?: React.ReactNode;
  errorState?: React.ReactNode;
  density?: keyof typeof densityClassMap;
  stickyHeader?: boolean;
  containerClassName?: string;
  rowClassName?: string | ((row: T, index: number) => string | undefined);
}

function getAlignmentClass(align: TableColumn<unknown>["align"]) {
  switch (align) {
    case "center":
      return "text-center";
    case "right":
      return "text-right";
    default:
      return "text-left";
  }
}

function renderCellValue<T>(column: TableColumn<T>, row: T) {
  return typeof column.accessor === "function"
    ? column.accessor(row)
    : (row[column.accessor] as React.ReactNode);
}

function TableInner<T>(
  {
    columns,
    data,
    keyExtractor,
    onRowClick,
    loading = false,
    loadingRows = 4,
    emptyState = "No data available.",
    errorState,
    density = "md",
    stickyHeader = false,
    containerClassName,
    rowClassName,
    className,
    ...props
  }: TableProps<T>,
  ref: React.ForwardedRef<HTMLTableElement>,
) {
  const sizing = densityClassMap[density];
  const stateContent = errorState ?? (loading ? null : emptyState);
  const hasStateRow = !!errorState || (!loading && data.length === 0);

  return (
    <div
      className={cn(
        "w-full overflow-x-auto",
        stickyHeader && "max-h-[26rem] overflow-auto",
        containerClassName,
      )}
    >
      <table
        ref={ref}
        className={cn("min-w-full border-collapse text-left", className)}
        {...props}
      >
        <thead
          className={cn(
            "border-b border-default bg-surface-subtle/60",
            stickyHeader && "sticky top-0 z-10 backdrop-blur-sm",
          )}
        >
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.id ?? index}
                style={{ width: column.width }}
                className={cn(
                  "font-semibold text-foreground-muted",
                  sizing.header,
                  getAlignmentClass(column.align),
                  column.className,
                  column.headerClassName,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border-default">
          {loading
            ? Array.from({ length: loadingRows }, (_, rowIndex) => (
                <tr key={`loading-row-${rowIndex}`} aria-hidden="true">
                  {columns.map((column, columnIndex) => (
                    <td
                      key={column.id ?? columnIndex}
                      className={cn(
                        "text-foreground",
                        sizing.cell,
                        column.className,
                        column.cellClassName,
                      )}
                    >
                      <div className="h-4 w-full animate-pulse rounded bg-surface-muted" />
                    </td>
                  ))}
                </tr>
              ))
            : null}

          {!loading && !hasStateRow
            ? data.map((row, rowIndex) => (
                <tr
                  key={keyExtractor(row, rowIndex)}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "transition-colors",
                    onRowClick && "cursor-pointer hover:bg-surface-subtle",
                    typeof rowClassName === "function"
                      ? rowClassName(row, rowIndex)
                      : rowClassName,
                  )}
                >
                  {columns.map((column, columnIndex) => (
                    <td
                      key={column.id ?? columnIndex}
                      className={cn(
                        "align-top text-foreground",
                        sizing.cell,
                        getAlignmentClass(column.align),
                        column.className,
                        column.cellClassName,
                      )}
                    >
                      {renderCellValue(column, row)}
                    </td>
                  ))}
                </tr>
              ))
            : null}

          {hasStateRow ? (
            <tr>
              <td
                colSpan={Math.max(columns.length, 1)}
                className={cn(
                  "text-center text-foreground-muted",
                  density === "sm"
                    ? "px-sm py-lg text-xs"
                    : "px-md py-xl text-sm",
                )}
              >
                {stateContent}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}

TableInner.displayName = "Table";

export const Table = React.forwardRef(TableInner) as <T>(
  props: TableProps<T> & React.RefAttributes<HTMLTableElement>,
) => React.ReactElement;
