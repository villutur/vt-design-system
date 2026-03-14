import React from "react";
import { IconCommand, IconSearch } from "@tabler/icons-react";
import { FloatingPortal } from "../../internal/FloatingPortal";
import { SearchableCollectionItem, filterCollectionItems, groupCollectionItems } from "../../internal/collection";
import { useBodyScrollLock } from "../../internal/useBodyScrollLock";
import { useControllableState } from "../../internal/useControllableState";
import { useDismissibleLayer } from "../../internal/useDismissibleLayer";
import { useFocusReturn } from "../../internal/useFocusReturn";
import { useListNavigation } from "../../internal/useListNavigation";
import { cn } from "../../utils/cn";

export interface CommandPaletteItem extends SearchableCollectionItem {
  onSelect?: () => void;
}

export interface CommandPaletteSection {
  title: string;
  items: CommandPaletteItem[];
}

export interface CommandPaletteProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  isOpen?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  sections: CommandPaletteSection[];
  onSelect?: (item: CommandPaletteItem) => void;
  searchPlaceholder?: string;
  emptyState?: React.ReactNode;
  enableGlobalShortcut?: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  defaultOpen = false,
  onOpenChange,
  sections,
  onSelect,
  searchPlaceholder = "Search commands...",
  emptyState = "No commands found.",
  className,
  enableGlobalShortcut = false,
  ...props
}) => {
  const paletteId = React.useId();
  const titleId = `${paletteId}-title`;
  const instructionsId = `${paletteId}-instructions`;
  const liveRegionId = `${paletteId}-live-region`;
  const resultsId = `${paletteId}-results`;
  const inputId = `${paletteId}-input`;
  const [open, setOpen] = useControllableState({
    value: isOpen,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const [query, setQuery] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const paletteRef = React.useRef<HTMLDivElement>(null);

  useBodyScrollLock(open);
  useFocusReturn(open);
  useDismissibleLayer({
    enabled: open,
    refs: [paletteRef],
    onDismiss: () => setOpen(false),
  });

  React.useEffect(() => {
    if (!enableGlobalShortcut) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [enableGlobalShortcut, open, setOpen]);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }

    window.requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const filteredSections = React.useMemo(
    () =>
      sections
        .map((section) => ({
          ...section,
          items: filterCollectionItems(section.items, query),
        }))
        .filter((section) => section.items.length > 0),
    [query, sections],
  );

  const flatItems = React.useMemo(() => filteredSections.flatMap((section) => section.items), [filteredSections]);

  const { activeIndex, setActiveIndex, handleKeyDown, setItemRef } = useListNavigation({
    items: flatItems,
    open,
    onClose: () => setOpen(false),
    onSelect: (item) => {
      item.onSelect?.();
      onSelect?.(item);
      setOpen(false);
    },
  });
  const activeItem = activeIndex >= 0 ? flatItems[activeIndex] : undefined;
  const { "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...dialogProps } = props;
  const statusMessage =
    flatItems.length === 0
      ? "No commands found."
      : query.trim()
        ? `${flatItems.length} command${flatItems.length === 1 ? "" : "s"} available for ${query.trim()}.`
        : `${flatItems.length} command${flatItems.length === 1 ? "" : "s"} available.`;
  const liveMessage = activeItem ? `${statusMessage} Focused command: ${activeItem.label}.` : statusMessage;
  const paletteLabel = typeof ariaLabel === "string" && ariaLabel.trim() ? ariaLabel : "Command palette";

  if (!open) {
    return null;
  }

  let runningIndex = -1;

  return (
    <FloatingPortal>
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-overlay/40 backdrop-blur-sm" />
        <div className="absolute inset-0 flex items-start justify-center px-md pt-[10vh]">
          <div
            ref={paletteRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ariaLabelledBy ?? titleId}
            aria-describedby={instructionsId}
            className={cn(
              "w-full max-w-2xl overflow-hidden rounded-2xl border border-default bg-surface shadow-2xl",
              className,
            )}
            {...dialogProps}
          >
            <h2 id={titleId} className="sr-only">
              {paletteLabel}
            </h2>
            <p id={instructionsId} className="sr-only">
              Type to filter commands. Use the Up and Down Arrow keys to move through available commands. Press Enter to
              run the active command. Press Escape to close the command palette.
            </p>
            <div id={liveRegionId} className="sr-only" aria-live="polite" aria-atomic="true">
              {liveMessage}
            </div>
            <div className="flex items-center gap-sm border-b border-default px-md py-md">
              <IconSearch size={18} className="text-foreground-subtle" />
              <label htmlFor={inputId} className="sr-only">
                Search commands
              </label>
              <input
                id={inputId}
                ref={inputRef}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={searchPlaceholder}
                aria-controls={resultsId}
                aria-describedby={instructionsId}
                aria-activedescendant={activeIndex >= 0 ? `${paletteId}-item-${activeIndex}` : undefined}
                aria-autocomplete="list"
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-subtle"
              />
              <span className="inline-flex items-center gap-xs rounded-md border border-default px-sm py-[2px] text-[10px] tracking-wide text-foreground-subtle uppercase">
                <IconCommand size={12} /> K
              </span>
            </div>

            <div id={resultsId} className="max-h-[420px] overflow-y-auto p-xs">
              {flatItems.length === 0 ? (
                <div className="px-md py-xl text-center text-sm text-foreground-muted">{emptyState}</div>
              ) : (
                groupCollectionItems(flatItems).map((group, groupIndex) => (
                  <div key={group.label ?? `command-group-${groupIndex}`} className="py-xs">
                    {group.label ? (
                      <div className="px-sm py-xs text-[10px] font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                        {group.label}
                      </div>
                    ) : null}
                    <div className="space-y-[2px]">
                      {group.items.map((item) => {
                        runningIndex += 1;
                        const itemIndex = runningIndex;

                        return (
                          <button
                            key={item.value}
                            id={`${paletteId}-item-${itemIndex}`}
                            ref={setItemRef(itemIndex)}
                            type="button"
                            disabled={item.disabled}
                            onMouseEnter={() => setActiveIndex(itemIndex)}
                            onClick={() => {
                              item.onSelect?.();
                              onSelect?.(item);
                              setOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-start justify-between gap-md rounded-xl px-sm py-sm text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                              itemIndex === activeIndex ? "bg-surface-muted" : "hover:bg-surface-subtle",
                            )}
                            aria-current={itemIndex === activeIndex ? "true" : undefined}
                          >
                            <span className="flex min-w-0 items-start gap-sm">
                              {item.icon ? (
                                <span className="mt-[2px] inline-flex text-foreground-subtle">{item.icon}</span>
                              ) : null}
                              <span className="min-w-0">
                                <span className="block text-sm font-medium text-foreground">{item.label}</span>
                                {item.description ? (
                                  <span className="mt-xs block text-xs text-foreground-muted">{item.description}</span>
                                ) : null}
                              </span>
                            </span>
                            {item.shortcut ? (
                              <span className="text-[10px] tracking-wide text-foreground-subtle uppercase">
                                {item.shortcut}
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </FloatingPortal>
  );
};

CommandPalette.displayName = "CommandPalette";
