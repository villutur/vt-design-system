import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DashboardExecutiveContent,
  DashboardOperationsContent,
  DashboardShellExample,
  LoginCompactShowcase,
  LoginSplitShowcase,
} from "../../internal/examples/pageMockups";

const meta = {
  title: "Examples/Page Layouts",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const LoginSplit: Story = {
  render: () => <LoginSplitShowcase />,
};

export const LoginCompact: Story = {
  render: () => <LoginCompactShowcase />,
};

export const DashboardOperations: Story = {
  render: () => (
    <DashboardShellExample>
      <DashboardOperationsContent />
    </DashboardShellExample>
  ),
};

export const DashboardExecutive: Story = {
  render: () => (
    <DashboardShellExample>
      <DashboardExecutiveContent />
    </DashboardShellExample>
  ),
};
