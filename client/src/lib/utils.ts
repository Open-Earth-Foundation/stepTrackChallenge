import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert steps to kilometers
// Using standard 2000 steps per mile and 1.60934 km per mile
export function stepsToKilometers(steps: number): number {
  const milesPerStep = 1 / 2000;
  const kmPerMile = 1.60934;
  return steps * milesPerStep * kmPerMile;
}

// Convert kilometers to steps
export function kilometersToSteps(km: number): number {
  const milesPerKm = 1 / 1.60934;
  const stepsPerMile = 2000;
  return Math.round(km * milesPerKm * stepsPerMile);
}

// Get a formatted number with commas
export function formatNumber(number: number): string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Get an ordinal suffix for a number (1st, 2nd, 3rd, etc.)
export function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return (v - 20) % 10 >= 0 && (v - 20) % 10 <= 3 ? s[(v - 20) % 10] : s[v] || s[0];
}
