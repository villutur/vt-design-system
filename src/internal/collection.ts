import React from "react";

export interface SearchableCollectionItem {
  value: string;
  label: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  keywords?: string[];
  disabled?: boolean;
  group?: string;
  shortcut?: string;
}

export interface CollectionGroup<T extends SearchableCollectionItem> {
  label?: string;
  items: T[];
}

function normalizeSearchValue(value: string) {
  return value.trim().toLowerCase();
}

function getTextFromNode(node: React.ReactNode) {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  return "";
}

export function filterCollectionItems<T extends SearchableCollectionItem>(
  items: T[],
  query: string,
) {
  const normalizedQuery = normalizeSearchValue(query);

  if (!normalizedQuery) {
    return items;
  }

  return items.filter((item) => {
    const haystack = [
      item.label,
      getTextFromNode(item.description),
      ...(item.keywords ?? []),
      item.group ?? "",
      item.value,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

export function groupCollectionItems<T extends SearchableCollectionItem>(
  items: T[],
) {
  const grouped = new Map<string, T[]>();

  items.forEach((item) => {
    const key = item.group ?? "";
    const groupItems = grouped.get(key) ?? [];
    groupItems.push(item);
    grouped.set(key, groupItems);
  });

  return Array.from(grouped.entries()).map(([label, groupItems]) => ({
    label: label || undefined,
    items: groupItems,
  })) satisfies CollectionGroup<T>[];
}
