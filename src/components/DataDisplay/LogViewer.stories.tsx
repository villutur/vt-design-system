import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Forms/Button";
import { LogViewer } from "./LogViewer";
import {
  createLogViewerItems,
  logViewerHeavyItems,
  logViewerLongPayloadItems,
  logViewerPreviewItems,
} from "../../internal/examples/logViewerExampleData";

function LiveAppendDemo() {
  const allItems = React.useMemo(() => createLogViewerItems(90), []);
  const [visibleCount, setVisibleCount] = React.useState(18);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setVisibleCount((current) =>
        current < allItems.length ? current + 1 : current,
      );
    }, 900);

    return () => window.clearInterval(intervalId);
  }, [allItems.length]);

  return (
    <div className="space-y-md">
      <div className="flex flex-wrap items-center gap-sm">
        <Button
          type="button"
          size="xs"
          variant="ghost"
          onClick={() => setVisibleCount(18)}
        >
          Restart feed
        </Button>
        <p className="text-sm text-foreground-muted">
          This demo appends one log at a time and keeps follow mode enabled by
          default.
        </p>
      </div>

      <LogViewer items={allItems.slice(0, visibleCount)} height={520} />
    </div>
  );
}

const meta: Meta<typeof LogViewer> = {
  component: LogViewer,
  title: "Components/DataDisplay/LogViewer",
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  argTypes: {
    height: { control: "number" },
    density: {
      control: "radio",
      options: ["default", "compact"],
    },
    items: { control: false },
    query: { control: false },
    defaultQuery: { control: false },
    selectedLevels: { control: false },
    defaultSelectedLevels: { control: false },
    selectedSources: { control: false },
    defaultSelectedSources: { control: false },
    selectedTags: { control: false },
    defaultSelectedTags: { control: false },
    expandedIds: { control: false },
    defaultExpandedIds: { control: false },
    followTail: { control: false },
    defaultFollowTail: { control: false },
    emptyState: { control: false },
    noResultsState: { control: false },
    onQueryChange: { control: false },
    onSelectedLevelsChange: { control: false },
    onSelectedSourcesChange: { control: false },
    onSelectedTagsChange: { control: false },
    onExpandedIdsChange: { control: false },
    onFollowTailChange: { control: false },
  },
  args: {
    height: 520,
    density: "default",
  },
};

export default meta;
type Story = StoryObj<typeof LogViewer>;

export const DefaultMixedLogs: Story = {
  args: {
    items: logViewerPreviewItems,
    defaultFollowTail: false,
  },
};

export const HeavyDataset: Story = {
  args: {
    items: logViewerHeavyItems,
    height: 620,
    defaultFollowTail: false,
  },
};

export const LongPayloadsAndExpansion: Story = {
  args: {
    items: logViewerLongPayloadItems,
    height: 620,
    defaultFollowTail: false,
    defaultExpandedIds: ["log-5", "log-12"],
  },
};

export const FilteredNoResults: Story = {
  args: {
    items: logViewerPreviewItems,
    height: 520,
    defaultFollowTail: false,
    defaultQuery: "quantum-cache-miss",
    defaultSelectedLevels: ["error"],
  },
};

export const LiveAppendAndFollow: Story = {
  render: () => <LiveAppendDemo />,
};
