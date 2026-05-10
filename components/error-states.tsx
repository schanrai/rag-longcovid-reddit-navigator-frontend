"use client"

import { AlertCircle, SearchX, RefreshCw, Plus } from "lucide-react"
import type { QueryStage } from "@/lib/types"

const STAGE_LABELS: Record<QueryStage, string> = {
  rewriting: "understanding your question",
  searching: "searching for discussions",
  reading: "reading the posts",
  synthesizing: "generating your answer",
}

interface ErrorViewProps {
  failedStage: QueryStage
  onRetry: () => void
  onNewSearch: () => void
}

export function ErrorView({ failedStage, onRetry, onNewSearch }: ErrorViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-sm mx-auto">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-6 w-6 text-destructive" />
      </div>
      <h2 className="text-base font-semibold text-foreground mb-2">Something went wrong</h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        We hit a problem while {STAGE_LABELS[failedStage]}. Please try again.
      </p>
      <div className="flex items-center gap-3">
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
        <button
          onClick={onNewSearch}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-foreground text-sm font-medium hover:bg-muted transition-colors"
        >
          New search
        </button>
      </div>
    </div>
  )
}

interface EmptyViewProps {
  query: string
  onNewSearch: () => void
}

export function EmptyView({ query, onNewSearch }: EmptyViewProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center max-w-sm mx-auto">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted mb-4">
        <SearchX className="h-6 w-6 text-muted-foreground" />
      </div>
      <h2 className="text-base font-semibold text-foreground mb-2">No results found</h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-1">
        We couldn&apos;t find community discussions matching:
      </p>
      <p className="text-sm font-medium text-foreground mb-6">
        &ldquo;{query}&rdquo;
      </p>
      <button
        onClick={onNewSearch}
        className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" />
        New search
      </button>
    </div>
  )
}
