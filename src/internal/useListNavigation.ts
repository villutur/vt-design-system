import React from "react";

interface ListItem {
  disabled?: boolean;
}

export interface ListNavigationOptions<T extends ListItem> {
  items: T[];
  open: boolean;
  onSelect?: (item: T, index: number) => void;
  onClose?: () => void;
  focusItemOnChange?: boolean;
}

function getNextEnabledIndex<T extends ListItem>(
  items: T[],
  startIndex: number,
  direction: 1 | -1,
) {
  if (!items.length) {
    return -1;
  }

  let index = startIndex;

  for (let count = 0; count < items.length; count += 1) {
    index = (index + direction + items.length) % items.length;
    if (!items[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

function getFirstEnabledIndex<T extends ListItem>(items: T[]) {
  return items.findIndex((item) => !item.disabled);
}

function getLastEnabledIndex<T extends ListItem>(items: T[]) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!items[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

export function useListNavigation<T extends ListItem>({
  items,
  open,
  onSelect,
  onClose,
  focusItemOnChange = false,
}: ListNavigationOptions<T>) {
  const itemRefs = React.useRef<Array<HTMLElement | null>>([]);
  const [activeIndex, setActiveIndex] = React.useState(-1);

  React.useEffect(() => {
    if (!open) {
      setActiveIndex(-1);
      return;
    }

    setActiveIndex((currentIndex) => {
      if (currentIndex >= 0 && !items[currentIndex]?.disabled) {
        return currentIndex;
      }

      return getFirstEnabledIndex(items);
    });
  }, [items, open]);

  React.useEffect(() => {
    if (!focusItemOnChange || activeIndex < 0) {
      return;
    }

    itemRefs.current[activeIndex]?.focus();
  }, [activeIndex, focusItemOnChange]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setActiveIndex((currentIndex) =>
            getNextEnabledIndex(
              items,
              currentIndex < 0 ? items.length - 1 : currentIndex,
              1,
            ),
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setActiveIndex((currentIndex) =>
            getNextEnabledIndex(
              items,
              currentIndex < 0 ? 0 : currentIndex,
              -1,
            ),
          );
          break;
        case "Home":
          event.preventDefault();
          setActiveIndex(getFirstEnabledIndex(items));
          break;
        case "End":
          event.preventDefault();
          setActiveIndex(getLastEnabledIndex(items));
          break;
        case "Enter":
          if (activeIndex >= 0 && !items[activeIndex]?.disabled) {
            event.preventDefault();
            onSelect?.(items[activeIndex], activeIndex);
          }
          break;
        case "Escape":
          onClose?.();
          break;
        default:
          break;
      }
    },
    [activeIndex, items, onClose, onSelect],
  );

  const setItemRef = React.useCallback(
    (index: number) => (node: HTMLElement | null) => {
      itemRefs.current[index] = node;
    },
    [],
  );

  return {
    activeIndex,
    setActiveIndex,
    handleKeyDown,
    itemRefs,
    setItemRef,
  };
}
