import React, { forwardRef } from "react";
import { IconChevronRight, IconDots } from "@tabler/icons-react";
import { cn } from "../../utils/cn";

export interface BreadcrumbItem extends Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "onClick" | "rel" | "target"
> {
  id?: React.Key;
  label: React.ReactNode;
  icon?: React.ReactNode;
  current?: boolean;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  maxItems?: number;
  ellipsisLabel?: string;
}

type BreadcrumbPart = BreadcrumbItem | { type: "ellipsis"; id: string };

function collapseItems(
  items: BreadcrumbItem[],
  maxItems?: number,
): BreadcrumbPart[] {
  if (!maxItems || maxItems < 3 || items.length <= maxItems) {
    return items;
  }

  const tail = items.slice(-(maxItems - 2));
  return [items[0], { type: "ellipsis", id: "ellipsis" }, ...tail];
}

function isEllipsisPart(
  part: BreadcrumbPart,
): part is { type: "ellipsis"; id: string } {
  return "type" in part;
}

export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  (
    {
      items,
      separator = <IconChevronRight size={14} className="shrink-0" />,
      maxItems,
      ellipsisLabel = "Collapsed breadcrumb items",
      className,
      ...props
    },
    ref,
  ) => {
    const currentItem =
      items.find((item) => item.current) ?? items[items.length - 1];
    const visibleItems = collapseItems(items, maxItems);

    return (
      <nav
        ref={ref}
        className={cn("w-full", className)}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="flex flex-wrap items-center gap-xs text-xs text-foreground-muted">
          {visibleItems.map((part, index) => {
            const key = isEllipsisPart(part)
              ? part.id
              : (part.id ?? part.href ?? `breadcrumb-${index}`);

            return (
              <React.Fragment key={key}>
                <li className="min-w-0">
                  {isEllipsisPart(part) ? (
                    <span
                      className="inline-flex items-center gap-[2px] px-xs text-foreground-subtle"
                      aria-label={ellipsisLabel}
                    >
                      <IconDots size={14} />
                    </span>
                  ) : part === currentItem ? (
                    <span
                      className="inline-flex max-w-full items-center gap-xs rounded-md bg-primary/10 px-sm py-[2px] font-semibold text-primary"
                      aria-current="page"
                    >
                      {part.icon ? (
                        <span className="inline-flex shrink-0">
                          {part.icon}
                        </span>
                      ) : null}
                      <span className="truncate">{part.label}</span>
                    </span>
                  ) : part.href ? (
                    <a
                      href={part.href}
                      onClick={part.onClick}
                      rel={part.rel}
                      target={part.target}
                      className="inline-flex max-w-full items-center gap-xs rounded-md px-xs py-[2px] transition-colors hover:bg-surface-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-surface"
                    >
                      {part.icon ? (
                        <span className="inline-flex shrink-0">
                          {part.icon}
                        </span>
                      ) : null}
                      <span className="truncate">{part.label}</span>
                    </a>
                  ) : (
                    <span className="inline-flex max-w-full items-center gap-xs px-xs py-[2px]">
                      {part.icon ? (
                        <span className="inline-flex shrink-0">
                          {part.icon}
                        </span>
                      ) : null}
                      <span className="truncate">{part.label}</span>
                    </span>
                  )}
                </li>

                {index < visibleItems.length - 1 ? (
                  <li
                    className="inline-flex items-center text-foreground-subtle"
                    aria-hidden="true"
                  >
                    {separator}
                  </li>
                ) : null}
              </React.Fragment>
            );
          })}
        </ol>
      </nav>
    );
  },
);

Breadcrumbs.displayName = "Breadcrumbs";
