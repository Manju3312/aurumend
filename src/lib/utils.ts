import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(str: string, len = 6) {
  if (!str) return "";
  if (str.length <= len * 2) return str;
  return `${str.slice(0, len)}...${str.slice(-len)}`;
}

