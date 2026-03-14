import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";
import { Image } from "./Image";

const landscapePreview =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='960' height='540' viewBox='0 0 960 540'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23dbeafe'/%3E%3Cstop offset='1' stop-color='%2393c5fd'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='960' height='540' rx='40' fill='url(%23g)'/%3E%3Ccircle cx='208' cy='172' r='72' fill='%23ffffff' fill-opacity='.78'/%3E%3Cpath d='M128 400l136-132 120 92 180-204 268 244H128z' fill='%23ffffff' fill-opacity='.9'/%3E%3C/svg%3E";

const tallPreview =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='540' height='720' viewBox='0 0 540 720'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23dcfce7'/%3E%3Cstop offset='1' stop-color='%2386efac'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='540' height='720' rx='36' fill='url(%23g)'/%3E%3Crect x='84' y='96' width='372' height='60' rx='18' fill='%23052e16' fill-opacity='.1'/%3E%3Crect x='84' y='196' width='372' height='364' rx='28' fill='%23ffffff' fill-opacity='.82'/%3E%3Crect x='124' y='596' width='292' height='34' rx='17' fill='%23052e16' fill-opacity='.14'/%3E%3C/svg%3E";

const meta: Meta<typeof Image> = {
  component: Image,
  title: "Components/DataDisplay/Image",
  tags: ["autodocs"],
  args: {
    src: landscapePreview,
    alt: "Design system preview asset",
    fit: "cover",
    rounded: "xl",
    framed: true,
  },
  argTypes: {
    fit: {
      control: "radio",
      options: ["cover", "contain", "fill", "none", "scale-down"],
    },
    rounded: {
      control: "radio",
      options: ["none", "sm", "md", "lg", "xl", "full"],
    },
    aspectRatio: { control: false },
    fallback: { control: false },
    imgClassName: { control: false },
    imgStyle: { control: false },
  },
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

export const Default: Story = {
  render: (args) => <Image {...args} className="w-full max-w-xl" />,
};

export const VideoContain: Story = {
  render: (args) => (
    <Image
      {...args}
      src={tallPreview}
      alt="Tall preview rendered inside a video frame"
      fit="contain"
      aspectRatio="video"
      className="w-full max-w-xl"
    />
  ),
};

export const FallbackState: Story = {
  render: (args) => (
    <Image
      {...args}
      src={undefined}
      alt="Fallback preview"
      aspectRatio="square"
      rounded="full"
      className="w-28"
      fallback={
        <span className="flex h-full w-full items-center justify-center bg-primary/10 text-sm font-semibold text-primary">
          VT
        </span>
      }
    />
  ),
};

export const FramedGallerySurface: Story = {
  render: (args) => (
    <div className="grid gap-lg md:grid-cols-2">
      <div className="space-y-sm">
        <div className="flex items-center gap-sm">
          <Badge variant="softPrimary">Cover</Badge>
          <span className="text-sm text-foreground-muted">
            Full-bleed preview for media cards and attachments.
          </span>
        </div>
        <Image
          {...args}
          src={landscapePreview}
          alt="Landscape preview"
          aspectRatio="16/10"
          className="w-full"
        />
      </div>

      <div className="space-y-sm">
        <div className="flex items-center gap-sm">
          <Badge variant="outlineGray">Contain</Badge>
          <span className="text-sm text-foreground-muted">
            Keeps the full image visible inside a constrained frame.
          </span>
        </div>
        <Image
          {...args}
          src={tallPreview}
          alt="Tall preview"
          fit="contain"
          aspectRatio="16/10"
          className="w-full bg-canvas"
        />
      </div>
    </div>
  ),
};
