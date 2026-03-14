import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createColumnHelper,
  type ColumnDef,
  type Table as TanStackTable,
} from "@tanstack/react-table";
import { IconColumns3, IconDownload, IconRefresh } from "@tabler/icons-react";
import { Button } from "../Forms/Button";
import { Toolbar, ToolbarGroup, ToolbarSpacer } from "../Layout/Toolbar";
import { StatusBadge } from "./StatusBadge";
import { DataTable } from "./DataTable";

type Deployment = {
  id: string;
  environment: string;
  owner: string;
  status: "active" | "pending" | "error";
  updatedAt: string;
};

const columnHelper = createColumnHelper<Deployment>();

const columns: ColumnDef<Deployment, any>[] = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
    size: 72,
  }),
  columnHelper.accessor("environment", {
    header: "Environment",
    cell: (info) => <span className="font-medium">{info.getValue()}</span>,
  }),
  columnHelper.accessor("owner", {
    header: "Owner",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => <StatusBadge status={info.getValue()} />,
  }),
  columnHelper.accessor("updatedAt", {
    header: "Updated",
    cell: (info) => info.getValue(),
  }),
];

const data: Deployment[] = Array.from({ length: 24 }, (_, index) => ({
  id: `DEP-${String(index + 1).padStart(3, "0")}`,
  environment: index % 2 === 0 ? "Production" : "Staging",
  owner: index % 3 === 0 ? "Alex Morgan" : "Jamie Rivera",
  status: index % 5 === 0 ? "error" : index % 4 === 0 ? "pending" : "active",
  updatedAt: `2026-03-${String((index % 9) + 2).padStart(2, "0")}`,
}));

const meta: Meta<any> = {
  title: "Components/DataDisplay/DataTable",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "DataTable is the advanced table surface for filtering, sorting, pagination, selection, toolbar workflows, and opt-in grid behaviors such as column resizing and pinning. Choose it instead of Table when you want behavior out of the box rather than a lightweight semantic wrapper. It also carries stronger table semantics, accessible sorting controls, descriptive selection labels, and screen-reader status summaries for loading and result changes.",
      },
    },
  },
  render: (args) => <DataTable<Deployment, unknown> {...args} />,
  args: {
    columns,
    data,
    pageSize: 8,
    enablePagination: true,
  },
};

export default meta;
type Story = StoryObj<any>;

export const Default: Story = {};

export const WithFilteringAndSelection: Story = {
  args: {
    enableGlobalFilter: true,
    enableRowSelection: true,
    showColumnBorders: true,
    toolbar: (table: TanStackTable<Deployment>) => (
      <Toolbar size="sm" tone="plain" className="border border-default">
        <ToolbarGroup compact>
          <Button size="xs" variant="secondary">
            <IconRefresh size={14} />
            Refresh
          </Button>
          <Button size="xs">
            <IconDownload size={14} />
            Export
          </Button>
        </ToolbarGroup>
        <ToolbarSpacer />
        <ToolbarGroup compact className="text-[11px] text-foreground-muted">
          <span>
            {table.getFilteredSelectedRowModel().rows.length} selected
          </span>
        </ToolbarGroup>
      </Toolbar>
    ),
  },
};

export const AccessibilityStatusFlow: Story = {
  args: {
    enableGlobalFilter: true,
    enableRowSelection: true,
  },
};

export const PinnedAndResizable: Story = {
  args: {
    enableGlobalFilter: true,
    enableColumnPinning: true,
    enableColumnResizing: true,
    defaultColumnPinning: {
      left: ["environment"],
      right: ["updatedAt"],
    },
    showColumnBorders: true,
    toolbar: (
      <Toolbar size="sm" tone="surface">
        <ToolbarGroup compact>
          <Button size="xs" variant="secondary">
            <IconColumns3 size={14} />
            Columns
          </Button>
          <Button size="xs" variant="secondary">
            <IconRefresh size={14} />
            Sync
          </Button>
        </ToolbarGroup>
        <ToolbarSpacer />
        <ToolbarGroup compact className="text-[11px] text-foreground-muted">
          <span>Drag header edges to resize.</span>
        </ToolbarGroup>
      </Toolbar>
    ),
  },
};

export const Loading: Story = {
  args: {
    data: [],
    loading: true,
    enableGlobalFilter: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
    enableGlobalFilter: true,
    emptyState: "No deployments match the current search and filters.",
  },
};

export const ErrorState: Story = {
  args: {
    data: [],
    errorState: (
      <div className="flex flex-col items-center gap-sm py-sm text-center">
        <p className="font-medium text-error">
          Deployment history is unavailable.
        </p>
        <Button size="xs" variant="secondary">
          Retry fetch
        </Button>
      </div>
    ),
    toolbar: (
      <Button size="xs" variant="secondary">
        <IconRefresh size={14} />
        Retry
      </Button>
    ),
  },
};

export const CompactStickyHeader: Story = {
  args: {
    density: "sm",
    stickyHeader: true,
    pageSize: 12,
    enablePagination: false,
  },
};
