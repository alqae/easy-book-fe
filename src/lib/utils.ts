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
  return `${baseURl}shared/get-file/${attachment.id}`;
}

export function parseDuration(duration: string): number {
  const hoursMatch = duration.match(/(\d+)h/);
  const minutesMatch = duration.match(/(\d+)m/);
  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  return hours * 60 + minutes;
}

const TIMEZONE_OFFSET = -5 * 60; // Offset in minutes for America/Bogota (UTC-5)

export function getStartTime(hour: string, day: Date): Date {
  const [hours, minutes] = hour.split(':').map(Number);
  const startTime = new Date(day);
  startTime.setUTCHours(hours - TIMEZONE_OFFSET / 60, minutes, 0, 0);
  return startTime;
}

export function getEndTime(startTime: Date, duration: string): Date {
  const durationInMinutes = parseDuration(duration);
  const endTime = new Date(startTime.getTime());
  endTime.setUTCMinutes(endTime.getUTCMinutes() + durationInMinutes);
  return endTime;
}

export function formatDate(date: Date | string): string {
  let parsedDate: Date;

  if (typeof date === 'string') {
    parsedDate = new Date(date);
  } else {
    parsedDate = date;
  }

  return `${parsedDate.toLocaleDateString()} ${parsedDate.toLocaleTimeString()}`;
}

export function getInitials(fistName: string, lastName: string): string {
  if (!fistName || !lastName) {
    return '';
  }

  return `${fistName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}
