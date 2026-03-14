import React from "react";
import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils/cn";
import { IconUser } from "@tabler/icons-react";
import { Image } from "./Image";

const avatarVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-muted font-semibold text-foreground uppercase",
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-[10px]",
        sm: "h-8 w-8 text-xs",
        default: "h-10 w-10 text-sm",
        lg: "h-14 w-14 text-base",
        xl: "h-20 w-20 text-xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export interface AvatarProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /**
   * The image URL. If it fails, falls back to initials or icon.
   */
  src?: string;
  /**
   * Alt text for the image
   */
  alt?: string;
  /**
   * Text context to extract initials from if image fails or isn't provided (e.g. "John Doe" -> "JD")
   */
  fallbackText?: string;
  /**
   * Explicit initials to use instead of calculating from fallbackText
   */
  initials?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    { className, size, src, alt, fallbackText, initials, children, ...props },
    ref,
  ) => {
    // Get initials based on provided text
    const getInitials = (text: string) => {
      if (!text) return "";
      const words = text.split(" ").filter((w) => w.trim().length > 0);
      if (words.length === 0) return "";
      if (words.length === 1) return words[0].substring(0, 2);
      return `${words[0][0]}${words[words.length - 1][0]}`;
    };

    const finalInitials = initials || getInitials(fallbackText || alt || "");

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        <Image
          src={src}
          alt={alt || "Avatar"}
          fit="cover"
          className="h-full w-full bg-transparent"
          imgClassName="h-full w-full"
          fallback={
            finalInitials ? (
              <span className="flex h-full w-full items-center justify-center">
                {finalInitials}
              </span>
            ) : (
              <span className="flex h-full w-full items-center justify-center opacity-70">
                <IconUser className="h-1/2 w-1/2 text-current" />
              </span>
            )
          }
        />
        {children}
      </div>
    );
  },
);
Avatar.displayName = "Avatar";
