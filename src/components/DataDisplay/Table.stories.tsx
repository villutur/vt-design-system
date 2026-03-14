import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "../Forms/Button";
import { StatusBadge } from "./StatusBadge";
import { Table, type TableProps } from "./Table";

type User = {
  id: string;
  name: string;
  role: string;
  status: "active" | "pending" | "error";
  notes: string;
};

const data: User[] = [
  {
    id: "1",
    name: "Jane Doe",
    role: "Admin",
    status: "active",
    notes: "Owns workspace billing and release approvals.",
  },
  {
    id: "2",
    name: "John Smith",
    role: "Editor",
    status: "pending",
    notes: "Reviewing the upcoming release checklist for staging.",
  },
  {
    id: "3",
    name: "Alice Johnson",
    role: "Viewer",
    status: "error",
    notes:
      "Needs permission updates because the audit export contains very long environment metadata and deployment notes.",
  },
];

const columns: TableProps<User>["columns"] = [
  { header: "Name", accessor: "name", width: "22%" },
  { header: "Role", accessor: "role", width: "18%" },
  {
    header: "Status",
    accessor: (row) => <StatusBadge status={row.status} />,
    width: "18%",
  },
  {
    header: "Notes",
    accessor: "notes",
    width: "42%",
    cellClassName: "min-w-[18rem]",
  },
];

const meta: Meta<TableProps<User>> = {
  title: "Components/DataDisplay/Table",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Table is the lightweight semantic table primitive for straightforward tabular layouts. Use it when you already control the data flow yourself and want a simple surface with aligned loading, empty, error, density, and sticky-header states.",
      },
    },
  },
  render: (args) => <Table<User> {...args} />,
  args: {
    columns,
    data,
    keyExtractor: (row) => row.id,
  },
};

export default meta;
type Story = StoryObj<TableProps<User>>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    loading: true,
    data: [],
  },
};

export const Empty: Story = {
  args: {
    data: [],
    emptyState: "No team members match the current filters.",
  },
};

export const ErrorState: Story = {
  args: {
    data: [],
    errorState: (
      <div className="flex flex-col items-center gap-sm py-sm text-center">
        <div className="inline-flex items-center gap-xs text-error">
          <IconAlertTriangle size={16} />
          Could not load team members
        </div>
        <Button size="xs" variant="secondary">
          Retry
        </Button>
      </div>
    ),
  },
};

export const CompactStickyHeader: Story = {
  args: {
    data: Array.from({ length: 14 }, (_, index) => ({
      id: `${index + 1}`,
      name: `Member ${index + 1}`,
      role: index % 3 === 0 ? "Admin" : "Member",
      status:
        index % 4 === 0 ? "pending" : index % 5 === 0 ? "error" : "active",
      notes: "Compact density works well for list-heavy admin views.",
    })),
    density: "sm",
    stickyHeader: true,
  },
};
