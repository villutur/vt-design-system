import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const storybookManualChunkGroups = [
  {
    chunk: "react-vendor",
    packages: ["react", "react-dom", "scheduler"],
  },
  {
    chunk: "storybook-vendor",
    packages: ["storybook", "@storybook"],
  },
  {
    chunk: "syntax-vendor",
    packages: ["prism-react-renderer", "refractor", "prismjs"],
  },
  {
    chunk: "table-vendor",
    packages: ["@tanstack/react-table", "@tanstack/react-virtual"],
  },
  {
    chunk: "overlay-vendor",
    packages: ["@floating-ui"],
  },
  {
    chunk: "date-vendor",
    packages: ["react-day-picker", "date-fns"],
  },
  {
    chunk: "icons-vendor",
    packages: ["@tabler/icons-react", "@tabler/icons"],
  },
];

function storybookManualVendorChunks(id: string) {
  const normalizedId = id.replace(/\\/g, "/");

  if (!normalizedId.includes("/node_modules/")) {
    return undefined;
  }

  for (const group of storybookManualChunkGroups) {
    if (
      group.packages.some((packageName) =>
        normalizedId.includes(`/node_modules/${packageName}/`),
      )
    ) {
      return group.chunk;
    }
  }

  return "vendor";
}

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-vitest",
  ],
  framework: "@storybook/react-vite",
  typescript: {
    reactDocgen: false,
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      build: {
        rollupOptions: {
          output: {
            manualChunks: storybookManualVendorChunks,
          },
        },
      },
    }),
};
export default config;
