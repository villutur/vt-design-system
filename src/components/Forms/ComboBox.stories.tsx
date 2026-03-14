import { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { IconActivity, IconPalette, IconServer2, IconSettings, IconUsers } from "@tabler/icons-react";
import { ComboBox, type ComboBoxOption } from "./ComboBox";

const options: ComboBoxOption[] = [
  {
    value: "alex",
    label: "Alex Morgan",
    description: "Platform engineering",
    keywords: ["owner", "frontend"],
    group: "Engineering",
    icon: <IconUsers size={16} />,
  },
  {
    value: "jamie",
    label: "Jamie Rivera",
    description: "Design systems",
    keywords: ["design", "ui"],
    group: "Engineering",
    icon: <IconPalette size={16} />,
  },
  {
    value: "sam",
    label: "Sam Patel",
    description: "Workspace operations",
    keywords: ["ops", "settings"],
    group: "Operations",
    icon: <IconSettings size={16} />,
  },
  {
    value: "riley",
    label: "Riley Turner",
    description: "Release automation",
    keywords: ["delivery", "automation"],
    group: "Operations",
    icon: <IconActivity size={16} />,
  },
  {
    value: "noah",
    label: "Noah Chen",
    description: "Read only",
    disabled: true,
    group: "Observers",
  },
];

const remoteOptions: ComboBoxOption[] = [
  {
    value: "release-console",
    label: "Release Console",
    description: "Production deployment dashboard",
    keywords: ["deploy", "prod", "release"],
    group: "Workspaces",
    icon: <IconServer2 size={16} />,
  },
  {
    value: "design-lab",
    label: "Design Lab",
    description: "Component review and QA flows",
    keywords: ["design", "figma", "review"],
    group: "Workspaces",
    icon: <IconPalette size={16} />,
  },
  {
    value: "ops-bridge",
    label: "Ops Bridge",
    description: "Incident response coordination",
    keywords: ["ops", "incident", "support"],
    group: "Workspaces",
    icon: <IconSettings size={16} />,
  },
  {
    value: "team-hub",
    label: "Team Hub",
    description: "People, permissions, and ownership",
    keywords: ["users", "workspace", "owner"],
    group: "Administration",
    icon: <IconUsers size={16} />,
  },
  {
    value: "activity-feed",
    label: "Activity Feed",
    description: "Operational event stream",
    keywords: ["activity", "events", "audit"],
    group: "Monitoring",
    icon: <IconActivity size={16} />,
  },
];

const meta: Meta<typeof ComboBox> = {
  component: ComboBox,
  title: "Components/Forms/ComboBox",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "ComboBox combines the shared Field form pattern with an anchored searchable option panel. It supports single-value and multi-value selection, async-friendly search/loading flows, and creatable entries while keeping its label, helper text, and error behavior aligned with the rest of the forms layer. The accessibility pass also adds stronger search labeling, option-count announcements, and clearer selected-value naming.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    description: { control: "text" },
    helperText: { control: "text" },
    error: { control: "boolean" },
    required: { control: "boolean" },
    placeholder: { control: "text" },
    searchPlaceholder: { control: "text" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    multiple: { control: "boolean" },
    loading: { control: "boolean" },
    creatable: { control: "boolean" },
    filterOptions: { control: "boolean" },
    emptyState: { control: "text" },
    loadingText: { control: "text" },
    options: { control: false },
    value: { control: false },
    defaultValue: { control: false },
    values: { control: false },
    defaultValues: { control: false },
    searchQuery: { control: false },
    onValueChange: { control: false },
    onValuesChange: { control: false },
    onSearchQueryChange: { control: false },
    onCreateOption: { control: false },
    createOptionLabel: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof ComboBox>;
type ComboBoxProps = React.ComponentProps<typeof ComboBox>;

function createValueFromQuery(query: string) {
  return (
    query
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || query.trim()
  );
}

function SingleValueExample(args: Partial<ComboBoxProps>) {
  const [value, setValue] = useState<string | undefined>(args.value ?? args.defaultValue);

  return (
    <div className="max-w-md">
      <ComboBox
        options={options}
        placeholder="Select an owner..."
        searchPlaceholder="Search teammates..."
        {...args}
        value={value}
        onValueChange={(nextValue, option) => {
          setValue(nextValue);
          args.onValueChange?.(nextValue, option);
        }}
      />
    </div>
  );
}

function MultiSelectExample(args: Partial<ComboBoxProps>) {
  const [values, setValues] = useState<string[]>(args.values ?? args.defaultValues ?? []);

  return (
    <div className="max-w-lg">
      <ComboBox
        options={options}
        placeholder="Select reviewers..."
        searchPlaceholder="Search teammates..."
        {...args}
        multiple
        values={values}
        onValuesChange={(nextValues, nextOptions) => {
          setValues(nextValues);
          args.onValuesChange?.(nextValues, nextOptions);
        }}
      />
    </div>
  );
}

function AsyncOptionsExample(args: Partial<ComboBoxProps>) {
  const [value, setValue] = useState<string | undefined>(args.value ?? args.defaultValue);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [asyncOptions, setAsyncOptions] = useState<ComboBoxOption[]>(remoteOptions.slice(0, 4));

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      const normalizedQuery = query.trim().toLowerCase();
      const nextOptions = normalizedQuery
        ? remoteOptions.filter((option) =>
            [option.label, option.description ?? "", option.group ?? "", option.value, ...(option.keywords ?? [])]
              .join(" ")
              .toLowerCase()
              .includes(normalizedQuery),
          )
        : remoteOptions.slice(0, 4);

      setAsyncOptions(nextOptions);
      setLoading(false);
    }, 450);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="max-w-md">
      <ComboBox
        options={asyncOptions}
        placeholder="Search remote workspaces..."
        searchPlaceholder="Search workspaces..."
        filterOptions={false}
        loading={loading}
        loadingText="Searching workspaces..."
        {...args}
        value={value}
        searchQuery={query}
        onSearchQueryChange={setQuery}
        onValueChange={(nextValue, option) => {
          setValue(nextValue);
          args.onValueChange?.(nextValue, option);
        }}
      />
    </div>
  );
}

function CreatableExample(args: Partial<ComboBoxProps>) {
  const [value, setValue] = useState<string | undefined>(args.value ?? args.defaultValue);
  const [localOptions, setLocalOptions] = useState<ComboBoxOption[]>(options.slice(0, 3));

  return (
    <div className="max-w-md">
      <ComboBox
        options={localOptions}
        placeholder="Search or create a teammate..."
        searchPlaceholder="Search or create teammates..."
        creatable
        createOptionLabel={(query) => `Invite "${query}"`}
        {...args}
        value={value}
        onCreateOption={async (query) => {
          await new Promise((resolve) => setTimeout(resolve, 300));

          const nextOption: ComboBoxOption = {
            value: createValueFromQuery(query),
            label: query,
            description: "Created from the command surface",
            group: "Custom",
            icon: <IconUsers size={16} />,
          };

          setLocalOptions((currentOptions) =>
            currentOptions.some((option) => option.value === nextOption.value)
              ? currentOptions
              : [...currentOptions, nextOption],
          );

          return nextOption;
        }}
        onValueChange={(nextValue, option) => {
          setValue(nextValue);
          args.onValueChange?.(nextValue, option);
        }}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <SingleValueExample {...args} />,
  args: {
    label: "Owner",
    helperText: "Assign a primary owner for this workspace.",
    options,
    onValueChange: fn(),
  },
};

export const MultiSelect: Story = {
  render: (args) => <MultiSelectExample {...args} />,
  args: {
    label: "Reviewers",
    helperText: "Pick one or more teammates for the release review.",
    options,
    onValuesChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");

    await userEvent.click(trigger);
    await userEvent.click(within(document.body).getByText("Alex Morgan"));
    await userEvent.click(within(document.body).getByText("Jamie Rivera"));

    await expect(trigger).toHaveTextContent(/alex morgan/i);
    await expect(trigger).toHaveTextContent(/jamie rivera/i);
    await expect(args.onValuesChange).toHaveBeenCalled();

    await userEvent.click(canvas.getByRole("button", { name: /clear selections/i }));

    await expect(trigger).toHaveTextContent(/select reviewers/i);
  },
};

export const AsyncOptions: Story = {
  render: (args) => <AsyncOptionsExample {...args} />,
  args: {
    label: "Remote workspace",
    helperText: "This example disables client filtering and simulates remote search.",
    options: remoteOptions,
    onValueChange: fn(),
  },
};

export const Creatable: Story = {
  render: (args) => <CreatableExample {...args} />,
  args: {
    label: "Guest reviewer",
    helperText: "Search the current list or create a new reviewer inline.",
    options,
    onValueChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");

    await userEvent.click(trigger);

    const searchInput = within(document.body).getByPlaceholderText(/search or create teammates/i);
    await userEvent.type(searchInput, "Taylor Greene");
    await userEvent.keyboard("{Enter}");

    await waitFor(() => expect(trigger).toHaveTextContent(/taylor greene/i));
    await expect(args.onValueChange).toHaveBeenCalled();
  },
};

export const ErrorState: Story = {
  render: (args) => <SingleValueExample {...args} />,
  args: {
    label: "Deployment owner",
    helperText: "Please choose an owner before continuing.",
    error: true,
    options,
    onValueChange: fn(),
  },
};

export const Disabled: Story = {
  render: (args) => <SingleValueExample {...args} />,
  args: {
    label: "Assignee",
    disabled: true,
    value: "jamie",
    options,
    onValueChange: fn(),
  },
};

export const FilterSelectAndClear: Story = {
  render: (args) => <SingleValueExample {...args} />,
  args: {
    label: "Assignee",
    helperText: "Search by name, team, or keyword.",
    options,
    onValueChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox");

    await userEvent.click(trigger);

    const searchInput = within(document.body).getByPlaceholderText(/search teammates/i);
    await userEvent.type(searchInput, "alex");
    await userEvent.keyboard("{ArrowDown}{Enter}");

    await expect(trigger).toHaveTextContent(/alex morgan/i);
    await expect(args.onValueChange).toHaveBeenCalled();

    await userEvent.click(canvas.getByRole("button", { name: /clear selection/i }));

    await expect(trigger).toHaveTextContent(/select an owner/i);
  },
};
