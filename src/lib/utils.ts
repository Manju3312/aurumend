import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Safe BigInt JSON serialization
if (typeof BigInt !== "undefined" && !(BigInt.prototype as any).toJSON) {
  (BigInt.prototype as any).toJSON = function () {
    return this.toString();
  };
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(str: string, len = 6) {
  if (!str) return "";
  if (str.length <= len * 2) return str;
  return `${str.slice(0, len)}...${str.slice(-len)}`;
}
