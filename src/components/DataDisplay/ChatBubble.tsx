import React from "react";
import {
  IconAlertCircle,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react";
import { cn } from "../../utils/cn";
import { Badge } from "./Badge";

const densityClassMap = {
  default: {
    rowGap: "gap-sm",
    bubblePadding: "px-lg py-md",
    headerGap: "gap-sm",
    bodyGap: "space-y-md",
    author: "text-sm font-semibold",
    meta: "text-xs",
  },
  compact: {
    rowGap: "gap-xs",
    bubblePadding: "px-md py-sm",
    headerGap: "gap-xs",
    bodyGap: "space-y-sm",
    author: "text-xs font-semibold",
    meta: "text-[11px]",
  },
} as const;

const toneClassMap = {
  neutral: "border-default bg-surface",
  assistant: "border-primary/20 bg-primary/5",
  user: "border-default bg-surface-subtle",
  success: "border-success/20 bg-success/5",
  warning: "border-warning/20 bg-warning/5",
  error: "border-error/20 bg-error/5",
} as const;

const statusBadgeMap = {
  streaming: {
    variant: "softPrimary" as const,
    label: "Streaming",
    icon: <IconLoader2 size={12} className="animate-spin" />,
  },
  complete: {
    variant: "softSuccess" as const,
    label: "Complete",
    icon: <IconCheck size={12} />,
  },
  error: {
    variant: "softError" as const,
    label: "Error",
    icon: <IconAlertCircle size={12} />,
  },
} as const;

export type ChatBubbleAlign = "start" | "end";
export type ChatBubbleTone =
  | "neutral"
  | "assistant"
  | "user"
  | "success"
  | "warning"
  | "error";
export type ChatBubbleStatus = "idle" | "streaming" | "complete" | "error";

export interface ChatBubbleProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  align?: ChatBubbleAlign;
  tone?: ChatBubbleTone;
  density?: "default" | "compact";
  surface?: "bubble" | "plain";
  author?: React.ReactNode;
  avatar?: React.ReactNode;
  meta?: React.ReactNode;
  status?: ChatBubbleStatus;
  children?: React.ReactNode;
  attachments?: React.ReactNode;
  footer?: React.ReactNode;
  bubbleClassName?: string;
}

function renderStatusBadge(status: ChatBubbleStatus) {
  if (status === "idle") {
    return null;
  }

  const statusMeta = statusBadgeMap[status];

  return (
    <Badge variant={statusMeta.variant} size="sm">
      {statusMeta.icon}
      {statusMeta.label}
    </Badge>
  );
}

export const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  (
    {
      align = "start",
      tone = "neutral",
      density = "default",
      surface = "bubble",
      author,
      avatar,
      meta,
      status = "idle",
      children,
      attachments,
      footer,
      className,
      bubbleClassName,
      ...props
    },
    ref,
  ) => {
    const styles = densityClassMap[density];
    const statusBadge = renderStatusBadge(status);
    const hasHeader = author || meta || statusBadge;
    const alignEnd = align === "end";
    const avatarNode = avatar ? (
      <div className="shrink-0 self-start">{avatar}</div>
    ) : null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full",
          alignEnd ? "justify-end" : "justify-start",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "flex w-full max-w-[min(52rem,100%)] items-end",
            styles.rowGap,
            alignEnd && "flex-row-reverse",
          )}
        >
          {avatarNode}

          <div className="min-w-0 flex-1">
            <div
              className={cn(
                "min-w-0",
                surface === "bubble"
                  ? cn(
                      "rounded-2xl border shadow-soft dark:shadow-soft-dark",
                      toneClassMap[tone],
                      styles.bubblePadding,
                    )
                  : "",
                bubbleClassName,
              )}
            >
              <div className={cn("min-w-0", styles.bodyGap)}>
                {hasHeader ? (
                  <div
                    className={cn(
                      "flex flex-wrap items-center",
                      styles.headerGap,
                      alignEnd && "justify-end text-right",
                    )}
                  >
                    {author ? (
                      <span className={cn(styles.author, "text-foreground")}>
                        {author}
                      </span>
                    ) : null}

                    {meta ? (
                      <span
                        className={cn(
                          styles.meta,
                          "text-foreground-subtle",
                          alignEnd && "order-first",
                        )}
                      >
                        {meta}
                      </span>
                    ) : null}

                    {statusBadge}
                  </div>
                ) : null}

                {children ? (
                  <div className="min-w-0 break-words text-sm text-foreground">
                    {children}
                  </div>
                ) : null}

                {attachments ? <div className="min-w-0">{attachments}</div> : null}

                {footer ? (
                  <div
                    className={cn(
                      "text-xs text-foreground-subtle",
                      alignEnd && "text-right",
                    )}
                  >
                    {footer}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ChatBubble.displayName = "ChatBubble";
