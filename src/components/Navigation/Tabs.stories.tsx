import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  title: "Components/Navigation/Tabs",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["primary", "secondary"],
    },
    defaultValue: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const PrimaryVariant: Story = {
  args: {
    defaultValue: "account",
    variant: "primary",
  },
  render: (args) => (
    <Tabs {...args} className="w-[400px]">
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="account" className="p-4 border rounded-xl mt-4 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="font-semibold text-lg mb-2">Account Settings</h3>
        <p className="text-sm text-slate-500">Make changes to your account here.</p>
      </TabsContent>
      
      <TabsContent value="password" className="p-4 border rounded-xl mt-4 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="font-semibold text-lg mb-2">Password</h3>
        <p className="text-sm text-slate-500">Change your password here.</p>
      </TabsContent>
      
      <TabsContent value="settings" className="p-4 border rounded-xl mt-4 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
        <h3 className="font-semibold text-lg mb-2">Preferences</h3>
        <p className="text-sm text-slate-500">Manage your system preferences.</p>
      </TabsContent>
    </Tabs>
  ),
};

export const SecondaryVariant: Story = {
  args: {
    defaultValue: "api",
    variant: "secondary",
  },
  render: (args) => (
    <Tabs {...args} className="w-[600px]">
      <div className="border-b border-slate-200 dark:border-slate-800">
        <TabsList>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Error Logs</TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="api" className="py-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">You have 3 active API keys.</p>
      </TabsContent>
      
      <TabsContent value="webhooks" className="py-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">No webhooks configured.</p>
      </TabsContent>
      
      <TabsContent value="logs" className="py-4">
        <p className="text-sm text-slate-700 dark:text-slate-300">System is operating normally. No errors logged.</p>
      </TabsContent>
    </Tabs>
  ),
};
