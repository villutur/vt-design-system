import React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../Forms/Button";
import { ScrollArea } from "./ScrollArea";

const meta: Meta<typeof ScrollArea> = {
  component: ScrollArea,
  title: "Components/Layout/ScrollArea",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ScrollArea>;

export const Default: Story = {
  render: () => (
    <ScrollArea
      maxHeight={200}
      className="w-64 rounded border border-slate-200 p-md dark:border-border-muted"
    >
      {Array.from({ length: 20 }, (_, i) => (
        <p
          key={i}
          className="border-b border-slate-100 py-xs text-sm text-slate-600 dark:border-border-muted dark:text-gray-400"
        >
          Item {i + 1}
        </p>
      ))}
    </ScrollArea>
  ),
};

function FollowTailDemo() {
  const allItems = React.useMemo(
    () =>
      Array.from(
        { length: 24 },
        (_, index) => `log-${String(index + 1).padStart(3, "0")}`,
      ),
    [],
  );
  const [visibleCount, setVisibleCount] = React.useState(10);
  const [followTail, setFollowTail] = React.useState(true);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setVisibleCount((current) =>
        current < allItems.length ? current + 1 : current,
      );
    }, 900);

    return () => window.clearInterval(intervalId);
  }, [allItems.length]);

  return (
    <div className="space-y-md">
      <div className="flex flex-wrap items-center gap-sm">
        <Button
          type="button"
          size="xs"
          variant="ghost"
          onClick={() => setVisibleCount(10)}
        >
          Restart feed
        </Button>
        <p className="text-sm text-foreground-muted">
          Follow mode stays pinned until the user scrolls away.
        </p>
      </div>

      <ScrollArea
        maxHeight={240}
        className="rounded-xl border border-default bg-surface-subtle p-md"
        followTail={followTail}
        onFollowTailChange={setFollowTail}
      >
        <div className="space-y-xs">
          {allItems.slice(0, visibleCount).map((item, index) => (
            <div
              key={item}
              className="rounded-lg border border-default bg-surface px-md py-sm"
            >
              <p className="font-mono text-xs text-foreground-subtle">
                09:{String(10 + index).padStart(2, "0")}
              </p>
              <p className="text-sm text-foreground">
                {item} appended to the shared scroll container.
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>

      {!followTail ? (
        <div className="-mt-18 flex justify-center">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="shadow-soft dark:shadow-soft-dark"
            onClick={() => setFollowTail(true)}
          >
            Follow tail
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export const FollowTail: Story = {
  render: () => <FollowTailDemo />,
};
