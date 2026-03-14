import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import type { Matcher } from "react-day-picker";
import {
  DatePicker,
  type DatePickerProps,
  type DateRangeValue,
} from "./DatePicker";

const baseMonth = new Date(2026, 2, 1);

const meta: Meta<typeof DatePicker> = {
  component: DatePicker,
  title: "Components/Forms/DatePicker",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "DatePicker is a field-aligned date selection primitive built on the shared forms and anchored overlay patterns. Use it for single-date and range workflows when you want the same labeling, messaging, and theme behavior as the rest of the design system.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    helperText: { control: "text" },
    error: { control: "boolean" },
    placeholder: { control: "text" },
    clearable: { control: "boolean" },
    disabled: { control: "boolean" },
    numberOfMonths: { control: { type: "number", min: 1, max: 2, step: 1 } },
    minDate: { control: false },
    maxDate: { control: false },
    disabledDates: { control: false },
    defaultMonth: { control: false },
    formatValue: { control: false },
    onValueChange: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

interface SingleDatePickerExampleProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  numberOfMonths?: number;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Matcher | Matcher[];
  defaultMonth?: Date;
  formatValue?: DatePickerProps["formatValue"];
  onValueChange?: (value: Date | undefined) => void;
  value?: Date;
  defaultValue?: Date;
}

function SingleDatePickerExample(args: SingleDatePickerExampleProps) {
  const [value, setValue] = useState<Date | undefined>(
    args.value as Date | undefined,
  );

  return (
    <div className="max-w-md">
      <DatePicker
        mode="single"
        label="Release date"
        helperText="Choose the date for the next production rollout."
        defaultMonth={baseMonth}
        {...args}
        value={value}
        onValueChange={(nextValue) => {
          setValue(nextValue as Date | undefined);
          args.onValueChange?.(nextValue as Date | undefined);
        }}
      />
    </div>
  );
}

interface RangeDatePickerExampleProps {
  label?: string;
  helperText?: string;
  error?: boolean;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  numberOfMonths?: number;
  minDate?: Date;
  maxDate?: Date;
  disabledDates?: Matcher | Matcher[];
  defaultMonth?: Date;
  formatValue?: DatePickerProps["formatValue"];
  onValueChange?: (value: DateRangeValue | undefined) => void;
  value?: DateRangeValue;
  defaultValue?: DateRangeValue;
  min?: number;
  max?: number;
  excludeDisabled?: boolean;
  resetOnSelect?: boolean;
}

function RangeDatePickerExample(args: RangeDatePickerExampleProps) {
  const [value, setValue] = useState<DateRangeValue | undefined>(
    args.value as DateRangeValue | undefined,
  );

  return (
    <div className="max-w-md">
      <DatePicker
        mode="range"
        label="Maintenance window"
        helperText="Pick a start and end date for the planned maintenance."
        defaultMonth={baseMonth}
        numberOfMonths={2}
        {...args}
        value={value}
        onValueChange={(nextValue) => {
          setValue(nextValue as DateRangeValue | undefined);
          args.onValueChange?.(nextValue as DateRangeValue | undefined);
        }}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => (
    <SingleDatePickerExample {...(args as SingleDatePickerExampleProps)} />
  ),
  args: {
    onValueChange: fn(),
  },
};

export const ErrorState: Story = {
  render: (args) => (
    <SingleDatePickerExample {...(args as SingleDatePickerExampleProps)} />
  ),
  args: {
    error: true,
    helperText: "A release date is required before continuing.",
    onValueChange: fn(),
  },
};

export const RangeMode: Story = {
  render: (args) => (
    <RangeDatePickerExample {...(args as RangeDatePickerExampleProps)} />
  ),
  args: {
    onValueChange: fn(),
  },
};

export const SingleDateSelection: Story = {
  render: (args) => (
    <SingleDatePickerExample {...(args as SingleDatePickerExampleProps)} />
  ),
  args: {
    onValueChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /release date/i });

    await userEvent.click(trigger);
    await userEvent.click(
      within(document.body).getByRole("button", { name: /march 12/i }),
    );

    await expect(trigger).toHaveTextContent(/mar 12, 2026/i);
    await expect(args.onValueChange).toHaveBeenCalled();
  },
};

export const RangeSelectionAndEscape: Story = {
  render: (args) => (
    <RangeDatePickerExample {...(args as RangeDatePickerExampleProps)} />
  ),
  args: {
    disabledDates: { dayOfWeek: [0, 6] },
    onValueChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /maintenance window/i });

    await userEvent.click(trigger);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await expect(
      within(document.body).getByRole("button", { name: /march 7/i }),
    ).toBeDisabled();

    await new Promise((resolve) => setTimeout(resolve, 500));
    await userEvent.click(
      within(document.body).getByRole("button", { name: /march 10/i }),
    );
    await new Promise((resolve) => setTimeout(resolve, 500));
    await userEvent.click(trigger);
    await new Promise((resolve) => setTimeout(resolve, 500));

    await userEvent.click(
      within(document.body).getByRole("button", { name: /march 13/i }),
    );

    await expect(trigger).toHaveTextContent(/mar 10, 2026/i);
    await expect(trigger).toHaveTextContent(/mar 13, 2026/i);
    await expect(args.onValueChange).toHaveBeenCalled();

    await userEvent.click(trigger);
    await expect(within(document.body).getByRole("dialog")).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(
      within(document.body).queryByRole("dialog"),
    ).not.toBeInTheDocument();
  },
};
