import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
//import React from "react";
import moment from 'moment';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string) {
  return moment(dateStr).format("MMMM DD (ddd), YYYY HH:mm:ss");
}

export function getMaxEntry(obj: object) {
  return Object.entries(obj).reduce(
    (max, item) => (item[1] > max[1] ? item : max),
    ["", -Infinity]
  );
}

/*
export function highlightText(
  text: string,
  word: string | null | undefined,
  className = "bg-emerald-200"
): React.ReactNode[] {
  if (!word || word.length === 0) return [text]

  const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const pattern = new RegExp(`(${escapedWord})`, "gi")
  const parts = text.split(pattern)

  parts.map((part, index) => {
    // Highlight only if it matches the pattern (case-insensitive)
    if (pattern.test(part)) {
      return (
        <mark key={index} className={className}>
          {part}
        </mark>
      )
    }

    return <span key={index}>{part}</span>

    })
}*/
