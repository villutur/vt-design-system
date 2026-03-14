import React from "react";
import { createPortal } from "react-dom";

export interface FloatingPortalProps {
  children: React.ReactNode;
}

export const FloatingPortal: React.FC<FloatingPortalProps> = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || typeof document === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
};

FloatingPortal.displayName = "FloatingPortal";
