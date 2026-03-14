import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion, AccordionItem } from "./Accordion";

const meta: Meta<typeof Accordion> = {
  component: Accordion,
  title: "Components/Surfaces/Accordion",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: { type: "radio" },
      options: ["single", "multiple"],
      description: "Whether multiple panels can be open simultaneously",
    },
    collapsible: {
      control: "boolean",
      description: "Whether an open panel can be closed (only for 'single' type)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
  args: {
    type: "single",
    collapsible: true,
    defaultValue: "item-1",
  },
  render: (args) => (
    <Accordion {...args} className="w-full">
      <AccordionItem value="item-1" title="Is it accessible?">
        Yes. It adheres to the WAI-ARIA design pattern.
      </AccordionItem>
      <AccordionItem value="item-2" title="Is it styled?">
        Yes. It comes with default styles that match the other components&apos; aesthetic.
      </AccordionItem>
      <AccordionItem value="item-3" title="Is it animated?">
        Yes. It's animated by default using Tailwind CSS and Radix UI primitives.
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  args: {
    type: "multiple",
    defaultValue: ["features", "installation"],
  },
  render: (args) => (
    <Accordion {...args} className="w-full">
      <AccordionItem value="features" title="Core Features">
        Includes data tables, interactive charts, and resizable layout panels.
      </AccordionItem>
      <AccordionItem value="installation" title="Installation Guide">
        Run `pnpm install`, import `vt-design-system/theme.css` in your app
        stylesheet, then import `vt-design-system/styles.css` at the app root.
      </AccordionItem>
    </Accordion>
  ),
};
