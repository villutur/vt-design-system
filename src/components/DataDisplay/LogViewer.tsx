import React from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  IconAlertCircle,
  IconArrowDown,
  IconCheck,
  IconChevronDown,
  IconChevronRight,
  IconFilter,
  IconLoader2,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { useControllableState } from "../../internal/useControllableState";
import { cn } from "../../utils/cn";
import { EmptyState } from "../Feedback/EmptyState";
import { Button } from "../Forms/Button";
import { Input } from "../Forms/Input";
import { ScrollArea } from "../Layout/ScrollArea";
import { Popover, PopoverContent, PopoverTrigger } from "../Overlay/Popover";
import { Accordion, AccordionItem } from "../Surfaces/Accordion";
import { Badge } from "./Badge";
import { CodeBlock } from "./CodeBlock";
import { KeyValue } from "./KeyValue";
import { MarkdownRenderer } from "./MarkdownRenderer";

const LOG_VIEWER_LEVELS = ["trace", "debug", "info", "warn", "error"] as const;

const densityClassMap = {
  default: {
    root: "rounded-2xl",
    header: "gap-md px-lg py-md",
    viewport: "text-sm",
    row: "px-lg py-sm",
    rowGap: "gap-md",
    rowMessage: "text-sm",
    timestamp: "w-[110px] text-xs",
    details: "px-lg pb-lg pt-sm",
    detailSection: "space-y-md",
    subheading:
      "text-[11px] font-bold tracking-[0.14em] text-foreground-subtle uppercase",
    estimateSize: 58,
    minHeight: "min-h-[58px]",
  },
  compact: {
    root: "rounded-xl",
    header: "gap-sm px-md py-sm",
    viewport: "text-xs",
    row: "px-md py-xs",
    rowGap: "gap-sm",
    rowMessage: "text-xs",
    timestamp: "w-[98px] text-[11px]",
    details: "px-md pb-md pt-sm",
    detailSection: "space-y-sm",
    subheading:
      "text-[10px] font-bold tracking-[0.14em] text-foreground-subtle uppercase",
    estimateSize: 50,
    minHeight: "min-h-[50px]",
  },
} as const;

const levelStyles = {
  trace: {
    buttonActive: "border-default bg-surface text-foreground",
    buttonInactive:
      "border-default bg-surface-subtle/60 text-foreground-subtle hover:text-foreground",
    badgeVariant: "outlineGray" as const,
    rowAccent: "border-l-transparent bg-transparent",
    rowHeader: "",
  },
  debug: {
    buttonActive: "border-default bg-surface text-foreground",
    buttonInactive:
      "border-default bg-surface-subtle/60 text-foreground-subtle hover:text-foreground",
    badgeVariant: "soft" as const,
    rowAccent: "border-l-transparent bg-transparent",
    rowHeader: "",
  },
  info: {
    buttonActive: "border-primary/30 bg-primary/10 text-primary",
    buttonInactive:
      "border-default bg-surface-subtle/60 text-foreground-subtle hover:text-foreground",
    badgeVariant: "softPrimary" as const,
    rowAccent: "border-l-transparent bg-transparent",
    rowHeader: "",
  },
  warn: {
    buttonActive: "border-warning/30 bg-warning/10 text-warning",
    buttonInactive:
      "border-default bg-surface-subtle/60 text-foreground-subtle hover:text-foreground",
    badgeVariant: "softWarning" as const,
    rowAccent: "border-l-warning/30 bg-warning/5",
    rowHeader: "hover:bg-warning/5",
  },
  error: {
    buttonActive: "border-error/30 bg-error/10 text-error",
    buttonInactive:
      "border-default bg-surface-subtle/60 text-foreground-subtle hover:text-foreground",
    badgeVariant: "softError" as const,
    rowAccent: "border-l-error/30 bg-error/5",
    rowHeader: "hover:bg-error/5",
  },
} as const;

const statusStyles = {
  idle: null,
  running: {
    label: "Running",
    variant: "softPrimary" as const,
    icon: <IconLoader2 size={12} className="animate-spin" />,
  },
  success: {
    label: "Success",
    variant: "softSuccess" as const,
    icon: <IconCheck size={12} />,
  },
  error: {
    label: "Error",
    variant: "softError" as const,
    icon: <IconAlertCircle size={12} />,
  },
} as const;

export type LogViewerLevel = (typeof LOG_VIEWER_LEVELS)[number];
export type LogViewerAttachmentKind =
  | "text"
  | "json"
  | "code"
  | "markdown"
  | "meta";

export interface LogViewerAttachment {
  id: string;
  kind: LogViewerAttachmentKind;
  label?: React.ReactNode;
  summary?: React.ReactNode;
  value: unknown;
  language?: string;
  defaultOpen?: boolean;
  searchText?: string;
}

export interface LogViewerItem {
  id: string;
  timestamp: number | string | Date;
  level: LogViewerLevel;
  message: string;
  source?: string;
  tags?: string[];
  status?: "idle" | "running" | "success" | "error";
  attachments?: LogViewerAttachment[];
  searchText?: string;
}

export interface LogViewerProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  items: LogViewerItem[];
  height?: number | string;
  density?: "default" | "compact";
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  selectedLevels?: LogViewerLevel[];
  defaultSelectedLevels?: LogViewerLevel[];
  onSelectedLevelsChange?: (levels: LogViewerLevel[]) => void;
  selectedSources?: string[];
  defaultSelectedSources?: string[];
  onSelectedSourcesChange?: (sources: string[]) => void;
  selectedTags?: string[];
  defaultSelectedTags?: string[];
  onSelectedTagsChange?: (tags: string[]) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (ids: string[]) => void;
  followTail?: boolean;
  defaultFollowTail?: boolean;
  onFollowTailChange?: (followTail: boolean) => void;
  emptyState?: React.ReactNode;
  noResultsState?: React.ReactNode;
}

interface FilterOption {
  value: string;
  count: number;
}

interface NormalizedLogViewerAttachment extends LogViewerAttachment {
  labelText?: string;
  summaryText?: string;
  searchKey: string;
}

interface NormalizedLogViewerItem extends LogViewerItem {
  attachments: NormalizedLogViewerAttachment[];
  attachmentCount: number;
  expandable: boolean;
  searchKey: string;
  timestampText: string;
  tags: string[];
}

function toSearchText(value: unknown): string {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  return "";
}

function normalizeSearchText(value: string) {
  return value.trim().toLowerCase();
}

function appendSearchText(parts: string[], value: unknown) {
  const text = toSearchText(value);

  if (text) {
    parts.push(text);
  }
}

function normalizeTimestamp(timestamp: LogViewerItem["timestamp"]) {
  const resolvedDate =
    timestamp instanceof Date
      ? timestamp
      : typeof timestamp === "number" || typeof timestamp === "string"
        ? new Date(timestamp)
        : null;

  if (!resolvedDate || Number.isNaN(resolvedDate.getTime())) {
    return String(timestamp);
  }

  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hour12: false,
  }).format(resolvedDate);
}

function safeSerialize(value: unknown, seen = new WeakSet<object>()): string {
  if (value === null || value === undefined) {
    return String(value);
  }

  if (typeof value === "string") {
    return value;
  }

  if (
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "bigint"
  ) {
    return String(value);
  }

  if (typeof value === "function") {
    return `[Function ${value.name || "anonymous"}]`;
  }

  if (typeof value === "symbol") {
    return value.toString();
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return JSON.stringify(
      {
        name: value.name,
        message: value.message,
        stack: value.stack,
      },
      null,
      2,
    );
  }

  if (typeof value !== "object") {
    return String(value);
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return JSON.stringify(
      value.map((item) => JSON.parse(safeSerializeToJson(item, seen))),
      null,
      2,
    );
  }

  return JSON.stringify(JSON.parse(safeSerializeToJson(value, seen)), null, 2);
}

function safeSerializeToJson(
  value: unknown,
  seen = new WeakSet<object>(),
): string {
  if (value === null || value === undefined) {
    return JSON.stringify(value);
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return JSON.stringify(value);
  }

  if (typeof value === "bigint") {
    return JSON.stringify(`${value}n`);
  }

  if (typeof value === "symbol") {
    return JSON.stringify(value.toString());
  }

  if (typeof value === "function") {
    return JSON.stringify(`[Function ${value.name || "anonymous"}]`);
  }

  if (value instanceof Date) {
    return JSON.stringify(value.toISOString());
  }

  if (value instanceof Error) {
    return JSON.stringify({
      name: value.name,
      message: value.message,
      stack: value.stack,
    });
  }

  if (typeof value !== "object") {
    return JSON.stringify(String(value));
  }

  if (seen.has(value)) {
    return JSON.stringify("[Circular]");
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return `[${value.map((item) => safeSerializeToJson(item, seen)).join(",")}]`;
  }

  const entries = Object.entries(value).map(([key, entryValue]) => [
    key,
    safeSerializeToJson(entryValue, seen),
  ]);

  return `{${entries
    .map(
      ([key, serializedValue]) => `${JSON.stringify(key)}:${serializedValue}`,
    )
    .join(",")}}`;
}

function getAttachmentSearchKey(attachment: LogViewerAttachment) {
  const parts: string[] = [];

  if (attachment.searchText) {
    parts.push(attachment.searchText);
  }

  appendSearchText(parts, attachment.label);
  appendSearchText(parts, attachment.summary);

  if (
    (attachment.kind === "text" || attachment.kind === "markdown") &&
    typeof attachment.value === "string"
  ) {
    parts.push(attachment.value);
  }

  if (
    attachment.kind === "meta" &&
    (typeof attachment.value === "string" ||
      typeof attachment.value === "number" ||
      typeof attachment.value === "boolean")
  ) {
    parts.push(String(attachment.value));
  }

  return normalizeSearchText(parts.join(" "));
}

function buildNormalizedItems(items: LogViewerItem[]) {
  const sourceCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();

  const normalizedItems: NormalizedLogViewerItem[] = items.map((item) => {
    if (item.source) {
      sourceCounts.set(item.source, (sourceCounts.get(item.source) ?? 0) + 1);
    }

    const normalizedTags = Array.from(new Set(item.tags ?? []));

    normalizedTags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    });

    const attachments = (item.attachments ?? []).map((attachment) => ({
      ...attachment,
      labelText:
        typeof attachment.label === "string" ? attachment.label : undefined,
      summaryText:
        typeof attachment.summary === "string" ? attachment.summary : undefined,
      searchKey: getAttachmentSearchKey(attachment),
    }));

    const searchParts = [
      item.message,
      item.source ?? "",
      normalizedTags.join(" "),
      item.searchText ?? "",
      attachments.map((attachment) => attachment.searchKey).join(" "),
    ];

    return {
      ...item,
      tags: normalizedTags,
      attachments,
      attachmentCount: attachments.length,
      expandable: attachments.length > 0,
      searchKey: normalizeSearchText(searchParts.join(" ")),
      timestampText: normalizeTimestamp(item.timestamp),
    };
  });

  const collator = new Intl.Collator("en", { sensitivity: "base" });
  const sources = Array.from(sourceCounts.entries())
    .sort(([left], [right]) => collator.compare(left, right))
    .map(([value, count]) => ({ value, count }));
  const tags = Array.from(tagCounts.entries())
    .sort(([left], [right]) => collator.compare(left, right))
    .map(([value, count]) => ({ value, count }));

  return { normalizedItems, sources, tags };
}

function collectDefaultExpandedIds(items: LogViewerItem[]) {
  return items
    .filter((item) =>
      item.attachments?.some((attachment) => attachment.defaultOpen),
    )
    .map((item) => item.id);
}

function toggleValue(values: string[], value: string) {
  if (values.includes(value)) {
    return values.filter((entry) => entry !== value);
  }

  return [...values, value];
}

function renderMetaValue(value: unknown) {
  if (value === null || value === undefined) {
    return String(value);
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return safeSerialize(value);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function attachmentKindLabel(kind: LogViewerAttachmentKind) {
  switch (kind) {
    case "json":
      return "JSON";
    case "code":
      return "Code";
    case "markdown":
      return "Markdown";
    case "meta":
      return "Meta";
    default:
      return "Text";
  }
}

function renderAttachmentContent(
  attachment: NormalizedLogViewerAttachment,
  density: LogViewerProps["density"],
) {
  if (attachment.kind === "markdown") {
    const content =
      typeof attachment.value === "string"
        ? attachment.value
        : safeSerialize(attachment.value);

    return <MarkdownRenderer content={content} density={density} />;
  }

  if (attachment.kind === "json") {
    const code =
      typeof attachment.value === "string"
        ? attachment.value
        : safeSerialize(attachment.value);

    return <CodeBlock language="json" code={code} copyable wrapLongLines />;
  }

  if (attachment.kind === "code") {
    const code =
      typeof attachment.value === "string"
        ? attachment.value
        : safeSerialize(attachment.value);

    return (
      <CodeBlock
        language={attachment.language ?? "text"}
        code={code}
        copyable
        wrapLongLines
      />
    );
  }

  if (attachment.kind === "meta" && isPlainRecord(attachment.value)) {
    return (
      <div className="rounded-xl border border-default bg-surface-subtle/60 p-md">
        <KeyValue
          items={Object.entries(attachment.value).map(([label, value]) => ({
            label,
            value: renderMetaValue(value),
          }))}
          layout="stacked"
        />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-default bg-surface-subtle/60 p-md text-sm leading-6 break-words whitespace-pre-wrap text-foreground-muted">
      {typeof attachment.value === "string"
        ? attachment.value
        : safeSerialize(attachment.value)}
    </div>
  );
}

interface FilterPopoverProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onToggleValue: (value: string) => void;
  onClear: () => void;
}

function FilterPopover({
  title,
  options,
  selectedValues,
  onToggleValue,
  onClear,
}: FilterPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={selectedValues.length > 0 ? "secondary" : "ghost"}
          size="xs"
          type="button"
        >
          <IconFilter size={14} />
          {title}
          {selectedValues.length > 0 ? ` (${selectedValues.length})` : ""}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-72 p-md">
        <div className="space-y-md">
          <div className="flex items-center justify-between gap-md">
            <div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-xs text-foreground-muted">
                {options.length} available
              </p>
            </div>

            <Button
              type="button"
              size="xs"
              variant="ghost"
              disabled={selectedValues.length === 0}
              onClick={onClear}
            >
              Clear
            </Button>
          </div>

          {options.length === 0 ? (
            <div className="rounded-xl border border-dashed border-default bg-surface-subtle/60 px-md py-md text-xs text-foreground-muted">
              No {title.toLowerCase()} available.
            </div>
          ) : (
            <div className="max-h-72 space-y-xs overflow-auto pr-xs">
              {options.map((option) => {
                const checked = selectedValues.includes(option.value);

                return (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-center gap-sm rounded-lg border border-transparent px-sm py-xs transition-colors hover:border-default hover:bg-surface-subtle/60"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleValue(option.value)}
                      className="h-4 w-4 rounded border-2 border-strong accent-primary"
                    />
                    <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                      {option.value}
                    </span>
                    <span className="text-xs text-foreground-subtle">
                      {option.count}
                    </span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface LogViewerRowProps {
  item: NormalizedLogViewerItem;
  density: LogViewerProps["density"];
  expanded: boolean;
  onToggleExpanded: () => void;
  style?: React.CSSProperties;
  rowRef: (element: HTMLDivElement | null) => void;
}

function LogViewerRow({
  item,
  density = "default",
  expanded,
  onToggleExpanded,
  style,
  rowRef,
}: LogViewerRowProps) {
  const styles = densityClassMap[density];
  const statusMeta = item.status ? statusStyles[item.status] : null;
  const defaultAttachmentIds = item.attachments
    .filter((attachment) => attachment.defaultOpen)
    .map((attachment) => attachment.id);
  const previewTags = item.tags.slice(0, 2);
  const remainingTagCount = Math.max(item.tags.length - previewTags.length, 0);
  const detailsId = `${item.id}-details`;
  const rowMessageClassName = cn(
    "min-w-0 font-medium text-foreground",
    styles.rowMessage,
    expanded ? "break-words whitespace-normal" : "truncate",
  );

  return (
    <div
      ref={rowRef}
      style={style}
      className={cn(
        "overflow-hidden border-b border-l-2 border-default bg-surface",
        levelStyles[item.level].rowAccent,
      )}
    >
      <button
        type="button"
        onClick={item.expandable ? onToggleExpanded : undefined}
        aria-expanded={item.expandable ? expanded : undefined}
        aria-controls={item.expandable ? detailsId : undefined}
        className={cn(
          "flex w-full text-left transition-colors",
          expanded ? "items-start" : "items-center",
          styles.minHeight,
          styles.row,
          styles.rowGap,
          item.expandable && "cursor-pointer",
          !item.expandable && "cursor-default",
          "hover:bg-surface-subtle/40",
          levelStyles[item.level].rowHeader,
        )}
      >
        <span className="flex w-5 shrink-0 items-center justify-center text-foreground-subtle">
          {item.expandable ? (
            expanded ? (
              <IconChevronDown size={16} />
            ) : (
              <IconChevronRight size={16} />
            )
          ) : null}
        </span>

        <span
          className={cn(
            "shrink-0 font-mono text-foreground-subtle",
            styles.timestamp,
          )}
        >
          {item.timestampText}
        </span>

        {expanded ? (
          <div className="min-w-0 flex-1 space-y-xs">
            <div className="flex min-w-0 flex-wrap items-center gap-xs">
              <Badge variant={levelStyles[item.level].badgeVariant} size="sm">
                {item.level}
              </Badge>

              {item.source ? (
                <Badge variant="outlineGray" size="sm">
                  {item.source}
                </Badge>
              ) : null}

              {previewTags.map((tag) => (
                <Badge key={tag} variant="soft" size="sm">
                  {tag}
                </Badge>
              ))}

              {remainingTagCount > 0 ? (
                <Badge variant="outlineGray" size="sm">
                  +{remainingTagCount}
                </Badge>
              ) : null}

              {item.attachmentCount > 0 ? (
                <Badge variant="outlineGray" size="sm">
                  {item.attachmentCount} attachment
                  {item.attachmentCount === 1 ? "" : "s"}
                </Badge>
              ) : null}

              {statusMeta ? (
                <Badge variant={statusMeta.variant} size="sm">
                  {statusMeta.icon}
                  {statusMeta.label}
                </Badge>
              ) : null}
            </div>

            <p className={rowMessageClassName}>{item.message}</p>
          </div>
        ) : (
          <>
            <Badge variant={levelStyles[item.level].badgeVariant} size="sm">
              {item.level}
            </Badge>

            {item.source ? (
              <Badge variant="outlineGray" size="sm">
                {item.source}
              </Badge>
            ) : null}

            <span className={cn("flex-1", rowMessageClassName)}>
              {item.message}
            </span>

            <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-xs">
              {previewTags.map((tag) => (
                <Badge key={tag} variant="soft" size="sm">
                  {tag}
                </Badge>
              ))}

              {remainingTagCount > 0 ? (
                <Badge variant="outlineGray" size="sm">
                  +{remainingTagCount}
                </Badge>
              ) : null}

              {item.attachmentCount > 0 ? (
                <Badge variant="outlineGray" size="sm">
                  {item.attachmentCount} attachment
                  {item.attachmentCount === 1 ? "" : "s"}
                </Badge>
              ) : null}

              {statusMeta ? (
                <Badge variant={statusMeta.variant} size="sm">
                  {statusMeta.icon}
                  {statusMeta.label}
                </Badge>
              ) : null}
            </div>
          </>
        )}
      </button>

      {expanded && item.expandable ? (
        <div
          id={detailsId}
          className={cn(
            "border-t border-default bg-surface-subtle/40",
            styles.details,
            styles.detailSection,
          )}
        >
          <p className={styles.subheading}>Attachments</p>

          <Accordion
            type="multiple"
            defaultValue={defaultAttachmentIds}
            collapsible
          >
            {item.attachments.map((attachment) => (
              <AccordionItem
                key={attachment.id}
                value={attachment.id}
                title={
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-sm">
                      <Badge variant="outlineGray" size="sm">
                        {attachmentKindLabel(attachment.kind)}
                      </Badge>
                      <span className="text-sm font-semibold text-foreground">
                        {attachment.label ??
                          attachmentKindLabel(attachment.kind)}
                      </span>
                    </div>

                    {attachment.summary ? (
                      <p className="mt-xs text-sm font-normal text-foreground-muted">
                        {attachment.summary}
                      </p>
                    ) : null}
                  </div>
                }
              >
                {renderAttachmentContent(attachment, density)}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ) : null}
    </div>
  );
}

export const LogViewer = React.forwardRef<HTMLDivElement, LogViewerProps>(
  (
    {
      items,
      height = 560,
      density = "default",
      query,
      defaultQuery = "",
      onQueryChange,
      selectedLevels,
      defaultSelectedLevels = [...LOG_VIEWER_LEVELS],
      onSelectedLevelsChange,
      selectedSources,
      defaultSelectedSources = [],
      onSelectedSourcesChange,
      selectedTags,
      defaultSelectedTags = [],
      onSelectedTagsChange,
      expandedIds,
      defaultExpandedIds,
      onExpandedIdsChange,
      followTail,
      defaultFollowTail = true,
      onFollowTailChange,
      emptyState,
      noResultsState,
      className,
      style,
      ...props
    },
    ref,
  ) => {
    const styles = densityClassMap[density];
    const rootId = React.useId();
    const scrollElementRef = React.useRef<HTMLDivElement | null>(null);
    const [currentQuery, setCurrentQuery] = useControllableState<string>({
      value: query,
      defaultValue: defaultQuery,
      onChange: onQueryChange,
    });
    const [currentSelectedLevels, setCurrentSelectedLevels] =
      useControllableState<LogViewerLevel[]>({
        value: selectedLevels,
        defaultValue: defaultSelectedLevels,
        onChange: onSelectedLevelsChange,
      });
    const [currentSelectedSources, setCurrentSelectedSources] =
      useControllableState<string[]>({
        value: selectedSources,
        defaultValue: defaultSelectedSources,
        onChange: onSelectedSourcesChange,
      });
    const [currentSelectedTags, setCurrentSelectedTags] = useControllableState<
      string[]
    >({
      value: selectedTags,
      defaultValue: defaultSelectedTags,
      onChange: onSelectedTagsChange,
    });
    const [currentExpandedIds, setCurrentExpandedIds] = useControllableState<
      string[]
    >({
      value: expandedIds,
      defaultValue: defaultExpandedIds ?? collectDefaultExpandedIds(items),
      onChange: onExpandedIdsChange,
    });
    const [currentFollowTail, setCurrentFollowTail] =
      useControllableState<boolean>({
        value: followTail,
        defaultValue: defaultFollowTail,
        onChange: onFollowTailChange,
      });

    const { normalizedItems, sources, tags } = React.useMemo(
      () => buildNormalizedItems(items),
      [items],
    );
    const normalizedQuery = React.useMemo(
      () => normalizeSearchText(currentQuery),
      [currentQuery],
    );
    const selectedLevelSet = React.useMemo(
      () => new Set(currentSelectedLevels),
      [currentSelectedLevels],
    );
    const selectedSourceSet = React.useMemo(
      () => new Set(currentSelectedSources),
      [currentSelectedSources],
    );
    const selectedTagSet = React.useMemo(
      () => new Set(currentSelectedTags),
      [currentSelectedTags],
    );
    const expandedIdSet = React.useMemo(
      () => new Set(currentExpandedIds),
      [currentExpandedIds],
    );

    const filteredItems = React.useMemo(
      () =>
        normalizedItems.filter((item) => {
          if (!selectedLevelSet.has(item.level)) {
            return false;
          }

          if (
            selectedSourceSet.size > 0 &&
            (!item.source || !selectedSourceSet.has(item.source))
          ) {
            return false;
          }

          if (
            selectedTagSet.size > 0 &&
            !item.tags.some((tag) => selectedTagSet.has(tag))
          ) {
            return false;
          }

          if (normalizedQuery && !item.searchKey.includes(normalizedQuery)) {
            return false;
          }

          return true;
        }),
      [
        normalizedItems,
        normalizedQuery,
        selectedLevelSet,
        selectedSourceSet,
        selectedTagSet,
      ],
    );

    const expandableVisibleIds = React.useMemo(
      () =>
        filteredItems.filter((item) => item.expandable).map((item) => item.id),
      [filteredItems],
    );
    const allVisibleExpanded =
      expandableVisibleIds.length > 0 &&
      expandableVisibleIds.every((id) => expandedIdSet.has(id));
    const hasActiveFilters =
      normalizedQuery.length > 0 ||
      currentSelectedSources.length > 0 ||
      currentSelectedTags.length > 0 ||
      currentSelectedLevels.length !== LOG_VIEWER_LEVELS.length;

    const virtualizer = useVirtualizer({
      count: filteredItems.length,
      getScrollElement: () => scrollElementRef.current,
      estimateSize: () => styles.estimateSize,
      overscan: 10,
      getItemKey: (index) => filteredItems[index]?.id ?? index,
    });

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    const clearFilters = React.useCallback(() => {
      setCurrentQuery("");
      setCurrentSelectedLevels([...LOG_VIEWER_LEVELS]);
      setCurrentSelectedSources([]);
      setCurrentSelectedTags([]);
    }, [
      setCurrentQuery,
      setCurrentSelectedLevels,
      setCurrentSelectedSources,
      setCurrentSelectedTags,
    ]);

    const setFollowMode = React.useCallback(
      (nextValue: boolean) => {
        setCurrentFollowTail(nextValue);
      },
      [setCurrentFollowTail],
    );

    const toggleExpanded = React.useCallback(
      (id: string) => {
        setCurrentExpandedIds(toggleValue(currentExpandedIds, id));
      },
      [currentExpandedIds, setCurrentExpandedIds],
    );

    const toggleExpandAll = React.useCallback(() => {
      if (expandableVisibleIds.length === 0) {
        return;
      }

      if (allVisibleExpanded) {
        setCurrentExpandedIds(
          currentExpandedIds.filter((id) => !expandableVisibleIds.includes(id)),
        );
        return;
      }

      setCurrentExpandedIds(
        Array.from(new Set([...currentExpandedIds, ...expandableVisibleIds])),
      );
    }, [
      allVisibleExpanded,
      currentExpandedIds,
      expandableVisibleIds,
      setCurrentExpandedIds,
    ]);

    React.useEffect(() => {
      virtualizer.measure();
    }, [currentExpandedIds, density, virtualizer]);

    const resolvedEmptyState = emptyState ?? (
      <EmptyState
        size="sm"
        eyebrow="Log viewer"
        title="No logs yet"
        description="Pass structured log items to render the first entries in this viewer."
        icon={<IconSearch size={18} />}
      />
    );
    const resolvedNoResultsState = noResultsState ?? (
      <EmptyState
        size="sm"
        eyebrow="No matches"
        title="No logs match the current filters"
        description="Try clearing the search query or broadening the selected levels, sources, or tags."
        icon={<IconFilter size={18} />}
        action={
          <Button
            type="button"
            size="xs"
            variant="ghost"
            onClick={clearFilters}
          >
            Clear filters
          </Button>
        }
      />
    );

    return (
      <div
        ref={ref}
        className={cn(
          "flex min-h-0 flex-col overflow-hidden border border-default bg-surface shadow-soft dark:shadow-soft-dark",
          styles.root,
          className,
        )}
        style={{
          height,
          ...style,
        }}
        {...props}
      >
        <div
          className={cn(
            "border-b border-default bg-linear-to-r from-surface-subtle via-surface to-surface",
            styles.header,
          )}
        >
          <div className="flex flex-wrap items-center gap-sm">
            {LOG_VIEWER_LEVELS.map((level) => {
              const selected = selectedLevelSet.has(level);

              return (
                <button
                  key={level}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    const nextValues = toggleValue(
                      currentSelectedLevels,
                      level,
                    );

                    setCurrentSelectedLevels(
                      nextValues.length > 0
                        ? (nextValues as LogViewerLevel[])
                        : [...LOG_VIEWER_LEVELS],
                    );
                  }}
                  className={cn(
                    "rounded-lg border px-sm py-xs text-[11px] font-semibold tracking-[0.14em] uppercase transition-colors",
                    selected
                      ? levelStyles[level].buttonActive
                      : levelStyles[level].buttonInactive,
                  )}
                >
                  {level}
                </button>
              );
            })}

            <div className="ml-auto flex flex-wrap items-center gap-sm text-xs text-foreground-muted">
              <span>
                {filteredItems.length === normalizedItems.length
                  ? `${filteredItems.length} logs`
                  : `${filteredItems.length} of ${normalizedItems.length} logs`}
              </span>

              <Button
                type="button"
                size="xs"
                variant={currentFollowTail ? "secondary" : "ghost"}
                onClick={() => setFollowMode(!currentFollowTail)}
              >
                {currentFollowTail ? "Following" : "Follow tail"}
              </Button>

              <Button
                type="button"
                size="xs"
                variant="ghost"
                disabled={expandableVisibleIds.length === 0}
                onClick={toggleExpandAll}
              >
                {allVisibleExpanded ? "Collapse all" : "Expand all"}
              </Button>

              <Button
                type="button"
                size="xs"
                variant="ghost"
                disabled={!hasActiveFilters}
                onClick={clearFilters}
              >
                <IconX size={14} />
                Clear filters
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-start gap-sm">
            <div className="min-w-[16rem] flex-1">
              <Input
                label="Search logs"
                labelHidden
                aria-label="Search logs"
                placeholder="Search message, source, tags, or prepared search text"
                value={currentQuery}
                onChange={(event) => setCurrentQuery(event.target.value)}
                size="sm"
                className="font-mono"
              />
            </div>

            <div className="flex flex-wrap items-center gap-sm">
              <FilterPopover
                title="Sources"
                options={sources}
                selectedValues={currentSelectedSources}
                onToggleValue={(value) =>
                  setCurrentSelectedSources(
                    toggleValue(currentSelectedSources, value),
                  )
                }
                onClear={() => setCurrentSelectedSources([])}
              />

              <FilterPopover
                title="Tags"
                options={tags}
                selectedValues={currentSelectedTags}
                onToggleValue={(value) =>
                  setCurrentSelectedTags(
                    toggleValue(currentSelectedTags, value),
                  )
                }
                onClear={() => setCurrentSelectedTags([])}
              />
            </div>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          {normalizedItems.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              {resolvedEmptyState}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              {resolvedNoResultsState}
            </div>
          ) : (
            <>
              <ScrollArea
                ref={scrollElementRef}
                id={`${rootId}-viewport`}
                className={cn("absolute inset-0", styles.viewport)}
                style={{ contain: "strict", maxHeight: "100%" }}
                followTail={currentFollowTail}
                onFollowTailChange={setCurrentFollowTail}
              >
                <div
                  style={{
                    height: totalSize,
                    position: "relative",
                    width: "100%",
                  }}
                >
                  {virtualItems.map((virtualRow) => {
                    const item = filteredItems[virtualRow.index];

                    if (!item) {
                      return null;
                    }

                    return (
                      <LogViewerRow
                        key={virtualRow.key}
                        item={item}
                        density={density}
                        expanded={expandedIdSet.has(item.id)}
                        onToggleExpanded={() => toggleExpanded(item.id)}
                        rowRef={(element) => {
                          if (element) {
                            element.dataset.index = String(virtualRow.index);
                          }

                          virtualizer.measureElement(element);
                        }}
                        style={{
                          left: 0,
                          position: "absolute",
                          top: 0,
                          transform: `translateY(${virtualRow.start}px)`,
                          width: "100%",
                        }}
                      />
                    );
                  })}
                </div>
              </ScrollArea>

              {!currentFollowTail ? (
                <div className="pointer-events-none absolute inset-x-0 bottom-md flex justify-center px-md">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="pointer-events-auto shadow-soft dark:shadow-soft-dark"
                    onClick={() => setFollowMode(true)}
                  >
                    <IconArrowDown size={16} />
                    Follow tail
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    );
  },
);

LogViewer.displayName = "LogViewer";
