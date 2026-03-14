import React from "react";
import { forwardRef, useEffect, useState } from "react";
import { IconPhoto } from "@tabler/icons-react";
import { cn } from "../../utils/cn";

const fitClassMap = {
  cover: "object-cover",
  contain: "object-contain",
  fill: "object-fill",
  none: "object-none",
  "scale-down": "object-scale-down",
} as const;

const roundedClassMap = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-lg",
  lg: "rounded-xl",
  xl: "rounded-2xl",
  full: "rounded-full",
} as const;

export type ImageFit = keyof typeof fitClassMap;
export type ImageRounded = keyof typeof roundedClassMap;
export type ImageAspectRatio = "auto" | "square" | "video" | number | `${number}/${number}`;

function resolveAspectRatio(aspectRatio: ImageAspectRatio) {
  if (aspectRatio === "auto") {
    return undefined;
  }

  if (aspectRatio === "square") {
    return "1 / 1";
  }

  if (aspectRatio === "video") {
    return "16 / 9";
  }

  if (typeof aspectRatio === "number") {
    return String(aspectRatio);
  }

  return aspectRatio.replace("/", " / ");
}

export interface ImageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "onError" | "onLoad"> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  fit?: ImageFit;
  rounded?: ImageRounded;
  framed?: boolean;
  aspectRatio?: ImageAspectRatio;
  loading?: React.ImgHTMLAttributes<HTMLImageElement>["loading"];
  decoding?: React.ImgHTMLAttributes<HTMLImageElement>["decoding"];
  crossOrigin?: React.ImgHTMLAttributes<HTMLImageElement>["crossOrigin"];
  referrerPolicy?: React.ImgHTMLAttributes<HTMLImageElement>["referrerPolicy"];
  sizes?: React.ImgHTMLAttributes<HTMLImageElement>["sizes"];
  srcSet?: React.ImgHTMLAttributes<HTMLImageElement>["srcSet"];
  width?: React.ImgHTMLAttributes<HTMLImageElement>["width"];
  height?: React.ImgHTMLAttributes<HTMLImageElement>["height"];
  title?: React.ImgHTMLAttributes<HTMLImageElement>["title"];
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  onError?: React.ReactEventHandler<HTMLImageElement>;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
}

export const Image = forwardRef<HTMLDivElement, ImageProps>(
  (
    {
      src,
      alt = "",
      fallback,
      fit = "cover",
      rounded = "none",
      framed = false,
      aspectRatio = "auto",
      loading,
      decoding,
      crossOrigin,
      referrerPolicy,
      sizes,
      srcSet,
      width,
      height,
      title,
      className,
      style,
      imgClassName,
      imgStyle,
      onError,
      onLoad,
      ...props
    },
    ref,
  ) => {
    const [hasError, setHasError] = useState(!src);
    const resolvedAspectRatio = resolveAspectRatio(aspectRatio);
    const fallbackContent = fallback ?? (
      <span className="flex h-full min-h-16 w-full items-center justify-center bg-surface-subtle/80 text-foreground-subtle">
        <IconPhoto size={20} />
      </span>
    );

    useEffect(() => {
      setHasError(!src);
    }, [src]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative block overflow-hidden bg-surface-subtle",
          roundedClassMap[rounded],
          framed && "border border-default",
          className,
        )}
        style={{
          aspectRatio: resolvedAspectRatio,
          ...style,
        }}
        {...props}
      >
        {src && !hasError ? (
          <img
            src={src}
            alt={alt}
            loading={loading}
            decoding={decoding}
            crossOrigin={crossOrigin}
            referrerPolicy={referrerPolicy}
            sizes={sizes}
            srcSet={srcSet}
            width={width}
            height={height}
            title={title}
            className={cn("block w-full", resolvedAspectRatio ? "h-full" : "h-auto", fitClassMap[fit], imgClassName)}
            style={imgStyle}
            onError={(event) => {
              setHasError(true);
              onError?.(event);
            }}
            onLoad={onLoad}
          />
        ) : (
          fallbackContent
        )}
      </div>
    );
  },
);

Image.displayName = "Image";
