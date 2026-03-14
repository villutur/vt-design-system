import React from "react";
import { FloatingPortal } from "../../internal/FloatingPortal";
import { useAnchoredFloating } from "../../internal/useAnchoredFloating";
import { cn } from "../../utils/cn";

const placementMap = {
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
} as const;

function mergeDescribedBy(
  currentValue: unknown,
  nextValue: string | undefined,
) {
  const values = [
    typeof currentValue === "string" ? currentValue : undefined,
    nextValue,
  ].filter(Boolean);

  return values.length > 0 ? values.join(" ") : undefined;
}

function composeEventHandlers<E extends React.SyntheticEvent>(
  userHandler: ((event: E) => void) | undefined,
  internalHandler: (event: E) => void,
) {
  return (event: E) => {
    userHandler?.(event);

    if (!event.defaultPrevented) {
      internalHandler(event);
    }
  };
}

export interface TooltipProps extends Omit<
  React.HTMLAttributes<HTMLSpanElement>,
  "content"
> {
  content: React.ReactNode;
  delay?: number;
  position?: keyof typeof placementMap;
}

export const Tooltip = React.forwardRef<HTMLSpanElement, TooltipProps>(
  (
    {
      className,
      children,
      content,
      delay = 200,
      position = "top",
      onMouseEnter,
      onMouseLeave,
      onFocusCapture,
      onBlurCapture,
      onKeyDownCapture,
      ...props
    },
    ref,
  ) => {
    const tooltipId = React.useId();
    const triggerRef = React.useRef<HTMLSpanElement | null>(null);
    const contentRef = React.useRef<HTMLDivElement | null>(null);
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
    const [open, setOpen] = React.useState(false);
    const { refs, floatingStyles } = useAnchoredFloating({
      open,
      placement: placementMap[position],
      offsetValue: 10,
    });

    const clearOpenTimeout = React.useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }, []);

    const scheduleOpen = React.useCallback(() => {
      clearOpenTimeout();
      timeoutRef.current = setTimeout(() => setOpen(true), delay);
    }, [clearOpenTimeout, delay]);

    const closeTooltip = React.useCallback(() => {
      clearOpenTimeout();
      setOpen(false);
    }, [clearOpenTimeout]);

    React.useEffect(() => clearOpenTimeout, [clearOpenTimeout]);

    const child = React.isValidElement(children)
      ? (() => {
          const childElement = children as React.ReactElement<
            Record<string, unknown>
          >;
          const existingDescribedBy = childElement.props["aria-describedby"];

          return React.cloneElement(childElement, {
            "aria-describedby": mergeDescribedBy(
              existingDescribedBy,
              open ? tooltipId : undefined,
            ),
          });
        })()
      : children;

    return (
      <span
        ref={(node) => {
          triggerRef.current = node;
          refs.setReference(node);
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className="inline-flex"
        data-state={open ? "open" : "closed"}
        onMouseEnter={composeEventHandlers(onMouseEnter, scheduleOpen)}
        onMouseLeave={composeEventHandlers(onMouseLeave, closeTooltip)}
        onFocusCapture={composeEventHandlers(onFocusCapture, scheduleOpen)}
        onBlurCapture={composeEventHandlers(onBlurCapture, closeTooltip)}
        onKeyDownCapture={composeEventHandlers(onKeyDownCapture, (event) => {
          if (event.key === "Escape") {
            closeTooltip();
          }
        })}
        {...props}
      >
        {child}
        {open ? (
          <FloatingPortal>
            <div
              id={tooltipId}
              ref={(node) => {
                contentRef.current = node;
                refs.setFloating(node);
              }}
              role="tooltip"
              style={floatingStyles}
              data-state={open ? "open" : "closed"}
              data-side={position}
              className={cn(
                "animate-in fade-in-0 zoom-in-95 z-50 max-w-[18rem] rounded-lg bg-foreground px-md py-sm text-xs text-foreground-inverse shadow-lg",
                className,
              )}
            >
              {content}
            </div>
          </FloatingPortal>
        ) : null}
      </span>
    );
  },
);

Tooltip.displayName = "Tooltip";
