import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Grid, GridItem } from "./Grid";

const meta: Meta<typeof Grid> = {
  component: Grid,
  title: "Components/Layout/Grid",
  tags: ["autodocs"],
  argTypes: {
    cols: {
      control: { type: "range", min: 1, max: 12, step: 1 },
      description: "Number of columns in the grid",
    },
    gap: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg", "xl"],
      description: "Gap spacing between grid cells",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Grid>;

// Helper to generate mock content blocks
const Box = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-medium h-24 dark:bg-indigo-900/30 dark:text-indigo-400 ${className}`}>
    {children}
  </div>
);

export const Default: Story = {
  args: {
    cols: 3,
    gap: "md",
  },
  render: (args) => (
    <Grid {...args} className="w-full">
      <Box>Item 1</Box>
      <Box>Item 2</Box>
      <Box>Item 3</Box>
      <Box>Item 4</Box>
      <Box>Item 5</Box>
      <Box>Item 6</Box>
    </Grid>
  ),
};

export const DifferentGaps: Story = {
  render: () => (
    <div className="space-y-8 w-full">
      <div>
        <p className="mb-2 text-sm font-semibold">Small Gap (sm)</p>
        <Grid cols={4} gap="sm">
          <Box className="h-16">1</Box>
          <Box className="h-16">2</Box>
          <Box className="h-16">3</Box>
          <Box className="h-16">4</Box>
        </Grid>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold">Large Gap (lg)</p>
        <Grid cols={4} gap="lg">
          <Box className="h-16">1</Box>
          <Box className="h-16">2</Box>
          <Box className="h-16">3</Box>
          <Box className="h-16">4</Box>
        </Grid>
      </div>
    </div>
  ),
};

export const ComplexLayout: Story = {
  args: {
    cols: 12,
    gap: "md",
  },
  render: (args) => (
    <Grid {...args} className="w-full">
      <GridItem colSpan="full">
        <div className="flex items-center justify-center rounded-lg bg-teal-100 text-teal-700 font-medium h-16 dark:bg-teal-900/30 dark:text-teal-400">
          Header (colSpan="full")
        </div>
      </GridItem>
      
      <GridItem colSpan={3}>
        <div className="flex items-center justify-center rounded-lg bg-amber-100 text-amber-700 font-medium h-64 dark:bg-amber-900/30 dark:text-amber-400">
          Sidebar (colSpan=3)
        </div>
      </GridItem>
      
      <GridItem colSpan={9}>
        <div className="flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-medium h-64 dark:bg-indigo-900/30 dark:text-indigo-400">
          Main Content (colSpan=9)
        </div>
      </GridItem>
      
      <GridItem colSpan={4}>
        <Box>Widget 1 (colSpan=4)</Box>
      </GridItem>
      <GridItem colSpan={4}>
        <Box>Widget 2 (colSpan=4)</Box>
      </GridItem>
      <GridItem colSpan={4}>
        <Box>Widget 3 (colSpan=4)</Box>
      </GridItem>
    </Grid>
  ),
};
