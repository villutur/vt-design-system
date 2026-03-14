import type { Preview, StoryContext } from "@storybook/react-vite";
import React, { useEffect, useState } from "react";
import {
  DocsContainer,
  type DocsContainerProps,
} from "@storybook/addon-docs/blocks";
import { GLOBALS_UPDATED } from "storybook/internal/core-events";
import { themes } from "storybook/theming";
import type { SizeMode } from "../src/tokens";
import addonA11y from '@storybook/addon-a11y';
import "../src/styles.css";

function applyPreviewGlobals(theme: string, sizeMode: SizeMode) {
  const htmlTag = document.documentElement;
  htmlTag.dataset.sizeMode = sizeMode;

  if (theme === "dark") {
    htmlTag.classList.add("dark");
    htmlTag.style.colorScheme = "dark";
  } else {
    htmlTag.classList.remove("dark");
    htmlTag.style.colorScheme = "light";
  }
}

function readPreviewGlobalsFromDom(): { theme: "light" | "dark"; sizeMode: SizeMode } {
  const htmlTag = document.documentElement;

  return {
    theme: htmlTag.classList.contains("dark") ? "dark" : "light",
    sizeMode: (htmlTag.dataset.sizeMode ?? "default") as SizeMode,
  };
}

const withTheme = (StoryFn: any, context: StoryContext) => {
  const theme = context.globals.theme;
  const sizeMode = (context.globals.sizeMode ?? "default") as SizeMode;
  const layout = context.parameters.layout || "padded";

  useEffect(() => {
    applyPreviewGlobals(theme, sizeMode);
  }, [theme, sizeMode]);

  if (layout === "fullscreen") {
    return React.createElement(StoryFn);
  }

  return React.createElement(StoryFn);
  // Gives a nice padded container with proper background for components in Storybook
  return React.createElement(
    "div",
    {
      className:
        "flex min-h-[50vh] w-full items-start justify-center bg-canvas p-8 text-foreground transition-colors sm:p-12",
    },
    // React.createElement(
    //   "div",
    //   {
    //     className:
    //       "flex w-full max-w-5xl flex-col items-start rounded-xs border border-default bg-surface p-6 shadow-sm sm:p-10",
    //   },
      React.createElement(StoryFn),
    // ),
  );
};

const ThemedDocsContainer = ({
  children,
  context,
}: React.PropsWithChildren<DocsContainerProps>) => {
  const [{ theme, sizeMode }, setPreviewGlobals] = useState(readPreviewGlobalsFromDom);

  useEffect(() => {
    applyPreviewGlobals(theme, sizeMode);
  }, [theme, sizeMode]);

  useEffect(() => {
    const handleGlobalsUpdated = (payload: {
      globals?: {
        theme?: string;
        sizeMode?: string;
      };
    }) => {
      const nextTheme = payload.globals?.theme === "dark" ? "dark" : "light";
      const nextSizeMode = (payload.globals?.sizeMode ?? "default") as SizeMode;

      setPreviewGlobals({
        theme: nextTheme,
        sizeMode: nextSizeMode,
      });
    };

    context.channel.on(GLOBALS_UPDATED, handleGlobalsUpdated);

    return () => {
      context.channel.off(GLOBALS_UPDATED, handleGlobalsUpdated);
    };
  }, [context.channel]);

  return React.createElement(
    DocsContainer,
    {
      context,
      theme: theme === "dark" ? themes.dark : themes.light,
    },
    children,
  );
};

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "light",
    toolbar: {
      items: [
        { value: "light", icon: "sun", title: "Light" },
        { value: "dark", icon: "moon", title: "Dark" },
      ],
      dynamicTitle: true,
    },
  },
  sizeMode: {
    name: "Size",
    description: "Global preview size mode",
    defaultValue: "default",
    toolbar: {
      items: [
        { value: "compact", title: "Compact" },
        { value: "default", title: "Default" },
        { value: "comfortable", title: "Comfortable" },
      ],
      dynamicTitle: true,
    },
  },
};

const preview: Preview = {
  decorators: [withTheme],
  
  parameters: {
    docs: {
      container: ThemedDocsContainer,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      test: "error",
    },
    backgrounds: {
      disable: true, // We handle backgrounds via our own CSS classes
    },
  },
};

export default preview;
