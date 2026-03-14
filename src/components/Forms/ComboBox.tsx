import React from "react";
import {
  IconCheck,
  IconChevronDown,
  IconLoader2,
  IconPlus,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import { FloatingPortal } from "../../internal/FloatingPortal";
import {
  filterCollectionItems,
  groupCollectionItems,
  type SearchableCollectionItem,
} from "../../internal/collection";
import { useAnchoredFloating } from "../../internal/useAnchoredFloating";
import { useControllableState } from "../../internal/useControllableState";
import { useDismissibleLayer } from "../../internal/useDismissibleLayer";
import { useFocusReturn } from "../../internal/useFocusReturn";
import { useListNavigation } from "../../internal/useListNavigation";
import { cn } from "../../utils/cn";
import { Field } from "./Field";

export interface ComboBoxOption extends SearchableCollectionItem {}

interface ComboBoxOptionListItem {
  kind: "option";
  option: ComboBoxOption;
  disabled?: boolean;
}

interface ComboBoxCreateListItem {
  kind: "create";
  query: string;
  disabled?: boolean;
}

type ComboBoxListItem = ComboBoxOptionListItem | ComboBoxCreateListItem;

const comboBoxSizeClassMap = {
  xs: {
    trigger: "min-h-6 py-xs pr-10 pl-sm text-[11px]",
    searchInput: "py-xs pr-sm pl-8 text-[11px]",
    triggerIcon: "right-2",
    clearButton: "right-7",
    tag: "px-xs py-[1px] text-[10px]",
  },
  sm: {
    trigger: "min-h-8 py-xs pr-10 pl-sm text-xs",
    searchInput: "py-xs pr-sm pl-8 text-xs",
    triggerIcon: "right-2.5",
    clearButton: "right-8",
    tag: "px-xs py-[2px] text-[10px]",
  },
  md: {
    trigger: "min-h-10 py-sm pr-11 pl-md text-sm",
    searchInput: "py-sm pr-md pl-9 text-sm",
    triggerIcon: "right-3",
    clearButton: "right-9",
    tag: "px-sm py-[3px] text-xs",
  },
} as const;

function normalizeComboBoxValue(value: string) {
  return value.trim().toLowerCase();
}

function createComboBoxValue(query: string) {
  return (
    query
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || query.trim()
  );
}

function createDefaultOptionFromQuery(query: string): ComboBoxOption {
  const trimmedQuery = query.trim();

  return {
    value: createComboBoxValue(trimmedQuery),
    label: trimmedQuery,
  };
}

function upsertCreatedOption(
  currentOptions: ComboBoxOption[],
  nextOption: ComboBoxOption,
) {
  const existingIndex = currentOptions.findIndex(
    (option) => option.value === nextOption.value,
  );

  if (existingIndex < 0) {
    return [...currentOptions, nextOption];
  }

  const nextOptions = [...currentOptions];
  nextOptions[existingIndex] = nextOption;

  return nextOptions;
}

function mergeOptions(
  options: ComboBoxOption[],
  createdOptions: ComboBoxOption[],
) {
  const optionMap = new Map(options.map((option) => [option.value, option]));

  createdOptions.forEach((option) => {
    if (!optionMap.has(option.value)) {
      optionMap.set(option.value, option);
    }
  });

  return Array.from(optionMap.values());
}

function joinIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(" ") || undefined;
}

function resolveSelectedOptions(
  values: string[],
  optionMap: Map<string, ComboBoxOption>,
  latestCreatedOption: ComboBoxOption | undefined,
) {
  return values.flatMap((value) => {
    const option =
      optionMap.get(value) ??
      (latestCreatedOption?.value === value ? latestCreatedOption : undefined);

    return option ? [option] : [];
  });
}

export interface ComboBoxProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "defaultValue" | "onChange"
> {
  options: ComboBoxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | undefined, option?: ComboBoxOption) => void;
  multiple?: boolean;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[], options: ComboBoxOption[]) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  searchQuery?: string;
  defaultSearchQuery?: string;
  onSearchQueryChange?: (query: string) => void;
  filterOptions?: boolean;
  emptyState?: React.ReactNode;
  clearable?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: React.ReactNode;
  creatable?: boolean;
  createOptionLabel?: (query: string) => React.ReactNode;
  onCreateOption?: (
    query: string,
  ) => ComboBoxOption | Promise<ComboBoxOption | undefined> | undefined;
  name?: string;
  size?: keyof typeof comboBoxSizeClassMap;
}

export const ComboBox = React.forwardRef<HTMLButtonElement, ComboBoxProps>(
  (
    {
      options,
      value,
      defaultValue,
      onValueChange,
      multiple = false,
      values,
      defaultValues = [],
      onValuesChange,
      label,
      description,
      helperText,
      errorText,
      error = false,
      required = false,
      placeholder = "Select an option...",
      searchPlaceholder = "Search options...",
      searchQuery,
      defaultSearchQuery = "",
      onSearchQueryChange,
      filterOptions = true,
      emptyState = "No options found.",
      clearable = true,
      disabled = false,
      loading = false,
      loadingText = "Loading options...",
      creatable = false,
      createOptionLabel,
      onCreateOption,
      name,
      size = "md",
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = id || React.useId();
    const labelId = label ? `${generatedId}-label` : undefined;
    const messageId =
      helperText || errorText ? `${generatedId}-message` : undefined;
    const liveRegionId = `${generatedId}-live-region`;
    const listboxId = `${generatedId}-listbox`;
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const popoverRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const latestCreatedOptionRef = React.useRef<ComboBoxOption | undefined>(
      undefined,
    );
    const sizing = comboBoxSizeClassMap[size];
    const dismissRefs = React.useMemo(() => [triggerRef, popoverRef], []);
    const [open, setOpen] = React.useState(false);
    const [creating, setCreating] = React.useState(false);
    const [createdOptions, setCreatedOptions] = React.useState<
      ComboBoxOption[]
    >([]);
    const mergedOptions = React.useMemo(
      () => mergeOptions(options, createdOptions),
      [createdOptions, options],
    );
    const optionMap = React.useMemo(
      () => new Map(mergedOptions.map((option) => [option.value, option])),
      [mergedOptions],
    );
    const [query, setQuery] = useControllableState<string>({
      value: searchQuery,
      defaultValue: defaultSearchQuery,
      onChange: onSearchQueryChange,
    });
    const [selectedValue, setSelectedValue] = useControllableState<
      string | undefined
    >({
      value,
      defaultValue,
      onChange: (nextValue) => {
        const option =
          nextValue == null
            ? undefined
            : (optionMap.get(nextValue) ??
              (latestCreatedOptionRef.current?.value === nextValue
                ? latestCreatedOptionRef.current
                : undefined));

        onValueChange?.(nextValue, option);
      },
    });
    const [selectedValues, setSelectedValues] = useControllableState<string[]>({
      value: values,
      defaultValue: defaultValues,
      onChange: (nextValues) => {
        onValuesChange?.(
          nextValues,
          resolveSelectedOptions(
            nextValues,
            optionMap,
            latestCreatedOptionRef.current,
          ),
        );
      },
    });
    const filteredOptions = React.useMemo(
      () =>
        filterOptions
          ? filterCollectionItems(mergedOptions, query)
          : mergedOptions,
      [filterOptions, mergedOptions, query],
    );
    const groupedOptions = React.useMemo(
      () => groupCollectionItems(filteredOptions),
      [filteredOptions],
    );
    const selectedOption = React.useMemo(
      () =>
        multiple
          ? undefined
          : selectedValue == null
            ? undefined
            : (optionMap.get(selectedValue) ??
              (latestCreatedOptionRef.current?.value === selectedValue
                ? latestCreatedOptionRef.current
                : undefined)),
      [multiple, optionMap, selectedValue],
    );
    const normalizedQuery = normalizeComboBoxValue(query);
    const hasExactMatch = React.useMemo(
      () =>
        normalizedQuery.length > 0 &&
        mergedOptions.some(
          (option) =>
            normalizeComboBoxValue(option.label) === normalizedQuery ||
            normalizeComboBoxValue(option.value) === normalizedQuery,
        ),
      [mergedOptions, normalizedQuery],
    );
    const showCreateOption =
      creatable && normalizedQuery.length > 0 && !loading && !hasExactMatch;
    const listItems = React.useMemo<ComboBoxListItem[]>(() => {
      const optionItems: ComboBoxListItem[] = filteredOptions.map((option) => ({
        kind: "option" as const,
        option,
        disabled: option.disabled,
      }));

      if (showCreateOption) {
        optionItems.push({
          kind: "create",
          query: query.trim(),
          disabled: creating,
        });
      }

      return optionItems;
    }, [creating, filteredOptions, query, showCreateOption]);
    const optionIndexMap = React.useMemo(() => {
      const map = new Map<string, number>();

      listItems.forEach((item, index) => {
        if (item.kind === "option") {
          map.set(item.option.value, index);
        }
      });

      return map;
    }, [listItems]);
    const createItemIndex = React.useMemo(
      () => listItems.findIndex((item) => item.kind === "create"),
      [listItems],
    );
    const triggerHasSelection = multiple
      ? selectedValues.length > 0
      : Boolean(selectedValue);
    const selectedLabels = React.useMemo(
      () =>
        multiple
          ? selectedValues.map(
              (currentValue) =>
                optionMap.get(currentValue)?.label ??
                (latestCreatedOptionRef.current?.value === currentValue
                  ? latestCreatedOptionRef.current.label
                  : currentValue),
            )
          : [],
      [multiple, optionMap, selectedValues],
    );
    const listStatusMessage = loading
      ? "Loading options."
      : listItems.length === 0
        ? "No options available."
        : `${listItems.length} option${
            listItems.length === 1 ? "" : "s"
          } available.${multiple ? ` ${selectedValues.length} selected.` : ""}`;
    const { refs, floatingStyles } = useAnchoredFloating({
      open,
      onOpenChange: setOpen,
      placement: "bottom-start",
      sameWidth: true,
    });

    const handleOptionSelect = React.useCallback(
      (option: ComboBoxOption) => {
        if (multiple) {
          const nextValues = selectedValues.includes(option.value)
            ? selectedValues.filter(
                (currentValue) => currentValue !== option.value,
              )
            : [...selectedValues, option.value];

          setSelectedValues(nextValues);
          setQuery("");
          window.requestAnimationFrame(() => inputRef.current?.focus());
          return;
        }

        setSelectedValue(option.value);
        setOpen(false);
      },
      [multiple, selectedValues, setQuery, setSelectedValue, setSelectedValues],
    );

    const handleCreate = React.useCallback(async () => {
      const trimmedQuery = query.trim();

      if (!trimmedQuery || creating) {
        return;
      }

      setCreating(true);

      try {
        const createdOption =
          (await onCreateOption?.(trimmedQuery)) ??
          (onCreateOption
            ? undefined
            : createDefaultOptionFromQuery(trimmedQuery));

        if (!createdOption) {
          return;
        }

        latestCreatedOptionRef.current = createdOption;
        setCreatedOptions((currentOptions) =>
          upsertCreatedOption(currentOptions, createdOption),
        );

        if (multiple) {
          const nextValues = selectedValues.includes(createdOption.value)
            ? selectedValues
            : [...selectedValues, createdOption.value];

          setSelectedValues(nextValues);
          setQuery("");
          window.requestAnimationFrame(() => inputRef.current?.focus());
          return;
        }

        setSelectedValue(createdOption.value);
        setQuery("");
        setOpen(false);
      } finally {
        setCreating(false);
      }
    }, [
      creating,
      multiple,
      onCreateOption,
      query,
      selectedValues,
      setQuery,
      setSelectedValue,
      setSelectedValues,
    ]);

    useFocusReturn(open);
    useDismissibleLayer({
      enabled: open,
      refs: dismissRefs,
      onDismiss: () => setOpen(false),
    });

    const { activeIndex, setActiveIndex, handleKeyDown, itemRefs, setItemRef } =
      useListNavigation({
        items: listItems,
        open,
        onClose: () => setOpen(false),
        onSelect: (item) => {
          if (item.kind === "create") {
            void handleCreate();
            return;
          }

          handleOptionSelect(item.option);
        },
        focusItemOnChange: false,
      });

    React.useEffect(() => {
      if (!open) {
        setQuery("");
        return;
      }

      window.requestAnimationFrame(() => inputRef.current?.focus());
    }, [open, setQuery]);

    React.useEffect(() => {
      if (!open) {
        return;
      }

      const preferredValue = multiple
        ? selectedValues.find((currentValue) =>
            optionIndexMap.has(currentValue),
          )
        : selectedValue;
      const selectedIndex =
        preferredValue == null
          ? -1
          : (optionIndexMap.get(preferredValue) ?? -1);
      const nextIndex =
        selectedIndex >= 0
          ? selectedIndex
          : listItems.findIndex((item) => !item.disabled);

      setActiveIndex(nextIndex);
    }, [
      listItems,
      multiple,
      open,
      optionIndexMap,
      selectedValue,
      selectedValues,
      setActiveIndex,
    ]);

    React.useEffect(() => {
      if (!open || activeIndex < 0) {
        return;
      }

      itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
    }, [activeIndex, itemRefs, open]);

    const handleSearchInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (
        multiple &&
        !query &&
        (event.key === "Backspace" || event.key === "Delete") &&
        selectedValues.length > 0
      ) {
        event.preventDefault();
        setSelectedValues(selectedValues.slice(0, -1));
        return;
      }

      handleKeyDown(event);
    };

    const clearSelection = () => {
      if (multiple) {
        setSelectedValues([]);
      } else {
        setSelectedValue(undefined);
      }

      setOpen(false);
      setQuery("");
    };

    const handleTriggerKeyDown = (
      event: React.KeyboardEvent<HTMLButtonElement>,
    ) => {
      if (disabled) {
        return;
      }

      switch (event.key) {
        case "ArrowDown":
        case "ArrowUp":
        case "Enter":
        case " ":
          event.preventDefault();
          setOpen(true);
          break;
        case "Backspace":
        case "Delete":
          if (clearable && triggerHasSelection) {
            event.preventDefault();
            clearSelection();
          }
          break;
        default:
          break;
      }
    };

    return (
      <Field
        label={label}
        labelId={labelId}
        description={description}
        helperText={helperText}
        errorText={errorText}
        error={error}
        required={required}
        disabled={disabled}
        htmlFor={generatedId}
        className={className}
        messageId={messageId}
        {...props}
      >
        <div className="relative">
          <div
            id={liveRegionId}
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
          >
            {listStatusMessage}
          </div>
          <button
            id={generatedId}
            ref={(node) => {
              triggerRef.current = node;
              refs.setReference(node);
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            type="button"
            role="combobox"
            aria-controls={open ? listboxId : undefined}
            aria-expanded={open}
            aria-haspopup="listbox"
            aria-invalid={error}
            aria-required={required || undefined}
            aria-describedby={joinIds(messageId, liveRegionId)}
            aria-labelledby={
              labelId ? `${labelId} ${generatedId}-value` : undefined
            }
            disabled={disabled}
            onClick={() => setOpen((currentOpen) => !currentOpen)}
            onKeyDown={handleTriggerKeyDown}
            className={cn(
              "flex w-full items-center justify-between gap-md rounded-lg border bg-surface-subtle text-left text-foreground transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
              sizing.trigger,
              error
                ? "border-error/50 focus:border-error focus:ring-2 focus:ring-error/20"
                : "border-default hover:border-strong focus:border-primary focus:ring-2 focus:ring-primary/20",
            )}
          >
            <span
              id={`${generatedId}-value`}
              className={cn(
                "flex min-w-0 flex-1 flex-wrap items-center gap-xs pr-4",
                !triggerHasSelection && "truncate",
              )}
            >
              {multiple ? (
                triggerHasSelection ? (
                  selectedLabels.map((selectedLabel, index) => (
                    <span
                      key={`${selectedValues[index]}-${index}`}
                      className={cn(
                        "max-w-full truncate rounded-full border border-default bg-surface px-sm py-[3px] font-medium text-foreground",
                        sizing.tag,
                      )}
                    >
                      {selectedLabel}
                    </span>
                  ))
                ) : (
                  <span className="truncate text-foreground-subtle">
                    {placeholder}
                  </span>
                )
              ) : (
                <span
                  className={cn(
                    "min-w-0 truncate",
                    selectedOption || selectedValue
                      ? "text-foreground"
                      : "text-foreground-subtle",
                  )}
                >
                  {selectedOption?.label ?? selectedValue ?? placeholder}
                </span>
              )}
            </span>
            <IconChevronDown
              size={18}
              className={cn(
                "pointer-events-none absolute top-1/2 -translate-y-1/2 text-foreground-subtle transition-transform",
                sizing.triggerIcon,
                open && "rotate-180",
              )}
            />
          </button>

          {clearable && triggerHasSelection && !disabled ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                clearSelection();
              }}
              className={cn(
                "absolute top-1/2 -translate-y-1/2 rounded-md p-[2px] text-foreground-subtle transition-colors hover:bg-surface-muted hover:text-foreground",
                sizing.clearButton,
              )}
              aria-label={multiple ? "Clear selections" : "Clear selection"}
            >
              <IconX size={14} />
            </button>
          ) : null}

          {name ? (
            multiple ? (
              selectedValues.map((currentValue) => (
                <input
                  key={currentValue}
                  type="hidden"
                  name={name}
                  value={currentValue}
                />
              ))
            ) : (
              <input type="hidden" name={name} value={selectedValue ?? ""} />
            )
          ) : null}

          {open ? (
            <FloatingPortal>
              <div
                ref={(node) => {
                  popoverRef.current = node;
                  refs.setFloating(node);
                }}
                style={floatingStyles}
                className="z-50 overflow-hidden rounded-xl border border-default bg-surface shadow-xl"
              >
                <div className="border-b border-default px-sm py-sm">
                  <div className="relative">
                    <label
                      htmlFor={`${generatedId}-search`}
                      className="sr-only"
                    >
                      Search options
                    </label>
                    <IconSearch
                      size={16}
                      className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-foreground-subtle"
                    />
                    <input
                      id={`${generatedId}-search`}
                      ref={inputRef}
                      type="text"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={handleSearchInputKeyDown}
                      placeholder={searchPlaceholder}
                      aria-controls={listboxId}
                      aria-describedby={joinIds(messageId, liveRegionId)}
                      aria-activedescendant={
                        activeIndex >= 0
                          ? `${generatedId}-option-${activeIndex}`
                          : undefined
                      }
                      className={cn(
                        "w-full rounded-lg border border-default bg-surface-subtle text-foreground transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary/20",
                        sizing.searchInput,
                      )}
                    />
                  </div>
                </div>

                <div
                  id={listboxId}
                  role="listbox"
                  aria-multiselectable={multiple || undefined}
                  aria-busy={loading || creating || undefined}
                  className="max-h-72 overflow-y-auto p-xs"
                >
                  {filteredOptions.length === 0 &&
                  !showCreateOption &&
                  !loading ? (
                    <div className="px-md py-lg text-sm text-foreground-muted">
                      {emptyState}
                    </div>
                  ) : (
                    groupedOptions.map((group, groupIndex) => {
                      const groupLabelId =
                        group.label != null
                          ? `${generatedId}-group-${groupIndex}`
                          : undefined;

                      return (
                        <div
                          key={group.label ?? `group-${groupIndex}`}
                          role="group"
                          aria-labelledby={groupLabelId}
                          className="py-xs"
                        >
                          {group.label ? (
                            <div
                              id={groupLabelId}
                              className="px-sm py-xs text-[10px] font-bold tracking-[0.14em] text-foreground-subtle uppercase"
                            >
                              {group.label}
                            </div>
                          ) : null}
                          <div className="space-y-[2px]">
                            {group.items.map((option) => {
                              const optionIndex =
                                optionIndexMap.get(option.value) ?? -1;
                              const isSelected = multiple
                                ? selectedValues.includes(option.value)
                                : option.value === selectedValue;
                              const isActive = optionIndex === activeIndex;

                              return (
                                <button
                                  key={option.value}
                                  id={`${generatedId}-option-${optionIndex}`}
                                  ref={
                                    optionIndex >= 0
                                      ? setItemRef(optionIndex)
                                      : undefined
                                  }
                                  type="button"
                                  role="option"
                                  aria-selected={isSelected}
                                  disabled={option.disabled}
                                  onMouseEnter={() => {
                                    if (optionIndex >= 0) {
                                      setActiveIndex(optionIndex);
                                    }
                                  }}
                                  onClick={() => handleOptionSelect(option)}
                                  className={cn(
                                    "flex w-full items-start justify-between gap-md rounded-lg px-sm py-sm text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-50",
                                    isActive
                                      ? "bg-surface-muted"
                                      : "hover:bg-surface-subtle",
                                  )}
                                >
                                  <span className="flex min-w-0 items-start gap-sm">
                                    {option.icon ? (
                                      <span className="mt-[2px] shrink-0 text-foreground-subtle">
                                        {option.icon}
                                      </span>
                                    ) : null}
                                    <span className="min-w-0">
                                      <span className="block truncate font-medium text-foreground">
                                        {option.label}
                                      </span>
                                      {option.description ? (
                                        <span className="mt-xs block text-xs text-foreground-muted">
                                          {option.description}
                                        </span>
                                      ) : null}
                                    </span>
                                  </span>
                                  <span className="flex items-center gap-xs">
                                    {option.shortcut ? (
                                      <span className="text-[10px] tracking-wide text-foreground-subtle uppercase">
                                        {option.shortcut}
                                      </span>
                                    ) : null}
                                    {isSelected ? (
                                      <IconCheck
                                        size={16}
                                        className="shrink-0 text-primary"
                                      />
                                    ) : null}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {showCreateOption ? (
                    <button
                      id={`${generatedId}-option-${createItemIndex}`}
                      ref={
                        createItemIndex >= 0
                          ? setItemRef(createItemIndex)
                          : undefined
                      }
                      type="button"
                      role="option"
                      aria-selected={false}
                      disabled={creating}
                      onMouseEnter={() => {
                        if (createItemIndex >= 0) {
                          setActiveIndex(createItemIndex);
                        }
                      }}
                      onClick={() => void handleCreate()}
                      className={cn(
                        "mt-[2px] flex w-full items-center justify-between gap-md rounded-lg px-sm py-sm text-left text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60",
                        createItemIndex === activeIndex
                          ? "bg-surface-muted"
                          : "hover:bg-surface-subtle",
                      )}
                    >
                      <span className="flex min-w-0 items-center gap-sm">
                        {creating ? (
                          <IconLoader2
                            size={16}
                            className="shrink-0 animate-spin text-primary"
                          />
                        ) : (
                          <IconPlus
                            size={16}
                            className="shrink-0 text-primary"
                          />
                        )}
                        <span className="min-w-0 truncate font-medium text-foreground">
                          {creating
                            ? `Creating "${query.trim()}"...`
                            : (createOptionLabel?.(query.trim()) ??
                              `Create "${query.trim()}"`)}
                        </span>
                      </span>
                    </button>
                  ) : null}

                  {loading ? (
                    <div className="flex items-center gap-sm px-md py-md text-sm text-foreground-muted">
                      <IconLoader2
                        size={16}
                        className="shrink-0 animate-spin text-primary"
                      />
                      <span>{loadingText}</span>
                    </div>
                  ) : null}
                </div>
              </div>
            </FloatingPortal>
          ) : null}
        </div>
      </Field>
    );
  },
);

ComboBox.displayName = "ComboBox";
