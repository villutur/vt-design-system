import React from "react";
import { IconActivity, IconInbox, IconRefresh } from "@tabler/icons-react";
import {
  Accordion,
  AccordionItem,
  Button,
  Divider,
  EmptyState,
  KeyValue,
  PanelResizeHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ScrollArea,
  SectionPanel,
  StatusBadge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../src/index";

export function PanelsSection() {
  return (
    <div className="flex h-full flex-col gap-8">
      <div>
        <h2 className="mb-4 text-2xl font-bold text-foreground">
          Panels & Tabs
        </h2>
        <p className="text-foreground-muted">Drag the handles to resize.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionPanel
          title="Divider"
          subtitle="Horizontal, vertical, and labeled separators"
        >
          <div className="space-y-md">
            <Divider />
            <Divider label="or continue with" />
            <div className="flex h-12 items-center gap-md">
              <span className="text-sm text-foreground">Left</span>
              <Divider orientation="vertical" />
              <span className="text-sm text-foreground">Right</span>
              <Divider orientation="vertical" />
              <span className="text-sm text-foreground">Far right</span>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="ScrollArea" subtitle="Styled scrollable container">
          <ScrollArea
            maxHeight={180}
            className="rounded border border-default bg-surface-subtle"
          >
            {Array.from({ length: 16 }, (_, index) => (
              <div
                key={index}
                className="flex items-center justify-between border-b border-default px-md py-sm"
              >
                <span className="font-mono text-xs text-foreground-muted">
                  node-{String(index + 1).padStart(3, "0")}
                </span>
                <StatusBadge
                  status={
                    index % 3 === 0
                      ? "pending"
                      : index % 5 === 0
                        ? "error"
                        : "active"
                  }
                />
              </div>
            ))}
          </ScrollArea>
        </SectionPanel>

        <SectionPanel
          title="Accordion"
          subtitle="Progressive disclosure inside surfaces"
        >
          <Accordion>
            <AccordionItem value="a1" title="Is it accessible?">
              Yes. Adheres to WAI-ARIA design patterns.
            </AccordionItem>
            <AccordionItem value="a2" title="Is it styled?">
              Yes. Matches the overall design system aesthetic.
            </AccordionItem>
            <AccordionItem value="a3" title="Is it animated?">
              Yes. Animated by default, can be disabled.
            </AccordionItem>
          </Accordion>
        </SectionPanel>

        <SectionPanel
          title="SectionPanel"
          subtitle="Reusable preview and utility shell"
          controls={
            <Button size="xs" variant="ghost">
              <IconRefresh size={12} /> Refresh
            </Button>
          }
        >
          <p className="text-sm text-foreground-muted">
            SectionPanel works well for grouped previews, dashboard surfaces,
            and any component examples that need a consistent header plus
            content area.
          </p>
        </SectionPanel>
      </div>

      <div className="flex h-[600px] w-full flex-col overflow-hidden rounded-xl border border-default bg-surface shadow-sm">
        <Tabs defaultValue="analytics" className="flex h-full flex-col">
          <div className="shrink-0 border-b border-default px-8 pt-4">
            <TabsList>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="logs">System Logs</TabsTrigger>
              <TabsTrigger value="analytics">User Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent
            value="analytics"
            className="mt-0 flex-1 overflow-hidden"
          >
            <ResizablePanelGroup orientation="horizontal">
              <ResizablePanel defaultSize={70} minSize={30}>
                <div className="flex h-full flex-col overflow-auto p-6">
                  <h3 className="mb-4 text-lg font-bold text-foreground">
                    User Performance Directory
                  </h3>
                  <div className="flex flex-1 items-center justify-center rounded-xl border border-default bg-surface-subtle text-foreground-muted">
                    Left panel content area
                  </div>
                </div>
              </ResizablePanel>
              <PanelResizeHandle />
              <ResizablePanel defaultSize={30} minSize={20}>
                <div className="flex h-full flex-col bg-surface-subtle/70">
                  <Tabs defaultValue="summary" className="flex h-full flex-col">
                    <div className="shrink-0 border-b border-default px-4 pt-4">
                      <div className="mb-4 flex items-center justify-between px-2">
                        <h4 className="font-bold text-foreground">
                          Profile Details
                        </h4>
                      </div>
                      <TabsList>
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent
                      value="summary"
                      className="mt-0 flex-1 overflow-y-auto p-6"
                    >
                      <KeyValue
                        items={[
                          { label: "User", value: "Jordan Smith" },
                          { label: "Role", value: "Admin" },
                          {
                            label: "Status",
                            value: <StatusBadge status="active" />,
                          },
                          { label: "Joined", value: "Jan 2023" },
                        ]}
                      />
                    </TabsContent>
                    <TabsContent value="activity" className="mt-0 p-6">
                      <EmptyState
                        icon={<IconActivity size={24} />}
                        title="No recent activity"
                      />
                    </TabsContent>
                    <TabsContent value="notes" className="mt-0 p-6">
                      <EmptyState
                        icon={<IconInbox size={24} />}
                        title="No notes yet"
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          <TabsContent
            value="dashboard"
            className="mt-0 flex justify-center p-8 text-foreground-muted"
          >
            Dashboard view
          </TabsContent>
          <TabsContent
            value="logs"
            className="mt-0 flex justify-center p-8 text-foreground-muted"
          >
            System logs view
          </TabsContent>
          <TabsContent
            value="settings"
            className="mt-0 flex justify-center p-8 text-foreground-muted"
          >
            Settings view
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
