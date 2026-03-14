import React, { useState } from "react";
import {
  IconActivity,
  IconHome,
  IconRefresh,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import {
  Breadcrumbs,
  Button,
  CommandBar,
  Divider,
  Pagination,
  SectionPanel,
  Stepper,
} from "../../../src/index";

const breadcrumbItems = [
  { label: "Workspace", href: "#" },
  { label: "Projects", href: "#" },
  { label: "Design System", href: "#" },
  { label: "Breadcrumbs" },
];

const breadcrumbItemsWithIcons = [
  { label: "Home", href: "#", icon: <IconHome size={14} /> },
  { label: "Admin", href: "#", icon: <IconSettings size={14} /> },
  { label: "Team", icon: <IconUsers size={14} /> },
];

const deepBreadcrumbItems = [
  { label: "Workspace", href: "#" },
  { label: "Admin", href: "#" },
  { label: "Operations", href: "#" },
  { label: "Users", href: "#" },
  { label: "Permissions", href: "#" },
  { label: "Audit Log" },
];

const stepperSteps = [
  {
    id: "details",
    title: "Project details",
    description: "Name, region, and environment",
  },
  {
    id: "access",
    title: "Access policy",
    description: "Permissions and API keys",
  },
  {
    id: "review",
    title: "Review",
    description: "Final confirmation before launch",
  },
] as const;

export function NavigationSection() {
  const [paginationPage, setPaginationPage] = useState(1);
  const [stepperStep, setStepperStep] = useState(1);

  return (
    <section className="space-y-8">
      <CommandBar
        title="Navigation"
        subtitle="Wayfinding, commands, and multi-step flow"
        actions={
          <>
            <Button size="xs" variant="secondary">
              <IconRefresh size={12} /> Refresh
            </Button>
            <Button size="xs">Export</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <SectionPanel title="Pagination" subtitle="Page navigation">
          <div className="space-y-md">
            <div>
              <p className="mb-sm text-xs text-foreground-muted">Few pages</p>
              <Pagination
                page={paginationPage}
                totalPages={5}
                onPageChange={setPaginationPage}
              />
            </div>
            <Divider />
            <div>
              <p className="mb-sm text-xs text-foreground-muted">
                Many pages (current: {paginationPage})
              </p>
              <Pagination
                page={paginationPage}
                totalPages={42}
                onPageChange={setPaginationPage}
              />
            </div>
          </div>
        </SectionPanel>

        <SectionPanel title="Breadcrumbs" subtitle="Hierarchical navigation">
          <div className="space-y-md">
            <div>
              <p className="mb-sm text-xs text-foreground-muted">
                Standard path
              </p>
              <Breadcrumbs items={breadcrumbItems} />
            </div>
            <Divider />
            <div>
              <p className="mb-sm text-xs text-foreground-muted">With icons</p>
              <Breadcrumbs items={breadcrumbItemsWithIcons} />
            </div>
            <Divider />
            <div>
              <p className="mb-sm text-xs text-foreground-muted">
                Collapsed path
              </p>
              <Breadcrumbs items={deepBreadcrumbItems} maxItems={4} />
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Stepper"
          subtitle="Interactive multi-step progress"
        >
          <div className="space-y-lg">
            <Stepper
              steps={stepperSteps}
              currentStep={stepperStep}
              onStepChange={(index) => setStepperStep(index)}
              interactive
            />
            <Divider />
            <div className="grid gap-lg md:grid-cols-[minmax(0,1fr)_auto]">
              <Stepper
                steps={stepperSteps}
                currentStep={stepperStep}
                onStepChange={(index) => setStepperStep(index)}
                orientation="vertical"
                interactive
                className="max-w-md"
              />
              <div className="flex items-start justify-start md:justify-end">
                <Button
                  size="xs"
                  variant="secondary"
                  onClick={() => setStepperStep(1)}
                >
                  Reset step
                </Button>
              </div>
            </div>
          </div>
        </SectionPanel>

        <SectionPanel
          title="Command Context"
          subtitle="How navigation pieces can work together"
        >
          <div className="space-y-md">
            <p className="text-sm text-foreground-muted">
              Breadcrumbs, pagers, and steppers are usually most effective when
              paired with command surfaces and workflow summaries.
            </p>
            <div className="rounded-xl border border-default bg-surface-subtle p-md">
              <div className="flex items-center gap-2 text-sm text-foreground">
                <IconActivity size={16} className="text-primary" />
                Release workflow is currently on step {stepperStep}.
              </div>
            </div>
          </div>
        </SectionPanel>
      </div>
    </section>
  );
}
