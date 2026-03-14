const semanticColors = {
  light: {
    canvas: "#f6f7f8",
    surface: "#ffffff",
    surfaceSubtle: "#f8fafc",
    surfaceMuted: "#f1f5f9",
    overlay: "#0f1115",
    foreground: "#0f1115",
    foregroundMuted: "#64748b",
    foregroundSubtle: "#94a3b8",
    foregroundInverse: "#ffffff",
    borderDefault: "#e2e8f0",
    borderStrong: "#cbd5e1",
  },
  dark: {
    canvas: "#0f1115",
    surface: "#1a1d23",
    surfaceSubtle: "#262b34",
    surfaceMuted: "#334155",
    overlay: "#000000",
    foreground: "#e2e8f0",
    foregroundMuted: "#64748b",
    foregroundSubtle: "#94a3b8",
    foregroundInverse: "#0f1115",
    borderDefault: "#2d343f",
    borderStrong: "#475569",
  },
} as const;

function hexToRgbChannels(hex: string): string {
  const normalized = hex.replace("#", "");
  const value =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  if (value.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);

  return `${red} ${green} ${blue}`;
}

export const semanticColorChannels = {
  light: {
    canvas: hexToRgbChannels(semanticColors.light.canvas),
    surface: hexToRgbChannels(semanticColors.light.surface),
    surfaceSubtle: hexToRgbChannels(semanticColors.light.surfaceSubtle),
    surfaceMuted: hexToRgbChannels(semanticColors.light.surfaceMuted),
    overlay: hexToRgbChannels(semanticColors.light.overlay),
    foreground: hexToRgbChannels(semanticColors.light.foreground),
    foregroundMuted: hexToRgbChannels(semanticColors.light.foregroundMuted),
    foregroundSubtle: hexToRgbChannels(semanticColors.light.foregroundSubtle),
    foregroundInverse: hexToRgbChannels(semanticColors.light.foregroundInverse),
    borderDefault: hexToRgbChannels(semanticColors.light.borderDefault),
    borderStrong: hexToRgbChannels(semanticColors.light.borderStrong),
  },
  dark: {
    canvas: hexToRgbChannels(semanticColors.dark.canvas),
    surface: hexToRgbChannels(semanticColors.dark.surface),
    surfaceSubtle: hexToRgbChannels(semanticColors.dark.surfaceSubtle),
    surfaceMuted: hexToRgbChannels(semanticColors.dark.surfaceMuted),
    overlay: hexToRgbChannels(semanticColors.dark.overlay),
    foreground: hexToRgbChannels(semanticColors.dark.foreground),
    foregroundMuted: hexToRgbChannels(semanticColors.dark.foregroundMuted),
    foregroundSubtle: hexToRgbChannels(semanticColors.dark.foregroundSubtle),
    foregroundInverse: hexToRgbChannels(semanticColors.dark.foregroundInverse),
    borderDefault: hexToRgbChannels(semanticColors.dark.borderDefault),
    borderStrong: hexToRgbChannels(semanticColors.dark.borderStrong),
  },
} as const;

export const semanticCssVariables = {
  light: {
    "--vt-color-canvas": semanticColorChannels.light.canvas,
    "--vt-color-surface": semanticColorChannels.light.surface,
    "--vt-color-surface-subtle": semanticColorChannels.light.surfaceSubtle,
    "--vt-color-surface-muted": semanticColorChannels.light.surfaceMuted,
    "--vt-color-overlay": semanticColorChannels.light.overlay,
    "--vt-color-foreground": semanticColorChannels.light.foreground,
    "--vt-color-foreground-muted": semanticColorChannels.light.foregroundMuted,
    "--vt-color-foreground-subtle":
      semanticColorChannels.light.foregroundSubtle,
    "--vt-color-foreground-inverse":
      semanticColorChannels.light.foregroundInverse,
    "--vt-color-border-default": semanticColorChannels.light.borderDefault,
    "--vt-color-border-strong": semanticColorChannels.light.borderStrong,
  },
  dark: {
    "--vt-color-canvas": semanticColorChannels.dark.canvas,
    "--vt-color-surface": semanticColorChannels.dark.surface,
    "--vt-color-surface-subtle": semanticColorChannels.dark.surfaceSubtle,
    "--vt-color-surface-muted": semanticColorChannels.dark.surfaceMuted,
    "--vt-color-overlay": semanticColorChannels.dark.overlay,
    "--vt-color-foreground": semanticColorChannels.dark.foreground,
    "--vt-color-foreground-muted": semanticColorChannels.dark.foregroundMuted,
    "--vt-color-foreground-subtle": semanticColorChannels.dark.foregroundSubtle,
    "--vt-color-foreground-inverse":
      semanticColorChannels.dark.foregroundInverse,
    "--vt-color-border-default": semanticColorChannels.dark.borderDefault,
    "--vt-color-border-strong": semanticColorChannels.dark.borderStrong,
  },
} as const;

export const sizeModes = {
  compact: {
    label: "Compact",
    rootFontSize: "13px",
    description: "Denser preview with more information visible at once.",
  },
  default: {
    label: "Default",
    rootFontSize: "14px",
    description: "Current baseline for the design system preview.",
  },
  comfortable: {
    label: "Comfortable",
    rootFontSize: "15px",
    description: "Roomier preview with slightly larger text and spacing.",
  },
} as const;

export type SizeMode = keyof typeof sizeModes;

export const sizeModeCssVariables = {
  compact: {
    "--vt-root-font-size": sizeModes.compact.rootFontSize,
  },
  default: {
    "--vt-root-font-size": sizeModes.default.rootFontSize,
  },
  comfortable: {
    "--vt-root-font-size": sizeModes.comfortable.rootFontSize,
  },
} as const;

export const designTokens = {
  colors: {
    primary: {
      DEFAULT: "#137fec",
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    success: { DEFAULT: "#4ade80", dark: "#4ade80" },
    warning: { DEFAULT: "#fbbf24", dark: "#fbbf24" },
    error: { DEFAULT: "#f87171", dark: "#f87171" },
    semantic: semanticColors,
    background: {
      light: semanticColors.light.canvas,
      dark: semanticColors.dark.canvas,
      main: semanticColors.dark.canvas,
      surface: semanticColors.dark.surface,
      elevated: semanticColors.dark.surfaceSubtle,
    },
    border: {
      default: semanticColors.light.borderDefault,
      strong: semanticColors.light.borderStrong,
      muted: semanticColors.dark.borderDefault,
    },
    // Legacy text aliases are kept for compatibility.
    text: {
      primary: semanticColors.dark.foreground,
      secondary: semanticColors.dark.foregroundMuted,
      disabled: semanticColors.dark.surfaceMuted,
      inverse: semanticColors.dark.foregroundInverse,
      foreground: semanticColors.light.foreground,
      muted: semanticColors.light.foregroundMuted,
      subtle: semanticColors.light.foregroundSubtle,
      foregroundInverse: semanticColors.light.foregroundInverse,
    },
  },
  typography: {
    fontFamily: {
      display: ["Inter", "sans-serif"],
      body: ["Inter", "sans-serif"],
      mono: ["ui-monospace", "monospace"],
    },
    fontSize: {
      xs: "0.6875rem", // 11px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },
  radius: {
    sm: "0.125rem", // 2px
    DEFAULT: "0.20rem", // ~2.4px
    md: "0.20rem", // ~2.4px
    lg: "0.25rem", // ~2.4px
    xl: "0.35rem", // 4px
    "2xl": "0.5rem", // 8px
    full: "9999px",
  },
  shadows: {
    soft: "0 2px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.15)",
    "soft-dark":
      "0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.4)",
  },
  spacing: {
    none: "0",
    xs: "0.25rem", // 4px
    sm: "0.375rem", // 6px
    md: "0.75rem", // 12px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    "2xl": "2rem", // 32px
    "3xl": "3rem", // 48px
    "4xl": "4rem", // 64px
  },
  containers: {
    "3xs": "16rem", // 256px
    "2xs": "18rem", // 288px
    xs: "20rem", // 320px
    sm: "24rem", // 384px
    md: "28rem", // 448px
    lg: "32rem", // 512px
    xl: "36rem", // 576px
    "2xl": "42rem", // 672px
    "3xl": "48rem", // 768px
    "4xl": "56rem", // 896px
    "5xl": "64rem", // 1024px
    "6xl": "72rem", // 1152px
    "7xl": "80rem", // 1280px
  },
  // z-index scale - use as `z-dropdown`, `z-modal`, etc.
  zIndex: {
    base: "0",
    raised: "10",
    dropdown: "1000",
    sticky: "1020",
    overlay: "1030",
    modal: "1050",
    toast: "1100",
    tooltip: "1200",
  },
  // Transition helpers - use as `duration-base`, `ease-spring`, etc.
  transition: {
    duration: {
      fast: "100ms",
      base: "200ms",
      slow: "300ms",
      slower: "500ms",
    },
    easing: {
      default: "ease-in-out",
      in: "ease-in",
      out: "ease-out",
      spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
    },
  },
  sizeModes,
};
