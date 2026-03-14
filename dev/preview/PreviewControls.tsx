import React from "react";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { Button, designTokens } from "../../src/index";
import type { SizeMode } from "../../src/index";

interface PreviewControlsProps {
  isDark: boolean;
  sizeMode: SizeMode;
  onSizeModeChange: (mode: SizeMode) => void;
  onToggleDarkMode: () => void;
}

export function PreviewControls({
  isDark,
  sizeMode,
  onSizeModeChange,
  onToggleDarkMode,
}: PreviewControlsProps) {
  const activeSizeMode = designTokens.sizeModes[sizeMode];

  return (
    <div className="fixed right-6 bottom-6 z-50 w-[260px]">
      <div className="rounded-2xl border border-default bg-surface/95 p-2 shadow-xl backdrop-blur supports-[backdrop-filter]:bg-surface/90">
        <div className="px-2 pb-2">
          <p className="text-[10px] font-bold tracking-[0.14em] text-foreground-subtle uppercase">
            Preview Scale
          </p>
          <p className="mt-1 text-xs text-foreground-muted">
            {activeSizeMode.label} mode - {activeSizeMode.rootFontSize}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1">
          {Object.entries(designTokens.sizeModes).map(([mode, config]) => (
            <Button
              key={mode}
              variant={mode === sizeMode ? "primary" : "ghost"}
              size="xs"
              onClick={() => onSizeModeChange(mode as SizeMode)}
              className="justify-center"
            >
              {config.label}
            </Button>
          ))}
        </div>

        <div className="mt-2 border-t border-default pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onToggleDarkMode}
            className="w-full justify-center"
            title="Toggle theme mode"
            leftIcon={isDark ? <IconSun size={16} /> : <IconMoon size={16} />}
          >
            {isDark ? "Switch to light mode" : "Switch to dark mode"}
          </Button>
        </div>
      </div>
    </div>
  );
}
