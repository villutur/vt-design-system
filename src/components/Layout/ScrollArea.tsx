import React from "react";
import { useControllableState } from "../../internal/useControllableState";
import { cn } from "../../utils/cn";

const DEFAULT_FOLLOW_TAIL_THRESHOLD = 16;
const FOLLOW_BREAK_SCROLL_DELTA = 8;

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (typeof ref === "function") {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Maximum height before scrolling kicks in */
  maxHeight?: string | number;
  /** Whether content growth should keep the viewport pinned to the tail */
  followTail?: boolean;
  /** Initial follow-tail state for uncontrolled usage */
  defaultFollowTail?: boolean;
  /** Called when follow-tail state changes */
  onFollowTailChange?: (followTail: boolean) => void;
  /** Threshold, in pixels, used to decide whether the viewport is at the tail */
  followTailThreshold?: number;
  /** Called when the viewport enters or leaves the bottom threshold */
  onAtBottomChange?: (atBottom: boolean) => void;
}

export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      maxHeight,
      followTail,
      defaultFollowTail = false,
      onFollowTailChange,
      followTailThreshold = DEFAULT_FOLLOW_TAIL_THRESHOLD,
      onAtBottomChange,
      style,
      className,
      children,
      onScroll,
      ...props
    },
    ref,
  ) => {
    const scrollElementRef = React.useRef<HTMLDivElement | null>(null);
    const previousMetricsRef = React.useRef({
      scrollHeight: 0,
      scrollTop: 0,
      clientHeight: 0,
    });
    const lastAtBottomRef = React.useRef(true);
    const [currentFollowTail, setCurrentFollowTail] = useControllableState<boolean>({
      value: followTail,
      defaultValue: defaultFollowTail,
      onChange: onFollowTailChange,
    });
    const previousFollowTailRef = React.useRef(currentFollowTail);

    const updateAtBottomState = React.useCallback(
      (element: HTMLDivElement) => {
        const distanceFromBottom = element.scrollHeight - element.scrollTop - element.clientHeight;
        const atBottom = distanceFromBottom <= followTailThreshold;

        if (lastAtBottomRef.current !== atBottom) {
          lastAtBottomRef.current = atBottom;
          onAtBottomChange?.(atBottom);
        }

        return { atBottom, distanceFromBottom };
      },
      [followTailThreshold, onAtBottomChange],
    );

    React.useLayoutEffect(() => {
      const element = scrollElementRef.current;

      if (!element) {
        return;
      }

      const previousMetrics = previousMetricsRef.current;
      const contentHeightChanged =
        element.scrollHeight !== previousMetrics.scrollHeight || element.clientHeight !== previousMetrics.clientHeight;
      const followTailJustEnabled = currentFollowTail && !previousFollowTailRef.current;

      if (currentFollowTail && (contentHeightChanged || followTailJustEnabled)) {
        element.scrollTop = element.scrollHeight;
      }

      updateAtBottomState(element);

      previousMetricsRef.current = {
        scrollHeight: element.scrollHeight,
        scrollTop: element.scrollTop,
        clientHeight: element.clientHeight,
      };
      previousFollowTailRef.current = currentFollowTail;
    }, [children, currentFollowTail, maxHeight, updateAtBottomState]);

    return (
      <div
        ref={(node) => {
          scrollElementRef.current = node;
          assignRef(ref, node);
        }}
        className={cn(
          "overflow-auto",
          // Thin scrollbar utility – matches styles.css global scrollbar
          "scrollbar-thin",
          className,
        )}
        style={{
          maxHeight,
          ...style,
        }}
        onScroll={(event) => {
          const element = event.currentTarget;
          const previousScrollTop = previousMetricsRef.current.scrollTop;
          const nextScrollTop = element.scrollTop;
          const { distanceFromBottom } = updateAtBottomState(element);
          const scrolledUp = nextScrollTop < previousScrollTop - FOLLOW_BREAK_SCROLL_DELTA;

          if (currentFollowTail && scrolledUp && distanceFromBottom > followTailThreshold) {
            setCurrentFollowTail(false);
          } else if (!currentFollowTail && distanceFromBottom <= followTailThreshold) {
            setCurrentFollowTail(true);
          }

          previousMetricsRef.current = {
            scrollHeight: element.scrollHeight,
            scrollTop: nextScrollTop,
            clientHeight: element.clientHeight,
          };

          onScroll?.(event);
        }}
        {...props}
      >
        {children}
      </div>
    );
  },
);

ScrollArea.displayName = "ScrollArea";
