function isAvailableFocusTarget(element: HTMLElement | null | undefined) {
  return Boolean(
    element &&
      !element.hasAttribute("disabled") &&
      element.getAttribute("aria-hidden") !== "true",
  );
}

const preferredFocusableSelector = [
  "[data-autofocus]",
  "button:not([disabled]):not([data-close-button='true'])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

const fallbackFocusableSelector = [
  "button:not([disabled])",
  "[href]",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function getInitialFocusTarget(
  container: HTMLElement | null,
  preferredTarget?: HTMLElement | null,
) {
  if (isAvailableFocusTarget(preferredTarget)) {
    return preferredTarget;
  }

  return (
    container?.querySelector<HTMLElement>(preferredFocusableSelector) ??
    container?.querySelector<HTMLElement>(fallbackFocusableSelector) ??
    container
  );
}
