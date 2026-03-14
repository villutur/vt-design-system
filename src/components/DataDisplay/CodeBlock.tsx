import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { Button } from "../Forms/Button";
import { cn } from "../../utils/cn";

export type CodeBlockTheme = "auto" | "light" | "dark";

export interface CodeBlockProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  code: string;
  language: string;
  title?: React.ReactNode;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  copyable?: boolean;
  wrapLongLines?: boolean;
  theme?: CodeBlockTheme;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  title,
  showLineNumbers = false,
  highlightLines = [],
  copyable = false,
  wrapLongLines = false,
  theme = "auto",
  className,
  ...props
}) => {
  const [copied, setCopied] = React.useState(false);
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (theme !== "auto" || typeof document === "undefined") {
      return;
    }

    const html = document.documentElement;
    const syncTheme = () => {
      setIsDark(html.classList.contains("dark"));
    };
    const observer = new MutationObserver(() => {
      syncTheme();
    });

    syncTheme();
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, [theme]);

  const highlightTheme =
    theme === "dark" ? themes.vsDark : theme === "light" ? themes.vsLight : isDark ? themes.vsDark : themes.vsLight;

  const handleCopy = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-default bg-surface shadow-soft dark:shadow-soft-dark",
        className,
      )}
      {...props}
    >
      {(title || copyable) && (
        <div className="flex items-center justify-between border-b border-default bg-surface-subtle px-md py-sm">
          <div className="truncate text-xs font-semibold tracking-wide text-foreground-muted uppercase">
            {title ?? language}
          </div>
          {copyable ? (
            <Button type="button" size="xs" variant="ghost" onClick={() => void handleCopy()}>
              {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              {copied ? "Copied" : "Copy"}
            </Button>
          ) : null}
        </div>
      )}

      <Highlight theme={highlightTheme} code={code.trimEnd()} language={language}>
        {({ className: highlightClassName, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={cn(
              highlightClassName,
              "overflow-x-auto bg-transparent p-md text-sm leading-6",
              wrapLongLines && "break-words whitespace-pre-wrap",
            )}
          >
            {tokens.map((line, index) => {
              const lineNumber = index + 1;
              const isHighlighted = highlightLines.includes(lineNumber);

              return (
                <div
                  key={lineNumber}
                  {...getLineProps({ line })}
                  className={cn(
                    "grid min-w-max grid-cols-[auto_1fr] gap-md rounded px-sm",
                    wrapLongLines && "min-w-0",
                    isHighlighted && "bg-primary/10",
                  )}
                >
                  {showLineNumbers ? (
                    <span className="pt-[1px] text-right text-xs text-foreground-subtle select-none">{lineNumber}</span>
                  ) : null}
                  <span className={cn("block", wrapLongLines && "min-w-0")}>
                    {line.map((token, tokenIndex) => (
                      <span key={tokenIndex} {...getTokenProps({ token })} />
                    ))}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

CodeBlock.displayName = "CodeBlock";
