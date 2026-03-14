import React from "react";

export function useBodyScrollLock(enabled: boolean) {
  React.useEffect(() => {
    if (!enabled || typeof document === "undefined") {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [enabled]);
}
