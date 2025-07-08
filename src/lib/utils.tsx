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

export function getDateRange(option: string): { start: string; end: string } {
  const today = new Date();
  const end = today.toISOString().split("T")[0];
  const startDate = new Date(today);

  switch (option) {
    case "last_3_months":
      startDate.setMonth(startDate.getMonth() - 2);
      break;
    case "last_6_months":
      startDate.setMonth(startDate.getMonth() - 5);
      break;
    case "last_12_months":
      startDate.setMonth(startDate.getMonth() - 11);
      break;
    case "ytd":
      startDate.setMonth(0);
      startDate.setDate(1);
      break;
    case "last_year":
      startDate.setFullYear(today.getFullYear() - 1);
      startDate.setMonth(0);
      startDate.setDate(1);
      today.setFullYear(today.getFullYear() - 1);
      today.setMonth(11);
      today.setDate(31);
      return {
        start: startDate.toISOString().split("T")[0],
        end: today.toISOString().split("T")[0],
      };
    default:
      startDate.setMonth(startDate.getMonth() - 2);
  }

  return {
    start: startDate.toISOString().split("T")[0],
    end,
  };
}


export function categorizeSentimentScore(score: number) {
  if (score > 0.5) return { label: "🟩 Strongly Positive", meaning: "The word is framed in very favorable terms (e.g., support, praise)." };
  if (score > 0.2) return { label: "🟢 Positive", meaning: "Generally favorable framing, possibly supportive tone." };
  if (score >= -0.19) return { label: "⚪ Neutral / Mixed", meaning: "Balanced, nuanced, or neutral reporting." };
  if (score >= -0.5) return { label: "🔴 Negative", meaning: "The word is often used in a critical or unfavorable tone." };
  return { label: "🔻 Strongly Negative", meaning: "Highly critical, negative language consistently used with the word." };
}

export function categorizeSentimentStdDev(std: number) {
  if (std <= 0.10) return { label: "🟦 Very Consistent", meaning: "Almost all sentiment values are very close to the mean. Very little variation." };
  if (std <= 0.25) return { label: "🟩 Consistent", meaning: "Generally stable tone, minor fluctuations." };
  if (std <= 0.5) return { label: "🟨 Moderate", meaning: "Some variability in tone — might reflect nuance or shifting stance." };
  if (std <= 0.8) return { label: "🟧 Volatile", meaning: "Big shifts in how the word is framed (positive/negative) across articles." };
  return { label: "🟥 Highly Volatile", meaning: "Tone fluctuates significantly — often sensational or emotionally reactive." };
}


export function dynamicCategorizeSentimentScore(score: number, min: number, max: number) {
  const range = max - min;
  const thresholds = {
    low: min + range * 0.33,
    mid: min + range * 0.66,
  };

  if (score <= thresholds.low) return { label: "🔻 Very Negative", meaning: "Strongly negative framing." };
  if (score <= thresholds.mid) return { label: "🔴 Negative", meaning: "Generally unfavorable reporting." };
  return { label: "⚪ Slightly Negative", meaning: "Mild criticism or mixed framing." };
}

export function dynamicCategorizeStdDev(std: number, min: number, max: number) {
  const range = max - min;
  const thresholds = {
    low: min + range * 0.33,
    mid: min + range * 0.66,
  };

  if (std <= thresholds.low) return { label: "🟦 Very Consistent", meaning: "Tone is steady across mentions." };
  if (std <= thresholds.mid) return { label: "🟩 Consistent", meaning: "Small variations in tone." };
  return { label: "🟨 Somewhat Volatile", meaning: "Tone shifts more across articles." };
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
