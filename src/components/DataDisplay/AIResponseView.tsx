import React from "react";
import {
  IconAlertCircle,
  IconBolt,
  IconBrain,
  IconCheck,
  IconLoader2,
  IconPhoto,
  IconPlayerPlay,
  IconTool,
} from "@tabler/icons-react";
import { Alert } from "../Feedback/Alert";
import { Badge } from "./Badge";
import { CodeBlock } from "./CodeBlock";
import { Image } from "./Image";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { Accordion, AccordionItem } from "../Surfaces/Accordion";
import { cn } from "../../utils/cn";

const responseDensityClassMap = {
  default: {
    shell: "rounded-2xl",
    sectionGap: "space-y-lg",
    bodyPadding: "p-lg",
    sectionSpacing: "space-y-md",
    headerPadding: "px-lg py-md",
    subheading:
      "text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase",
  },
  compact: {
    shell: "rounded-xl",
    sectionGap: "space-y-md",
    bodyPadding: "p-md",
    sectionSpacing: "space-y-sm",
    headerPadding: "px-md py-sm",
    subheading:
      "text-[10px] font-bold tracking-[0.14em] text-foreground-subtle uppercase",
  },
} as const;

const statusConfig = {
  thinking: {
    label: "Thinking",
    description: "Waiting for the model to produce its first tokens.",
    variant: "soft" as const,
    icon: <IconBrain size={14} />,
  },
  streaming: {
    label: "Streaming",
    description:
      "Rendering partial output while the response is still in flight.",
    variant: "softPrimary" as const,
    icon: <IconLoader2 size={14} className="animate-spin" />,
  },
  complete: {
    label: "Complete",
    description: "The response finished successfully.",
    variant: "softSuccess" as const,
    icon: <IconCheck size={14} />,
  },
  error: {
    label: "Error",
    description: "The response stopped before completion.",
    variant: "softError" as const,
    icon: <IconAlertCircle size={14} />,
  },
} as const;

export type AIResponseStatus = "thinking" | "streaming" | "complete" | "error";

export interface AIResponseToolCall {
  id: string;
  name: React.ReactNode;
  status?: "running" | "success" | "error";
  summary?: React.ReactNode;
  input?: string;
  output?: string;
  language?: string;
  defaultOpen?: boolean;
}

export interface AIResponseAttachment {
  id: string;
  kind: "image" | "audio" | "file";
  title: React.ReactNode;
  src?: string;
  description?: React.ReactNode;
  meta?: React.ReactNode;
}

export interface AIResponseViewProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  status?: AIResponseStatus;
  content?: string;
  thought?: {
    summary?: React.ReactNode;
    content: string;
    defaultOpen?: boolean;
  };
  toolCalls?: AIResponseToolCall[];
  attachments?: AIResponseAttachment[];
  density?: "default" | "compact";
  showThought?: boolean;
  showToolCalls?: boolean;
  errorMessage?: React.ReactNode;
}

function renderToolCallStatus(
  status: AIResponseToolCall["status"] = "running",
) {
  if (status === "success") {
    return (
      <Badge variant="softSuccess" size="sm">
        <IconCheck size={12} />
        Success
      </Badge>
    );
  }

  if (status === "error") {
    return (
      <Badge variant="softError" size="sm">
        <IconAlertCircle size={12} />
        Error
      </Badge>
    );
  }

  return (
    <Badge variant="softPrimary" size="sm">
      <IconLoader2 size={12} className="animate-spin" />
      Running
    </Badge>
  );
}

function renderAttachmentKind(kind: AIResponseAttachment["kind"]) {
  if (kind === "image") {
    return (
      <Badge variant="softPrimary" size="sm">
        <IconPhoto size={12} />
        Image
      </Badge>
    );
  }

  if (kind === "audio") {
    return (
      <Badge variant="softWarning" size="sm">
        <IconPlayerPlay size={12} />
        Audio
      </Badge>
    );
  }

  return (
    <Badge variant="outlineGray" size="sm">
      <IconBolt size={12} />
      File
    </Badge>
  );
}

export const AIResponseView = React.forwardRef<
  HTMLDivElement,
  AIResponseViewProps
>(
  (
    {
      status = "complete",
      content,
      thought,
      toolCalls = [],
      attachments = [],
      density = "default",
      showThought = true,
      showToolCalls = true,
      errorMessage,
      className,
      ...props
    },
    ref,
  ) => {
    const styles = responseDensityClassMap[density];
    const statusMeta = statusConfig[status];
    const openToolCalls = toolCalls
      .filter((toolCall) => toolCall.defaultOpen)
      .map((toolCall) => toolCall.id);
    const imageAttachments = attachments.filter(
      (attachment) => attachment.kind === "image" && attachment.src,
    );
    const fileLikeAttachments = attachments.filter(
      (attachment) => attachment.kind !== "image" || !attachment.src,
    );
    const placeholderMessage =
      !content && status === "thinking"
        ? "The model is preparing a response."
        : !content && status === "streaming"
          ? "The first streamed tokens will appear here."
          : null;

    return (
      <div
        ref={ref}
        className={cn(
          "overflow-hidden border border-default bg-surface shadow-soft dark:shadow-soft-dark",
          styles.shell,
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "flex flex-wrap items-start justify-between gap-md border-b border-default bg-surface-subtle",
            styles.headerPadding,
          )}
        >
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-sm">
              <p className={styles.subheading}>Assistant response</p>
              <Badge variant={statusMeta.variant} size="sm">
                {statusMeta.icon}
                {statusMeta.label}
              </Badge>
            </div>
            <p className="mt-xs text-sm text-foreground-muted">
              {statusMeta.description}
            </p>
          </div>

          {(toolCalls.length > 0 || attachments.length > 0) && (
            <div className="flex flex-wrap items-center gap-sm">
              {toolCalls.length > 0 ? (
                <Badge variant="outlineGray" size="sm">
                  <IconTool size={12} />
                  {toolCalls.length} tool{toolCalls.length === 1 ? "" : "s"}
                </Badge>
              ) : null}
              {attachments.length > 0 ? (
                <Badge variant="outlineGray" size="sm">
                  <IconPhoto size={12} />
                  {attachments.length} attachment
                  {attachments.length === 1 ? "" : "s"}
                </Badge>
              ) : null}
            </div>
          )}
        </div>

        <div className={cn(styles.bodyPadding, styles.sectionGap)}>
          {errorMessage ? (
            <Alert type="error" title="Response failed">
              {errorMessage}
            </Alert>
          ) : null}

          {content ? (
            <MarkdownRenderer content={content} density={density} />
          ) : placeholderMessage ? (
            <div className="rounded-xl border border-dashed border-default bg-surface-subtle/50 px-md py-md text-sm text-foreground-muted">
              {placeholderMessage}
            </div>
          ) : null}

          {showThought && thought ? (
            <div className={styles.sectionSpacing}>
              <p className={styles.subheading}>Thought</p>
              <Accordion
                type="single"
                collapsible
                defaultValue={thought.defaultOpen ? "thought" : undefined}
              >
                <AccordionItem
                  value="thought"
                  title={
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-sm">
                        <span className="text-sm font-semibold text-foreground">
                          {thought.summary ?? "Reasoning summary"}
                        </span>
                        <Badge variant="soft" size="sm">
                          <IconBrain size={12} />
                          Internal
                        </Badge>
                      </div>
                    </div>
                  }
                >
                  <MarkdownRenderer
                    content={thought.content}
                    density={density}
                  />
                </AccordionItem>
              </Accordion>
            </div>
          ) : null}

          {showToolCalls && toolCalls.length > 0 ? (
            <div className={styles.sectionSpacing}>
              <p className={styles.subheading}>Tool calls</p>
              <Accordion
                type="multiple"
                defaultValue={openToolCalls}
                collapsible
              >
                {toolCalls.map((toolCall) => (
                  <AccordionItem
                    key={toolCall.id}
                    value={toolCall.id}
                    title={
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-sm">
                          <span className="text-sm font-semibold text-foreground">
                            {toolCall.name}
                          </span>
                          {renderToolCallStatus(toolCall.status)}
                        </div>
                        {toolCall.summary ? (
                          <p className="mt-xs text-sm font-normal text-foreground-muted">
                            {toolCall.summary}
                          </p>
                        ) : null}
                      </div>
                    }
                  >
                    <div className={styles.sectionSpacing}>
                      {toolCall.input ? (
                        <div className={styles.sectionSpacing}>
                          <p className={styles.subheading}>Input</p>
                          <CodeBlock
                            language={toolCall.language ?? "text"}
                            code={toolCall.input}
                            copyable
                            wrapLongLines
                          />
                        </div>
                      ) : null}

                      {toolCall.output ? (
                        <div className={styles.sectionSpacing}>
                          <p className={styles.subheading}>Output</p>
                          <CodeBlock
                            language={toolCall.language ?? "text"}
                            code={toolCall.output}
                            copyable
                            wrapLongLines
                          />
                        </div>
                      ) : null}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : null}

          {attachments.length > 0 ? (
            <div className={styles.sectionSpacing}>
              <p className={styles.subheading}>Attachments</p>

              {imageAttachments.length > 0 ? (
                <div className="grid gap-md sm:grid-cols-2">
                  {imageAttachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="overflow-hidden rounded-xl border border-default bg-surface-subtle"
                    >
                      <Image
                        src={attachment.src}
                        alt={
                          typeof attachment.title === "string"
                            ? attachment.title
                            : "Attachment preview"
                        }
                        aspectRatio="16/10"
                        className="w-full"
                      />
                      <div className={cn("space-y-sm", styles.bodyPadding)}>
                        <div className="flex flex-wrap items-center gap-sm">
                          {renderAttachmentKind(attachment.kind)}
                          {attachment.meta ? (
                            <span className="text-xs text-foreground-subtle">
                              {attachment.meta}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm font-semibold text-foreground">
                          {attachment.title}
                        </p>
                        {attachment.description ? (
                          <p className="text-sm text-foreground-muted">
                            {attachment.description}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {fileLikeAttachments.length > 0 ? (
                <div className="space-y-sm">
                  {fileLikeAttachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="flex flex-wrap items-start justify-between gap-md rounded-xl border border-default bg-surface-subtle px-md py-md"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-sm">
                          {renderAttachmentKind(attachment.kind)}
                          {attachment.meta ? (
                            <span className="text-xs text-foreground-subtle">
                              {attachment.meta}
                            </span>
                          ) : null}
                        </div>
                        <p className="mt-sm text-sm font-semibold text-foreground">
                          {attachment.title}
                        </p>
                        {attachment.description ? (
                          <p className="mt-xs text-sm text-foreground-muted">
                            {attachment.description}
                          </p>
                        ) : null}
                      </div>

                      {attachment.src ? (
                        <a
                          href={attachment.src}
                          className="text-sm font-medium text-primary underline decoration-primary/30 underline-offset-4 hover:decoration-primary"
                        >
                          Open
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    );
  },
);

AIResponseView.displayName = "AIResponseView";
