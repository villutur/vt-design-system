import type { Meta, StoryObj } from "@storybook/react-vite";
import { Pagination } from "./Pagination";
import { useState } from "react";

const meta: Meta<typeof Pagination> = {
  component: Pagination,
  title: "Components/Navigation/Pagination",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Pagination>;

function Controlled({ totalPages }: { totalPages: number }) {
  const [page, setPage] = useState(1);
  return (
    <div className="flex flex-col gap-md">
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      <p className="text-xs text-slate-500">Current page: {page}</p>
    </div>
  );
}

export const FewPages: Story = {
  render: () => <Controlled totalPages={5} />,
};

export const ManyPages: Story = {
  render: () => <Controlled totalPages={42} />,
};

export const SinglePage: Story = {
  render: () => <Controlled totalPages={1} />,
};
