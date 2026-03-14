import React from "react";
import { DayPicker, type DateRange, type Matcher } from "react-day-picker";
import { IconCalendar, IconChevronDown, IconChevronLeft, IconChevronRight, IconX } from "@tabler/icons-react";
import { FloatingPortal } from "../../internal/FloatingPortal";
import { useAnchoredFloating } from "../../internal/useAnchoredFloating";
import { useControllableState } from "../../internal/useControllableState";
import { useDismissibleLayer } from "../../internal/useDismissibleLayer";
import { useFocusReturn } from "../../internal/useFocusReturn";
import { cn } from "../../utils/cn";
import { Field } from "./Field";

export type DateRangeValue = DateRange;

type DatePickerMode = "single" | "range";

const datePickerSizeClassMap = {
  xs: {
    trigger: "h-6 py-xs pr-10 pl-sm text-[11px]",
    clearButton: "right-7",
    triggerIcon: "right-2",
  },
  sm: {
    trigger: "h-8 py-xs pr-10 pl-sm text-xs",
    clearButton: "right-8",
    triggerIcon: "right-2.5",
  },
  md: {
    trigger: "min-h-10 py-sm pr-11 pl-md text-sm",
    clearButton: "right-9",
    triggerIcon: "right-3",
  },
} as const;

interface DatePickerBaseProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  size?: keyof typeof datePickerSizeClassMap;
  numberOfMonths?: number;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Matcher | Matcher[];
  defaultMonth?: Date;
  formatValue?: (value: Date | DateRangeValue | undefined, mode: DatePickerMode) => string;
}

interface DatePickerSingleProps extends DatePickerBaseProps {
  mode?: "single";
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (value: Date | undefined) => void;
}

interface DatePickerRangeProps extends DatePickerBaseProps {
  mode: "range";
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  onValueChange?: (value: DateRangeValue | undefined) => void;
  min?: number;
  max?: number;
  excludeDisabled?: boolean;
  resetOnSelect?: boolean;
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps;

const calendarClassNames = {
  root: "p-md",
  months: "flex flex-col gap-lg sm:flex-row",
  month: "space-y-md",
  month_caption: "flex items-center justify-between gap-md",
  caption_label: "text-sm font-semibold text-foreground",
  nav: "flex items-center gap-xs",
  button_previous:
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-default bg-surface text-foreground-muted transition-colors hover:bg-surface-subtle hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20",
  button_next:
    "inline-flex h-8 w-8 items-center justify-center rounded-md border border-default bg-surface text-foreground-muted transition-colors hover:bg-surface-subtle hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20",
  weekdays: "grid grid-cols-7 gap-xs",
  weekday: "text-center text-[10px] font-bold tracking-[0.14em] text-foreground-subtle uppercase",
  week: "mt-xs grid grid-cols-7 gap-xs",
  day: "flex items-center justify-center",
  day_button:
    "inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm text-foreground transition-colors hover:bg-surface-muted focus:outline-none focus:ring-2 focus:ring-primary/20",
  selected: "bg-primary text-white hover:bg-primary",
  today: "border border-primary/30 text-primary",
  outside: "text-foreground-subtle opacity-60",
  disabled: "cursor-not-allowed opacity-35",
  range_start: "bg-primary text-white hover:bg-primary",
  range_end: "bg-primary text-white hover:bg-primary",
  range_middle: "bg-primary/10 text-primary",
} as const;

function getDefaultFormatter(value: Date | DateRangeValue | undefined, mode: DatePickerMode) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (!value) {
    return mode === "range" ? "Pick a date range..." : "Pick a date...";
  }

  if (mode === "range") {
    const range = value as DateRangeValue;

    if (!range.from && !range.to) {
      return "Pick a date range...";
    }
    if (range.from && !range.to) {
      return formatter.format(range.from);
    }
    if (range.from && range.to) {
      return `${formatter.format(range.from)} - ${formatter.format(range.to)}`;
    }

    return "Pick a date range...";
  }

  return formatter.format(value as Date);
}

function getInitialMonth(mode: DatePickerMode, value: Date | DateRangeValue | undefined, defaultMonth?: Date) {
  if (defaultMonth) {
    return defaultMonth;
  }

  if (mode === "range") {
    const rangeValue = value as DateRangeValue | undefined;
    return rangeValue?.from ?? rangeValue?.to ?? new Date();
  }

  return (value as Date | undefined) ?? new Date();
}

function getDisabledMatchers(minDate?: Date, maxDate?: Date, disabledDates?: Matcher | Matcher[]) {
  const disabled: Matcher[] = [];

  if (minDate) {
    disabled.push({ before: minDate });
  }

  if (maxDate) {
    disabled.push({ after: maxDate });
  }

  if (disabledDates) {
    if (Array.isArray(disabledDates)) {
      disabled.push(...disabledDates);
    } else {
      disabled.push(disabledDates);
    }
  }

  return disabled.length > 0 ? disabled : undefined;
}

export const DatePicker = React.forwardRef<HTMLButtonElement, DatePickerProps>((props, ref) => {
  const {
    label,
    description,
    helperText,
    errorText,
    error = false,
    required = false,
    placeholder,
    disabled = false,
    clearable = true,
    size = "md",
    numberOfMonths = 1,
    minDate,
    maxDate,
    disabledDates,
    defaultMonth,
    formatValue = getDefaultFormatter,
    className,
    id,
  } = props;
  const mode: DatePickerMode = props.mode ?? "single";
  const generatedId = id || React.useId();
  const labelId = label ? `${generatedId}-label` : undefined;
  const messageId = helperText || errorText ? `${generatedId}-message` : undefined;
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  const sizing = datePickerSizeClassMap[size];
  const dismissRefs = React.useMemo(() => [triggerRef, popoverRef], []);
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = useControllableState<Date | DateRangeValue | undefined>({
    value: props.value as Date | DateRangeValue | undefined,
    defaultValue: props.defaultValue as Date | DateRangeValue | undefined,
    onChange: (nextValue) => {
      if (mode === "range") {
        (props as DatePickerRangeProps).onValueChange?.(nextValue as DateRangeValue | undefined);
      } else {
        (props as DatePickerSingleProps).onValueChange?.(nextValue as Date | undefined);
      }
    },
  });
  const { refs, floatingStyles } = useAnchoredFloating({
    open,
    onOpenChange: setOpen,
    placement: "bottom-start",
  });
  const disabledMatchers = React.useMemo(
    () => getDisabledMatchers(minDate, maxDate, disabledDates),
    [disabledDates, maxDate, minDate],
  );
  const displayValue =
    selectedValue == null
      ? (placeholder ?? (mode === "range" ? "Pick a date range..." : "Pick a date..."))
      : formatValue(selectedValue, mode);

  useFocusReturn(open);
  useDismissibleLayer({
    enabled: open,
    refs: dismissRefs,
    onDismiss: () => setOpen(false),
  });

  React.useEffect(() => {
    if (!open) {
      return;
    }

    window.requestAnimationFrame(() => {
      const nextFocusTarget =
        popoverRef.current?.querySelector<HTMLButtonElement>("[aria-selected='true'], button:not([disabled])") ??
        popoverRef.current;

      nextFocusTarget?.focus();
    });
  }, [open]);

  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
      case "Enter":
      case " ":
        event.preventDefault();
        setOpen(true);
        break;
      case "Backspace":
      case "Delete":
        if (clearable && selectedValue) {
          event.preventDefault();
          setSelectedValue(undefined);
        }
        break;
      default:
        break;
    }
  };

  const handleSelectSingle = (nextValue: Date | undefined) => {
    setSelectedValue(nextValue);
    if (nextValue) {
      setOpen(false);
    }
  };

  const handleSelectRange = (nextValue: DateRangeValue | undefined) => {
    setSelectedValue(nextValue);
    if (nextValue?.from && nextValue?.to) {
      setOpen(false);
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
    >
      <div className="relative">
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
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={error}
          aria-required={required || undefined}
          aria-describedby={messageId}
          aria-labelledby={labelId}
          disabled={disabled}
          onClick={() => setOpen((currentOpen) => !currentOpen)}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            "flex w-full items-center gap-md rounded-lg border bg-surface-subtle text-left text-foreground transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",
            sizing.trigger,
            error
              ? "border-error/50 focus:border-error focus:ring-2 focus:ring-error/20"
              : "border-default hover:border-strong focus:border-primary focus:ring-2 focus:ring-primary/20",
          )}
        >
          <IconCalendar size={16} className="shrink-0 text-foreground-subtle" />
          <span className={cn("min-w-0 flex-1 truncate", selectedValue ? "text-foreground" : "text-foreground-subtle")}>
            {displayValue}
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

        {clearable && selectedValue && !disabled ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setSelectedValue(undefined);
              setOpen(false);
            }}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 rounded-md p-[2px] text-foreground-subtle transition-colors hover:bg-surface-muted hover:text-foreground",
              sizing.clearButton,
            )}
            aria-label="Clear date"
          >
            <IconX size={14} />
          </button>
        ) : null}

        {open ? (
          <FloatingPortal>
            <div
              ref={(node) => {
                popoverRef.current = node;
                refs.setFloating(node);
              }}
              style={floatingStyles}
              role="dialog"
              aria-modal="false"
              className="z-50 overflow-hidden rounded-2xl border border-default bg-surface shadow-xl"
            >
              {mode === "range" ? (
                <DayPicker
                  mode="range"
                  required={false}
                  showOutsideDays
                  defaultMonth={getInitialMonth(mode, selectedValue, defaultMonth)}
                  selected={selectedValue as DateRangeValue | undefined}
                  onSelect={handleSelectRange}
                  disabled={disabledMatchers}
                  numberOfMonths={numberOfMonths}
                  min={(props as DatePickerRangeProps).min}
                  max={(props as DatePickerRangeProps).max}
                  excludeDisabled={(props as DatePickerRangeProps).excludeDisabled}
                  resetOnSelect={(props as DatePickerRangeProps).resetOnSelect}
                  classNames={calendarClassNames}
                  components={{
                    Chevron: ({ orientation, ...iconProps }) =>
                      orientation === "left" ? (
                        <IconChevronLeft size={16} {...iconProps} />
                      ) : (
                        <IconChevronRight size={16} {...iconProps} />
                      ),
                  }}
                />
              ) : (
                <DayPicker
                  mode="single"
                  required={false}
                  showOutsideDays
                  defaultMonth={getInitialMonth(mode, selectedValue, defaultMonth)}
                  selected={selectedValue as Date | undefined}
                  onSelect={handleSelectSingle}
                  disabled={disabledMatchers}
                  numberOfMonths={numberOfMonths}
                  classNames={calendarClassNames}
                  components={{
                    Chevron: ({ orientation, ...iconProps }) =>
                      orientation === "left" ? (
                        <IconChevronLeft size={16} {...iconProps} />
                      ) : (
                        <IconChevronRight size={16} {...iconProps} />
                      ),
                  }}
                />
              )}
            </div>
          </FloatingPortal>
        ) : null}
      </div>
    </Field>
  );
});

DatePicker.displayName = "DatePicker";
