import React from "react";
import {
  IconDatabase,
  IconInbox,
  IconRefresh,
  IconServer,
} from "@tabler/icons-react";
import {
  Alert,
  Banner,
  Button,
  EmptyState,
  MetricCard,
  ProgressBar,
  SectionPanel,
  Skeleton,
  Spinner,
  useToast,
} from "../../../src/index";

export function FeedbackSection() {
  const { toast } = useToast();
  const [syncState, setSyncState] = React.useState<
    "idle" | "loading" | "success"
  >("idle");
  const [hasSavedView, setHasSavedView] = React.useState(false);
  const [showCapacityBanner, setShowCapacityBanner] = React.useState(true);

  const runSyncWorkflow = () => {
    setSyncState("loading");

    toast({
      title: "Sync started",
      description: "The latest deployment activity is being collected.",
      type: "info",
    });

    window.setTimeout(() => {
      setSyncState("success");
      toast({
        title: "Sync complete",
        description: "Release health was refreshed across all environments.",
        type: "success",
      });
    }, 900);
  };

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Feedback</h2>
        <p className="mt-2 text-sm text-foreground-muted">
          Banners, alerts, loading states, empty states, and transient workflow
          feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionPanel
          title="Composed Workflow"
          subtitle="Page-level, inline, and transient feedback working together"
          className="xl:col-span-2"
        >
          <div className="space-y-md">
            {showCapacityBanner ? (
              <Banner
                type="warning"
                title="Storage usage is climbing faster than expected"
                description="Use Banner when the message belongs to the whole page or section and should remain visible until someone addresses it."
                actions={
                  <Button size="sm" variant="secondary">
                    Review retention
                  </Button>
                }
                onClose={() => setShowCapacityBanner(false)}
              />
            ) : null}

            {syncState === "idle" ? (
              <Alert title="Environment sync is recommended" type="info">
                <div className="flex flex-wrap items-center gap-sm">
                  <span>
                    Use Alert for feedback that belongs to the current panel or
                    workflow rather than the whole page.
                  </span>
                  <Button size="xs" onClick={runSyncWorkflow}>
                    Run sync
                  </Button>
                </div>
              </Alert>
            ) : null}

            {syncState === "loading" ? (
              <div className="space-y-md rounded-xl border border-default bg-surface p-md">
                <Alert title="Sync in progress" type="info" compact>
                  Release health is being refreshed across all regions.
                </Alert>
                <div className="space-y-sm">
                  <div className="flex items-center gap-sm text-sm text-foreground-muted">
                    <Spinner size="sm" variant="primary" />
                    <span>Loading the newest deployment activity...</span>
                  </div>
                  <ProgressBar indeterminate />
                </div>
              </div>
            ) : null}

            {syncState === "success" ? (
              <Alert title="Release health updated" type="success">
                <div className="flex flex-wrap items-center gap-sm">
                  <span>
                    The newest rollout status is available and a toast confirmed
                    completion without taking over the layout.
                  </span>
                  <Button size="xs" variant="secondary">
                    Open report
                  </Button>
                </div>
              </Alert>
            ) : null}
          </div>
        </SectionPanel>

        <SectionPanel
          title="Loading Surfaces"
          subtitle="Use Skeleton for layout-preserving loading and Spinner for inline work"
        >
          <div className="space-y-md">
            <div className="rounded-xl border border-default bg-surface p-md">
              <div className="mb-sm flex items-center gap-sm text-sm text-foreground-muted">
                <Spinner size="sm" variant="primary" />
                <span>Uploading the current release bundle...</span>
              </div>
              <ProgressBar value={72} />
            </div>

            <div className="rounded-xl border border-default bg-surface p-md">
              <div className="space-y-sm">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-xl" />
                  <Skeleton className="h-10 w-2/3 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Toast Workflows"
          subtitle="Transient confirmations and retries should not permanently occupy layout space"
        >
          <div className="flex flex-wrap gap-sm">
            <Button
              size="sm"
              onClick={() => {
                toast({
                  title: "Release published",
                  description: "The latest configuration is now live.",
                  type: "success",
                });
              }}
            >
              Publish release
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                toast({
                  title: "Upload failed",
                  description:
                    "The first upload failed. Retry without leaving the current workflow.",
                  type: "warning",
                  action: (
                    <Button
                      size="xs"
                      onClick={() =>
                        toast({
                          title: "Retry succeeded",
                          description:
                            "The release bundle uploaded successfully.",
                          type: "success",
                        })
                      }
                    >
                      Retry now
                    </Button>
                  ),
                });
              }}
            >
              Trigger retry flow
            </Button>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Empty States"
          subtitle="No-data and first-run surfaces should point to the next meaningful action"
          className="xl:col-span-2"
        >
          <div className="grid grid-cols-1 gap-md md:grid-cols-3">
            <div className="rounded-xl border border-default bg-surface-subtle p-md">
              {hasSavedView ? (
                <Alert title="Saved view created" type="success">
                  Your first dashboard view is ready. EmptyState handed off to a
                  normal workflow successfully.
                </Alert>
              ) : (
                <EmptyState
                  icon={<IconDatabase size={28} />}
                  eyebrow="First run"
                  title="No saved views yet"
                  description="Create a saved dashboard view to keep the most important release metrics close at hand."
                  action={
                    <Button
                      size="sm"
                      onClick={() => {
                        setHasSavedView(true);
                        toast({
                          title: "Saved view created",
                          description:
                            "The new dashboard view is now available.",
                          type: "success",
                        });
                      }}
                    >
                      Create saved view
                    </Button>
                  }
                />
              )}
            </div>

            <div className="rounded-xl border border-default bg-surface-subtle p-md">
              <EmptyState
                icon={<IconInbox size={28} />}
                title="No messages to review"
                description="Nothing needs attention right now. When a workflow needs action, it will appear here."
              />
            </div>

            <div className="rounded-xl border border-default bg-surface-subtle p-md">
              <EmptyState
                icon={<IconServer size={28} />}
                title="No nodes registered"
                description="Connect your first runtime node before deployment health can be monitored."
                action={
                  <Button size="sm" variant="secondary">
                    Add node
                  </Button>
                }
              />
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Metric Handoff"
          subtitle="Status metrics summarize the system, then Banner or Alert takes over when action is required"
          className="xl:col-span-2"
        >
          <div className="grid gap-md lg:grid-cols-[minmax(0,20rem)_1fr]">
            <MetricCard
              title="Storage capacity"
              value="86%"
              description="Used across active workspaces this billing cycle."
              trendValue="+6%"
              trendDirection="up"
              trendType="warning"
              icon={<IconDatabase size={20} />}
              footer="MetricCard provides summary context, not the full message workflow."
            />
            <Banner
              type="warning"
              title="Action is now required"
              description="Once a metric crosses a threshold, move to Banner or Alert so the next step is explicit and not hidden inside a KPI card."
              actions={
                <Button
                  size="sm"
                  variant="secondary"
                  leftIcon={<IconRefresh size={16} />}
                >
                  Review cleanup plan
                </Button>
              }
            />
          </div>
        </SectionPanel>
      </div>
    </section>
  );
}
