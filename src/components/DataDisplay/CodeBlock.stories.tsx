import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { CodeBlock } from "./CodeBlock";

const meta: Meta<typeof CodeBlock> = {
  component: CodeBlock,
  title: "Components/DataDisplay/CodeBlock",
  tags: ["autodocs"],
  argTypes: {
    language: { control: "text" },
    title: { control: "text" },
    showLineNumbers: { control: "boolean" },
    copyable: { control: "boolean" },
    wrapLongLines: { control: "boolean" },
    theme: {
      control: "radio",
      options: ["auto", "light", "dark"],
    },
    highlightLines: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof CodeBlock>;

const sampleCode = `import { Button } from "vt-design-system";

export function Example() {
  return (
    <Button variant="primary" size="sm">
      Save changes
    </Button>
  );
}`;

export const Default: Story = {
  args: {
    title: "Example.tsx",
    language: "tsx",
    code: sampleCode,
    showLineNumbers: true,
    copyable: true,
    highlightLines: [4],
    theme: "auto",
  },
};

export const ForcedLight: Story = {
  args: {
    ...Default.args,
    title: "Example.light.tsx",
    theme: "light",
  },
};

export const ForcedDark: Story = {
  args: {
    ...Default.args,
    title: "Example.dark.tsx",
    theme: "dark",
  },
};

export const Wrapped: Story = {
  args: {
    title: "config.json",
    language: "json",
    code: `{"components":{"button":{"variant":"primary","className":"w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-md py-sm text-sm font-semibold text-slate-900"}}}`,
    wrapLongLines: true,
    theme: "auto",
  },
};

export const MixedContentSurface: Story = {
  render: () => (
    <div className="dark max-w-5xl rounded-2xl bg-foreground p-lg text-foreground-inverse">
      <div className="grid gap-lg lg:grid-cols-2">
        <div className="space-y-md">
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Auto Theme
            </h3>
            <p className="mt-xs text-sm text-foreground-inverse/70">
              Follows the surrounding dark surface automatically.
            </p>
          </div>
          <CodeBlock
            title="assistant-response.ts"
            language="ts"
            code="export const status = 'streaming';"
            theme="auto"
            copyable
          />
        </div>

        <div className="space-y-md">
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase">
              Forced Light
            </h3>
            <p className="mt-xs text-sm text-foreground-inverse/70">
              Useful when a mixed-content surface needs deterministic light code
              styling.
            </p>
          </div>
          <CodeBlock
            title="tool-input.json"
            language="json"
            code={`{"action":"deploy","environment":"preview"}`}
            theme="light"
            copyable
          />
        </div>
      </div>
    </div>
  ),
};

export const CopyInteraction: Story = {
  args: {
    title: "copy-example.ts",
    language: "ts",
    code: "export const answer = 42;",
    copyable: true,
    theme: "auto",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /copy/i });
    await userEvent.click(button);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await expect(canvas.getByRole("button", { name: /copied/i })).toBeInTheDocument();
  },
};
