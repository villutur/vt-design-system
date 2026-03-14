import type {
  LogViewerAttachment,
  LogViewerItem,
  LogViewerLevel,
} from "../../components/DataDisplay/LogViewer";

const sources = ["app", "auth", "api", "db", "worker", "perf"] as const;
const levels: LogViewerLevel[] = ["trace", "debug", "info", "warn", "error"];

function createAttachmentId(itemIndex: number, suffix: string) {
  return `log-${itemIndex + 1}-${suffix}`;
}

function createAttachments(index: number): LogViewerAttachment[] | undefined {
  if (index % 14 === 1) {
    return [
      {
        id: createAttachmentId(index, "request"),
        kind: "json",
        label: "Request payload",
        summary: "Structured request context captured before the API call.",
        value: {
          userId: `usr_${1000 + index}`,
          accountTier: index % 3 === 0 ? "pro" : "team",
          scopes: ["read:users", "read:audit"],
        },
        defaultOpen: index < 6,
        searchText: `usr_${1000 + index} pro team read audit`,
      },
      {
        id: createAttachmentId(index, "note"),
        kind: "markdown",
        label: "Operator note",
        summary: "Short reviewer guidance captured during the incident.",
        value: `### Retry guidance

- Check whether the upstream worker queue is draining.
- Retry the request only after the cached auth token is refreshed.
- Escalate if the same request fails three times within five minutes.`,
      },
    ];
  }

  if (index % 14 === 4) {
    return [
      {
        id: createAttachmentId(index, "sql"),
        kind: "code",
        label: "SQL payload",
        summary: "Rendered exactly as captured from the query layer.",
        language: "sql",
        value: `SELECT id, email, created_at
FROM users
WHERE account_tier = 'team'
ORDER BY created_at DESC
LIMIT 42;`,
        defaultOpen: index < 8,
      },
      {
        id: createAttachmentId(index, "meta"),
        kind: "meta",
        label: "Query metadata",
        value: {
          duration: `${42 + (index % 5) * 8}ms`,
          cache: index % 2 === 0 ? "miss" : "warm",
          rows: 42 + (index % 7),
          region: index % 2 === 0 ? "eu-north-1" : "us-east-2",
        },
        searchText: "duration cache rows region eu-north us-east",
      },
    ];
  }

  if (index % 14 === 8) {
    return [
      {
        id: createAttachmentId(index, "response"),
        kind: "text",
        label: "Response excerpt",
        summary:
          "Useful for verifying the exact payload text without opening devtools.",
        value:
          "The downstream service returned a partial response while the metrics fan-out was still catching up. The payload was accepted, but the UI should treat the operation as pending until the background consistency check finishes.",
      },
    ];
  }

  if (index % 14 === 11) {
    return [
      {
        id: createAttachmentId(index, "snapshot"),
        kind: "json",
        label: "State snapshot",
        summary:
          "Small state dump taken when the warning threshold was crossed.",
        value: {
          pendingJobs: 3 + (index % 4),
          lastSuccessAt: `2026-03-12T08:${String(10 + (index % 40)).padStart(2, "0")}:11.000Z`,
          threshold: 0.82,
          degraded: index % 2 === 0,
        },
      },
    ];
  }

  return undefined;
}

function createMessage(index: number) {
  const source = sources[index % sources.length];

  switch (source) {
    case "app":
      return index % 9 === 0
        ? "Application started"
        : "Workspace state synchronized";
    case "auth":
      return index % 5 === 0
        ? "User session refreshed"
        : "Token validation completed";
    case "api":
      return index % 7 === 0
        ? "Request: GET /users"
        : index % 7 === 3
          ? "Response: 200 OK"
          : "Rate limit approaching";
    case "db":
      return index % 4 === 0
        ? "Query: SELECT * FROM users"
        : "Returned rows from users query";
    case "worker":
      return index % 6 === 0
        ? "Background job scheduled"
        : "Queue batch flushed";
    default:
      return index % 8 === 0
        ? "Slow render path detected"
        : "Render time sampled";
  }
}

function createTags(index: number, source: string) {
  const tags = [source];

  if (source === "api") {
    tags.push(index % 2 === 0 ? "http" : "gateway");
  }

  if (source === "db") {
    tags.push("users");
  }

  if (source === "worker") {
    tags.push("queue");
  }

  if (index % 10 === 0) {
    tags.push("critical-path");
  }

  return tags;
}

function createLevel(index: number, source: string): LogViewerLevel {
  if (source === "api" && index % 7 === 2) {
    return "warn";
  }

  if ((source === "db" || source === "worker") && index % 23 === 0) {
    return "error";
  }

  if (source === "perf") {
    return index % 5 === 0 ? "debug" : "trace";
  }

  return levels[(index + 2) % levels.length] === "trace"
    ? "info"
    : levels[(index + 2) % levels.length];
}

export function createLogViewerItems(count = 48): LogViewerItem[] {
  const baseTimestamp = new Date("2026-03-12T08:38:21.159Z").getTime();

  return Array.from({ length: count }, (_, index) => {
    const source = sources[index % sources.length];
    const level = createLevel(index, source);
    const attachments = createAttachments(index);
    const timestamp = new Date(baseTimestamp + index * 901 + (index % 5) * 37);

    return {
      id: `log-${index + 1}`,
      timestamp,
      level,
      message: createMessage(index),
      source,
      tags: createTags(index, source),
      status:
        index % 18 === 0
          ? "running"
          : index % 23 === 0
            ? "error"
            : index % 12 === 0
              ? "success"
              : "idle",
      attachments,
      searchText:
        source === "api"
          ? "request response http gateway users"
          : source === "db"
            ? "query rows sql users"
            : source === "worker"
              ? "jobs queue background batch"
              : source === "perf"
                ? "latency frame render duration"
                : undefined,
    };
  });
}

export const logViewerPreviewItems = createLogViewerItems(72);
export const logViewerHeavyItems = createLogViewerItems(6200);
export const logViewerLongPayloadItems: LogViewerItem[] = createLogViewerItems(
  18,
).map((item, index) => {
  if (index !== 4) {
    return item;
  }

  const attachments: LogViewerAttachment[] = [
    {
      id: "long-payload-markdown",
      kind: "markdown",
      label: "Long markdown note",
      summary: "Shows that wrapped markdown stays readable in expanded rows.",
      value: `## Escalation note

The connection pool recovered, but the query layer still reports a warm-cache miss pattern.

- Verify whether the auth token fan-out reused the previous request context
- Confirm that the background reconciliation pass completed successfully
- Re-run the degraded render path check before promoting the build

### Suggested handoff

Keep the worker queue paused for one additional minute and page the owning reviewer if the same warning repeats more than twice.`,
      defaultOpen: true,
    },
    {
      id: "long-payload-code",
      kind: "code",
      label: "Diagnostic snippet",
      language: "ts",
      value: `export async function validateQueueHealth() {
  const snapshot = await readQueueSnapshot();

  if (snapshot.pendingJobs > 8) {
    throw new Error("Queue health degraded");
  }

  return snapshot;
}`,
    },
  ];

  return {
    ...item,
    attachments,
  };
});
