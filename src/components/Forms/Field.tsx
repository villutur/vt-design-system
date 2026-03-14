import React from "react";
import { cn } from "../../utils/cn";

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  hidden?: boolean;
  disabled?: boolean;
}

export const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, children, required = false, hidden = false, disabled = false, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        hidden ? "sr-only" : "text-sm font-medium text-foreground-muted transition-colors",
        disabled && "opacity-70",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      {required ? (
        <span className="ml-xs text-error" aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  ),
);

FieldLabel.displayName = "FieldLabel";

export interface FieldMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: boolean;
}

export const FieldMessage = React.forwardRef<HTMLParagraphElement, FieldMessageProps>(
  ({ className, error = false, ...props }, ref) => (
    <p ref={ref} className={cn("text-xs", error ? "text-error" : "text-foreground-muted", className)} {...props} />
  ),
);

FieldMessage.displayName = "FieldMessage";

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  helperText?: React.ReactNode;
  errorText?: React.ReactNode;
  error?: boolean;
  required?: boolean;
  disabled?: boolean;
  htmlFor?: string;
  labelHidden?: boolean;
  labelId?: string;
  messageId?: string;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      label,
      description,
      helperText,
      errorText,
      error = false,
      required = false,
      disabled = false,
      htmlFor,
      labelHidden = false,
      labelId,
      messageId,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const message = error ? (errorText ?? helperText) : helperText;

    return (
      <div ref={ref} className={cn("flex w-full flex-col gap-sm", className)} {...props}>
        {label ? (
          <div className="space-y-xs">
            <FieldLabel id={labelId} htmlFor={htmlFor} required={required} hidden={labelHidden} disabled={disabled}>
              {label}
            </FieldLabel>
            {description ? <p className="text-xs text-foreground-muted">{description}</p> : null}
          </div>
        ) : null}

        {children}

        {message ? (
          <FieldMessage id={messageId} error={error}>
            {message}
          </FieldMessage>
        ) : null}
      </div>
    );
  },
);

Field.displayName = "Field";
