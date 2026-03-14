import { useState, type ComponentProps } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FileUpload, type FileUploadItem } from "./FileUpload";

function createMockFile(name: string, content: string, type: string) {
  return new File([content], name, { type });
}

const meta: Meta<typeof FileUpload> = {
  component: FileUpload,
  title: "Components/Forms/FileUpload",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "FileUpload provides a field-aligned dropzone with validation, upload state display, and accessible status messaging. The dropzone announces add, reject, remove, and upload-summary changes without requiring consumers to build their own live-region wiring.",
      },
    },
  },
  argTypes: {
    label: { control: "text" },
    helperText: { control: "text" },
    error: { control: "boolean" },
    multiple: { control: "boolean" },
    maxFiles: { control: { type: "number", min: 1, max: 10, step: 1 } },
    maxSize: { control: { type: "number", min: 0, step: 1024 } },
    minSize: { control: { type: "number", min: 0, step: 256 } },
    disabled: { control: "boolean" },
    accept: { control: false },
    items: { control: false },
    defaultItems: { control: false },
    onItemsChange: { control: false },
    onAddFiles: { control: false },
    onRejectedFiles: { control: false },
  },
};

export default meta;
type Story = StoryObj<typeof FileUpload>;

function UploadExample(args: Partial<ComponentProps<typeof FileUpload>>) {
  const [items, setItems] = useState<FileUploadItem[]>(args.items ?? []);

  return (
    <div className="max-w-xl">
      <FileUpload
        label="Attachments"
        helperText="Drop release notes, specs, or screenshots."
        {...args}
        items={items}
        onItemsChange={(nextItems) => {
          setItems(nextItems);
          args.onItemsChange?.(nextItems);
        }}
      />
    </div>
  );
}

export const Default: Story = {
  render: (args) => <UploadExample {...args} />,
  args: {
    onItemsChange: fn(),
    onRejectedFiles: fn(),
  },
};

export const WithProgress: Story = {
  render: (args) => <UploadExample {...args} />,
  args: {
    items: [
      {
        id: "release-notes",
        file: createMockFile(
          "release-notes.md",
          "release notes",
          "text/markdown",
        ),
        status: "uploading",
        progress: 68,
      },
      {
        id: "tokens",
        file: createMockFile("tokens.json", "{}", "application/json"),
        status: "success",
        progress: 100,
      },
      {
        id: "report",
        file: createMockFile("audit-report.pdf", "pdf", "application/pdf"),
        status: "error",
        error: "Upload failed. Please retry.",
      },
    ],
    onItemsChange: fn(),
  },
};

export const DisabledAtCapacity: Story = {
  render: (args) => <UploadExample {...args} />,
  args: {
    disabled: true,
    items: [
      {
        id: "release-archive",
        file: createMockFile("release-archive.zip", "archive", "application/zip"),
        status: "success",
        progress: 100,
      },
    ],
    maxFiles: 1,
    onItemsChange: fn(),
  },
};

export const UploadAndRemove: Story = {
  render: (args) => <UploadExample {...args} />,
  args: {
    onItemsChange: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const fileInput = canvasElement.querySelector(
      "input[type='file']",
    ) as HTMLInputElement;

    await userEvent.upload(
      fileInput,
      createMockFile("release-plan.txt", "deploy checklist", "text/plain"),
    );

    const canvas = within(canvasElement);
    await expect(canvas.getByText(/release-plan\.txt/i)).toBeInTheDocument();
    await expect(args.onItemsChange).toHaveBeenCalled();

    await userEvent.click(
      canvas.getByRole("button", { name: /remove release-plan\.txt/i }),
    );

    await expect(
      canvas.queryByText(/release-plan\.txt/i),
    ).not.toBeInTheDocument();
  },
};

export const RejectLargeFile: Story = {
  render: (args) => <UploadExample {...args} />,
  args: {
    maxSize: 10,
    onRejectedFiles: fn(),
  },
  play: async ({ canvasElement, args }) => {
    const fileInput = canvasElement.querySelector(
      "input[type='file']",
    ) as HTMLInputElement;

    await userEvent.upload(
      fileInput,
      createMockFile("too-large.txt", "this file is too large", "text/plain"),
    );

    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(/some files could not be added/i),
    ).toBeInTheDocument();
    await expect(args.onRejectedFiles).toHaveBeenCalled();
  },
};
