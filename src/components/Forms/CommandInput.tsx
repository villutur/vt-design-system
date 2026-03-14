import React from "react";
import { IconArrowRight, IconHistory, IconLoader2, IconSearch } from "@tabler/icons-react";
import { FloatingPortal } from "../../internal/FloatingPortal";
import { filterCollectionItems, groupCollectionItems, type SearchableCollectionItem } from "../../internal/collection";
import { useAnchoredFloating } from "../../internal/useAnchoredFloating";
import { useControllableState } from "../../internal/useControllableState";
import { useDismissibleLayer } from "../../internal/useDismissibleLayer";
import { useListNavigation } from "../../internal/useListNavigation";
import { cn } from "../../utils/cn";
import { Button, type ButtonVariant } from "./Button";
import { Field } from "./Field";

const commandInputSizeClassMap = {
  sm: {
    textarea: "px-sm py-sm text-xs",
    footer: "px-sm py-xs",
    shortcut: "text-[10px]",
    menuHeader: "px-sm py-xs",
    menuItem: "px-sm py-sm",
  },
  md: {
    textarea: "px-md py-md text-sm",
    footer: "px-md py-sm",
    shortcut: "text-xs",
    menuHeader: "px-md py-sm",
    menuItem: "px-md py-md",
  },
} as const;

type CommandInputMenuMode = "history" | "slash";

export interface CommandInputHistoryItem {
  id?: string;
  value: string;
  label?: string;
  description?: React.ReactNode;
  keywords?: string[];
  disabled?: boolean;
}

export interface CommandInputSlashCommand {
  value: string;
  label: string;
  description?: React.ReactNode;
  keywords?: string[];
  icon?: React.ReactNode;
  disabled?: boolean;
  group?: string;
  shortcut?: string;
  insertText?: string;
  insertValue?: string;
}

interface NormalizedCommandInputHistoryItem extends SearchableCollectionItem {
  id: string;
  historyValue: string;
  originalIndex: number;
}

interface NormalizedCommandInputSlashCommand extends CommandInputSlashCommand, SearchableCollectionItem {
  originalIndex: number;
}

interface CommandInputMenuItemBase {
  disabled?: boolean;
}

interface CommandInputHistoryMenuItem extends CommandInputMenuItemBase {
  kind: "history";
  item: NormalizedCommandInputHistoryItem;
}

interface CommandInputSlashMenuItem extends CommandInputMenuItemBase {
  kind: "slash";
  item: NormalizedCommandInputSlashCommand;
}

type CommandInputMenuItem = CommandInputHistoryMenuItem | CommandInputSlashMenuItem;

function joinIds(...ids: Array<string | undefined>) {
  return ids.filter(Boolean).join(" ") || undefined;
}

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function isPromiseLike(value: unknown): value is Promise<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "then" in value &&
    typeof (value as Promise<unknown>).then === "function"
  );
}

function getFirstLine(value: string) {
  return value.split(/\r?\n/, 1)[0] ?? value;
}

function normalizeHistoryItem(
  item: string | CommandInputHistoryItem,
  index: number,
): NormalizedCommandInputHistoryItem {
  if (typeof item === "string") {
    const firstLine = getFirstLine(item);

    return {
      id: `history-${index}`,
      value: item,
      historyValue: item,
      label: firstLine,
      description: firstLine !== item ? "Multiline history entry" : undefined,
      originalIndex: index,
    };
  }

  return {
    id: item.id ?? `history-${index}`,
    value: item.value,
    historyValue: item.value,
    label: item.label ?? getFirstLine(item.value),
    description: item.description,
    keywords: item.keywords,
    disabled: item.disabled,
    originalIndex: index,
  };
}

function normalizeSlashCommand(command: CommandInputSlashCommand, index: number): NormalizedCommandInputSlashCommand {
  return {
    ...command,
    insertText: command.insertText ?? command.insertValue,
    originalIndex: index,
  };
}

function getSlashQuery(value: string) {
  const trimmedStart = value.trimStart();

  if (!trimmedStart.startsWith("/")) {
    return null;
  }

  const firstLine = trimmedStart.split(/\r?\n/, 1)[0] ?? trimmedStart;

  if (/\s/.test(firstLine)) {
    return null;
  }

  return firstLine.slice(1);
}

function isCaretAtPromptStart(textarea: HTMLTextAreaElement) {
  const selectionStart = textarea.selectionStart ?? 0;
  const selectionEnd = textarea.selectionEnd ?? selectionStart;

  return selectionStart === 0 && selectionEnd === 0;
}

function replaceLeadingSlashToken(currentValue: string, command: CommandInputSlashCommand) {
  const tokenMatch = currentValue.match(/^(\s*)\/[^\s\r\n]*/);
  const leadingWhitespace = tokenMatch?.[1] ?? "";
  const insertText = command.insertText ?? command.insertValue ?? `/${command.value}`;

  if (!tokenMatch) {
    return `${leadingWhitespace}${insertText.trimEnd()} `;
  }

  const remainder = currentValue.slice(tokenMatch[0].length);
  const needsSeparator = remainder.length === 0 || !/^\s/.test(remainder);

  return `${leadingWhitespace}${insertText.trimEnd()}${needsSeparator ? " " : ""}${remainder}`;
}

function focusTextareaAtEnd(textarea: HTMLTextAreaElement | null) {
  if (!textarea) {
    return;
  }

  textarea.focus();

  const nextPosition = textarea.value.length;
  textarea.setSelectionRange(nextPosition, nextPosition);
}

function getLastEnabledIndex<T extends { disabled?: boolean }>(items: T[]) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (!items[index]?.disabled) {
      return index;
    }
  }

  return -1;
}

export interface CommandInputProps extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "defaultValue" | "onChange" | "onSubmit" | "size" | "value"
> {
  value?: string;
  defaultValue?: string;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onValueChange?: (value: string) => void;
  onSubmit?: (value: string) => void | Promise<void>;
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  required?: boolean;
  size?: keyof typeof commandInputSizeClassMap;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  submitLabel?: React.ReactNode;
  submitShortcutHint?: React.ReactNode;
  submitButtonVariant?: ButtonVariant;
  submitDisabled?: boolean;
  showShortcutHint?: boolean;
  clearAfterSubmit?: boolean;
  actions?: React.ReactNode;
  shellClassName?: string;
  textareaClassName?: string;
  isSubmitting?: boolean;
  history?: Array<string | CommandInputHistoryItem>;
  historyEmptyState?: React.ReactNode;
  onHistorySelect?: (item: CommandInputHistoryItem, index: number) => void;
  slashCommands?: CommandInputSlashCommand[];
  slashCommandsEmptyState?: React.ReactNode;
  onSlashCommandSelect?: (command: CommandInputSlashCommand, index: number) => void;
}

export const CommandInput = React.forwardRef<HTMLTextAreaElement, CommandInputProps>(
  (
    {
      value,
      defaultValue = "",
      onValueChange,
      onSubmit,
      label,
      description,
      helperText,
      errorText,
      error = false,
      required = false,
      disabled = false,
      size = "md",
      minRows = 4,
      maxRows = 10,
      autoResize = true,
      submitLabel = "Run",
      submitShortcutHint = "Ctrl/Cmd + Enter",
      submitButtonVariant = "primary",
      submitDisabled,
      showShortcutHint = true,
      clearAfterSubmit = false,
      actions,
      shellClassName,
      textareaClassName,
      isSubmitting,
      className,
      id,
      onChange,
      onKeyDown,
      rows,
      history = [],
      historyEmptyState = "No history entries match the current value.",
      onHistorySelect,
      slashCommands = [],
      slashCommandsEmptyState = "No slash commands match the current query.",
      onSlashCommandSelect,
      ...textareaProps
    },
    ref,
  ) => {
    const generatedId = id || React.useId();
    const labelId = label ? `${generatedId}-label` : undefined;
    const shortcutHintId = showShortcutHint && onSubmit ? `${generatedId}-shortcut-hint` : undefined;
    const liveRegionId = `${generatedId}-live-region`;
    const messageId = helperText || errorText ? `${generatedId}-message` : undefined;
    const listboxId = `${generatedId}-listbox`;
    const shellRef = React.useRef<HTMLDivElement | null>(null);
    const menuRef = React.useRef<HTMLDivElement | null>(null);
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const dismissRefs = React.useMemo(() => [shellRef, menuRef], []);
    const [currentValue, setCurrentValue] = useControllableState<string>({
      value,
      defaultValue,
      onChange: onValueChange,
    });
    const [internalSubmitting, setInternalSubmitting] = React.useState(false);
    const [openMenu, setOpenMenu] = React.useState<CommandInputMenuMode | null>(null);
    const sizing = commandInputSizeClassMap[size];
    const submitting = isSubmitting ?? internalSubmitting;
    const normalizedHistory = React.useMemo(() => history.map(normalizeHistoryItem), [history]);
    const normalizedSlashCommands = React.useMemo(() => slashCommands.map(normalizeSlashCommand), [slashCommands]);
    const filteredHistory = React.useMemo(
      () => filterCollectionItems(normalizedHistory, currentValue),
      [currentValue, normalizedHistory],
    );
    const slashQuery = React.useMemo(() => getSlashQuery(currentValue), [currentValue]);
    const filteredSlashCommands = React.useMemo(
      () =>
        slashQuery === null ? normalizedSlashCommands : filterCollectionItems(normalizedSlashCommands, slashQuery),
      [normalizedSlashCommands, slashQuery],
    );
    const groupedSlashCommands = React.useMemo(
      () => groupCollectionItems(filteredSlashCommands),
      [filteredSlashCommands],
    );
    const menuItems = React.useMemo<CommandInputMenuItem[]>(() => {
      if (openMenu === "history") {
        return filteredHistory.map((item) => ({
          kind: "history",
          item,
          disabled: item.disabled,
        }));
      }

      if (openMenu === "slash") {
        return filteredSlashCommands.map((item) => ({
          kind: "slash",
          item,
          disabled: item.disabled,
        }));
      }

      return [];
    }, [filteredHistory, filteredSlashCommands, openMenu]);
    const slashCommandIndexMap = React.useMemo(() => {
      const map = new Map<string, number>();

      filteredSlashCommands.forEach((command, index) => {
        map.set(command.value, index);
      });

      return map;
    }, [filteredSlashCommands]);
    const resolvedSubmitDisabled = submitDisabled ?? (!currentValue.trim() || disabled || submitting);
    const listStatusMessage =
      openMenu === "history"
        ? filteredHistory.length === 0
          ? "No history entries available."
          : `${filteredHistory.length} history entr${filteredHistory.length === 1 ? "y" : "ies"} available.`
        : openMenu === "slash"
          ? filteredSlashCommands.length === 0
            ? "No slash commands available."
            : `${filteredSlashCommands.length} slash command${filteredSlashCommands.length === 1 ? "" : "s"} available.`
          : submitting
            ? "Submitting command."
            : resolvedSubmitDisabled
              ? "Command input is not ready to submit."
              : "Command input is ready to submit.";
    const { refs, floatingStyles } = useAnchoredFloating({
      open: openMenu !== null,
      onOpenChange: (nextOpen) => {
        if (!nextOpen) {
          setOpenMenu(null);
        }
      },
      placement: "bottom-start",
      sameWidth: true,
    });
    const {
      activeIndex,
      handleKeyDown: handleListNavigationKeyDown,
      itemRefs,
      setItemRef,
      setActiveIndex,
    } = useListNavigation<CommandInputMenuItem>({
      items: menuItems,
      open: openMenu !== null,
      onSelect: (item) => {
        if (item.kind === "history") {
          setCurrentValue(item.item.historyValue);
          setOpenMenu(null);
          onHistorySelect?.(
            {
              id: item.item.id,
              value: item.item.historyValue,
              label: item.item.label,
              description: item.item.description,
              keywords: item.item.keywords,
              disabled: item.item.disabled,
            },
            item.item.originalIndex,
          );
          window.requestAnimationFrame(() => focusTextareaAtEnd(textareaRef.current));
          return;
        }

        const nextValue = replaceLeadingSlashToken(currentValue, item.item);

        setCurrentValue(nextValue);
        setOpenMenu(null);
        onSlashCommandSelect?.(item.item, item.item.originalIndex);
        window.requestAnimationFrame(() => focusTextareaAtEnd(textareaRef.current));
      },
      onClose: () => {
        setOpenMenu(null);
        window.requestAnimationFrame(() => focusTextareaAtEnd(textareaRef.current));
      },
    });

    useDismissibleLayer({
      enabled: openMenu !== null,
      refs: dismissRefs,
      onDismiss: () => setOpenMenu(null),
    });

    React.useEffect(() => {
      if (openMenu === "slash" && (normalizedSlashCommands.length === 0 || slashQuery === null)) {
        setOpenMenu(null);
      }
    }, [normalizedSlashCommands.length, openMenu, slashQuery]);

    React.useEffect(() => {
      if (openMenu === null || activeIndex < 0) {
        return;
      }

      itemRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }, [activeIndex, itemRefs, openMenu]);

    const resizeTextarea = React.useCallback(() => {
      if (!autoResize || !textareaRef.current || typeof window === "undefined") {
        return;
      }

      const textarea = textareaRef.current;
      textarea.style.height = "auto";

      const computedStyle = window.getComputedStyle(textarea);
      const lineHeight = Number.parseFloat(computedStyle.lineHeight || "") || 20;
      const borderBox = textarea.offsetHeight - textarea.clientHeight;
      const minHeight = lineHeight * minRows + borderBox;
      const maxHeight = lineHeight * maxRows + borderBox;
      const nextHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);

      textarea.style.height = `${nextHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [autoResize, maxRows, minRows]);

    React.useLayoutEffect(() => {
      resizeTextarea();
    }, [currentValue, resizeTextarea]);

    const handleSubmit = React.useCallback(async () => {
      if (!onSubmit || resolvedSubmitDisabled) {
        return;
      }

      const nextValue = currentValue.trimEnd();

      try {
        if (isSubmitting === undefined) {
          setInternalSubmitting(true);
        }

        const result = onSubmit(nextValue);

        if (isPromiseLike(result)) {
          await result;
        }

        if (clearAfterSubmit) {
          setCurrentValue("");
        }
      } finally {
        if (isSubmitting === undefined) {
          setInternalSubmitting(false);
        }
      }
    }, [clearAfterSubmit, currentValue, isSubmitting, onSubmit, resolvedSubmitDisabled, setCurrentValue]);

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
      >
        <div className="relative">
          <div id={liveRegionId} className="sr-only" aria-live="polite" aria-atomic="true">
            {listStatusMessage}
          </div>

          <div
            ref={(node) => {
              shellRef.current = node;
              refs.setReference(node);
            }}
            className={cn(
              "overflow-hidden rounded-xl border bg-surface transition-colors",
              error ? "border-error/40" : "border-default",
              disabled && "opacity-70",
              shellClassName,
            )}
          >
            <textarea
              {...textareaProps}
              id={generatedId}
              ref={(node) => {
                textareaRef.current = node;
                assignRef(ref, node);
              }}
              rows={rows ?? minRows}
              value={currentValue}
              disabled={disabled}
              aria-invalid={error}
              aria-required={required || undefined}
              aria-describedby={joinIds(messageId, shortcutHintId, liveRegionId)}
              aria-labelledby={labelId}
              aria-busy={submitting || undefined}
              aria-controls={openMenu ? listboxId : undefined}
              aria-expanded={openMenu !== null}
              aria-activedescendant={
                openMenu !== null && activeIndex >= 0 ? `${generatedId}-option-${activeIndex}` : undefined
              }
              onChange={(event) => {
                const nextValue = event.target.value;

                setCurrentValue(nextValue);
                onChange?.(event);

                if (slashCommands.length > 0 && getSlashQuery(nextValue) !== null) {
                  setOpenMenu("slash");
                } else if (openMenu === "slash") {
                  setOpenMenu(null);
                }
              }}
              onKeyDown={(event) => {
                onKeyDown?.(event);

                if (event.defaultPrevented) {
                  return;
                }

                if (openMenu !== null) {
                  if (
                    event.key === "ArrowDown" ||
                    event.key === "ArrowUp" ||
                    event.key === "Home" ||
                    event.key === "End" ||
                    event.key === "Enter" ||
                    event.key === "Escape"
                  ) {
                    handleListNavigationKeyDown(event);

                    if (!event.defaultPrevented && event.key === "Enter") {
                      event.preventDefault();
                    }

                    return;
                  }
                }

                if (
                  history.length > 0 &&
                  event.key === "ArrowUp" &&
                  !event.altKey &&
                  !event.ctrlKey &&
                  !event.metaKey &&
                  textareaRef.current &&
                  isCaretAtPromptStart(textareaRef.current) &&
                  currentValue.trim().length === 0
                ) {
                  event.preventDefault();
                  setOpenMenu("history");
                  setActiveIndex(getLastEnabledIndex(filteredHistory));
                  return;
                }

                if (slashCommands.length > 0 && event.key === "ArrowDown" && slashQuery !== null) {
                  event.preventDefault();
                  setOpenMenu("slash");
                  return;
                }

                if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
                  event.preventDefault();
                  void handleSubmit();
                }
              }}
              className={cn(
                "w-full resize-none bg-transparent align-top text-foreground outline-none placeholder:text-foreground-subtle",
                "focus:ring-0",
                sizing.textarea,
                textareaClassName,
              )}
            />

            {(showShortcutHint || actions || onSubmit) && (
              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-sm border-t border-default bg-surface-subtle",
                  sizing.footer,
                )}
              >
                {showShortcutHint ? (
                  <span id={shortcutHintId} className={cn("text-foreground-subtle", sizing.shortcut)}>
                    {submitShortcutHint}
                  </span>
                ) : (
                  <span />
                )}

                <div className="flex items-center gap-sm">
                  {actions}
                  {onSubmit ? (
                    <Button
                      type="button"
                      size={size === "sm" ? "sm" : "md"}
                      variant={submitButtonVariant}
                      disabled={resolvedSubmitDisabled}
                      onClick={() => void handleSubmit()}
                      rightIcon={
                        submitting ? <IconLoader2 size={16} className="animate-spin" /> : <IconArrowRight size={16} />
                      }
                    >
                      {submitLabel}
                    </Button>
                  ) : null}
                </div>
              </div>
            )}
          </div>

          {openMenu !== null ? (
            <FloatingPortal>
              <div
                ref={(node) => {
                  menuRef.current = node;
                  refs.setFloating(node);
                }}
                style={floatingStyles}
                className="z-50 overflow-hidden rounded-xl border border-default bg-surface shadow-xl"
              >
                <div
                  className={cn(
                    "flex items-center gap-sm border-b border-default bg-surface-subtle text-xs font-semibold tracking-[0.14em] text-foreground-subtle uppercase",
                    sizing.menuHeader,
                  )}
                >
                  {openMenu === "history" ? (
                    <>
                      <IconHistory size={14} />
                      History
                    </>
                  ) : (
                    <>
                      <IconSearch size={14} />
                      Slash commands
                    </>
                  )}
                </div>

                <div id={listboxId} role="listbox" className="max-h-72 overflow-auto py-xs">
                  {openMenu === "history" ? (
                    filteredHistory.length > 0 ? (
                      filteredHistory.map((item, index) => {
                        const active = index === activeIndex;

                        return (
                          <button
                            key={item.id}
                            id={`${generatedId}-option-${index}`}
                            type="button"
                            role="option"
                            aria-selected={active}
                            disabled={item.disabled}
                            ref={setItemRef(index)}
                            onMouseEnter={() => setActiveIndex(index)}
                            onClick={() => {
                              setCurrentValue(item.historyValue);
                              setOpenMenu(null);
                              onHistorySelect?.(
                                {
                                  id: item.id,
                                  value: item.historyValue,
                                  label: item.label,
                                  description: item.description,
                                  keywords: item.keywords,
                                  disabled: item.disabled,
                                },
                                item.originalIndex,
                              );
                              window.requestAnimationFrame(() => focusTextareaAtEnd(textareaRef.current));
                            }}
                            className={cn(
                              "flex w-full items-start gap-sm text-left transition-colors",
                              sizing.menuItem,
                              active ? "bg-primary/10 text-foreground" : "text-foreground hover:bg-surface-subtle",
                              item.disabled && "cursor-not-allowed opacity-50",
                            )}
                          >
                            <IconHistory size={14} className="mt-[3px] shrink-0 text-foreground-subtle" />
                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-sm font-medium">{item.label}</span>
                              <span className="mt-xs line-clamp-2 block text-xs text-foreground-subtle">
                                {item.description ?? item.historyValue}
                              </span>
                            </span>
                          </button>
                        );
                      })
                    ) : (
                      <div className={cn("px-md py-md text-sm text-foreground-muted", sizing.menuItem)}>
                        {historyEmptyState}
                      </div>
                    )
                  ) : filteredSlashCommands.length > 0 ? (
                    groupedSlashCommands.map((group) => (
                      <div key={group.label ?? "ungrouped"}>
                        {group.label ? (
                          <div className="px-md pt-sm pb-xs text-[11px] font-semibold tracking-[0.14em] text-foreground-subtle uppercase">
                            {group.label}
                          </div>
                        ) : null}

                        {group.items.map((command) => {
                          const index = slashCommandIndexMap.get(command.value) ?? -1;
                          const active = index === activeIndex;

                          return (
                            <button
                              key={command.value}
                              id={`${generatedId}-option-${index}`}
                              type="button"
                              role="option"
                              aria-selected={active}
                              disabled={command.disabled}
                              ref={setItemRef(index)}
                              onMouseEnter={() => setActiveIndex(index)}
                              onClick={() => {
                                setCurrentValue(replaceLeadingSlashToken(currentValue, command));
                                setOpenMenu(null);
                                onSlashCommandSelect?.(command, command.originalIndex);
                                window.requestAnimationFrame(() => focusTextareaAtEnd(textareaRef.current));
                              }}
                              className={cn(
                                "flex w-full items-start gap-sm text-left transition-colors",
                                sizing.menuItem,
                                active ? "bg-primary/10 text-foreground" : "text-foreground hover:bg-surface-subtle",
                                command.disabled && "cursor-not-allowed opacity-50",
                              )}
                            >
                              <span className="mt-[2px] shrink-0 text-foreground-subtle">
                                {command.icon ?? <IconSearch size={14} />}
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-medium">{command.label}</span>
                                {command.description ? (
                                  <span className="mt-xs line-clamp-2 block text-xs text-foreground-subtle">
                                    {command.description}
                                  </span>
                                ) : null}
                              </span>
                              {command.shortcut ? (
                                <span className="shrink-0 text-xs text-foreground-subtle">{command.shortcut}</span>
                              ) : null}
                            </button>
                          );
                        })}
                      </div>
                    ))
                  ) : (
                    <div className={cn("px-md py-md text-sm text-foreground-muted", sizing.menuItem)}>
                      {slashCommandsEmptyState}
                    </div>
                  )}
                </div>
              </div>
            </FloatingPortal>
          ) : null}
        </div>
      </Field>
    );
  },
);

CommandInput.displayName = "CommandInput";
