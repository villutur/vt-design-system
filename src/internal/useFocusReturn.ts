import React from "react";

export function useFocusReturn(open: boolean) {
  const previousFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (open && typeof document !== "undefined") {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      return;
    }

    if (!open && previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [open]);
}
