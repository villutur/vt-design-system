/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { viteSingleFile as singleFile } from 'vite-plugin-singlefile';
// import path from "node:path";
// import { fileURLToPath } from "node:url";
// import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
// import { playwright } from "@vitest/browser-playwright";
import { manualVendorChunks } from "./build/viteManualChunks";

// const dirname =
//   typeof __dirname !== "undefined"
//     ? __dirname
//     : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  root: "dev",
  plugins: [react(), tailwindcss(), singleFile()],
  build: {
    target: 'esnext', // Modern JS output
    cssCodeSplit: false, // Prevent separate CSS files
    assetsInlineLimit: 100000000, // Inline all assets (images, fonts, etc.)
    // rollupOptions: {
    //   output: {
    //     manualChunks: manualVendorChunks,
    //   },
    // },
  },
  // test: {
  //   projects: [
  //     {
  //       extends: true,
  //       plugins: [
  //         // The plugin will run tests for the stories defined in your Storybook config
  //         // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
  //         storybookTest({
  //           configDir: path.join(dirname, ".storybook"),
  //         }),
  //       ],
  //       test: {
  //         name: "storybook",
  //         browser: {
  //           enabled: true,
  //           headless: true,
  //           provider: playwright({}),
  //           instances: [
  //             {
  //               browser: "chromium",
  //             },
  //           ],
  //         },
  //         setupFiles: [".storybook/vitest.setup.ts"],
  //       },
  //     },
  //   ],
  // },
});
