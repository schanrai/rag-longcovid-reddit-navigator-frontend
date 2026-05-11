import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function redditPermalinkHref(permalink: string): string {
  const p = permalink.trim()
  if (!p) return "https://www.reddit.com/"
  if (p.startsWith("http://") || p.startsWith("https://")) return p
  if (p.startsWith("/")) return `https://www.reddit.com${p}`
  return `https://www.reddit.com/${p}`
}

export function sourceDisplayScore(source: {
  comment_score: number | null
  post_score: number | null
}): number {
  return source.comment_score ?? source.post_score ?? 0
}

export function formatSourceCreatedUtc(iso: string | null): string {
  if (!iso) return "—"
  return new Date(iso).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

/** Relative labels for recent posts; falls back to calendar date after 14 days. */
export function formatSourceCreatedRelative(iso: string | null): string {
  if (!iso) return "—"
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return formatSourceCreatedUtc(iso)
  const diffMs = Date.now() - then
  if (diffMs < 0) return formatSourceCreatedUtc(iso)
  const day = Math.floor(diffMs / (24 * 60 * 60 * 1000))
  if (day >= 14) return formatSourceCreatedUtc(iso)
  if (day >= 1) return `${day} day${day === 1 ? "" : "s"} ago`
  const hr = Math.floor(diffMs / (60 * 60 * 1000))
  if (hr >= 1) return `${hr} hour${hr === 1 ? "" : "s"} ago`
  const min = Math.floor(diffMs / (60 * 1000))
  if (min >= 1) return `${min} min ago`
  return "Just now"
}
