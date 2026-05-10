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
