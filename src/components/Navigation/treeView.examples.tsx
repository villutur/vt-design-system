import {
  IconAlertCircle,
  IconBolt,
  IconCloud,
  IconDatabase,
  IconFileCode,
  IconFileText,
  IconFolder,
  IconFolderOpen,
  IconPhoto,
  IconServer,
  IconSettings,
  IconShieldCheck,
  IconUsers,
} from "@tabler/icons-react";
import { Avatar } from "../DataDisplay/Avatar";
import { Badge } from "../DataDisplay/Badge";
import { cn } from "../../utils/cn";
import { createTreeViewItemsFromObject, type TreeViewItem, type TreeViewRenderProps } from "./TreeView";

const fileBadgeVariantMap = {
  css: "softWarning",
  json: "soft",
  md: "soft",
  png: "softSuccess",
  svg: "softSuccess",
  ts: "softPrimary",
  tsx: "softPrimary",
} as const;

function getFileBadgeVariant(extension: string | undefined) {
  if (!extension) {
    return "outlineGray";
  }

  return fileBadgeVariantMap[extension as keyof typeof fileBadgeVariantMap] ?? "outlineGray";
}

export const sampleConfigurationObject = {
  workspace: "vt-design-system",
  runtime: {
    mode: "preview",
    releaseChannel: "stable",
    retries: 2,
  },
  features: {
    treeView: {
      asyncNodes: true,
      dragAndDrop: true,
      multiSelect: true,
    },
    storybook: {
      docs: true,
      interactions: true,
    },
  },
  owners: ["Alex Morgan", "Jamie Rivera", "Sam Patel"],
};

export function createJsonTreeItems() {
  return createTreeViewItemsFromObject(sampleConfigurationObject, {
    sortKeys: true,
  });
}

export function createFileTreeItems(): TreeViewItem[] {
  return [
    {
      id: "workspace-src",
      name: "src",
      description: "Component source",
      canAddChild: true,
      canDelete: true,
      canRename: true,
      canDrag: true,
      defaultExpanded: true,
      data: { kind: "folder" },
      children: [
        {
          id: "workspace-src-components",
          name: "components",
          description: "Navigation, forms, and surfaces",
          canAddChild: true,
          canDelete: true,
          canRename: true,
          canDrag: true,
          defaultExpanded: true,
          data: { kind: "folder" },
          children: [
            {
              id: "workspace-tree-view",
              name: "TreeView.tsx",
              description: "9.8 KB",
              canDelete: true,
              canRename: true,
              canDrag: true,
              droppable: false,
              data: { kind: "file", extension: "tsx" },
            },
            {
              id: "workspace-tree-view-story",
              name: "TreeView.stories.tsx",
              description: "5.2 KB",
              canDelete: true,
              canRename: true,
              canDrag: true,
              droppable: false,
              data: { kind: "file", extension: "tsx" },
            },
            {
              id: "workspace-tree-view-tokens",
              name: "tree-view.tokens.json",
              description: "1.2 KB",
              canDelete: true,
              canRename: true,
              canDrag: true,
              droppable: false,
              data: { kind: "file", extension: "json" },
            },
          ],
        },
        {
          id: "workspace-src-styles",
          name: "styles.css",
          description: "2.1 KB",
          canDelete: true,
          canRename: true,
          canDrag: true,
          droppable: false,
          data: { kind: "file", extension: "css" },
        },
      ],
    },
    {
      id: "workspace-assets",
      name: "assets",
      description: "Illustrations and icons",
      canAddChild: true,
      canDelete: true,
      canRename: true,
      canDrag: true,
      defaultExpanded: true,
      data: { kind: "folder" },
      children: [
        {
          id: "workspace-assets-hero",
          name: "hero-preview.png",
          description: "428 KB",
          canDelete: true,
          canRename: true,
          canDrag: true,
          droppable: false,
          data: { kind: "file", extension: "png" },
        },
        {
          id: "workspace-assets-logo",
          name: "brand-mark.svg",
          description: "14 KB",
          canDelete: true,
          canRename: true,
          canDrag: true,
          droppable: false,
          data: { kind: "file", extension: "svg" },
        },
      ],
    },
    {
      id: "workspace-readme",
      name: "README.md",
      description: "3.5 KB",
      canDelete: true,
      canRename: true,
      canDrag: true,
      droppable: false,
      data: { kind: "file", extension: "md" },
    },
  ];
}

export function createTeamDirectoryItems(): TreeViewItem[] {
  return [
    {
      id: "team-platform",
      name: "Platform Team",
      description: "Core system ownership",
      icon: <IconUsers size={16} />,
      defaultExpanded: true,
      canAddChild: true,
      canDelete: true,
      canRename: true,
      children: [
        {
          id: "team-platform-alex",
          name: "Alex Morgan",
          description: "Design systems",
          canDelete: true,
          canRename: true,
          droppable: false,
          data: {
            initials: "AM",
            team: "Platform",
            status: "Available",
            role: "Owner",
          },
        },
        {
          id: "team-platform-jamie",
          name: "Jamie Rivera",
          description: "Storybook maintenance",
          canDelete: true,
          canRename: true,
          droppable: false,
          data: {
            initials: "JR",
            team: "Platform",
            status: "Reviewing",
            role: "Maintainer",
          },
        },
      ],
    },
    {
      id: "team-operations",
      name: "Operations Team",
      description: "Release and deployment workflows",
      icon: <IconServer size={16} />,
      defaultExpanded: true,
      canAddChild: true,
      canDelete: true,
      canRename: true,
      children: [
        {
          id: "team-ops-sam",
          name: "Sam Patel",
          description: "Delivery orchestration",
          canDelete: true,
          canRename: true,
          droppable: false,
          data: {
            initials: "SP",
            team: "Operations",
            status: "On call",
            role: "Lead",
          },
        },
        {
          id: "team-ops-riley",
          name: "Riley Turner",
          description: "Observability rollout",
          canDelete: true,
          canRename: true,
          droppable: false,
          data: {
            initials: "RT",
            team: "Operations",
            status: "In focus",
            role: "Engineer",
          },
        },
      ],
    },
  ];
}

export function createAsyncExplorerItems(): TreeViewItem[] {
  return [
    {
      id: "async-services",
      name: "services",
      description: "Loaded locally",
      canAddChild: true,
      canDelete: true,
      canRename: true,
      defaultExpanded: true,
      data: { kind: "folder" },
      children: [
        {
          id: "async-services-api",
          name: "api-gateway",
          description: "Running in eu-north-1",
          icon: <IconCloud size={16} />,
          droppable: false,
          data: { kind: "service" },
        },
        {
          id: "async-services-auth",
          name: "auth-service",
          description: "2 replicas healthy",
          icon: <IconShieldCheck size={16} />,
          droppable: false,
          data: { kind: "service" },
        },
      ],
    },
    {
      id: "async-packages",
      name: "packages",
      description: "Expand to fetch children",
      canAddChild: true,
      canDelete: true,
      canRename: true,
      hasAsyncChildren: true,
      data: { kind: "folder" },
    },
    {
      id: "async-config",
      name: "settings",
      description: "Fails once, then supports inline retry",
      canAddChild: true,
      canDelete: true,
      canRename: true,
      hasAsyncChildren: true,
      data: { kind: "folder" },
    },
  ];
}

export interface AsyncTreeLoaderOptions {
  delay?: number;
  failOnceIds?: string[];
}

export function createAsyncTreeChildLoader(options: AsyncTreeLoaderOptions = {}) {
  const attempts = new Map<string, number>();
  const failOnceIds = new Set(options.failOnceIds ?? ["async-config"]);

  return async function loadAsyncTreeChildren(item: TreeViewItem) {
    await new Promise((resolve) => {
      setTimeout(resolve, options.delay ?? 700);
    });

    const attemptCount = (attempts.get(item.id) ?? 0) + 1;
    attempts.set(item.id, attemptCount);

    if (failOnceIds.has(item.id) && attemptCount === 1) {
      throw new Error("Could not load environment presets on the first attempt.");
    }

    if (item.id === "async-packages") {
      return [
        {
          id: "async-packages-navigation",
          name: "@vt/navigation",
          description: "Shared navigation primitives",
          icon: <IconBolt size={16} />,
          droppable: false,
          data: { kind: "package" },
        },
        {
          id: "async-packages-tokens",
          name: "@vt/tokens",
          description: "Semantic color and spacing tokens",
          icon: <IconDatabase size={16} />,
          droppable: false,
          data: { kind: "package" },
        },
      ];
    }

    return [
      {
        id: "async-config-default",
        name: "default.env",
        description: "Shared workspace defaults",
        icon: <IconSettings size={16} />,
        droppable: false,
        data: { kind: "config" },
      },
      {
        id: "async-config-production",
        name: "production.env",
        description: "Secrets managed outside the repo",
        icon: <IconSettings size={16} />,
        droppable: false,
        data: { kind: "config" },
      },
    ];
  };
}

export const branchFirstTreeComparator = (left: TreeViewItem, right: TreeViewItem) => {
  const leftIsBranch = canItemActAsBranch(left);
  const rightIsBranch = canItemActAsBranch(right);

  if (leftIsBranch !== rightIsBranch) {
    return leftIsBranch ? -1 : 1;
  }

  return left.name.localeCompare(right.name);
};

function canItemActAsBranch(item: TreeViewItem) {
  return Boolean(item.children?.length) || Boolean(item.hasAsyncChildren);
}

function renderFileIcon(item: TreeViewItem, isExpanded: boolean) {
  const extension = typeof item.data?.extension === "string" ? item.data.extension : undefined;
  const kind = item.data?.kind;

  if (kind === "folder") {
    return isExpanded ? <IconFolderOpen size={16} /> : <IconFolder size={16} />;
  }

  if (extension === "png" || extension === "svg") {
    return <IconPhoto size={16} />;
  }

  if (extension === "json") {
    return <IconDatabase size={16} />;
  }

  if (extension === "tsx" || extension === "ts" || extension === "css") {
    return <IconFileCode size={16} />;
  }

  return <IconFileText size={16} />;
}

export function renderFileTreeNode({ item, isExpanded, isSelected }: TreeViewRenderProps) {
  const extension = typeof item.data?.extension === "string" ? item.data.extension : undefined;

  return (
    <div className="flex min-w-0 flex-1 items-center gap-sm">
      <span className="inline-flex shrink-0 items-center justify-center text-foreground-muted">
        {renderFileIcon(item, isExpanded)}
      </span>
      <div className="min-w-0 flex-1">
        <div className={cn("truncate text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
          {item.name}
        </div>
        {item.description ? <div className="truncate text-xs text-foreground-muted">{item.description}</div> : null}
      </div>
      {extension ? (
        <Badge size="sm" variant={getFileBadgeVariant(extension)}>
          {extension.toUpperCase()}
        </Badge>
      ) : null}
    </div>
  );
}

export function renderTeamTreeNode({ item, isSelected }: TreeViewRenderProps) {
  const initials = typeof item.data?.initials === "string" ? item.data.initials : undefined;
  const status = typeof item.data?.status === "string" ? item.data.status : undefined;
  const role = typeof item.data?.role === "string" ? item.data.role : undefined;
  const team = typeof item.data?.team === "string" ? item.data.team : undefined;

  if (!initials) {
    return (
      <div className="flex min-w-0 flex-1 items-center gap-sm">
        <span className="inline-flex shrink-0 items-center justify-center text-foreground-muted">
          {item.icon ?? <IconUsers size={16} />}
        </span>
        <div className="min-w-0 flex-1">
          <div className={cn("truncate text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
            {item.name}
          </div>
          {item.description ? <div className="truncate text-xs text-foreground-muted">{item.description}</div> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 flex-1 items-center gap-sm">
      <Avatar size="sm" initials={initials} fallbackText={item.name} />
      <div className="min-w-0 flex-1">
        <div className={cn("truncate text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
          {item.name}
        </div>
        <div className="truncate text-xs text-foreground-muted">{[role, team].filter(Boolean).join(" · ")}</div>
      </div>
      {status ? (
        <Badge size="sm" variant="softPrimary">
          {status}
        </Badge>
      ) : null}
    </div>
  );
}

function renderAsyncExplorerIcon(item: TreeViewItem) {
  if (item.icon) {
    return item.icon;
  }

  if (item.data?.kind === "config") {
    return <IconSettings size={16} />;
  }

  if (item.data?.kind === "package") {
    return <IconBolt size={16} />;
  }

  return <IconServer size={16} />;
}

export function renderAsyncExplorerNode({ item, isSelected, hasAsyncError }: TreeViewRenderProps) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-sm">
      <span className="inline-flex shrink-0 items-center justify-center text-foreground-muted">
        {renderAsyncExplorerIcon(item)}
      </span>
      <div className="min-w-0 flex-1">
        <div className={cn("truncate text-sm font-medium", isSelected ? "text-primary" : "text-foreground")}>
          {item.name}
        </div>
        {item.description ? <div className="truncate text-xs text-foreground-muted">{item.description}</div> : null}
      </div>
      {hasAsyncError ? (
        <Badge size="sm" variant="outlineError">
          <span className="inline-flex items-center gap-xs">
            <IconAlertCircle size={12} />
            Retry
          </span>
        </Badge>
      ) : null}
    </div>
  );
}
