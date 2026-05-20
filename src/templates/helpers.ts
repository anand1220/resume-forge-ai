import type { ResumeData } from "@/lib/types";
import { format } from "date-fns";

export function fmtDate(d: string) {
  if (!d) return "";
  try {
    return format(new Date(d + "-01"), "MMM yyyy");
  } catch {
    return d;
  }
}

export function dateRange(start: string, end: string, current?: boolean) {
  const s = fmtDate(start);
  const e = current ? "Present" : fmtDate(end);
  if (!s && !e) return "";
  return [s, e].filter(Boolean).join(" — ");
}

export function getThemeVars(theme: ResumeData["theme"]) {
  const sizeMap = { sm: "10.5px", md: "11.5px", lg: "12.5px" };
  const lhMap = { tight: 1.35, normal: 1.5, loose: 1.7 };
  const spMap = { tight: "10px", normal: "16px", loose: "22px" };
  return {
    "--rt-accent": theme.accentColor,
    fontSize: sizeMap[theme.fontSize],
    lineHeight: String(lhMap[theme.lineHeight]),
    "--rt-section-gap": spMap[theme.spacing],
    fontFamily:
      theme.fontFamily === "serif"
        ? '"Instrument Serif", Georgia, serif'
        : '"Inter", system-ui, sans-serif',
  } as React.CSSProperties;
}

/** Normalize a possibly-protocol-less URL for href attributes. */
export function hrefify(url: string) {
  if (!url) return "#";
  if (/^https?:\/\//i.test(url) || url.startsWith("mailto:")) return url;
  return `https://${url}`;
}