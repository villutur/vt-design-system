import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility to merge Tailwind CSS classes safely without style conflicts.
 * Uses clsx for conditional classes and tailwind-merge for overriding.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
