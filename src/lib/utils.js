import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Pinagsasama ang mga Tailwind class.
// Kapag nagbanggaan (hal. 'text-6xl' at 'text-3xl'), ang huli ang mananalo.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}