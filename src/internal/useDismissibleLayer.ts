import React from "react";

export interface DismissibleLayerOptions {
  enabled: boolean;
  refs: Array<React.RefObject<HTMLElement | null>>;
  onDismiss: () => void;
  dismissOnOutsidePress?: boolean;
  dismissOnEscape?: boolean;
}

export function useDismissibleLayer({
  enabled,
  refs,
  onDismiss,
  dismissOnOutsidePress = true,
  dismissOnEscape = true,
}: DismissibleLayerOptions) {
  React.useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      return;
    }

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      if (!dismissOnOutsidePress) {
        return;
      }

      const target = event.target as Node | null;
      const isInsideLayer = refs.some((ref) => {
        const current = ref.current;
        return current ? current.contains(target) : false;
      });

      if (!isInsideLayer) {
        onDismiss();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (dismissOnEscape && event.key === "Escape") {
        onDismiss();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dismissOnEscape, dismissOnOutsidePress, enabled, onDismiss, refs]);
}
