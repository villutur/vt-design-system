import type { Meta, StoryObj } from "@storybook/react-vite";
import { MarkdownRenderer } from "./MarkdownRenderer";

const statusOverviewImage =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='640' height='320' viewBox='0 0 640 320'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23dbeafe'/%3E%3Cstop offset='1' stop-color='%23bfdbfe'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='640' height='320' rx='28' fill='url(%23g)'/%3E%3Crect x='48' y='60' width='220' height='24' rx='12' fill='%231e3a8a' fill-opacity='.12'/%3E%3Crect x='48' y='102' width='544' height='14' rx='7' fill='%231e3a8a' fill-opacity='.12'/%3E%3Crect x='48' y='132' width='468' height='14' rx='7' fill='%231e3a8a' fill-opacity='.12'/%3E%3Crect x='48' y='186' width='152' height='92' rx='20' fill='%23ffffff' fill-opacity='.74'/%3E%3Crect x='224' y='168' width='160' height='110' rx='20' fill='%23ffffff' fill-opacity='.84'/%3E%3Crect x='408' y='144' width='176' height='134' rx='20' fill='%23ffffff' fill-opacity='.94'/%3E%3C/svg%3E";

const richMarkdown = `# Incident Briefing

Keep the response surface readable when the model mixes prose, data, and snippets.

> Render markdown as a real product surface instead of leaving each consuming app to restyle it.

## What shipped

- Shared paragraph, heading, and blockquote styling
- GFM tables and fenced code blocks
- Responsive inline images and normal anchor behavior

### Suggested follow-up

1. Wire the renderer into streaming response components
2. Reuse it in release notes and docs previews
3. Keep raw HTML disabled in v1

Use [CommandInput](?path=/docs/components-forms-commandinput--docs) to pair prompt composition with response rendering.

![Status overview](${statusOverviewImage})
`;

const dataMarkdown = `## Release Notes

| Area | Status | Notes |
| --- | --- | --- |
| Renderer | Complete | Shared styles now live in one place |
| Tool calls | In progress | Will render through AIResponseView |
| Rich media | Planned | Audio rows stay lightweight in v1 |

\`\`\`tsx
import { MarkdownRenderer } from "vt-design-system";

export function ReleaseSummary() {
  return <MarkdownRenderer content={markdown} codeTheme="dark" />;
}
\`\`\`
`;

const meta: Meta<typeof MarkdownRenderer> = {
  component: MarkdownRenderer,
  title: "Components/DataDisplay/MarkdownRenderer",
  tags: ["autodocs"],
  args: {
    content: richMarkdown,
    density: "default",
    codeTheme: "auto",
  },
  argTypes: {
    content: { control: "text" },
    density: {
      control: "radio",
      options: ["default", "compact"],
    },
    codeTheme: {
      control: "radio",
      options: ["auto", "light", "dark"],
    },
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof MarkdownRenderer>;

export const Default: Story = {};

export const CompactDensity: Story = {
  args: {
    density: "compact",
  },
};

export const TablesAndCodeFences: Story = {
  args: {
    content: dataMarkdown,
    codeTheme: "light",
  },
};

export const DarkThemeReference: Story = {
  args: {
    content: dataMarkdown,
    codeTheme: "dark",
  },
  decorators: [
    (Story) => (
      <div className="dark rounded-2xl bg-foreground p-lg">
        <div className="rounded-2xl border border-default bg-surface p-lg">
          <Story />
        </div>
      </div>
    ),
  ],
};
