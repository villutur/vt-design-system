import React, { useEffect, useState } from "react";
import {
  IconActivity,
  IconDownload,
  IconPalette,
  IconRefresh,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import {
  Button,
  Checkbox,
  ComboBox,
  CommandInput,
  type ComboBoxOption,
  DatePicker,
  Field,
  FileUpload,
  Input,
  NumberInput,
  Radio,
  SectionPanel,
  Select,
  SplitButton,
  Textarea,
  Toggle,
  useToast,
} from "../../../src/index";
import type { DateRangeValue, FileUploadItem } from "../../../src/index";

const comboBoxOptions: ComboBoxOption[] = [
  {
    value: "alex",
    label: "Alex Morgan",
    description: "Platform engineering",
    group: "Engineering",
    keywords: ["frontend", "owner"],
    icon: <IconUsers size={16} />,
  },
  {
    value: "jamie",
    label: "Jamie Rivera",
    description: "Design systems",
    group: "Engineering",
    keywords: ["design", "ui"],
    icon: <IconPalette size={16} />,
  },
  {
    value: "sam",
    label: "Sam Patel",
    description: "Workspace operations",
    group: "Operations",
    keywords: ["ops", "settings"],
    icon: <IconSettings size={16} />,
  },
  {
    value: "riley",
    label: "Riley Turner",
    description: "Release automation",
    group: "Operations",
    keywords: ["delivery", "automation"],
    icon: <IconActivity size={16} />,
  },
  {
    value: "noah",
    label: "Noah Chen",
    description: "Read only",
    group: "Observers",
    disabled: true,
  },
];

const remoteComboBoxOptions: ComboBoxOption[] = [
  {
    value: "release-console",
    label: "Release Console",
    description: "Production deployment dashboard",
    group: "Workspaces",
    keywords: ["release", "deploy", "prod"],
    icon: <IconActivity size={16} />,
  },
  {
    value: "design-lab",
    label: "Design Lab",
    description: "Component review and QA flows",
    group: "Workspaces",
    keywords: ["design", "review", "ui"],
    icon: <IconPalette size={16} />,
  },
  {
    value: "ops-bridge",
    label: "Ops Bridge",
    description: "Incident response coordination",
    group: "Operations",
    keywords: ["ops", "incident", "support"],
    icon: <IconSettings size={16} />,
  },
  {
    value: "team-hub",
    label: "Team Hub",
    description: "People, permissions, and workspace ownership",
    group: "Administration",
    keywords: ["users", "owners", "workspace"],
    icon: <IconUsers size={16} />,
  },
];

const commandHistory = [
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

const commandSlashCommands = [
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
    shortcut: "Cmd+E",
  },
];

function createComboBoxValue(query: string) {
  return (
    query
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || query.trim()
  );
}

export function FormsSection() {
  const [toggleState, setToggleState] = useState(false);
  const [numberVal, setNumberVal] = useState(5);
  const [comboBoxValue, setComboBoxValue] = useState<string | undefined>(
    "jamie",
  );
  const [reviewerValues, setReviewerValues] = useState<string[]>([
    "alex",
    "sam",
  ]);
  const [reviewerOptions, setReviewerOptions] =
    useState<ComboBoxOption[]>(comboBoxOptions);
  const [controlledCommandValue, setControlledCommandValue] = useState(
    "Summarize deployment drift for staging and propose the next safest action.",
  );
  const [historyRecallValue, setHistoryRecallValue] = useState("");
  const [historySelectionMessage, setHistorySelectionMessage] = useState(
    "Move the caret to the beginning of the prompt and press ArrowUp to recall a saved entry.",
  );
  const [slashCommandValue, setSlashCommandValue] = useState("/");
  const [slashSelectionMessage, setSlashSelectionMessage] = useState(
    "Type a leading / token to open the command picker, then use ArrowDown or keep typing to narrow the list.",
  );
  const [historyAndSlashValue, setHistoryAndSlashValue] = useState("");
  const [historyAndSlashMessage, setHistoryAndSlashMessage] = useState(
    "Press ArrowUp from the beginning of the prompt to open history, or type / to open slash commands.",
  );
  const [remoteComboBoxValue, setRemoteComboBoxValue] = useState<
    string | undefined
  >();
  const [remoteQuery, setRemoteQuery] = useState("");
  const [remoteLoading, setRemoteLoading] = useState(false);
  const [remoteResults, setRemoteResults] = useState<ComboBoxOption[]>(
    remoteComboBoxOptions.slice(0, 3),
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(2026, 2, 12),
  );
  const [selectedRange, setSelectedRange] = useState<
    DateRangeValue | undefined
  >({
    from: new Date(2026, 2, 18),
    to: new Date(2026, 2, 22),
  });
  const [fileUploadItems, setFileUploadItems] = useState<FileUploadItem[]>(
    () => [
      {
        id: "release-notes",
        file: new File(["release notes"], "release-notes.md", {
          type: "text/markdown",
        }),
        status: "uploading",
        progress: 68,
      },
      {
        id: "design-tokens",
        file: new File(["{}"], "design-tokens.json", {
          type: "application/json",
        }),
        status: "success",
        progress: 100,
      },
    ],
  );
  const { toast } = useToast();

  useEffect(() => {
    setRemoteLoading(true);

    const timeout = setTimeout(() => {
      const normalizedQuery = remoteQuery.trim().toLowerCase();
      const nextOptions = normalizedQuery
        ? remoteComboBoxOptions.filter((option) =>
            [
              option.label,
              option.description ?? "",
              option.group ?? "",
              option.value,
              ...(option.keywords ?? []),
            ]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery),
          )
        : remoteComboBoxOptions.slice(0, 3);

      setRemoteResults(nextOptions);
      setRemoteLoading(false);
    }, 450);

    return () => clearTimeout(timeout);
  }, [remoteQuery]);

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Forms & Inputs</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          Input primitives, searchable selects, date picking, and file upload
          patterns for product workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionPanel
          title="Buttons"
          subtitle="Action hierarchy and size scale"
        >
          <div className="flex flex-wrap items-center gap-2">
            <Button size="xs" variant="secondary">
              XSmall
            </Button>
            <Button size="sm" variant="secondary">
              Small
            </Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
            <Button size="xs" variant="danger">
              XS Danger
            </Button>
            <SplitButton
              size="sm"
              variant="secondary"
              className="ml-sm"
              onClick={() =>
                toast({
                  title: "Export started",
                  description:
                    "The default CSV export was added to the background queue.",
                  type: "info",
                })
              }
              actions={[
                {
                  label: "Export CSV",
                  description: "Download the current filtered dataset.",
                  icon: <IconDownload size={16} />,
                  onSelect: () =>
                    toast({
                      title: "CSV export queued",
                      description: "The default export is being prepared.",
                      type: "success",
                    }),
                },
                {
                  label: "Refresh first",
                  description: "Sync latest records before exporting.",
                  icon: <IconRefresh size={16} />,
                  onSelect: () =>
                    toast({
                      title: "Data refreshed",
                      description: "The source data was updated before export.",
                      type: "info",
                    }),
                },
                {
                  label: "Export settings",
                  description: "Choose columns and output format.",
                  icon: <IconSettings size={16} />,
                  separatorBefore: true,
                  onSelect: () =>
                    toast({
                      title: "Export settings opened",
                      description:
                        "Column and format options are now available.",
                      type: "default",
                    }),
                },
              ]}
            >
              Export
            </SplitButton>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Selection Controls"
          subtitle="Binary and single-choice inputs"
        >
          <div className="flex flex-col gap-md">
            <Checkbox id="checkbox1" label="Accept terms and conditions" />
            <Radio id="radio1" name="radiogroup" label="Option A" />
            <Radio id="radio2" name="radiogroup" label="Option B" />
            <Toggle
              id="toggle1"
              label="Enable feature"
              checked={toggleState}
              onChange={(event) => setToggleState(event.target.checked)}
            />
          </div>
        </SectionPanel>

        <SectionPanel
          title="Text & Numeric Inputs"
          subtitle="Freeform and constrained entry"
        >
          <div className="space-y-md">
            <Field
              label="Custom field shell"
              description="Use the shared Field primitive when a control needs custom markup."
              helperText="The shell keeps labels and messages aligned with other form controls."
              htmlFor="custom-field-shell"
            >
              <textarea
                id="custom-field-shell"
                className="min-h-24 w-full rounded-lg border border-default bg-surface-subtle px-md py-sm text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                defaultValue="This textarea is wrapped by Field."
              />
            </Field>
            <Textarea
              label="Textarea"
              helperText="Use the shared multiline control when you do not need history or slash-command behavior."
              placeholder="Capture the details of the next rollout, bug report, or prompt draft..."
              defaultValue="Summarize the current staging drift, call out the largest risk, and propose the next safest step."
            />
            <Input
              label="Default input (md)"
              placeholder="Enter something..."
            />
            <Input
              label="Compact input (xs)"
              size="xs"
              placeholder="Compact..."
            />
            <Input
              label="Error state"
              error
              helperText="This field is required."
              placeholder="Will show red border"
            />

            <NumberInput
              label="NumberInput"
              value={numberVal}
              onChange={setNumberVal}
              min={0}
              max={100}
              helperText="Min: 0 / Max: 100"
            />
          </div>
        </SectionPanel>

        <SectionPanel
          title="Select & ComboBox"
          subtitle="Standard select and searchable option picking"
        >
          <div className="space-y-md">
            <Select
              label="Select Box"
              options={[
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ]}
            />

            <ComboBox
              label="Owner"
              helperText="Search by name, team, or keyword."
              options={comboBoxOptions}
              value={comboBoxValue}
              onValueChange={setComboBoxValue}
              placeholder="Select an owner..."
              searchPlaceholder="Search teammates..."
            />

            <ComboBox
              multiple
              creatable
              label="Reviewers"
              helperText="Select multiple reviewers or create a new guest reviewer inline."
              options={reviewerOptions}
              values={reviewerValues}
              onValuesChange={setReviewerValues}
              onCreateOption={async (query) => {
                await new Promise((resolve) => setTimeout(resolve, 250));

                const nextOption: ComboBoxOption = {
                  value: createComboBoxValue(query),
                  label: query,
                  description: "Created from the preview flow",
                  group: "Guests",
                  icon: <IconUsers size={16} />,
                };

                setReviewerOptions((currentOptions) =>
                  currentOptions.some(
                    (option) => option.value === nextOption.value,
                  )
                    ? currentOptions
                    : [...currentOptions, nextOption],
                );

                return nextOption;
              }}
              createOptionLabel={(query) => `Invite "${query}"`}
              placeholder="Select reviewers..."
              searchPlaceholder="Search or create teammates..."
            />

            <ComboBox
              label="Remote workspace"
              helperText="This example disables client filtering and simulates async remote search."
              options={remoteResults}
              value={remoteComboBoxValue}
              onValueChange={setRemoteComboBoxValue}
              searchQuery={remoteQuery}
              onSearchQueryChange={setRemoteQuery}
              filterOptions={false}
              loading={remoteLoading}
              loadingText="Searching workspaces..."
              placeholder="Search remote workspaces..."
              searchPlaceholder="Search workspaces..."
            />
          </div>
        </SectionPanel>

        <SectionPanel
          title="DatePicker"
          subtitle="Single date and range selection"
          className="xl:col-span-2"
        >
          <div className="grid gap-md md:grid-cols-2">
            <DatePicker
              label="DatePicker"
              helperText="Choose the next release date."
              value={selectedDate}
              onValueChange={(value) =>
                setSelectedDate(value as Date | undefined)
              }
              defaultMonth={new Date(2026, 2, 1)}
              minDate={new Date(2026, 2, 1)}
              maxDate={new Date(2026, 3, 30)}
            />
            <DatePicker
              mode="range"
              label="Date range"
              helperText="Plan the maintenance window."
              value={selectedRange}
              onValueChange={(value) =>
                setSelectedRange(value as DateRangeValue | undefined)
              }
              defaultMonth={new Date(2026, 2, 1)}
              numberOfMonths={2}
              disabledDates={{ dayOfWeek: [0, 6] }}
            />
          </div>
        </SectionPanel>

        <SectionPanel
          title="FileUpload"
          subtitle="Dropzone with validation and file state"
          className="xl:col-span-2"
        >
          <FileUpload
            label="FileUpload"
            helperText="Attach release notes, screenshots, and deployment specs. The dropzone announces add, reject, and remove events for assistive tech."
            items={fileUploadItems}
            onItemsChange={setFileUploadItems}
            maxFiles={5}
            maxSize={5 * 1024 * 1024}
            accept={{
              "application/json": [".json"],
              "text/markdown": [".md"],
              "image/png": [".png"],
              "image/jpeg": [".jpg", ".jpeg"],
            }}
            onRejectedFiles={(rejections) => {
              toast({
                title: "Some files were rejected",
                description:
                  rejections[0]?.errors[0]?.message ??
                  "Review file size and type requirements.",
                type: "warning",
              });
            }}
          />
        </SectionPanel>

        <SectionPanel
          title="CommandInput"
          subtitle="Prompt composition with keyboard submit, history, and slash commands"
          className="xl:col-span-2"
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <div className="space-y-md rounded-2xl border border-default bg-surface p-lg">
              <div>
                <p className="text-sm font-semibold text-foreground">Default</p>
                <p className="mt-xs text-sm text-foreground-muted">
                  The basic multiline command surface from Storybook.
                </p>
              </div>
              <CommandInput
                label="Command"
                helperText="Use Ctrl/Cmd + Enter to submit quickly."
                placeholder="Describe what should happen next..."
                defaultValue="Draft a rollout summary for the latest release and highlight any risk areas."
                onSubmit={(nextValue) =>
                  toast({
                    title: "Command submitted",
                    description: nextValue,
                    type: "success",
                  })
                }
              />
            </div>

            <div className="space-y-md rounded-2xl border border-default bg-surface p-lg">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Controlled With Actions
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  Controlled value plus footer actions for retries and presets.
                </p>
              </div>
              <CommandInput
                label="Ops command"
                description="A controlled example with supporting footer actions."
                helperText="Use Ctrl/Cmd + Enter to submit quickly."
                placeholder="Describe what should happen next..."
                value={controlledCommandValue}
                onValueChange={setControlledCommandValue}
                actions={
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<IconRefresh size={16} />}
                      onClick={() =>
                        setControlledCommandValue(
                          "Summarize deployment drift for staging and propose the next safest action.",
                        )
                      }
                    >
                      Retry
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<IconSettings size={16} />}
                      onClick={() =>
                        setControlledCommandValue("/release-note draft")
                      }
                    >
                      Presets
                    </Button>
                  </>
                }
                onSubmit={(nextValue) =>
                  toast({
                    title: "Ops command submitted",
                    description: nextValue,
                    type: "info",
                  })
                }
              />
            </div>

            <div className="space-y-md rounded-2xl border border-default bg-surface p-lg">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  History Recall
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  ArrowUp opens saved prompts from the start of the textarea.
                </p>
              </div>
              <CommandInput
                label="Prompt history"
                description="History recall stays opt-in and only opens from the start of the prompt."
                helperText="Press ArrowUp from the beginning of the prompt to browse saved prompts."
                placeholder="Describe what should happen next..."
                value={historyRecallValue}
                onValueChange={setHistoryRecallValue}
                history={commandHistory}
                historyEmptyState="No saved prompts match the current text."
                onHistorySelect={(item, index) => {
                  setHistorySelectionMessage(
                    `Selected history #${index + 1}: ${item.label ?? item.value.slice(0, 48)}`,
                  );
                }}
                onSubmit={() => undefined}
              />
              <p className="text-sm text-foreground-muted">
                {historySelectionMessage}
              </p>
            </div>

            <div className="space-y-md rounded-2xl border border-default bg-surface p-lg">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Slash Commands
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  Leading slash tokens open the command picker without taking over the rest of the prompt.
                </p>
              </div>
              <CommandInput
                label="Slash commands"
                description="Leading slash commands are optional and keep the rest of the prompt freeform."
                helperText="Type / at the start of the prompt to search commands. Ctrl/Cmd + Enter still submits."
                placeholder="Describe what should happen next..."
                value={slashCommandValue}
                onValueChange={setSlashCommandValue}
                slashCommands={commandSlashCommands}
                slashCommandsEmptyState="No slash command matches that token."
                onSlashCommandSelect={(command, index) => {
                  setSlashSelectionMessage(
                    `Selected command #${index + 1}: /${command.value}`,
                  );
                }}
                onSubmit={() => undefined}
              />
              <p className="text-sm text-foreground-muted">
                {slashSelectionMessage}
              </p>
            </div>

            <div className="space-y-md rounded-2xl border border-default bg-surface p-lg">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  History And Slash Commands
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  The combined Storybook scenario for prompts that need both saved history and command helpers.
                </p>
              </div>
              <CommandInput
                label="Assistant prompt"
                description="History opens from the keyboard at the start of the prompt. Slash commands appear for leading / tokens."
                helperText="ArrowUp opens history from the beginning of the prompt. Ctrl/Cmd + Enter still submits."
                placeholder="Describe what should happen next..."
                value={historyAndSlashValue}
                onValueChange={setHistoryAndSlashValue}
                history={commandHistory}
                slashCommands={commandSlashCommands}
                historyEmptyState="No prompt history has been saved yet."
                slashCommandsEmptyState="No slash command matches that token."
                onHistorySelect={(item) => {
                  setHistoryAndSlashMessage(
                    `History selected: ${item.label ?? item.value.slice(0, 48)}`,
                  );
                }}
                onSlashCommandSelect={(command) => {
                  setHistoryAndSlashMessage(
                    `Slash command selected: /${command.value}`,
                  );
                }}
                submitLabel="Send"
                onSubmit={() => undefined}
              />
              <p className="text-sm text-foreground-muted">
                {historyAndSlashMessage}
              </p>
            </div>

            <div className="space-y-md rounded-2xl border border-default bg-surface p-lg">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Async Submit
                </p>
                <p className="mt-xs text-sm text-foreground-muted">
                  Mirrors the Storybook async example and clears the prompt after completion.
                </p>
              </div>
              <CommandInput
                label="Release note generator"
                helperText="Use Ctrl/Cmd + Enter to submit quickly."
                placeholder="Describe what should happen next..."
                defaultValue="Generate a concise release summary from the last 12 merged pull requests."
                clearAfterSubmit
                onSubmit={async (nextValue) => {
                  await new Promise((resolve) => window.setTimeout(resolve, 900));
                  toast({
                    title: "Async command completed",
                    description: nextValue,
                    type: "success",
                  });
                }}
              />
            </div>
          </div>
        </SectionPanel>
      </div>
    </section>
  );
}
