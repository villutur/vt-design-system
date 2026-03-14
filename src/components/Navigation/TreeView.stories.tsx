import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { TreeView } from "./TreeView";
import {
  branchFirstTreeComparator,
  createAsyncTreeChildLoader,
  createAsyncExplorerItems,
  createFileTreeItems,
  createJsonTreeItems,
  createTeamDirectoryItems,
  renderAsyncExplorerNode,
  renderFileTreeNode,
  renderTeamTreeNode,
} from "./treeView.examples";

const meta: Meta<typeof TreeView> = {
  component: TreeView,
  title: "Components/Navigation/TreeView",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "TreeView is the hierarchical browsing surface for expandable structures such as file explorers, JSON trees, and custom node directories. It supports lazy child loading with built-in loading, error, and inline retry flows, plus keyboard-first tree navigation with screen-reader-friendly status messaging.",
      },
    },
  },
  argTypes: {
    items: {
      control: false,
    },
    defaultItems: {
      control: false,
    },
    renderNode: {
      control: false,
    },
    filterFn: {
      control: false,
    },
    sortComparator: {
      control: false,
    },
    createItem: {
      control: false,
    },
    loadChildren: {
      control: false,
    },
    onLoadChildrenError: {
      control: false,
    },
    loadErrorMessage: {
      control: false,
    },
    retryLabel: {
      control: false,
    },
    classNames: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof TreeView>;

function AsyncTreeStory(props: React.ComponentProps<typeof TreeView>) {
  const loadChildren = React.useMemo(() => createAsyncTreeChildLoader(), []);

  return (
    <div className="max-w-2xl">
      <TreeView {...props} defaultItems={createAsyncExplorerItems()} loadChildren={loadChildren} />
    </div>
  );
}

export const FileExplorer: Story = {
  args: {
    searchable: true,
    editable: true,
    addable: true,
    deletable: true,
    draggable: true,
    multiSelect: true,
  },
  render: (args) => (
    <div className="max-w-3xl">
      <TreeView
        {...args}
        defaultItems={createFileTreeItems()}
        renderNode={renderFileTreeNode}
        sortComparator={branchFirstTreeComparator}
      />
    </div>
  ),
};

export const JsonStructure: Story = {
  args: {
    searchable: true,
  },
  render: (args) => (
    <div className="max-w-2xl">
      <TreeView {...args} items={createJsonTreeItems()} sortComparator={branchFirstTreeComparator} />
    </div>
  ),
};

export const CustomNodes: Story = {
  args: {
    searchable: true,
    multiSelect: true,
  },
  render: (args) => (
    <div className="max-w-2xl">
      <TreeView {...args} items={createTeamDirectoryItems()} renderNode={renderTeamTreeNode} />
    </div>
  ),
};

export const AsyncLoading: Story = {
  args: {
    searchable: true,
  },
  render: (args) => <AsyncTreeStory {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText("packages"));
    await expect(await canvas.findByText("@vt/navigation")).toBeInTheDocument();
  },
};

export const AsyncErrorAndRetry: Story = {
  args: {
    searchable: true,
    onLoadChildrenError: fn(),
  },
  render: (args) => <AsyncTreeStory {...args} />,
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByText("settings"));
    await expect(
      await canvas.findByText("Could not load environment presets on the first attempt."),
    ).toBeInTheDocument();
    await expect(args.onLoadChildrenError).toHaveBeenCalledTimes(1);

    await userEvent.click(canvas.getByRole("button", { name: "Retry" }));
    await expect(await canvas.findByText("default.env")).toBeInTheDocument();
  },
};

export const AsyncCustomNodeFeedback: Story = {
  args: {
    searchable: true,
  },
  render: (args) => <AsyncTreeStory {...args} renderNode={renderAsyncExplorerNode} />,
};

export const KeyboardNavigation: Story = {
  args: {
    searchable: true,
    editable: true,
    addable: true,
    deletable: true,
    multiSelect: true,
  },
  render: (args) => (
    <div className="max-w-3xl">
      <TreeView
        {...args}
        defaultItems={createFileTreeItems()}
        renderNode={renderFileTreeNode}
        sortComparator={branchFirstTreeComparator}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tree = canvas.getByRole("tree");
    const srcItem = canvas.getByText("src").closest('[role="treeitem"]');

    if (!(srcItem instanceof HTMLElement)) {
      throw new Error("Expected src tree item.");
    }

    await userEvent.click(srcItem);
    await expect(tree).toHaveAttribute("aria-describedby");
    await expect(srcItem).toHaveFocus();

    await userEvent.keyboard("r");

    const readmeItem = canvas.getByText("README.md").closest('[role="treeitem"]');

    if (!(readmeItem instanceof HTMLElement)) {
      throw new Error("Expected README tree item.");
    }

    await expect(readmeItem).toHaveFocus();

    await userEvent.keyboard("{Home}");
    await expect(srcItem).toHaveFocus();

    await userEvent.keyboard("{Insert}");
    await expect(await canvas.findByRole("textbox", { name: /rename new item/i })).toBeInTheDocument();
  },
};

export const SearchAndFilter: Story = {
  args: {
    searchable: true,
  },
  render: (args) => (
    <div className="max-w-2xl">
      <TreeView {...args} items={createJsonTreeItems()} sortComparator={branchFirstTreeComparator} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const searchInput = canvas.getByPlaceholderText("Search tree nodes...");
    await userEvent.type(searchInput, "releaseChannel");
    await expect(canvas.getByText("releaseChannel")).toBeInTheDocument();
    await expect(canvas.queryByText("owners")).not.toBeInTheDocument();
  },
};
