import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  title: "Components/Feedback/Skeleton",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Skeleton is the loading placeholder surface for layout-preserving states. Use it while real content is on the way, then replace it with the final content or an EmptyState if nothing arrives.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-[250px]" />,
};

export const CardLayout: Story = {
  render: () => (
    <div className="flex w-72 flex-col space-y-3 rounded-xl border p-4">
      <Skeleton className="h-[125px] w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

export const ProfileLayout: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

export const TableRows: Story = {
  render: () => (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-default bg-surface">
      <div className="grid grid-cols-[1.3fr_1fr_0.8fr] gap-sm border-b border-default bg-surface-subtle px-md py-sm">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="space-y-xs px-md py-sm">
        {Array.from({ length: 5 }, (_, index) => (
          <div
            key={index}
            className="grid grid-cols-[1.3fr_1fr_0.8fr] gap-sm py-sm"
          >
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16 justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  ),
};
