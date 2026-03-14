import {
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
  type UseFloatingReturn,
} from "@floating-ui/react";

export interface AnchoredFloatingOptions {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  offsetValue?: number;
  sameWidth?: boolean;
}

export function useAnchoredFloating({
  open,
  onOpenChange,
  placement = "bottom-start",
  offsetValue = 8,
  sameWidth = false,
}: AnchoredFloatingOptions): UseFloatingReturn {
  return useFloating({
    open,
    onOpenChange,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(offsetValue),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      ...(sameWidth
        ? [
            size({
              apply({ rects, elements }) {
                Object.assign(elements.floating.style, {
                  width: `${rects.reference.width}px`,
                });
              },
            }),
          ]
        : []),
    ],
  });
}
