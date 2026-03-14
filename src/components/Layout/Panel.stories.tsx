import type { Meta, StoryObj } from "@storybook/react-vite";
import { Panel, PanelGroup, ResizablePanel, ResizablePanelGroup, PanelResizeHandle } from "./Panel";

const meta: Meta = {
  title: "Components/Layout/Panel",
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

// ─── Fixed panels ─────────────────────────────────────────────────────────────

export const FixedHorizontal: Story = {
  name: "Fixed — Horizontal",
  render: () => (
    <div className="h-[300px] w-full overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <PanelGroup orientation="horizontal">
        <Panel size="200px" className="items-center justify-center bg-slate-50 dark:bg-slate-800/50">
          <span className="font-medium text-slate-500">Sidebar (200px fixed)</span>
        </Panel>
        <div className="w-px shrink-0 bg-slate-200 dark:bg-slate-800" />
        <Panel className="items-center justify-center">
          <span className="font-medium text-slate-500">Main (grows)</span>
        </Panel>
        <div className="w-px shrink-0 bg-slate-200 dark:bg-slate-800" />
        <Panel size="180px" className="items-center justify-center bg-slate-50 dark:bg-slate-800/50">
          <span className="font-medium text-slate-500">Details (180px fixed)</span>
        </Panel>
      </PanelGroup>
    </div>
  ),
};

export const FixedVertical: Story = {
  name: "Fixed — Vertical",
  render: () => (
    <div className="h-[400px] w-full overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <PanelGroup orientation="vertical">
        <Panel size="48px" className="shrink-0 items-center bg-slate-100 px-4 dark:bg-slate-800">
          <span className="font-medium text-slate-500">Header (fixed 48px)</span>
        </Panel>
        <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />
        <Panel className="items-center justify-center">
          <span className="font-medium text-slate-500">Content (grows)</span>
        </Panel>
        <div className="h-px w-full bg-slate-200 dark:bg-slate-800" />
        <Panel size="40px" className="shrink-0 items-center bg-slate-50 px-4 dark:bg-slate-800/50">
          <span className="font-medium text-slate-500">Footer (fixed 40px)</span>
        </Panel>
      </PanelGroup>
    </div>
  ),
};

// ─── Resizable panels ─────────────────────────────────────────────────────────

export const ResizableHorizontal: Story = {
  name: "Resizable — Horizontal",
  render: () => (
    <div className="h-[400px] w-full overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="flex h-full items-center justify-center bg-slate-50 p-6 dark:bg-slate-800/50">
            <span className="font-medium text-slate-500">Sidebar (25%)</span>
          </div>
        </ResizablePanel>

        <PanelResizeHandle />

        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-medium text-slate-500">Main Content (50%)</span>
          </div>
        </ResizablePanel>

        <PanelResizeHandle />

        <ResizablePanel defaultSize={25} minSize={15}>
          <div className="flex h-full items-center justify-center bg-slate-50 p-6 dark:bg-slate-800/50">
            <span className="font-medium text-slate-500">Details (25%)</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const ResizableVertical: Story = {
  name: "Resizable — Vertical",
  render: () => (
    <div className="h-[500px] w-full overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize={70}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-medium text-slate-500">Editor Workspace</span>
          </div>
        </ResizablePanel>

        <PanelResizeHandle />

        <ResizablePanel defaultSize={30} minSize={10} collapsible>
          <div className="flex h-full items-center justify-center bg-slate-50 p-6 dark:bg-slate-800/50">
            <span className="font-medium text-slate-500">Terminal / Logs</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};

export const NestedResizable: Story = {
  name: "Resizable — Nested",
  render: () => (
    <div className="h-[500px] w-full overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize={20} minSize="15%" maxSize="35%">
          <div className="flex h-full items-center justify-center bg-slate-50 p-6 dark:bg-slate-800/50">
            <span className="font-medium text-slate-500">Explorer</span>
          </div>
        </ResizablePanel>

        <PanelResizeHandle />

        <ResizablePanel defaultSize={80}>
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize={75}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-medium text-slate-500">Code Editor</span>
              </div>
            </ResizablePanel>

            <PanelResizeHandle />

            <ResizablePanel defaultSize={25} minSize={10}>
              <div className="flex h-full items-center justify-center bg-slate-100 p-6 dark:bg-slate-800">
                <span className="font-medium text-slate-500">Console</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
};
