import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


 export function getCookie(name:any) {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith(name + '='))
      ?.split('=')[1];
  }



  // lib/utils.ts or a hooks file
export const getPaginationRange = (currentPage: number, totalPages: number) => {
  const delta = 2; // How many pages to show around the current page
  const range = [];
  for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
    range.push(i);
  }

  if (currentPage - delta > 2) range.unshift("...");
  if (currentPage + delta < totalPages - 1) range.push("...");

  range.unshift(1);
  if (totalPages > 1) range.push(totalPages);

  return range;
};