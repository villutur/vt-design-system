import type { Meta, StoryObj } from "@storybook/react-vite";
import { Modal } from "./Modal";
import { Button } from "../Forms/Button";
import { Input } from "../Forms/Input";
import { Select } from "../Forms/Select";
import { useState } from "react";

const meta: Meta<typeof Modal> = {
  component: Modal,
  title: "Components/Overlay/Modal",
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Modal is the blocking dialog surface for high-importance decisions and focused workflows. It belongs to the dialog layer, not the anchored overlay layer, and it manages modal behaviors such as focus movement, dismissal, scroll locking, and accessible dialog labeling.",
      },
    },
  },
  argTypes: {
    isOpen: { control: "boolean" },
    title: { control: "text" },
    description: { control: "text" },
    primaryActionLabel: { control: "text" },
    primaryActionVariant: {
      control: "radio",
      options: ["primary", "danger"],
    },
    primaryActionLoading: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Default: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex w-full items-center justify-center p-12">
        <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Confirm action"
          description="Are you sure you want to perform this action? This cannot be undone."
          primaryActionOnClick={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const DangerAction: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex w-full items-center justify-center p-12">
        <Button variant="danger" onClick={() => setIsOpen(true)}>
          Delete Project
        </Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Delete Project"
          description="This will permanently delete your project and all of its associated data. Are you absolutely sure?"
          primaryActionLabel="Delete permanently"
          primaryActionVariant="danger"
          primaryActionOnClick={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const WithCustomContent: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex w-full items-center justify-center p-12">
        <Button onClick={() => setIsOpen(true)}>Invite User</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Invite User"
          primaryActionLabel="Send Invite"
          primaryActionOnClick={() => setIsOpen(false)}
        >
          <div className="space-y-md py-md">
            <Input
              type="email"
              label="Email address"
              placeholder="colleague@company.com"
              helperText="We will send a workspace invitation to this address."
            />
            <Select
              label="Role"
              options={[
                { value: "member", label: "Member" },
                { value: "admin", label: "Admin" },
                { value: "viewer", label: "Viewer" },
              ]}
              defaultValue="member"
            />
          </div>
        </Modal>
      </div>
    );
  },
};

export const NonDismissibleBackdrop: Story = {
  render: (args) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="flex w-full items-center justify-center p-12">
        <Button onClick={() => setIsOpen(true)}>Open guarded modal</Button>
        <Modal
          {...args}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Pending verification"
          description="This confirmation requires an explicit action, so clicking the backdrop will not close it."
          closeOnBackdropClick={false}
          primaryActionLabel="Continue"
          primaryActionOnClick={() => setIsOpen(false)}
        />
      </div>
    );
  },
};
