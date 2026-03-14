import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShell } from "./AppShell";

const meta: Meta<typeof AppShell> = {
  component: AppShell,
  title: "Components/Layout/AppShell",
  tags: ["autodocs"],
  args: {
    contentContainerClassName: "max-w-[1280px]",
  },
  argTypes: {
    contentContainerClassName: {
      control: "text",
      description:
        "Tailwind classes applied to the inner content container. Use this to change or remove the default max width.",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

export const Default: Story = {
  render: (args) => (
    <div className="relative h-[500px] w-full overflow-hidden rounded-lg border">
      <AppShell
        {...args}
        header={
          <header className="flex h-16 items-center border-b bg-white px-6 font-semibold dark:bg-slate-900">
            Application Header
          </header>
        }
        sidebar={
          <aside className="hidden w-64 border-r bg-slate-50 p-4 md:block dark:bg-slate-800">
            <nav className="space-y-2">
              <div className="rounded bg-slate-200 p-2 text-sm font-medium dark:bg-slate-700">Dashboard</div>
              <div className="rounded p-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                Settings
              </div>
              <div className="rounded p-2 text-sm text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
                Profile
              </div>
            </nav>
          </aside>
        }
      >
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Welcome back</h1>
          <p className="text-slate-500">
            This is the main content area of the application shell. It automatically handles scrolling when content
            exceeds the viewport height.
          </p>
          <div className="flex h-96 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400 dark:border-slate-700">
            Content Space
          </div>
        </div>
      </AppShell>
    </div>
  ),
};

export const FullWidthContent: Story = {
  args: {
    contentContainerClassName: "max-w-none space-y-10",
  },
  render: Default.render,
};
