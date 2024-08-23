import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ellipsis(text: string, length: number) {
  if (text.length > length) {
    return `${text.slice(0, length - 3)}...`;
  }

  return text;
}
