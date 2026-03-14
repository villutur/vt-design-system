import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconRefresh, IconSettings } from "@tabler/icons-react";
import { Button } from "./Button";
import {
  CommandInput,
  type CommandInputHistoryItem,
  type CommandInputSlashCommand,
} from "./CommandInput";

const historyItems: CommandInputHistoryItem[] = [
  {
    id: "history-release",
    label: "Release handoff summary",
    description: "Recent approval-packet draft reused by the rollout team.",
    value:
      "Draft a rollout handoff for REL-3104, include the rollback wording, and call out the remaining reviewer blocker.",
    keywords: ["release", "rollout", "handoff"],
  },
  {
    id: "history-incident",
    label: "Incident mitigation prompt",
    description: "Responder-focused remediation summary.",
    value:
      "Summarize the current auth incident, propose the next safest mitigation step, and include explicit rollback criteria.",
    keywords: ["incident", "mitigation", "rollback"],
  },
  {
    id: "history-docs",
    value:
      "Draft a short Storybook migration note that explains when to choose DataTable instead of Table.",
    keywords: ["docs", "storybook", "migration"],
  },
];

const slashCommands: CommandInputSlashCommand[] = [
  {
    value: "summarize",
    label: "Summarize context",
    description: "Generate a concise summary from the active workflow state.",
    keywords: ["summary", "brief"],
    group: "Prompt helpers",
  },
  {
    value: "release-note",
    label: "Insert release-note template",
    description: "Prefill a handoff template for release approvals.",
    keywords: ["handoff", "release", "approval"],
    group: "Templates",
    insertText: "/release-note draft",
  },
  {
    value: "export-bundle",
    label: "Prepare export bundle",
    description: "Start a command for packaging the visible artifacts.",
    keywords: ["export", "bundle", "attachments"],
    group: "Actions",
    shortcut: "⌘E",
  },
];

const meta: Meta<typeof CommandInput> = {
  component: CommandInput,
  title: "Components/Forms/CommandInput",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "CommandInput is the multiline prompt and command surface for workflows that mix freeform text with explicit submit actions. It also supports optional history recall and leading slash-command discovery without taking over higher-level chat or session logic.",
      },
    },
  },
  args: {
    label: "Command",
    helperText: "Use Ctrl/Cmd + Enter to submit quickly.",
    placeholder: "Describe what should happen next...",
    className: "max-w-4xl"
  },
};

export default meta;
type Story = StoryObj<typeof CommandInput>;

export const Default: Story = {
  render: (args) => (
    <CommandInput
      {...args}
      defaultValue="Draft a rollout summary for the latest release and highlight any risk areas."
      onSubmit={() => undefined}
    />
  ),
};

export const ControlledWithActions: Story = {
  render: (args) => {
    const [value, setValue] = React.useState(
      "Summarize deployment drift for staging and propose the next safest action.",
    );

    return (
      <CommandInput
        {...args}
        label="Ops command"
        description="A controlled example with supporting footer actions."
        value={value}
        onValueChange={setValue}
        actions={
          <>
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<IconRefresh size={16} />}
            >
              Retry
            </Button>
            <Button
              size="sm"
              variant="secondary"
              leftIcon={<IconSettings size={16} />}
            >
              Presets
            </Button>
          </>
        }
        onSubmit={() => undefined}
      />
    );
  },
};

export const HistoryRecall: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("");
    const [selectionMessage, setSelectionMessage] = React.useState(
      "Move the caret to the beginning of the prompt and press ArrowUp to recall a saved entry.",
    );

    return (
      <div className="space-y-md">
        <CommandInput
          {...args}
          label="Prompt history"
          description="History recall stays opt-in and only opens from the start of the prompt."
          helperText="Press ArrowUp from the beginning of the prompt to browse saved prompts."
          value={value}
          onValueChange={setValue}
          history={historyItems}
          historyEmptyState="No saved prompts match the current text."
          onHistorySelect={(item, index) => {
            setSelectionMessage(
              `Selected history #${index + 1}: ${item.label ?? item.value.slice(0, 48)}`,
            );
          }}
          onSubmit={() => undefined}
        />
        <p className="text-sm text-foreground-muted">{selectionMessage}</p>
      </div>
    );
  },
};

export const SlashCommands: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("/");
    const [selectionMessage, setSelectionMessage] = React.useState(
      "Type a leading / token to open the command picker, then use ArrowDown or keep typing to narrow the list.",
    );

    return (
      <div className="space-y-md">
        <CommandInput
          {...args}
          label="Slash commands"
          description="Leading slash commands are optional and keep the rest of the prompt freeform."
          helperText="Type / at the start of the prompt to search commands. Ctrl/Cmd + Enter still submits."
          value={value}
          onValueChange={setValue}
          slashCommands={slashCommands}
          slashCommandsEmptyState="No slash command matches that token."
          onSlashCommandSelect={(command, index) => {
            setSelectionMessage(
              `Selected command #${index + 1}: /${command.value}`,
            );
          }}
          onSubmit={() => undefined}
        />
        <p className="text-sm text-foreground-muted">{selectionMessage}</p>
      </div>
    );
  },
};

export const HistoryAndSlashCommands: Story = {
  render: (args) => {
    const [value, setValue] = React.useState("");
    const [selectionMessage, setSelectionMessage] = React.useState(
      "Press ArrowUp from the beginning of the prompt to open history, or type / to open slash commands.",
    );

    return (
      <div className="space-y-md">
        <CommandInput
          {...args}
          label="Assistant prompt"
          description="History opens from the keyboard at the start of the prompt. Slash commands appear for leading / tokens."
          helperText="ArrowUp opens history from the beginning of the prompt. Ctrl/Cmd + Enter still submits."
          value={value}
          onValueChange={setValue}
          history={historyItems}
          slashCommands={slashCommands}
          historyEmptyState="No prompt history has been saved yet."
          slashCommandsEmptyState="No slash command matches that token."
          onHistorySelect={(item) => {
            setSelectionMessage(
              `History selected: ${item.label ?? item.value.slice(0, 48)}`,
            );
          }}
          onSlashCommandSelect={(command) => {
            setSelectionMessage(`Slash command selected: /${command.value}`);
          }}
          submitLabel="Send"
          onSubmit={() => undefined}
        />
        <p className="text-sm text-foreground-muted">{selectionMessage}</p>
      </div>
    );
  },
};

export const AsyncSubmit: Story = {
  render: (args) => (
    <CommandInput
      {...args}
      label="Release note generator"
      defaultValue="Generate a concise release summary from the last 12 merged pull requests."
      clearAfterSubmit
      onSubmit={async () => {
        await new Promise((resolve) => window.setTimeout(resolve, 900));
      }}
    />
  ),
};
