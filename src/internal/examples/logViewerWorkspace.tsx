import { IconActivity, IconFilter, IconZoomIn } from "@tabler/icons-react";
import { Badge, Card, CardContent, LogViewer, SectionPanel } from "../../index";
import { logViewerPreviewItems } from "./logViewerExampleData";

export function LogViewerWorkspaceExample() {
  return (
    <div className="space-y-lg">
      <div className="flex flex-wrap items-center gap-sm">
        <Badge variant="softPrimary">Example</Badge>
        <Badge variant="outlineGray">Viewer-first</Badge>
        <Badge variant="soft">Operational logs</Badge>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.34fr_0.66fr]">
        <SectionPanel
          title="Inspector lane"
          subtitle="How this composition is intended to be used"
        >
          <div className="space-y-md">
            <Card variant="plain" className="rounded-2xl bg-surface-subtle">
              <CardContent className="space-y-sm p-lg">
                <p className="text-xs font-bold tracking-[0.14em] text-foreground-subtle uppercase">
                  Why this shape
                </p>
                <p className="text-sm text-foreground-muted">
                  `LogViewer` stays focused on rendering, filtering, searching,
                  expansion, and follow behavior. It does not own the logger,
                  store, or worker layer in v1.
                </p>
              </CardContent>
            </Card>

            <div className="space-y-sm">
              <div className="flex items-start gap-sm rounded-xl border border-default bg-surface-subtle/60 px-md py-md">
                <IconActivity size={16} className="mt-[2px] text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Scanability first
                  </p>
                  <p className="text-sm text-foreground-muted">
                    Timestamp, level, source, and message stay compact so the
                    eye lands on important rows quickly.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-sm rounded-xl border border-default bg-surface-subtle/60 px-md py-md">
                <IconFilter size={16} className="mt-[2px] text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Filters stay stable
                  </p>
                  <p className="text-sm text-foreground-muted">
                    Levels remain inline, while source and tag filters move into
                    popovers so the header does not collapse under high
                    cardinality.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-sm rounded-xl border border-default bg-surface-subtle/60 px-md py-md">
                <IconZoomIn size={16} className="mt-[2px] text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Expansion shows the real payload
                  </p>
                  <p className="text-sm text-foreground-muted">
                    Attachments render through CodeBlock, MarkdownRenderer, and
                    compact metadata views instead of a one-size-fits-all blob.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Operational lane"
          subtitle="AI, tooling, API, and database events in one shared surface"
        >
          <LogViewer
            items={logViewerPreviewItems}
            height={560}
            defaultFollowTail={false}
            defaultExpandedIds={["log-2", "log-5", "log-12"]}
          />
        </SectionPanel>
      </div>
    </div>
  );
}
