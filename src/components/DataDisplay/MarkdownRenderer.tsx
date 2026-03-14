import React from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "../../utils/cn";
import { CodeBlock, type CodeBlockTheme } from "./CodeBlock";
import { Image } from "./Image";

const densityClassMap = {
  default: {
    heading: "mt-xl first:mt-0",
    heading1: "text-2xl leading-tight font-semibold tracking-tight",
    heading2: "text-xl leading-tight font-semibold tracking-tight",
    heading3: "text-lg leading-tight font-semibold tracking-tight",
    heading4: "text-base leading-tight font-semibold tracking-tight",
    paragraph: "mt-md text-sm leading-7 text-foreground-muted first:mt-0",
    list: "mt-md space-y-sm pl-lg text-sm leading-7 text-foreground-muted first:mt-0",
    listItem: "pl-xs",
    blockquote:
      "mt-lg rounded-r-xl border-l-2 border-default bg-surface-subtle/70 px-lg py-md text-sm leading-7 text-foreground-muted italic first:mt-0",
    inlineCode:
      "rounded-md border border-default bg-surface-subtle px-xs py-[2px] font-mono text-[0.875em] text-foreground",
    preFallback:
      "mt-md overflow-x-auto rounded-xl border border-default bg-surface-subtle p-md text-sm leading-6 text-foreground first:mt-0",
    tableWrapper: "mt-lg overflow-x-auto rounded-xl border border-default first:mt-0",
    table: "min-w-full border-collapse bg-surface text-left text-sm text-foreground",
    tableHead: "bg-surface-subtle",
    tableHeader:
      "border-b border-default px-md py-sm text-xs font-semibold tracking-wide text-foreground-muted uppercase",
    tableCell: "border-t border-default px-md py-sm align-top text-sm text-foreground-muted",
    image: "mt-lg overflow-hidden rounded-xl border border-default first:mt-0",
    horizontalRule: "my-xl border-default",
  },
  compact: {
    heading: "mt-lg first:mt-0",
    heading1: "text-xl leading-tight font-semibold tracking-tight",
    heading2: "text-lg leading-tight font-semibold tracking-tight",
    heading3: "text-base leading-tight font-semibold tracking-tight",
    heading4: "text-sm leading-tight font-semibold tracking-tight",
    paragraph: "mt-sm text-sm leading-6 text-foreground-muted first:mt-0",
    list: "mt-sm space-y-xs pl-md text-sm leading-6 text-foreground-muted first:mt-0",
    listItem: "",
    blockquote:
      "mt-md rounded-r-xl border-l-2 border-default bg-surface-subtle/70 px-md py-sm text-sm leading-6 text-foreground-muted italic first:mt-0",
    inlineCode:
      "rounded-md border border-default bg-surface-subtle px-[6px] py-px font-mono text-[0.875em] text-foreground",
    preFallback:
      "mt-sm overflow-x-auto rounded-xl border border-default bg-surface-subtle p-md text-sm leading-6 text-foreground first:mt-0",
    tableWrapper: "mt-md overflow-x-auto rounded-xl border border-default first:mt-0",
    table: "min-w-full border-collapse bg-surface text-left text-sm text-foreground",
    tableHead: "bg-surface-subtle",
    tableHeader:
      "border-b border-default px-sm py-xs text-xs font-semibold tracking-wide text-foreground-muted uppercase",
    tableCell: "border-t border-default px-sm py-xs align-top text-sm text-foreground-muted",
    image: "mt-md overflow-hidden rounded-xl border border-default first:mt-0",
    horizontalRule: "my-lg border-default",
  },
} as const;

function extractTextContent(node: React.ReactNode): string {
  return React.Children.toArray(node)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (React.isValidElement<{ children?: React.ReactNode }>(child)) {
        return extractTextContent(child.props.children);
      }

      return "";
    })
    .join("");
}

function getCodeBlockProps(children: React.ReactNode) {
  const childArray = React.Children.toArray(children);

  if (childArray.length !== 1) {
    return null;
  }

  const codeChild = childArray[0];

  if (!React.isValidElement<{ className?: string; children?: React.ReactNode }>(codeChild)) {
    return null;
  }

  const className = codeChild.props.className ?? "";
  const languageMatch = className.match(/language-([\w-]+)/);

  return {
    code: extractTextContent(codeChild.props.children),
    language: languageMatch?.[1] ?? "text",
  };
}

export interface MarkdownRendererProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  content: string;
  density?: "default" | "compact";
  codeTheme?: CodeBlockTheme;
}

export const MarkdownRenderer = React.forwardRef<HTMLDivElement, MarkdownRendererProps>(
  ({ content, density = "default", codeTheme = "auto", className, ...props }, ref) => {
    const styles = densityClassMap[density];

    const components = React.useMemo<Components>(
      () => ({
        h1: ({ className: headingClassName, children, ...headingProps }) => (
          <h1 className={cn(styles.heading, styles.heading1, headingClassName)} {...headingProps}>
            {children}
          </h1>
        ),
        h2: ({ className: headingClassName, children, ...headingProps }) => (
          <h2 className={cn(styles.heading, styles.heading2, headingClassName)} {...headingProps}>
            {children}
          </h2>
        ),
        h3: ({ className: headingClassName, children, ...headingProps }) => (
          <h3 className={cn(styles.heading, styles.heading3, headingClassName)} {...headingProps}>
            {children}
          </h3>
        ),
        h4: ({ className: headingClassName, children, ...headingProps }) => (
          <h4 className={cn(styles.heading, styles.heading4, headingClassName)} {...headingProps}>
            {children}
          </h4>
        ),
        p: ({ className: paragraphClassName, children, ...paragraphProps }) => (
          <p className={cn(styles.paragraph, paragraphClassName)} {...paragraphProps}>
            {children}
          </p>
        ),
        a: ({ className: linkClassName, children, ...linkProps }) => (
          <a
            className={cn(
              "font-medium text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:decoration-primary",
              linkClassName,
            )}
            {...linkProps}
          >
            {children}
          </a>
        ),
        ul: ({ className: listClassName, children, ...listProps }) => (
          <ul className={cn(styles.list, "list-disc marker:text-foreground-subtle", listClassName)} {...listProps}>
            {children}
          </ul>
        ),
        ol: ({ className: listClassName, children, ...listProps }) => (
          <ol className={cn(styles.list, "list-decimal marker:text-foreground-subtle", listClassName)} {...listProps}>
            {children}
          </ol>
        ),
        li: ({ className: listItemClassName, children, ...listItemProps }) => (
          <li className={cn(styles.listItem, listItemClassName)} {...listItemProps}>
            {children}
          </li>
        ),
        blockquote: ({ className: blockquoteClassName, children, ...blockquoteProps }) => (
          <blockquote className={cn(styles.blockquote, blockquoteClassName)} {...blockquoteProps}>
            {children}
          </blockquote>
        ),
        hr: ({ className: hrClassName, ...hrProps }) => (
          <hr className={cn(styles.horizontalRule, hrClassName)} {...hrProps} />
        ),
        img: ({ className: imageClassName, alt, src, ...imageProps }) => {
          if (!src) {
            return null;
          }

          return (
            <Image
              src={src}
              alt={alt ?? ""}
              loading="lazy"
              title={imageProps.title}
              width={imageProps.width}
              height={imageProps.height}
              sizes={imageProps.sizes}
              srcSet={imageProps.srcSet}
              crossOrigin={imageProps.crossOrigin}
              referrerPolicy={imageProps.referrerPolicy}
              className={cn(styles.image, "max-w-full bg-surface", imageClassName)}
              imgClassName="w-full"
            />
          );
        },
        code: ({ className: codeClassName, children, ...codeProps }) => (
          <code className={cn(styles.inlineCode, codeClassName)} {...codeProps}>
            {children}
          </code>
        ),
        pre: ({ className: preClassName, children, ...preProps }) => {
          const codeBlockProps = getCodeBlockProps(children);

          if (codeBlockProps) {
            return (
              <CodeBlock
                code={codeBlockProps.code}
                language={codeBlockProps.language}
                copyable
                wrapLongLines
                theme={codeTheme}
              />
            );
          }

          return (
            <pre className={cn(styles.preFallback, preClassName)} {...preProps}>
              {children}
            </pre>
          );
        },
        table: ({ className: tableClassName, children, ...tableProps }) => (
          <div className={styles.tableWrapper}>
            <table className={cn(styles.table, tableClassName)} {...tableProps}>
              {children}
            </table>
          </div>
        ),
        thead: ({ className: tableHeadClassName, children, ...tableHeadProps }) => (
          <thead className={cn(styles.tableHead, tableHeadClassName)} {...tableHeadProps}>
            {children}
          </thead>
        ),
        th: ({ className: tableHeaderClassName, children, ...tableHeaderProps }) => (
          <th className={cn(styles.tableHeader, tableHeaderClassName)} {...tableHeaderProps}>
            {children}
          </th>
        ),
        td: ({ className: tableCellClassName, children, ...tableCellProps }) => (
          <td className={cn(styles.tableCell, tableCellClassName)} {...tableCellProps}>
            {children}
          </td>
        ),
        strong: ({ className: strongClassName, children, ...strongProps }) => (
          <strong className={cn("font-semibold text-foreground", strongClassName)} {...strongProps}>
            {children}
          </strong>
        ),
        em: ({ className: emphasisClassName, children, ...emphasisProps }) => (
          <em className={cn("text-foreground", emphasisClassName)} {...emphasisProps}>
            {children}
          </em>
        ),
      }),
      [codeTheme, styles],
    );

    return (
      <div ref={ref} className={cn("min-w-0 break-words text-foreground", className)} {...props}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml components={components}>
          {content}
        </ReactMarkdown>
      </div>
    );
  },
);

MarkdownRenderer.displayName = "MarkdownRenderer";
