import React from "react";
import {
  IconAlertCircle,
  IconChevronDown,
  IconChevronRight,
  IconEdit,
  IconLoader2,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "../Forms/Button";
import { useControllableState } from "../../internal/useControllableState";
import { cn } from "../../utils/cn";

export interface TreeViewItem {
  id: string;
  name: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  endContent?: React.ReactNode;
  children?: TreeViewItem[];
  keywords?: string[];
  disabled?: boolean;
  defaultExpanded?: boolean;
  canAddChild?: boolean;
  canDelete?: boolean;
  canRename?: boolean;
  canDrag?: boolean;
  droppable?: boolean;
  hasAsyncChildren?: boolean;
  isLoading?: boolean;
  data?: Record<string, unknown>;
}

export interface TreeViewRenderProps {
  item: TreeViewItem;
  level: number;
  isExpanded: boolean;
  isSelected: boolean;
  isFocused: boolean;
  isLeaf: boolean;
  isLoading: boolean;
  hasAsyncError: boolean;
  loadError?: unknown;
  isDropTarget: boolean;
  isDragging: boolean;
  searchQuery: string;
  toggle: () => void;
  select: (
    event?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
  ) => void;
  startEditing: () => void;
  retryLoad: () => void;
}

export interface TreeViewCreateItemContext {
  parent: TreeViewItem;
  level: number;
  index: number;
}

export interface TreeViewMoveOperation {
  sourceId: string;
  targetId: string;
  sourceItem: TreeViewItem;
  targetItem: TreeViewItem;
  insertedItem: TreeViewItem;
  copy: boolean;
}

export interface TreeViewDropValidatorContext {
  sourceId: string;
  targetId: string;
  sourceItem: TreeViewItem;
  targetItem: TreeViewItem;
  copy: boolean;
}

export interface TreeViewObjectAdapterOptions {
  rootName?: string;
  includeRoot?: boolean;
  sortKeys?: boolean;
}

export type TreeViewSlot =
  | "root"
  | "searchWrapper"
  | "searchInput"
  | "viewport"
  | "item"
  | "row"
  | "toggle"
  | "content"
  | "label"
  | "description"
  | "endContent"
  | "actions"
  | "group"
  | "emptyState"
  | "loadingRow"
  | "errorRow";

export type TreeViewClassNames = Partial<Record<TreeViewSlot, string>>;

type TreeViewIconRenderer =
  | React.ReactNode
  | ((props: TreeViewRenderProps) => React.ReactNode);
type TreeViewLoadErrorMessage =
  | React.ReactNode
  | ((item: TreeViewItem, error: unknown) => React.ReactNode);
type TreeViewRetryLabel =
  | React.ReactNode
  | ((item: TreeViewItem) => React.ReactNode);

export interface TreeViewProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  items?: TreeViewItem[];
  defaultItems?: TreeViewItem[];
  onItemsChange?: (items: TreeViewItem[]) => void;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedIdsChange?: (ids: string[]) => void;
  selectedIds?: string[];
  defaultSelectedIds?: string[];
  onSelectedIdsChange?: (ids: string[]) => void;
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  selectable?: boolean;
  multiSelect?: boolean;
  editable?: boolean;
  addable?: boolean;
  deletable?: boolean;
  draggable?: boolean;
  disableDefaultStyles?: boolean;
  indent?: number;
  emptyState?: React.ReactNode;
  classNames?: TreeViewClassNames;
  renderNode?: (props: TreeViewRenderProps) => React.ReactNode;
  filterFn?: (item: TreeViewItem, query: string) => boolean;
  sortComparator?: (a: TreeViewItem, b: TreeViewItem) => number;
  expandIcon?: TreeViewIconRenderer;
  collapseIcon?: TreeViewIconRenderer;
  leafIcon?: TreeViewIconRenderer;
  loadingIcon?: TreeViewIconRenderer;
  createItem?: (context: TreeViewCreateItemContext) => TreeViewItem;
  onAddItem?: (
    context: TreeViewCreateItemContext & { item: TreeViewItem },
  ) => void;
  onDeleteItem?: (item: TreeViewItem) => void;
  onRenameItem?: (item: TreeViewItem, nextName: string) => void;
  onItemMove?: (operation: TreeViewMoveOperation) => void;
  onItemCopy?: (operation: TreeViewMoveOperation) => void;
  allowDrop?: (context: TreeViewDropValidatorContext) => boolean;
  loadChildren?: (item: TreeViewItem) => Promise<TreeViewItem[]>;
  onLoadChildrenError?: (item: TreeViewItem, error: unknown) => void;
  loadErrorMessage?: TreeViewLoadErrorMessage;
  retryLabel?: TreeViewRetryLabel;
}

interface TreeViewVisibleItem {
  item: TreeViewItem;
  level: number;
  parentId?: string;
}

let treeViewIdCounter = 0;

function generateTreeItemId(seed: string) {
  const normalizedSeed =
    seed
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "item";

  treeViewIdCounter += 1;

  return `tree-${normalizedSeed}-${treeViewIdCounter}`;
}

function normalizeQuery(query: string) {
  return query.trim().toLowerCase();
}

function defaultTreeFilter(item: TreeViewItem, query: string) {
  const normalizedQuery = normalizeQuery(query);

  if (!normalizedQuery) {
    return true;
  }

  const haystack = [item.name, ...(item.keywords ?? [])]
    .join(" ")
    .toLowerCase();

  return haystack.includes(normalizedQuery);
}

function collectDefaultExpandedIds(items: TreeViewItem[]) {
  const ids = new Set<string>();

  const visit = (nodes: TreeViewItem[]) => {
    nodes.forEach((node) => {
      if (node.defaultExpanded) {
        ids.add(node.id);
      }

      if (node.children?.length) {
        visit(node.children);
      }
    });
  };

  visit(items);

  return Array.from(ids);
}

function isBranch(item: TreeViewItem) {
  return Boolean(item.children?.length) || Boolean(item.hasAsyncChildren);
}

function canAcceptChildren(item: TreeViewItem) {
  if (item.droppable === false) {
    return false;
  }

  return (
    item.droppable === true ||
    Array.isArray(item.children) ||
    Boolean(item.hasAsyncChildren) ||
    Boolean(item.canAddChild)
  );
}

function collectBranchIds(items: TreeViewItem[]) {
  const ids = new Set<string>();

  const visit = (nodes: TreeViewItem[]) => {
    nodes.forEach((node) => {
      if (isBranch(node)) {
        ids.add(node.id);
      }

      if (node.children?.length) {
        visit(node.children);
      }
    });
  };

  visit(items);

  return ids;
}

function processTreeItems(
  items: TreeViewItem[],
  query: string,
  filterFn: (item: TreeViewItem, searchQuery: string) => boolean,
  sortComparator?: (a: TreeViewItem, b: TreeViewItem) => number,
): TreeViewItem[] {
  const normalizedQuery = normalizeQuery(query);

  const processedItems = items.reduce<TreeViewItem[]>((accumulator, item) => {
    const processedChildren = item.children
      ? processTreeItems(
          item.children,
          normalizedQuery,
          filterFn,
          sortComparator,
        )
      : item.children;
    const matchesQuery = normalizedQuery
      ? filterFn(item, normalizedQuery)
      : true;
    const hasMatchingChildren = Boolean(processedChildren?.length);

    if (normalizedQuery && !matchesQuery && !hasMatchingChildren) {
      return accumulator;
    }

    accumulator.push(
      processedChildren === item.children
        ? item
        : {
            ...item,
            children: processedChildren,
          },
    );

    return accumulator;
  }, []);

  if (!sortComparator) {
    return processedItems;
  }

  return [...processedItems].sort(sortComparator);
}

function flattenVisibleItems(
  items: TreeViewItem[],
  expandedIds: Set<string>,
  level = 1,
  parentId?: string,
): TreeViewVisibleItem[] {
  return items.flatMap<TreeViewVisibleItem>((item) => {
    const currentItem: TreeViewVisibleItem = {
      item,
      level,
      parentId,
    };
    const childItems =
      item.children?.length && expandedIds.has(item.id)
        ? flattenVisibleItems(item.children, expandedIds, level + 1, item.id)
        : [];

    return [currentItem, ...childItems];
  });
}

function findTreeItem(
  items: TreeViewItem[],
  itemId: string,
): TreeViewItem | undefined {
  for (const item of items) {
    if (item.id === itemId) {
      return item;
    }

    if (item.children?.length) {
      const childMatch = findTreeItem(item.children, itemId);

      if (childMatch) {
        return childMatch;
      }
    }
  }

  return undefined;
}

function updateTreeItemById(
  items: TreeViewItem[],
  itemId: string,
  updater: (item: TreeViewItem) => TreeViewItem,
): TreeViewItem[] {
  return items.map((item) => {
    if (item.id === itemId) {
      return updater(item);
    }

    if (item.children?.length) {
      return {
        ...item,
        children: updateTreeItemById(item.children, itemId, updater),
      };
    }

    return item;
  });
}

function insertTreeItemAsChild(
  items: TreeViewItem[],
  targetId: string,
  newItem: TreeViewItem,
): TreeViewItem[] {
  return items.map((item) => {
    if (item.id === targetId) {
      return {
        ...item,
        children: [...(item.children ?? []), newItem],
      };
    }

    if (item.children?.length) {
      return {
        ...item,
        children: insertTreeItemAsChild(item.children, targetId, newItem),
      };
    }

    return item;
  });
}

function removeTreeItemById(
  items: TreeViewItem[],
  itemId: string,
): TreeViewItem[] {
  return items
    .filter((item) => item.id !== itemId)
    .map((item) => {
      if (item.children?.length) {
        return {
          ...item,
          children: removeTreeItemById(item.children, itemId),
        };
      }

      return item;
    });
}

function extractTreeItem(
  items: TreeViewItem[],
  itemId: string,
): {
  remainingItems: TreeViewItem[];
  extractedItem?: TreeViewItem;
} {
  let extractedItem: TreeViewItem | undefined;

  const remainingItems = items.reduce<TreeViewItem[]>((accumulator, item) => {
    if (item.id === itemId) {
      extractedItem = item;
      return accumulator;
    }

    if (item.children?.length) {
      const extractedChild = extractTreeItem(item.children, itemId);

      if (extractedChild.extractedItem) {
        extractedItem = extractedChild.extractedItem;
        accumulator.push({
          ...item,
          children: extractedChild.remainingItems,
        });
        return accumulator;
      }
    }

    accumulator.push(item);
    return accumulator;
  }, []);

  return {
    remainingItems,
    extractedItem,
  };
}

function cloneTreeItemWithNewIds(item: TreeViewItem): TreeViewItem {
  return {
    ...item,
    id: generateTreeItemId(item.name),
    children: item.children?.map((child) => cloneTreeItemWithNewIds(child)),
  };
}

function collectItemIds(item: TreeViewItem): string[] {
  return [
    item.id,
    ...(item.children?.flatMap((child) => collectItemIds(child)) ?? []),
  ];
}

function collectTreeIds(items: TreeViewItem[]) {
  return items.flatMap((item) => collectItemIds(item));
}

function findTreeItemPath(
  items: TreeViewItem[],
  itemId: string,
  trail: string[] = [],
): string[] | undefined {
  for (const item of items) {
    const nextTrail = [...trail, item.id];

    if (item.id === itemId) {
      return nextTrail;
    }

    if (item.children?.length) {
      const childPath = findTreeItemPath(item.children, itemId, nextTrail);

      if (childPath) {
        return childPath;
      }
    }
  }

  return undefined;
}

function resolveTreeIcon(
  icon: TreeViewIconRenderer | undefined,
  props: TreeViewRenderProps,
) {
  if (typeof icon === "function") {
    return icon(props);
  }

  return icon ?? null;
}

function resolveLoadErrorMessage(
  message: TreeViewLoadErrorMessage | undefined,
  item: TreeViewItem,
  error: unknown,
) {
  if (typeof message === "function") {
    return message(item, error);
  }

  if (message != null) {
    return message;
  }

  if (typeof error === "string" && error.trim()) {
    return error;
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return `Could not load children for ${item.name}.`;
}

function resolveRetryLabel(
  label: TreeViewRetryLabel | undefined,
  item: TreeViewItem,
) {
  if (typeof label === "function") {
    return label(item);
  }

  return label ?? "Retry";
}

function buildTreeInstructions(options: {
  multiSelect: boolean;
  editable: boolean;
  addable: boolean;
  deletable: boolean;
}) {
  const instructions = [
    "Use Up and Down Arrow keys to move between visible tree items.",
    "Use Right Arrow to expand a branch or move to its first child.",
    "Use Left Arrow to collapse a branch or move focus to its parent.",
    "Press Enter or Space to select the focused item.",
    "Type to move focus to the next matching item.",
  ];

  if (options.multiSelect) {
    instructions.push(
      "Use Control or Command plus A to select all visible items.",
    );
  }

  if (options.editable) {
    instructions.push("Press F2 to rename the focused item.");
  }

  if (options.addable) {
    instructions.push("Press Insert to add a child item when available.");
  }

  if (options.deletable) {
    instructions.push("Press Delete or Backspace to remove the focused item.");
  }

  return instructions.join(" ");
}

function createDefaultTreeItem(
  context: TreeViewCreateItemContext,
): TreeViewItem {
  return {
    id: generateTreeItemId("new-item"),
    name: context.parent.name ? `New item ${context.index + 1}` : "New item",
    canAddChild: true,
    canDelete: true,
    canRename: true,
  };
}

function formatPrimitiveValue(value: unknown) {
  if (typeof value === "string") {
    return `"${value}"`;
  }

  if (value === null) {
    return "null";
  }

  if (value === undefined) {
    return "undefined";
  }

  return String(value);
}

function buildTreeItemFromValue(
  name: string,
  value: unknown,
  path: string[],
  sortKeys: boolean,
): TreeViewItem {
  const itemId = path.join(".");

  if (Array.isArray(value)) {
    return {
      id: itemId,
      name,
      description: `${value.length} item${value.length === 1 ? "" : "s"}`,
      defaultExpanded: path.length <= 2,
      data: {
        valueType: "array",
      },
      children: value.map((child, index) =>
        buildTreeItemFromValue(
          String(index),
          child,
          [...path, String(index)],
          sortKeys,
        ),
      ),
    };
  }

  if (value && typeof value === "object") {
    const entries = Object.entries(value);
    const orderedEntries = sortKeys
      ? [...entries].sort(([leftKey], [rightKey]) =>
          leftKey.localeCompare(rightKey),
        )
      : entries;

    return {
      id: itemId,
      name,
      description: `${orderedEntries.length} key${
        orderedEntries.length === 1 ? "" : "s"
      }`,
      defaultExpanded: path.length <= 2,
      data: {
        valueType: "object",
      },
      children: orderedEntries.map(([childName, childValue]) =>
        buildTreeItemFromValue(
          childName,
          childValue,
          [...path, childName],
          sortKeys,
        ),
      ),
    };
  }

  return {
    id: itemId,
    name,
    description: formatPrimitiveValue(value),
    data: {
      valueType:
        value === null
          ? "null"
          : value === undefined
            ? "undefined"
            : typeof value,
      value,
    },
  };
}

export function createTreeViewItemsFromObject(
  value: unknown,
  options: TreeViewObjectAdapterOptions = {},
) {
  const rootName = options.rootName ?? "root";
  const rootItem = buildTreeItemFromValue(
    rootName,
    value,
    [rootName],
    options.sortKeys ?? false,
  );

  if (
    (options.includeRoot ?? Array.isArray(value)) ||
    value === null ||
    typeof value !== "object"
  ) {
    return [rootItem];
  }

  return rootItem.children ?? [];
}

export const TreeView = React.forwardRef<HTMLDivElement, TreeViewProps>(
  (
    {
      items,
      defaultItems = [],
      onItemsChange,
      expandedIds,
      defaultExpandedIds,
      onExpandedIdsChange,
      selectedIds,
      defaultSelectedIds = [],
      onSelectedIdsChange,
      searchQuery,
      defaultSearchQuery = "",
      onSearchQueryChange,
      searchable = false,
      searchPlaceholder = "Search tree nodes...",
      selectable = true,
      multiSelect = false,
      editable = false,
      addable = false,
      deletable = false,
      draggable = false,
      disableDefaultStyles = false,
      indent = 20,
      emptyState = "No tree nodes to display.",
      classNames,
      renderNode,
      filterFn = defaultTreeFilter,
      sortComparator,
      expandIcon,
      collapseIcon,
      leafIcon,
      loadingIcon,
      createItem,
      onAddItem,
      onDeleteItem,
      onRenameItem,
      onItemMove,
      onItemCopy,
      allowDrop,
      loadChildren,
      onLoadChildrenError,
      loadErrorMessage,
      retryLabel,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const rootId = id ?? generatedId;
    const instructionsId = `${rootId}-instructions`;
    const liveRegionId = `${rootId}-live-region`;
    const viewportId = `${rootId}-viewport`;
    const [currentItems, setCurrentItems] = useControllableState<
      TreeViewItem[]
    >({
      value: items,
      defaultValue: defaultItems,
      onChange: onItemsChange,
    });
    const [currentExpandedIds, setCurrentExpandedIds] = useControllableState<
      string[]
    >({
      value: expandedIds,
      defaultValue:
        defaultExpandedIds ?? collectDefaultExpandedIds(defaultItems),
      onChange: onExpandedIdsChange,
    });
    const [currentSelectedIds, setCurrentSelectedIds] = useControllableState<
      string[]
    >({
      value: selectedIds,
      defaultValue: defaultSelectedIds,
      onChange: onSelectedIdsChange,
    });
    const [currentSearchQuery, setCurrentSearchQuery] =
      useControllableState<string>({
        value: searchQuery,
        defaultValue: defaultSearchQuery,
        onChange: onSearchQueryChange,
      });
    const [focusedId, setFocusedId] = React.useState<string | undefined>(
      defaultSelectedIds[0],
    );
    const [editingId, setEditingId] = React.useState<string | undefined>();
    const [editingValue, setEditingValue] = React.useState("");
    const [loadingIds, setLoadingIds] = React.useState<string[]>([]);
    const [asyncLoadErrors, setAsyncLoadErrors] = React.useState<
      Record<string, unknown>
    >({});
    const [draggingId, setDraggingId] = React.useState<string | undefined>();
    const [dropTargetId, setDropTargetId] = React.useState<
      string | undefined
    >();
    const [liveMessage, setLiveMessage] = React.useState("");
    const itemRefs = React.useRef(new Map<string, HTMLDivElement | null>());
    const renameInputRef = React.useRef<HTMLInputElement>(null);
    const currentItemsRef = React.useRef(currentItems);
    const loadingIdsRef = React.useRef(loadingIds);
    const selectionAnchorRef = React.useRef<string | undefined>(
      defaultSelectedIds[0],
    );
    const typeaheadStateRef = React.useRef<{
      query: string;
      timeoutId?: number;
    }>({
      query: "",
    });
    const loadingIdSet = React.useMemo(() => new Set(loadingIds), [loadingIds]);
    const treeInstructions = React.useMemo(
      () =>
        buildTreeInstructions({
          multiSelect,
          editable,
          addable,
          deletable,
        }),
      [addable, deletable, editable, multiSelect],
    );

    const processedItems = React.useMemo(
      () =>
        processTreeItems(
          currentItems,
          currentSearchQuery,
          filterFn,
          sortComparator,
        ),
      [currentItems, currentSearchQuery, filterFn, sortComparator],
    );

    const effectiveExpandedIds = React.useMemo(() => {
      if (!normalizeQuery(currentSearchQuery)) {
        return new Set(currentExpandedIds);
      }

      return new Set([
        ...currentExpandedIds,
        ...Array.from(collectBranchIds(processedItems)),
      ]);
    }, [currentExpandedIds, currentSearchQuery, processedItems]);

    const visibleItems = React.useMemo(
      () => flattenVisibleItems(processedItems, effectiveExpandedIds),
      [processedItems, effectiveExpandedIds],
    );
    const visibleIdSet = React.useMemo(
      () => new Set(visibleItems.map((entry) => entry.item.id)),
      [visibleItems],
    );
    const selectedIdSet = React.useMemo(
      () => new Set(currentSelectedIds),
      [currentSelectedIds],
    );

    const getClassName = React.useCallback(
      (slot: TreeViewSlot, baseClassName: string) =>
        cn(baseClassName, classNames?.[slot]),
      [classNames],
    );

    const focusTreeItem = React.useCallback((itemId: string | undefined) => {
      if (!itemId) {
        return;
      }

      window.requestAnimationFrame(() => {
        itemRefs.current.get(itemId)?.focus();
      });
    }, []);

    const announce = React.useCallback((message: string) => {
      setLiveMessage("");
      window.requestAnimationFrame(() => {
        setLiveMessage(message);
      });
    }, []);

    React.useEffect(
      () => () => {
        if (typeaheadStateRef.current.timeoutId !== undefined) {
          window.clearTimeout(typeaheadStateRef.current.timeoutId);
        }
      },
      [],
    );

    React.useEffect(() => {
      currentItemsRef.current = currentItems;
    }, [currentItems]);

    React.useEffect(() => {
      loadingIdsRef.current = loadingIds;
    }, [loadingIds]);

    React.useEffect(() => {
      const validIds = new Set(collectTreeIds(currentItems));

      setLoadingIds((currentIds) => {
        const nextIds = currentIds.filter((loadingId) =>
          validIds.has(loadingId),
        );

        return nextIds.length === currentIds.length ? currentIds : nextIds;
      });

      setAsyncLoadErrors((currentErrors) => {
        const currentEntries = Object.entries(currentErrors);
        const nextEntries = currentEntries.filter(([itemId]) =>
          validIds.has(itemId),
        );

        return nextEntries.length === currentEntries.length
          ? currentErrors
          : Object.fromEntries(nextEntries);
      });
    }, [currentItems]);

    React.useEffect(() => {
      if (!visibleItems.length) {
        setFocusedId(undefined);
        return;
      }

      if (!focusedId || !visibleIdSet.has(focusedId)) {
        setFocusedId(visibleItems[0]?.item.id);
      }
    }, [focusedId, visibleIdSet, visibleItems]);

    React.useEffect(() => {
      if (!editingId) {
        return;
      }

      if (!findTreeItem(currentItems, editingId)) {
        setEditingId(undefined);
        setEditingValue("");
      }
    }, [currentItems, editingId]);

    React.useEffect(() => {
      if (!editingId) {
        return;
      }

      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }, [editingId]);

    React.useEffect(() => {
      if (editingId) {
        return;
      }

      focusTreeItem(focusedId);
    }, [editingId, focusTreeItem, focusedId]);

    const loadChildrenForItem = React.useCallback(
      async (itemId: string) => {
        if (!loadChildren || loadingIdsRef.current.includes(itemId)) {
          return;
        }

        const latestItem = findTreeItem(currentItemsRef.current, itemId);

        if (
          !latestItem ||
          latestItem.disabled ||
          !latestItem.hasAsyncChildren ||
          latestItem.children?.length
        ) {
          return;
        }

        setLoadingIds((currentIds) =>
          Array.from(new Set([...currentIds, itemId])),
        );
        setAsyncLoadErrors((currentErrors) => {
          if (!Object.prototype.hasOwnProperty.call(currentErrors, itemId)) {
            return currentErrors;
          }

          const nextErrors = { ...currentErrors };
          delete nextErrors[itemId];
          return nextErrors;
        });
        announce(`Loading children for ${latestItem.name}.`);

        try {
          const loadedChildren = await loadChildren(latestItem);
          const latestItems = currentItemsRef.current;

          if (!findTreeItem(latestItems, itemId)) {
            return;
          }

          setCurrentItems(
            updateTreeItemById(latestItems, itemId, (currentItem) => ({
              ...currentItem,
              children: loadedChildren,
              hasAsyncChildren: false,
              isLoading: false,
            })),
          );
          announce(
            `Loaded ${loadedChildren.length} child${
              loadedChildren.length === 1 ? "" : "ren"
            } for ${latestItem.name}.`,
          );
        } catch (error) {
          onLoadChildrenError?.(latestItem, error);
          setAsyncLoadErrors((currentErrors) => ({
            ...currentErrors,
            [itemId]: error,
          }));
          announce(`Could not load children for ${latestItem.name}.`);
        } finally {
          setLoadingIds((currentIds) =>
            currentIds.filter((loadingId) => loadingId !== itemId),
          );
        }
      },
      [announce, loadChildren, onLoadChildrenError, setCurrentItems],
    );

    const toggleExpanded = React.useCallback(
      async (item: TreeViewItem, forceExpanded?: boolean) => {
        if (!isBranch(item) || item.disabled) {
          return;
        }

        const isCurrentlyExpanded = currentExpandedIds.includes(item.id);
        const shouldExpand = forceExpanded ?? !isCurrentlyExpanded;

        setCurrentExpandedIds(
          shouldExpand
            ? Array.from(new Set([...currentExpandedIds, item.id]))
            : currentExpandedIds.filter((expandedId) => expandedId !== item.id),
        );

        if (
          shouldExpand &&
          loadChildren &&
          item.hasAsyncChildren &&
          !item.children?.length &&
          !loadingIdSet.has(item.id) &&
          !Object.prototype.hasOwnProperty.call(asyncLoadErrors, item.id)
        ) {
          await loadChildrenForItem(item.id);
        }
      },
      [
        asyncLoadErrors,
        currentExpandedIds,
        loadChildren,
        loadChildrenForItem,
        loadingIdSet,
        setCurrentExpandedIds,
      ],
    );

    const selectItem = React.useCallback(
      (
        itemId: string,
        event?:
          | React.MouseEvent<HTMLElement>
          | React.KeyboardEvent<HTMLElement>,
      ) => {
        setFocusedId(itemId);

        const targetItem = findTreeItem(currentItemsRef.current, itemId);

        if (targetItem?.disabled) {
          return;
        }

        if (!selectable) {
          return;
        }

        const itemIndex = visibleItems.findIndex(
          (entry) => entry.item.id === itemId,
        );
        const anchorId = selectionAnchorRef.current ?? itemId;
        const anchorIndex = visibleItems.findIndex(
          (entry) => entry.item.id === anchorId,
        );
        const usesRangeSelection =
          Boolean(event?.shiftKey) &&
          multiSelect &&
          anchorIndex >= 0 &&
          itemIndex >= 0;
        const usesToggleSelection =
          Boolean(event?.metaKey || event?.ctrlKey) && multiSelect;

        let nextSelectedIds: string[];

        if (usesRangeSelection) {
          const [startIndex, endIndex] =
            anchorIndex < itemIndex
              ? [anchorIndex, itemIndex]
              : [itemIndex, anchorIndex];

          nextSelectedIds = visibleItems
            .slice(startIndex, endIndex + 1)
            .map((entry) => entry.item.id);
        } else if (usesToggleSelection) {
          nextSelectedIds = selectedIdSet.has(itemId)
            ? currentSelectedIds.filter((selectedId) => selectedId !== itemId)
            : [...currentSelectedIds, itemId];
          selectionAnchorRef.current = itemId;
        } else {
          nextSelectedIds = [itemId];
          selectionAnchorRef.current = itemId;
        }

        setCurrentSelectedIds(Array.from(new Set(nextSelectedIds)));
      },
      [
        currentSelectedIds,
        multiSelect,
        selectable,
        selectedIdSet,
        setCurrentSelectedIds,
        visibleItems,
      ],
    );

    const startEditing = React.useCallback(
      (item: TreeViewItem) => {
        if (!editable || item.canRename === false || item.disabled) {
          return;
        }

        setFocusedId(item.id);
        setEditingId(item.id);
        setEditingValue(item.name);
      },
      [editable],
    );

    const commitEditing = React.useCallback(() => {
      if (!editingId) {
        return;
      }

      const item = findTreeItem(currentItems, editingId);

      if (!item) {
        setEditingId(undefined);
        setEditingValue("");
        return;
      }

      const nextName = editingValue.trim();

      if (!nextName) {
        setEditingId(undefined);
        setEditingValue("");
        focusTreeItem(editingId);
        return;
      }

      setCurrentItems(
        updateTreeItemById(currentItems, editingId, (currentItem) => ({
          ...currentItem,
          name: nextName,
        })),
      );
      onRenameItem?.(item, nextName);
      announce(`Renamed ${item.name} to ${nextName}.`);
      setEditingId(undefined);
      setEditingValue("");
      focusTreeItem(editingId);
    }, [
      announce,
      currentItems,
      editingId,
      editingValue,
      focusTreeItem,
      onRenameItem,
      setCurrentItems,
    ]);

    const cancelEditing = React.useCallback(() => {
      const previousEditingId = editingId;
      setEditingId(undefined);
      setEditingValue("");
      focusTreeItem(previousEditingId);
    }, [editingId, focusTreeItem]);

    const handleAddItem = React.useCallback(
      (item: TreeViewItem, level: number) => {
        if (!addable || item.disabled || item.canAddChild === false) {
          return;
        }

        const itemContext: TreeViewCreateItemContext = {
          parent: item,
          level: level + 1,
          index: item.children?.length ?? 0,
        };
        const nextItem =
          createItem?.(itemContext) ?? createDefaultTreeItem(itemContext);

        setCurrentItems(insertTreeItemAsChild(currentItems, item.id, nextItem));
        setCurrentExpandedIds(
          Array.from(new Set([...currentExpandedIds, item.id])),
        );
        setCurrentSelectedIds([nextItem.id]);
        setFocusedId(nextItem.id);
        selectionAnchorRef.current = nextItem.id;
        onAddItem?.({
          ...itemContext,
          item: nextItem,
        });
        announce(
          editable
            ? `Added ${nextItem.name} under ${item.name}. Rename field focused.`
            : `Added ${nextItem.name} under ${item.name}.`,
        );

        if (editable) {
          setEditingId(nextItem.id);
          setEditingValue(nextItem.name);
        }
      },
      [
        addable,
        announce,
        createItem,
        currentExpandedIds,
        currentItems,
        editable,
        onAddItem,
        setCurrentExpandedIds,
        setCurrentItems,
        setCurrentSelectedIds,
      ],
    );

    const handleDeleteItem = React.useCallback(
      (item: TreeViewItem) => {
        if (!deletable || item.disabled || item.canDelete === false) {
          return;
        }

        const itemIdsToRemove = new Set(collectItemIds(item));
        const currentVisibleIndex = visibleItems.findIndex(
          (entry) => entry.item.id === item.id,
        );
        const nextFocusedId =
          visibleItems[currentVisibleIndex + 1]?.item.id ??
          visibleItems[currentVisibleIndex - 1]?.item.id;

        setCurrentItems(removeTreeItemById(currentItems, item.id));
        setCurrentExpandedIds(
          currentExpandedIds.filter(
            (expandedId) => !itemIdsToRemove.has(expandedId),
          ),
        );
        setCurrentSelectedIds(
          currentSelectedIds.filter(
            (selectedId) => !itemIdsToRemove.has(selectedId),
          ),
        );
        setFocusedId(nextFocusedId);
        selectionAnchorRef.current = nextFocusedId;
        onDeleteItem?.(item);
        announce(`Deleted ${item.name}.`);
      },
      [
        announce,
        currentExpandedIds,
        currentItems,
        currentSelectedIds,
        deletable,
        onDeleteItem,
        setCurrentExpandedIds,
        setCurrentItems,
        setCurrentSelectedIds,
        visibleItems,
      ],
    );

    const getDropContext = React.useCallback(
      (sourceId: string, targetItem: TreeViewItem, copy: boolean) => {
        const sourceItem = findTreeItem(currentItems, sourceId);

        if (
          !sourceItem ||
          sourceItem.id === targetItem.id ||
          !canAcceptChildren(targetItem)
        ) {
          return undefined;
        }

        const targetPath = findTreeItemPath(currentItems, targetItem.id);

        if (targetPath?.includes(sourceItem.id)) {
          return undefined;
        }

        const context: TreeViewDropValidatorContext = {
          sourceId,
          targetId: targetItem.id,
          sourceItem,
          targetItem,
          copy,
        };

        if (allowDrop && !allowDrop(context)) {
          return undefined;
        }

        return context;
      },
      [allowDrop, currentItems],
    );

    const completeDrop = React.useCallback(
      (sourceId: string, targetItem: TreeViewItem, copy: boolean) => {
        const dropContext = getDropContext(sourceId, targetItem, copy);

        if (!dropContext) {
          return;
        }

        let insertedItem: TreeViewItem | undefined;
        let nextItems = currentItems;

        if (copy) {
          insertedItem = cloneTreeItemWithNewIds(dropContext.sourceItem);
          nextItems = insertTreeItemAsChild(
            currentItems,
            targetItem.id,
            insertedItem,
          );
        } else {
          const extractedTreeItem = extractTreeItem(currentItems, sourceId);

          if (!extractedTreeItem.extractedItem) {
            return;
          }

          insertedItem = extractedTreeItem.extractedItem;
          nextItems = insertTreeItemAsChild(
            extractedTreeItem.remainingItems,
            targetItem.id,
            insertedItem,
          );
        }

        setCurrentItems(nextItems);
        setCurrentExpandedIds(
          Array.from(new Set([...currentExpandedIds, targetItem.id])),
        );
        setCurrentSelectedIds([insertedItem.id]);
        setFocusedId(insertedItem.id);
        selectionAnchorRef.current = insertedItem.id;

        const operation: TreeViewMoveOperation = {
          ...dropContext,
          insertedItem,
        };

        if (copy) {
          onItemCopy?.(operation);
        } else {
          onItemMove?.(operation);
        }
      },
      [
        currentExpandedIds,
        currentItems,
        getDropContext,
        onItemCopy,
        onItemMove,
        setCurrentExpandedIds,
        setCurrentItems,
        setCurrentSelectedIds,
      ],
    );

    const focusByTypeahead = React.useCallback(
      (key: string, currentIndex: number) => {
        if (!key.trim()) {
          return false;
        }

        const nextCharacter = key.toLowerCase();
        const currentQuery = typeaheadStateRef.current.query;
        const nextQuery = `${currentQuery}${nextCharacter}`;

        if (typeaheadStateRef.current.timeoutId !== undefined) {
          window.clearTimeout(typeaheadStateRef.current.timeoutId);
        }

        const scheduleReset = () => {
          typeaheadStateRef.current.timeoutId = window.setTimeout(() => {
            typeaheadStateRef.current.query = "";
            typeaheadStateRef.current.timeoutId = undefined;
          }, 700);
        };

        const orderedItems = [
          ...visibleItems.slice(currentIndex + 1),
          ...visibleItems.slice(0, currentIndex + 1),
        ];

        const findMatch = (query: string) =>
          orderedItems.find((candidate) =>
            candidate.item.name.toLowerCase().startsWith(query),
          );

        let nextMatch = findMatch(nextQuery);
        typeaheadStateRef.current.query = nextQuery;

        if (!nextMatch && nextQuery.length > 1) {
          typeaheadStateRef.current.query = nextCharacter;
          nextMatch = findMatch(nextCharacter);
        }

        scheduleReset();

        if (!nextMatch) {
          return false;
        }

        setFocusedId(nextMatch.item.id);
        return true;
      },
      [visibleItems],
    );

    const handleItemKeyDown = React.useCallback(
      (
        event: React.KeyboardEvent<HTMLDivElement>,
        entry: TreeViewVisibleItem,
        visibleIndex: number,
      ) => {
        if (editingId && editingId === entry.item.id) {
          return;
        }

        if (
          event.key.length === 1 &&
          !event.altKey &&
          !event.ctrlKey &&
          !event.metaKey &&
          focusByTypeahead(event.key, visibleIndex)
        ) {
          event.preventDefault();
          return;
        }

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            setFocusedId(
              visibleItems[visibleIndex + 1]?.item.id ?? entry.item.id,
            );
            break;
          case "ArrowUp":
            event.preventDefault();
            setFocusedId(
              visibleItems[visibleIndex - 1]?.item.id ?? entry.item.id,
            );
            break;
          case "ArrowRight":
            event.preventDefault();
            if (
              !entry.item.disabled &&
              isBranch(entry.item) &&
              !effectiveExpandedIds.has(entry.item.id)
            ) {
              void toggleExpanded(entry.item, true);
            } else if (entry.item.children?.length) {
              setFocusedId(entry.item.children[0]?.id);
            }
            break;
          case "ArrowLeft":
            event.preventDefault();
            if (
              !entry.item.disabled &&
              isBranch(entry.item) &&
              effectiveExpandedIds.has(entry.item.id)
            ) {
              void toggleExpanded(entry.item, false);
            } else if (entry.parentId) {
              setFocusedId(entry.parentId);
            }
            break;
          case "Home":
            event.preventDefault();
            setFocusedId(visibleItems[0]?.item.id);
            break;
          case "End":
            event.preventDefault();
            setFocusedId(visibleItems[visibleItems.length - 1]?.item.id);
            break;
          case "Enter":
          case " ":
            if (!entry.item.disabled) {
              event.preventDefault();
              selectItem(entry.item.id, event);
            }
            break;
          case "a":
          case "A":
            if (multiSelect && (event.ctrlKey || event.metaKey)) {
              event.preventDefault();
              const selectableVisibleIds = visibleItems
                .filter((visibleEntry) => !visibleEntry.item.disabled)
                .map((visibleEntry) => visibleEntry.item.id);
              setCurrentSelectedIds(selectableVisibleIds);
              selectionAnchorRef.current = entry.item.id;
              announce(
                `Selected ${selectableVisibleIds.length} visible item${
                  selectableVisibleIds.length === 1 ? "" : "s"
                }.`,
              );
            }
            break;
          case "F2":
            if (!entry.item.disabled) {
              event.preventDefault();
              startEditing(entry.item);
            }
            break;
          case "Insert":
            if (
              !entry.item.disabled &&
              addable &&
              canAcceptChildren(entry.item) &&
              entry.item.canAddChild !== false
            ) {
              event.preventDefault();
              handleAddItem(entry.item, entry.level);
            }
            break;
          case "Delete":
          case "Backspace":
            if (deletable && !entry.item.disabled) {
              event.preventDefault();
              handleDeleteItem(entry.item);
            }
            break;
          default:
            break;
        }
      },
      [
        addable,
        announce,
        deletable,
        editingId,
        effectiveExpandedIds,
        focusByTypeahead,
        handleDeleteItem,
        handleAddItem,
        multiSelect,
        selectItem,
        setCurrentSelectedIds,
        startEditing,
        toggleExpanded,
        visibleItems,
      ],
    );

    const setTreeItemRef = React.useCallback(
      (itemId: string) => (node: HTMLDivElement | null) => {
        itemRefs.current.set(itemId, node);
      },
      [],
    );

    const renderDefaultNode = React.useCallback(
      (renderProps: TreeViewRenderProps) => {
        const icon =
          renderProps.item.icon ??
          (renderProps.isLeaf ? resolveTreeIcon(leafIcon, renderProps) : null);

        return (
          <div className="flex min-w-0 flex-1 items-center gap-sm">
            {icon ? (
              <span className="inline-flex shrink-0 items-center justify-center text-foreground-muted">
                {icon}
              </span>
            ) : null}
            <div className="min-w-0 flex-1">
              <div
                className={getClassName(
                  "label",
                  cn(
                    "truncate text-sm font-medium",
                    renderProps.isSelected ? "text-primary" : "text-foreground",
                  ),
                )}
              >
                {renderProps.item.name}
              </div>
              {renderProps.item.description ? (
                <div
                  className={getClassName(
                    "description",
                    cn(
                      "truncate text-xs",
                      renderProps.isSelected
                        ? "text-primary/80"
                        : "text-foreground-muted",
                    ),
                  )}
                >
                  {renderProps.item.description}
                </div>
              ) : null}
            </div>
            {renderProps.item.endContent ? (
              <div
                className={getClassName(
                  "endContent",
                  "ml-sm inline-flex shrink-0 items-center",
                )}
              >
                {renderProps.item.endContent}
              </div>
            ) : null}
          </div>
        );
      },
      [getClassName, leafIcon],
    );

    const renderTreeItems = React.useCallback(
      (
        entries: TreeViewItem[],
        level = 1,
        parentId?: string,
      ): React.ReactNode =>
        entries.map((item, entryIndex) => {
          const currentEntry: TreeViewVisibleItem = {
            item,
            level,
            parentId,
          };
          const visibleIndex = visibleItems.findIndex(
            (entry) => entry.item.id === item.id,
          );
          const actualItem = findTreeItem(currentItems, item.id) ?? item;
          const itemIsExpanded = effectiveExpandedIds.has(item.id);
          const itemIsSelected = selectedIdSet.has(item.id);
          const itemIsFocused = focusedId === item.id;
          const itemIsEditing = editingId === item.id;
          const itemIsLeaf = !isBranch(item);
          const itemIsLoading =
            loadingIdSet.has(item.id) || item.isLoading === true;
          const itemHasAsyncError = Object.prototype.hasOwnProperty.call(
            asyncLoadErrors,
            item.id,
          );
          const itemLoadError = itemHasAsyncError
            ? asyncLoadErrors[item.id]
            : undefined;
          const itemIsDropTarget = dropTargetId === item.id;
          const itemIsDragging = draggingId === item.id;
          const renderProps: TreeViewRenderProps = {
            item: actualItem,
            level,
            isExpanded: itemIsExpanded,
            isSelected: itemIsSelected,
            isFocused: itemIsFocused,
            isLeaf: itemIsLeaf,
            isLoading: itemIsLoading,
            hasAsyncError: itemHasAsyncError,
            loadError: itemLoadError,
            isDropTarget: itemIsDropTarget,
            isDragging: itemIsDragging,
            searchQuery: currentSearchQuery,
            toggle: () => {
              void toggleExpanded(actualItem);
            },
            select: (event) => selectItem(item.id, event),
            startEditing: () => startEditing(actualItem),
            retryLoad: () => {
              void loadChildrenForItem(actualItem.id);
            },
          };
          const resolvedErrorMessage = itemHasAsyncError
            ? resolveLoadErrorMessage(
                loadErrorMessage,
                actualItem,
                itemLoadError,
              )
            : null;
          const resolvedRetryLabel = resolveRetryLabel(retryLabel, actualItem);
          const itemGroupId = `${rootId}-${item.id}-group`;
          const itemLoadingMessageId = `${rootId}-${item.id}-loading`;
          const itemErrorMessageId = `${rootId}-${item.id}-error`;
          const itemDescriptionIds = [
            itemIsLoading ? itemLoadingMessageId : undefined,
            itemHasAsyncError ? itemErrorMessageId : undefined,
          ]
            .filter(Boolean)
            .join(" ");

          const toggleAdornment = itemIsLoading
            ? (resolveTreeIcon(loadingIcon, renderProps) ?? (
                <IconLoader2 size={16} className="animate-spin" />
              ))
            : itemIsExpanded
              ? (resolveTreeIcon(collapseIcon, renderProps) ?? (
                  <IconChevronDown size={16} />
                ))
              : (resolveTreeIcon(expandIcon, renderProps) ?? (
                  <IconChevronRight size={16} />
                ));
          const itemAllowsChildren = canAcceptChildren(actualItem);
          const showAddAction =
            addable && itemAllowsChildren && actualItem.canAddChild !== false;
          const showRenameAction =
            editable && actualItem.canRename !== false && !actualItem.disabled;
          const showDeleteAction =
            deletable && actualItem.canDelete !== false && !actualItem.disabled;

          return (
            <div
              key={item.id}
              className={getClassName("item", "space-y-[2px]")}
            >
              <div
                ref={setTreeItemRef(item.id)}
                role="treeitem"
                aria-expanded={isBranch(item) ? itemIsExpanded : undefined}
                aria-selected={selectable ? itemIsSelected : undefined}
                aria-level={level}
                aria-setsize={entries.length}
                aria-posinset={entryIndex + 1}
                aria-disabled={actualItem.disabled || undefined}
                aria-busy={itemIsLoading || undefined}
                aria-describedby={itemDescriptionIds || undefined}
                tabIndex={itemIsEditing ? -1 : itemIsFocused ? 0 : -1}
                data-selected={itemIsSelected || undefined}
                data-focused={itemIsFocused || undefined}
                data-drop-target={itemIsDropTarget || undefined}
                data-dragging={itemIsDragging || undefined}
                draggable={
                  draggable && !itemIsEditing && actualItem.canDrag !== false
                }
                onFocus={() => setFocusedId(item.id)}
                onClick={(event) => {
                  if (actualItem.disabled) {
                    return;
                  }

                  selectItem(item.id, event);
                }}
                onDoubleClick={() => {
                  if (!actualItem.disabled && isBranch(actualItem)) {
                    void toggleExpanded(actualItem);
                  }
                }}
                onKeyDown={(event) =>
                  handleItemKeyDown(event, currentEntry, visibleIndex)
                }
                onDragStart={(event) => {
                  if (!draggable || actualItem.canDrag === false) {
                    return;
                  }

                  event.dataTransfer.effectAllowed = "copyMove";
                  event.dataTransfer.setData("text/plain", actualItem.id);
                  setDraggingId(actualItem.id);
                }}
                onDragEnd={() => {
                  setDraggingId(undefined);
                  setDropTargetId(undefined);
                }}
                onDragOver={(event) => {
                  const sourceId =
                    draggingId ?? event.dataTransfer.getData("text/plain");
                  const dropContext = sourceId
                    ? getDropContext(sourceId, actualItem, event.ctrlKey)
                    : undefined;

                  if (!dropContext) {
                    return;
                  }

                  event.preventDefault();
                  event.dataTransfer.dropEffect = event.ctrlKey
                    ? "copy"
                    : "move";
                  setDropTargetId(actualItem.id);
                }}
                onDragLeave={() => {
                  if (dropTargetId === actualItem.id) {
                    setDropTargetId(undefined);
                  }
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const sourceId =
                    draggingId ?? event.dataTransfer.getData("text/plain");

                  if (!sourceId) {
                    return;
                  }

                  completeDrop(sourceId, actualItem, event.ctrlKey);
                  setDraggingId(undefined);
                  setDropTargetId(undefined);
                }}
                className={getClassName(
                  "row",
                  cn(
                    "group flex items-center gap-xs rounded-xl pr-sm transition-colors outline-none",
                    !disableDefaultStyles && "min-h-10",
                    !disableDefaultStyles &&
                      !actualItem.disabled &&
                      !itemIsSelected &&
                      "hover:bg-surface-subtle",
                    !disableDefaultStyles &&
                      itemIsSelected &&
                      "bg-primary/10 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.14)]",
                    !disableDefaultStyles &&
                      itemIsFocused &&
                      "ring-2 ring-primary/20 ring-offset-0",
                    !disableDefaultStyles &&
                      itemIsDropTarget &&
                      "bg-primary/5 ring-2 ring-primary/30",
                    itemIsDragging && "opacity-60",
                    actualItem.disabled && "cursor-not-allowed opacity-60",
                  ),
                )}
              >
                <div
                  className="flex min-w-0 flex-1 items-center gap-xs"
                  style={{
                    paddingLeft: `${Math.max(level - 1, 0) * indent}px`,
                  }}
                >
                  {isBranch(item) ? (
                    <button
                      type="button"
                      tabIndex={-1}
                      disabled={actualItem.disabled || itemIsLoading}
                      onClick={(event) => {
                        event.stopPropagation();
                        void toggleExpanded(actualItem);
                      }}
                      className={getClassName(
                        "toggle",
                        cn(
                          "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-foreground-subtle transition-colors",
                          !disableDefaultStyles &&
                            "hover:bg-surface-muted hover:text-foreground",
                        ),
                      )}
                      aria-label={
                        itemIsExpanded
                          ? `Collapse ${actualItem.name}`
                          : `Expand ${actualItem.name}`
                      }
                      aria-expanded={itemIsExpanded}
                      aria-controls={
                        item.children?.length ? itemGroupId : undefined
                      }
                    >
                      {toggleAdornment}
                    </button>
                  ) : (
                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center" />
                  )}

                  <div className={getClassName("content", "min-w-0 flex-1")}>
                    {itemIsEditing ? (
                      <input
                        ref={renameInputRef}
                        value={editingValue}
                        onChange={(event) =>
                          setEditingValue(event.target.value)
                        }
                        onBlur={commitEditing}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            commitEditing();
                          }

                          if (event.key === "Escape") {
                            event.preventDefault();
                            cancelEditing();
                          }
                        }}
                        className={cn(
                          "w-full rounded-lg border px-sm py-xs text-sm outline-none",
                          !disableDefaultStyles &&
                            "border-default bg-surface focus:border-primary focus:ring-2 focus:ring-primary/20",
                        )}
                        aria-label={`Rename ${actualItem.name}`}
                      />
                    ) : renderNode ? (
                      renderNode(renderProps)
                    ) : (
                      renderDefaultNode(renderProps)
                    )}
                  </div>
                </div>

                {(showAddAction || showRenameAction || showDeleteAction) &&
                !itemIsEditing ? (
                  <div
                    className={getClassName(
                      "actions",
                      cn(
                        "mr-xs flex shrink-0 items-center gap-[2px]",
                        !disableDefaultStyles &&
                          "opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100",
                        itemIsSelected && "opacity-100",
                      ),
                    )}
                  >
                    {showAddAction ? (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleAddItem(actualItem, level);
                        }}
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-subtle",
                          !disableDefaultStyles &&
                            "hover:bg-surface-muted hover:text-foreground",
                        )}
                        aria-label={`Add child to ${actualItem.name}`}
                      >
                        <IconPlus size={15} />
                      </button>
                    ) : null}
                    {showRenameAction ? (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={(event) => {
                          event.stopPropagation();
                          startEditing(actualItem);
                        }}
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-subtle",
                          !disableDefaultStyles &&
                            "hover:bg-surface-muted hover:text-foreground",
                        )}
                        aria-label={`Rename ${actualItem.name}`}
                      >
                        <IconEdit size={15} />
                      </button>
                    ) : null}
                    {showDeleteAction ? (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDeleteItem(actualItem);
                        }}
                        className={cn(
                          "inline-flex h-7 w-7 items-center justify-center rounded-md text-foreground-subtle",
                          !disableDefaultStyles &&
                            "hover:bg-error/10 hover:text-error",
                        )}
                        aria-label={`Delete ${actualItem.name}`}
                      >
                        <IconTrash size={15} />
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {itemIsExpanded && itemIsLoading ? (
                <div
                  id={itemLoadingMessageId}
                  role="status"
                  aria-live="polite"
                  aria-atomic="true"
                  className={getClassName(
                    "loadingRow",
                    cn(
                      "flex items-center gap-sm px-md py-xs text-xs text-foreground-muted",
                      !disableDefaultStyles && "ml-10",
                    ),
                  )}
                  style={{
                    paddingLeft: `${Math.max(level, 0) * indent + 32}px`,
                  }}
                >
                  <IconLoader2 size={14} className="animate-spin" />
                  Loading children...
                </div>
              ) : null}

              {itemIsExpanded && itemHasAsyncError ? (
                <div
                  id={itemErrorMessageId}
                  role="alert"
                  className={getClassName(
                    "errorRow",
                    cn(
                      "flex items-center justify-between gap-sm px-md py-sm text-xs",
                      !disableDefaultStyles &&
                        "ml-10 rounded-xl border border-error/20 bg-error/10 text-error",
                    ),
                  )}
                  style={{
                    paddingLeft: `${Math.max(level, 0) * indent + 32}px`,
                  }}
                >
                  <div className="flex min-w-0 items-center gap-sm">
                    <IconAlertCircle size={14} className="shrink-0" />
                    <span className="min-w-0 truncate">
                      {resolvedErrorMessage}
                    </span>
                  </div>
                  <Button
                    type="button"
                    size="xs"
                    variant="secondary"
                    onClick={(event) => {
                      event.stopPropagation();
                      void loadChildrenForItem(actualItem.id);
                    }}
                  >
                    {resolvedRetryLabel}
                  </Button>
                </div>
              ) : null}

              {itemIsExpanded && item.children?.length ? (
                <div
                  id={itemGroupId}
                  role="group"
                  className={getClassName("group", "space-y-[2px]")}
                >
                  {renderTreeItems(item.children, level + 1, item.id)}
                </div>
              ) : null}
            </div>
          );
        }),
      [
        addable,
        cancelEditing,
        collapseIcon,
        commitEditing,
        completeDrop,
        currentItems,
        currentSearchQuery,
        deletable,
        disableDefaultStyles,
        draggable,
        draggingId,
        dropTargetId,
        editingId,
        editingValue,
        effectiveExpandedIds,
        expandIcon,
        focusedId,
        getClassName,
        getDropContext,
        handleAddItem,
        handleDeleteItem,
        handleItemKeyDown,
        indent,
        asyncLoadErrors,
        loadChildrenForItem,
        loadErrorMessage,
        loadingIcon,
        loadingIdSet,
        renderDefaultNode,
        renderNode,
        retryLabel,
        selectItem,
        selectedIdSet,
        selectable,
        setTreeItemRef,
        startEditing,
        toggleExpanded,
        visibleItems,
      ],
    );

    return (
      <div
        id={rootId}
        ref={ref}
        role="tree"
        aria-label={props["aria-label"] ?? "Tree view"}
        aria-multiselectable={multiSelect || undefined}
        aria-describedby={instructionsId}
        aria-busy={loadingIds.length ? true : undefined}
        className={getClassName(
          "root",
          cn(
            "flex w-full flex-col overflow-hidden",
            !disableDefaultStyles &&
              "rounded-2xl border border-default bg-surface shadow-soft",
            className,
          ),
        )}
        {...props}
      >
        <p id={instructionsId} className="sr-only">
          {treeInstructions}
        </p>
        <div
          id={liveRegionId}
          className="sr-only"
          aria-live="polite"
          aria-atomic="true"
        >
          {liveMessage}
        </div>

        {searchable ? (
          <div
            className={getClassName(
              "searchWrapper",
              cn(
                "p-md",
                !disableDefaultStyles &&
                  "border-b border-default bg-surface-subtle/70",
              ),
            )}
          >
            <label htmlFor={`${rootId}-search`} className="sr-only">
              Search tree nodes
            </label>
            <div className="relative">
              <IconSearch
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-foreground-subtle"
              />
              <input
                id={`${rootId}-search`}
                value={currentSearchQuery}
                onChange={(event) => setCurrentSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "ArrowDown" && visibleItems.length) {
                    event.preventDefault();
                    focusTreeItem(visibleItems[0]?.item.id);
                  }
                }}
                placeholder={searchPlaceholder}
                aria-controls={viewportId}
                className={getClassName(
                  "searchInput",
                  cn(
                    "w-full rounded-xl py-sm pr-md pl-9 text-sm outline-none",
                    !disableDefaultStyles &&
                      "border border-default bg-surface text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20",
                  ),
                )}
              />
            </div>
          </div>
        ) : null}

        <div
          id={viewportId}
          className={getClassName(
            "viewport",
            cn("flex flex-col", !disableDefaultStyles && "gap-[2px] p-sm"),
          )}
        >
          {visibleItems.length ? (
            renderTreeItems(processedItems)
          ) : (
            <div
              className={getClassName(
                "emptyState",
                cn(
                  "px-lg py-xl text-sm text-foreground-muted",
                  !disableDefaultStyles &&
                    "rounded-xl border border-dashed border-default bg-surface-subtle/60",
                ),
              )}
            >
              {emptyState}
            </div>
          )}
        </div>
      </div>
    );
  },
);

TreeView.displayName = "TreeView";
