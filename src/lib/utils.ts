import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Attachment } from '@/types/models';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function ellipsis(text: string, length: number) {
  if (text.length > length) {
    return `${text.slice(0, length - 3)}...`;
  }

  return text;
}

export function getURLByAttachment(attachment?: Attachment): string {
  if (!attachment) {
    return '';
  }

  const baseURl = import.meta.env.VITE_API_BASE_URL;
  return `${baseURl}/shared/get-file/${attachment.id}`;
}
