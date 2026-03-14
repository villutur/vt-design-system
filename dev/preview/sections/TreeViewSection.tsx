import React, { useMemo, useState } from "react";
import { Badge, SectionPanel, TreeView } from "../../../src/index";
import {
  branchFirstTreeComparator,
  createAsyncTreeChildLoader,
  createAsyncExplorerItems,
  createFileTreeItems,
  createJsonTreeItems,
  createTeamDirectoryItems,
  renderAsyncExplorerNode,
  renderFileTreeNode,
  renderTeamTreeNode,
} from "../../../src/components/Navigation/treeView.examples";

export function TreeViewSection() {
  const [fileTreeItems, setFileTreeItems] = useState(() =>
    createFileTreeItems(),
  );
  const asyncTreeLoader = useMemo(() => createAsyncTreeChildLoader(), []);

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="softPrimary">Navigation</Badge>
          <Badge>Tree view</Badge>
          <Badge>Interactive</Badge>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Tree View</h2>
          <p className="mt-2 max-w-3xl text-sm text-foreground-muted">
            Hierarchical navigation and data browsing with expansion,
            multi-select, filtering, inline editing, drag and drop, and lazy
            child loading.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SectionPanel
          title="File Explorer"
          subtitle="Rename, add, delete, move, and copy with Ctrl + drag"
        >
          <TreeView
            items={fileTreeItems}
            onItemsChange={setFileTreeItems}
            searchable
            editable
            addable
            deletable
            draggable
            multiSelect
            renderNode={renderFileTreeNode}
            sortComparator={branchFirstTreeComparator}
          />
        </SectionPanel>

        <SectionPanel
          title="Configuration Tree"
          subtitle="JSON-style structure browsing with search"
        >
          <TreeView
            items={createJsonTreeItems()}
            searchable
            sortComparator={branchFirstTreeComparator}
          />
        </SectionPanel>

        <SectionPanel
          title="Custom Nodes"
          subtitle="People directory with avatars, roles, and statuses"
        >
          <TreeView
            items={createTeamDirectoryItems()}
            searchable
            multiSelect
            renderNode={renderTeamTreeNode}
          />
        </SectionPanel>

        <SectionPanel
          title="Async Loading And Retry"
          subtitle="Expand settings to trigger a deterministic failure, then retry inline"
        >
          <TreeView
            defaultItems={createAsyncExplorerItems()}
            searchable
            loadChildren={asyncTreeLoader}
            renderNode={renderAsyncExplorerNode}
          />
        </SectionPanel>
      </div>
    </section>
  );
}
