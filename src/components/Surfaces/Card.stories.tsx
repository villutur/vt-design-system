import type { Meta, StoryObj } from "@storybook/react-vite";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./Card";
import { Button } from "../Forms/Button";

const meta: Meta<typeof Card> = {
  component: Card,
  title: "Components/Surfaces/Card",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["default", "plain"],
    },
  },
  args: {
    variant: "default",
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-[360px]">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project with a friendlier default surface treatment.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Name</p>
            <div className="h-10 w-full rounded-lg border border-default bg-surface-subtle" />
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Framework</p>
            <div className="h-10 w-full rounded-lg border border-default bg-surface-subtle" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Deploy</Button>
      </CardFooter>
    </Card>
  ),
};

export const Plain: Story = {
  args: {
    variant: "plain",
  },
  render: (args) => (
    <Card {...args} className="w-[360px] p-6">
      <h3 className="mb-2 text-lg font-semibold text-foreground">Minimal Card</h3>
      <p className="text-sm text-foreground-muted">
        Use the plain variant when you want the basic surface only and prefer to opt out of the default accent styling.
      </p>
    </Card>
  ),
};

export const Comparison: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="w-[360px]">
        <CardHeader>
          <CardTitle>Default Card</CardTitle>
          <CardDescription>Decorated by default with more depth and a subtle top accent.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-muted">
            Better out of the box for dashboards, detail views, and small feature callouts.
          </p>
        </CardContent>
      </Card>

      <Card variant="plain" className="w-[360px]">
        <CardHeader>
          <CardTitle>Plain Card</CardTitle>
          <CardDescription>Same API, quieter visual treatment when you need a cleaner shell.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground-muted">
            Useful when another surrounding layout is already doing the visual heavy lifting.
          </p>
        </CardContent>
      </Card>
    </div>
  ),
};
