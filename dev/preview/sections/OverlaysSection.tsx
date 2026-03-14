import React, { useState } from "react";
import {
  IconActivity,
  IconChevronDown,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import {
  Alert,
  Button,
  CommandPalette,
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  Drawer,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  Input,
  Modal,
  Popover,
  PopoverContent,
  PopoverTrigger,
  SectionPanel,
  Select,
  Toggle,
  Tooltip,
  useToast,
} from "../../../src/index";
import type { CommandPaletteSection } from "../../../src/index";

const commandPaletteSections: CommandPaletteSection[] = [
  {
    title: "Navigation",
    items: [
      {
        value: "analytics",
        label: "Open analytics",
        description: "Jump to dashboards and reports",
        icon: <IconActivity size={16} />,
        shortcut: "G A",
        keywords: ["dashboards", "metrics"],
        group: "Navigation",
      },
      {
        value: "team",
        label: "Open team directory",
        description: "Manage members and access",
        icon: <IconUsers size={16} />,
        shortcut: "G T",
        group: "Navigation",
      },
    ],
  },
  {
    title: "Actions",
    items: [
      {
        value: "settings",
        label: "Open workspace settings",
        description: "Change environment and preferences",
        icon: <IconSettings size={16} />,
        shortcut: "G S",
        group: "Actions",
      },
      {
        value: "billing",
        label: "Open billing",
        description: "Review usage and invoices",
        icon: <IconActivity size={16} />,
        shortcut: "G B",
        group: "Actions",
      },
    ],
  },
];

export function OverlaysSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const { toast } = useToast();

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Overlays</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          Modal, tooltip, dropdown, drawer, context menu, and command palette
          patterns for layered interactions.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        <SectionPanel
          title="Modal"
          subtitle="Blocking dialog with primary and secondary actions"
        >
          <div className="space-y-md">
            <p className="text-sm text-foreground-muted">
              Use modals for high-importance decisions that require the user to
              confirm or cancel before continuing.
            </p>
            <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Tooltip"
          subtitle="Lightweight contextual help on hover or focus"
        >
          <div className="space-y-md">
            <p className="text-sm text-foreground-muted">
              Tooltips work well for brief explanations attached to a trigger
              without leaving the current context. They stay assistive and do
              not replace any existing inline descriptions already attached to
              the trigger.
            </p>
            <Tooltip content="This is a helpful tooltip with extra context">
              <Button variant="secondary">Hover me</Button>
            </Tooltip>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Dropdown"
          subtitle="Compact action menu anchored to a trigger"
        >
          <div className="space-y-md">
            <p className="text-sm text-foreground-muted">
              Dropdowns are best for short contextual action sets tied to a
              button or inline control.
            </p>
            <Dropdown
              trigger={
                <Button variant="secondary">
                  Open Menu <IconChevronDown className="ml-2 h-4 w-4" />
                </Button>
              }
            >
              <DropdownItem>Profile</DropdownItem>
              <DropdownItem>Settings</DropdownItem>
              <DropdownSeparator />
              <DropdownItem className="text-error dark:text-error">
                Logout
              </DropdownItem>
            </Dropdown>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Popover"
          subtitle="Generic anchored overlay for inspector-style content"
        >
          <div className="space-y-md">
            <p className="text-sm text-foreground-muted">
              Popover is the shared base for anchored panels that need richer
              custom content. When you do not provide an explicit label, the
              panel can derive its accessible name from the trigger.
            </p>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Open inspector</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-lg">
                <div className="space-y-sm">
                  <h3 className="text-sm font-semibold text-foreground">
                    Workspace snapshot
                  </h3>
                  <p className="text-sm text-foreground-muted">
                    Current region: eu-north-1, active users: 2,350, alerts: 12.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Drawer"
          subtitle="Context-preserving side panel for quick settings"
        >
          <div className="space-y-md">
            <p className="text-sm text-foreground-muted">
              Drawers keep the current page visible while exposing richer
              settings or workflows from the edge of the screen.
            </p>
            <Button onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Command Palette"
          subtitle="Keyboard-first search for actions and destinations"
        >
          <div className="space-y-md">
            <p className="text-sm text-foreground-muted">
              Search across common actions. The preview also supports Cmd/Ctrl+K
              for faster testing.
            </p>
            <Button onClick={() => setIsCommandPaletteOpen(true)}>
              Open Command Palette
            </Button>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Context Menu"
          subtitle="Right-click interaction surface"
          className="xl:col-span-2"
        >
          <div className="space-y-md">
            <p className="text-sm text-foreground-muted">
              Right-click inside the surface below to open a contextual menu for
              an existing item or surface. You can also focus the surface and
              press Shift+F10 for the keyboard path.
            </p>
            <ContextMenu>
              <ContextMenuTrigger>
                <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-strong bg-surface-subtle text-sm text-foreground-muted">
                  Right-click here or press Shift+F10
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent aria-label="Workspace actions">
                <ContextMenuItem
                  onClick={() =>
                    toast({
                      title: "Opened",
                      description: "The selected workspace item was opened.",
                      type: "info",
                    })
                  }
                >
                  Open
                </ContextMenuItem>
                <ContextMenuItem
                  shortcut="D"
                  onClick={() =>
                    toast({
                      title: "Duplicated",
                      description: "A duplicate item was created successfully.",
                      type: "success",
                    })
                  }
                >
                  Duplicate
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem disabled shortcut="Del">
                  Delete
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </SectionPanel>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Confirm Action"
        description="This will permanently delete the selected records and cannot be undone."
        size="lg"
        primaryActionLabel="Delete"
        primaryActionVariant="danger"
        primaryActionOnClick={() => setIsModalOpen(false)}
        secondaryActionLabel="Cancel"
      >
        <Alert type="warning" title="Warning">
          You are about to delete 12 records from the cluster.
        </Alert>
      </Modal>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Workspace settings"
        description="Adjust quick preferences without leaving the current page."
        footer={
          <div className="flex justify-end gap-sm">
            <Button variant="ghost" onClick={() => setIsDrawerOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsDrawerOpen(false);
                toast({
                  title: "Settings saved",
                  description: "The workspace configuration was updated.",
                  type: "success",
                });
              }}
            >
              Save
            </Button>
          </div>
        }
      >
        <div className="space-y-md">
          <Input label="Workspace name" defaultValue="Northwind Platform" />
          <Select
            label="Environment"
            defaultValue="production"
            options={[
              { value: "development", label: "Development" },
              { value: "staging", label: "Staging" },
              { value: "production", label: "Production" },
            ]}
          />
          <Toggle
            id="drawer-live-updates"
            label="Enable live updates"
            description="Refresh diagnostics automatically in the dashboard."
            defaultChecked
          />
        </div>
      </Drawer>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onOpenChange={setIsCommandPaletteOpen}
        sections={commandPaletteSections}
        enableGlobalShortcut
        onSelect={(item) =>
          toast({
            title: `Executed: ${item.label}`,
            description: `Triggered command "${item.value}".`,
            type: "info",
          })
        }
      />
    </section>
  );
}
