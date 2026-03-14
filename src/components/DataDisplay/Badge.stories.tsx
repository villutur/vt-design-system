import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: "Components/DataDisplay/Badge",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: [
        "default",
        "secondary",
        "destructive",
        "success",
        "warning",
        "info",
        "outline",
        "soft",
        "softPrimary",
        "softSuccess",
        "softWarning",
        "softError",
      ],
      description: "Visual style of the badge",
    },
    size: {
      control: { type: "select" },
      options: ["sm", "default", "lg"],
      description: "Size of the badge",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "New Feature",
    variant: "default",
  },
  // render: () => (
  //   <div>
  //     <div className="flex flex-wrap gap-md">
  //       <Badge variant="default" size={"lg"}>Default</Badge>
  //       <Badge variant="secondary">Secondary</Badge>
  //       <Badge variant="success">Success</Badge>
  //       <Badge variant="warning">Warning</Badge>
  //       <Badge variant="destructive">Destructive</Badge>
  //       <Badge variant="info">Info</Badge>
  //     </div>
  //     <div className="flex flex-wrap gap-md">
  //       <Badge variant="soft">Soft Default</Badge>
  //       <Badge variant="softPrimary">Soft Primary</Badge>
  //       <Badge variant="softSuccess">Soft Success</Badge>
  //       <Badge variant="softWarning">Soft Warning</Badge>
  //       <Badge variant="softError">Soft Error</Badge>
  //     </div>
  //     <div className="flex flex-wrap gap-md">
  //       <Badge variant="outline">Outline</Badge>
  //       <Badge variant="outlineSuccess">Outline Success</Badge>
  //       <Badge variant="outlineWarning">Outline Warning</Badge>
  //       <Badge variant="outlineError">Outline Error</Badge>
  //       <Badge variant="outlineGray">Outline Gray</Badge>
  //     </div>
  //   </div>
  // ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-md">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const SoftVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-md">
      <Badge variant="soft">Soft Default</Badge>
      <Badge variant="softPrimary">Soft Primary</Badge>
      <Badge variant="softSuccess">Soft Success</Badge>
      <Badge variant="softWarning">Soft Warning</Badge>
      <Badge variant="softError">Soft Error</Badge>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-md">
      <Badge size="sm">Small</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};
