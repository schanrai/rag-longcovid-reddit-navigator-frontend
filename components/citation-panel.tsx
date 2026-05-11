"use client"

import { useState, useRef } from "react"
import { X, ExternalLink } from "lucide-react"
import { RedditUpvoteIcon } from "@/components/reddit-upvote-icon"
import { DISPLAY_SUBREDDIT } from "@/lib/constants"
import type { Source } from "@/lib/types"
import { formatSourceCreatedRelative, hasSpecificPermalink, redditPermalinkHref, sourceDisplayScore } from "@/lib/utils"

function SourceMetaRow({ source }: { source: Source }) {
  const score = sourceDisplayScore(source)
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      <span className="capitalize bg-secondary px-2 py-0.5 rounded-full">{source.chunk_type}</span>
      {score > 0 && (
        <span className="inline-flex items-center gap-1" title="Score (upvotes / post score)">
          <RedditUpvoteIcon className="h-3 w-3 shrink-0 text-primary" />
          {score.toLocaleString()}
        </span>
      )}
      {source.num_comments != null && source.num_comments > 0 && (
        <span>{source.num_comments.toLocaleString()} comments</span>
      )}
      <span>{formatSourceCreatedRelative(source.created_utc)}</span>
    </div>
  )
}

// ── Tooltip (product: fixed subreddit + thread title + excerpt label + chunk text)

interface CitationTooltipProps {
  source: Source
  children: React.ReactNode
  onOpen: () => void
}

export function CitationTooltip({ source, children: _children, onOpen }: CitationTooltipProps) {
  const [visible, setVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const threadTitle = source.post_title.trim() || "Discussion thread"
  const ariaTitle = threadTitle !== "Discussion thread" ? threadTitle : source.text.slice(0, 120)

  function show() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setVisible(true)
  }
  function hide() {
    timeoutRef.current = setTimeout(() => setVisible(false), 120)
  }

  return (
    <span className="relative inline-block">
      <button
        onMouseEnter={show}
        onMouseLeave={hide}
        onClick={onOpen}
        className="inline-flex items-center justify-center min-w-5 h-5 px-1 rounded text-[11px] font-semibold bg-accent text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer align-middle mx-0.5"
        aria-label={`Citation ${source.n}: ${ariaTitle}`}
      >
        {source.n}
      </button>

      {visible && (
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-72 pointer-events-auto"
          role="tooltip"
        >
          <div className="bg-card border border-border rounded-xl shadow-lg p-3 text-left space-y-2">
            <p className="text-[11px] font-semibold text-primary">{DISPLAY_SUBREDDIT}</p>
            <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
              {threadTitle}
            </p>
            <p className="text-[11px] text-muted-foreground uppercase tracking-wide">
              {source.chunk_type === "comment" ? "Comment excerpt" : "Post excerpt"}
            </p>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-5 whitespace-pre-wrap">
              {source.text}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-card border-r border-b border-border rotate-45 -mt-1" />
          </div>
        </div>
      )}
    </span>
  )
}

// ── Right-rail sidebar (desktop) ─────────────────────────────────────────────

interface CitationSidebarProps {
  source: Source | null
  onClose: () => void
}

export function CitationSidebar({ source, onClose }: CitationSidebarProps) {
  if (!source) return null

  const href = redditPermalinkHref(source.permalink)
  const hasThread = hasSpecificPermalink(source.permalink)

  return (
    <aside
      className="hidden lg:flex flex-col w-80 xl:w-96 shrink-0 border-l border-border bg-card overflow-hidden animate-in slide-in-from-right duration-300"
      aria-label="Citation details"
    >
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Source [{source.n}]
        </span>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Close citation panel"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <div>
          <p className="text-xs font-semibold text-primary mb-1">{DISPLAY_SUBREDDIT}</p>
          <p className="text-sm font-semibold text-foreground leading-snug">
            {source.post_title.trim() || "Discussion thread"}
          </p>
        </div>
        <SourceMetaRow source={source} />
        <div className="bg-muted rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Excerpt</p>
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            &ldquo;{source.text}&rdquo;
          </p>
        </div>
        {source.post_summary && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Summary</p>
            <p className="text-sm text-foreground leading-relaxed">{source.post_summary}</p>
          </div>
        )}
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          {hasThread ? "Go to Reddit post" : "Open Reddit"}
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </aside>
  )
}

// ── Mobile modal ──────────────────────────────────────────────────────────────

interface CitationModalProps {
  source: Source | null
  onClose: () => void
}

export function CitationModal({ source, onClose }: CitationModalProps) {
  if (!source) return null

  const href = redditPermalinkHref(source.permalink)
  const hasThread = hasSpecificPermalink(source.permalink)

  return (
    <div
      className="fixed inset-0 z-50 lg:hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Citation details"
    >
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 bg-card rounded-t-2xl max-h-[80vh] flex flex-col shadow-xl animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Source [{source.n}]
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-muted transition-colors text-muted-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          <div>
            <p className="text-xs font-semibold text-primary mb-1">{DISPLAY_SUBREDDIT}</p>
            <p className="text-sm font-semibold text-foreground leading-snug">
              {source.post_title.trim() || "Discussion thread"}
            </p>
          </div>
          <SourceMetaRow source={source} />
          <div className="bg-muted rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1 font-medium">Excerpt</p>
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
              &ldquo;{source.text}&rdquo;
            </p>
          </div>
          {source.post_summary && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Summary</p>
              <p className="text-sm text-foreground leading-relaxed">{source.post_summary}</p>
            </div>
          )}
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors mb-4"
          >
            {hasThread ? "Go to Reddit post" : "Open Reddit"}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
