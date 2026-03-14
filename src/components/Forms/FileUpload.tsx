import React from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { IconAlertCircle, IconFile, IconLoader2, IconTrash, IconUpload } from "@tabler/icons-react";
import { Badge } from "../DataDisplay/Badge";
import { Button } from "./Button";
import { ProgressBar } from "../Feedback/ProgressBar";
import { cn } from "../../utils/cn";
import { useControllableState } from "../../internal/useControllableState";
import { Field } from "./Field";

export type FileUploadItemStatus = "idle" | "uploading" | "success" | "error";

export interface FileUploadItem {
  id: string;
  file: File;
  status?: FileUploadItemStatus;
  progress?: number;
  error?: React.ReactNode;
}

export interface FileUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  required?: boolean;
  accept?: Accept;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number;
  minSize?: number;
  disabled?: boolean;
  items?: FileUploadItem[];
  defaultItems?: FileUploadItem[];
  onItemsChange?: (items: FileUploadItem[]) => void;
  onAddFiles?: (items: FileUploadItem[], files: File[]) => void;
  onRejectedFiles?: (fileRejections: readonly FileRejection[]) => void;
}

const statusVariantMap: Record<FileUploadItemStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  idle: "soft",
  uploading: "softPrimary",
  success: "softSuccess",
  error: "softError",
};

function createFileUploadItem(file: File, index: number): FileUploadItem {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${index}`,
    file,
    status: "idle",
    progress: 0,
  };
}

function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIndex]}`;
}

function formatItemCount(count: number) {
  return `${count} ${count === 1 ? "file" : "files"}`;
}

function getUploadSummary(
  items: FileUploadItem[],
  options: {
    rejectedCount: number;
    disabled: boolean;
    isAtMaxFiles: boolean;
  },
) {
  const uploadingCount = items.filter((item) => (item.status ?? "idle") === "uploading").length;
  const errorCount = items.filter((item) => (item.status ?? "idle") === "error" || item.error).length;
  const successCount = items.filter((item) => (item.status ?? "idle") === "success").length;
  const parts = [items.length > 0 ? `${formatItemCount(items.length)} selected.` : "No files selected."];

  if (uploadingCount > 0) {
    parts.push(`${formatItemCount(uploadingCount)} uploading.`);
  }

  if (successCount > 0) {
    parts.push(`${formatItemCount(successCount)} completed.`);
  }

  if (errorCount > 0) {
    parts.push(`${formatItemCount(errorCount)} with errors.`);
  }

  if (options.rejectedCount > 0) {
    parts.push(`${formatItemCount(options.rejectedCount)} recently rejected.`);
  }

  if (options.isAtMaxFiles) {
    parts.push("Maximum file count reached.");
  }

  if (options.disabled) {
    parts.push("File upload is disabled.");
  }

  return parts.join(" ");
}

export const FileUpload = React.forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      label,
      description,
      helperText,
      errorText,
      error = false,
      required = false,
      accept,
      multiple = true,
      maxFiles,
      maxSize,
      minSize,
      disabled = false,
      items,
      defaultItems = [],
      onItemsChange,
      onAddFiles,
      onRejectedFiles,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = id || React.useId();
    const labelId = label ? `${generatedId}-label` : undefined;
    const messageId = helperText || errorText ? `${generatedId}-message` : undefined;
    const constraintsId = `${generatedId}-constraints`;
    const summaryId = `${generatedId}-summary`;
    const liveRegionId = `${generatedId}-live-region`;
    const [currentItems, setCurrentItems] = useControllableState<FileUploadItem[]>({
      value: items,
      defaultValue: defaultItems,
      onChange: onItemsChange,
    });
    const [liveMessage, setLiveMessage] = React.useState("");
    const [lastRejections, setLastRejections] = React.useState<readonly FileRejection[]>([]);
    const isAtMaxFiles = maxFiles !== undefined && currentItems.length >= maxFiles;
    const remainingFiles = maxFiles !== undefined ? Math.max(maxFiles - currentItems.length, 0) : undefined;
    const uploadingCount = currentItems.filter((item) => (item.status ?? "idle") === "uploading").length;
    const hasUploadingItems = uploadingCount > 0;
    const rejectionId = lastRejections.length > 0 ? `${generatedId}-rejections` : undefined;
    const fileListId = currentItems.length > 0 ? `${generatedId}-files` : undefined;
    const describedBy = [messageId, constraintsId, summaryId, rejectionId].filter(Boolean).join(" ") || undefined;
    const uploadSummary = getUploadSummary(currentItems, {
      rejectedCount: lastRejections.length,
      disabled,
      isAtMaxFiles,
    });

    const handleAcceptedFiles = React.useCallback(
      (acceptedFiles: File[]) => {
        const mappedItems = acceptedFiles.map((file, index) => createFileUploadItem(file, index));
        const nextItemsBase = multiple ? [...currentItems, ...mappedItems] : mappedItems.slice(0, 1);
        const nextItems = maxFiles !== undefined ? nextItemsBase.slice(0, maxFiles) : nextItemsBase;

        setCurrentItems(nextItems);
        setLastRejections([]);
        setLiveMessage(
          acceptedFiles.length === 1
            ? `${acceptedFiles[0]?.name} added.`
            : `${formatItemCount(acceptedFiles.length)} added.`,
        );
        onAddFiles?.(mappedItems, acceptedFiles);
      },
      [currentItems, maxFiles, multiple, onAddFiles, setCurrentItems],
    );

    const handleRejectedFiles = React.useCallback(
      (fileRejections: readonly FileRejection[]) => {
        setLastRejections(fileRejections);
        setLiveMessage(
          fileRejections.length === 1
            ? `${fileRejections[0]?.file.name} could not be added.`
            : `${formatItemCount(fileRejections.length)} could not be added.`,
        );
        onRejectedFiles?.(fileRejections);
      },
      [onRejectedFiles],
    );

    const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject, open } = useDropzone({
      accept,
      disabled: disabled || isAtMaxFiles,
      multiple,
      maxFiles: multiple ? remainingFiles : 1,
      maxSize,
      minSize,
      noClick: true,
      noKeyboard: true,
      onDropAccepted: handleAcceptedFiles,
      onDropRejected: handleRejectedFiles,
    });

    const removeItem = React.useCallback(
      (itemId: string) => {
        const removedItem = currentItems.find((item) => item.id === itemId);
        const nextItems = currentItems.filter((item) => item.id !== itemId);
        setCurrentItems(nextItems);
        if (removedItem) {
          setLiveMessage(`Removed ${removedItem.file.name}.`);
        }
      },
      [currentItems, setCurrentItems],
    );

    return (
      <Field
        label={label}
        labelId={labelId}
        description={description}
        helperText={helperText}
        errorText={errorText}
        error={error}
        required={required}
        disabled={disabled}
        htmlFor={generatedId}
        className={className}
        messageId={messageId}
        {...props}
      >
        <div
          ref={ref}
          {...getRootProps({
            onClick: () => {
              if (!disabled && !isAtMaxFiles) {
                open();
              }
            },
            onKeyDown: (event) => {
              if ((event.key === "Enter" || event.key === " ") && !disabled && !isAtMaxFiles) {
                event.preventDefault();
                open();
              }
            },
            role: "button",
            tabIndex: disabled ? -1 : 0,
            "aria-busy": hasUploadingItems || undefined,
            "aria-controls": fileListId,
            "aria-labelledby": labelId,
            "aria-describedby": describedBy,
            "aria-disabled": disabled || isAtMaxFiles || undefined,
            "aria-invalid": error || undefined,
            "aria-required": required || undefined,
            className: cn(
              "rounded-2xl border border-dashed p-lg transition-colors outline-none",
              error ? "border-error/50 bg-error/5" : "border-strong bg-surface-subtle/80",
              isDragActive && "border-primary bg-primary/5",
              isDragAccept && "border-success bg-success/5",
              isDragReject && "border-error bg-error/5",
              (disabled || isAtMaxFiles) && "cursor-not-allowed opacity-70",
            ),
          })}
        >
          <input
            {...getInputProps({
              id: generatedId,
              required,
              "aria-describedby": describedBy,
            })}
          />

          <div className="flex flex-col items-center justify-center gap-md text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <IconUpload size={22} />
            </div>
            <div className="space-y-xs">
              <p className="text-sm font-semibold text-foreground">
                {isDragActive ? "Drop files to add them" : "Drag and drop files here"}
              </p>
              <p className="text-xs text-foreground-muted">
                {isAtMaxFiles
                  ? "Maximum number of files reached."
                  : multiple
                    ? "or browse from your device"
                    : "or browse for a single file"}
              </p>
            </div>
            <Button
              type="button"
              size="xs"
              variant="secondary"
              onClick={(event) => {
                event.stopPropagation();
                open();
              }}
              disabled={disabled || isAtMaxFiles}
            >
              Browse files
            </Button>
            <div id={constraintsId} className="flex flex-wrap justify-center gap-sm text-[11px] text-foreground-subtle">
              {maxFiles !== undefined ? <span>Max files: {maxFiles}</span> : null}
              {maxSize !== undefined ? <span>Max size: {formatBytes(maxSize)}</span> : null}
              {minSize !== undefined ? <span>Min size: {formatBytes(minSize)}</span> : null}
            </div>
          </div>
        </div>

        <p id={summaryId} className="sr-only">
          {uploadSummary}
        </p>
        <p id={liveRegionId} className="sr-only" aria-live="polite" aria-atomic="true">
          {liveMessage}
        </p>

        {lastRejections.length > 0 ? (
          <div id={rejectionId} role="alert" className="rounded-xl border border-error/20 bg-error/5 p-md">
            <div className="mb-sm flex items-center gap-sm text-sm font-semibold text-error">
              <IconAlertCircle size={16} />
              Some files could not be added
            </div>
            <div className="space-y-sm">
              {lastRejections.map((rejection) => (
                <div key={`${rejection.file.name}-${rejection.file.size}`}>
                  <p className="text-xs font-medium text-foreground">{rejection.file.name}</p>
                  <p className="text-xs text-foreground-muted">
                    {rejection.errors.map((item) => item.message).join(" ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {currentItems.length > 0 ? (
          <ul id={fileListId} role="list" aria-label="Selected files" className="space-y-sm">
            {currentItems.map((item) => {
              const status = item.status ?? "idle";
              const itemNameId = `${generatedId}-${item.id}-name`;
              const itemMetaId = `${generatedId}-${item.id}-meta`;
              const itemProgressId =
                status === "uploading" || item.progress !== undefined
                  ? `${generatedId}-${item.id}-progress`
                  : undefined;
              const itemErrorId = item.error ? `${generatedId}-${item.id}-error` : undefined;
              const itemDescription = [itemMetaId, itemProgressId, itemErrorId].filter(Boolean).join(" ") || undefined;

              return (
                <li
                  key={item.id}
                  aria-labelledby={itemNameId}
                  aria-describedby={itemDescription}
                  className="rounded-xl border border-default bg-surface px-md py-md shadow-soft"
                >
                  <div className="flex items-start justify-between gap-md">
                    <div className="flex min-w-0 items-start gap-sm">
                      <div className="mt-[2px] inline-flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted text-foreground-muted">
                        {status === "uploading" ? (
                          <IconLoader2 size={16} className="animate-spin" />
                        ) : (
                          <IconFile size={16} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p id={itemNameId} className="truncate text-sm font-medium text-foreground">
                          {item.file.name}
                        </p>
                        <div id={itemMetaId} className="mt-xs flex flex-wrap items-center gap-sm">
                          <span className="text-xs text-foreground-muted">{formatBytes(item.file.size)}</span>
                          <Badge variant={statusVariantMap[status]} size="sm">
                            {status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="rounded-md p-xs text-foreground-subtle transition-colors hover:bg-surface-muted hover:text-foreground"
                      aria-label={`Remove ${item.file.name}`}
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>

                  {status === "uploading" || item.progress !== undefined ? (
                    <div className="mt-md">
                      <ProgressBar
                        id={itemProgressId}
                        value={item.progress}
                        indeterminate={status === "uploading" && item.progress === undefined}
                        variant={status === "error" ? "error" : "default"}
                        aria-label={`Upload progress for ${item.file.name}`}
                        aria-valuetext={
                          status === "uploading" && item.progress === undefined
                            ? "Upload in progress"
                            : item.progress !== undefined
                              ? `${item.progress}% uploaded`
                              : undefined
                        }
                      />
                    </div>
                  ) : null}

                  {item.error ? (
                    <p id={itemErrorId} className="mt-sm text-xs text-error">
                      {item.error}
                    </p>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : null}
      </Field>
    );
  },
);

FileUpload.displayName = "FileUpload";
