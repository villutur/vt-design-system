import type { Meta, StoryObj } from "@storybook/react-vite";
import { Field } from "./Field";

const meta: Meta<typeof Field> = {
  component: Field,
  title: "Components/Forms/Field",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Field is the shared form shell for label, description, helper text, error text, required state, and message spacing. Use it directly when you need custom form markup while staying aligned with the package's standard field behavior.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Field {...args}>
        <textarea
          id="field-story-default"
          className="min-h-28 w-full rounded-lg border border-default bg-surface-subtle px-md py-sm text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Describe the release impact..."
        />
      </Field>
    </div>
  ),
  args: {
    label: "Release notes",
    htmlFor: "field-story-default",
    description:
      "Use Field to add consistent labels, descriptions, and messages.",
    helperText: "This message uses the default neutral helper styling.",
  },
};

export const ErrorState: Story = {
  render: (args) => (
    <div className="max-w-md">
      <Field {...args}>
        <input
          id="field-story-error"
          className="w-full rounded-lg border border-error/50 bg-surface-subtle px-md py-sm text-sm text-foreground outline-none focus:border-error focus:ring-2 focus:ring-error/20"
          defaultValue="production"
        />
      </Field>
    </div>
  ),
  args: {
    label: "Environment",
    htmlFor: "field-story-error",
    required: true,
    error: true,
    errorText: "Choose a supported environment before continuing.",
  },
};
