"use client"

import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QueryStage } from "@/lib/types"

const STAGES: { key: QueryStage; label: string; description: string }[] = [
  { key: "rewriting", label: "Understanding", description: "Interpreting your question" },
  { key: "searching", label: "Searching", description: "Finding relevant discussions" },
  { key: "reading", label: "Reading", description: "Analysing community posts" },
  { key: "synthesizing", label: "Synthesizing", description: "Generating your answer" },
]

interface LoadingProgressProps {
  currentStage: QueryStage
  failedStage?: QueryStage
}

export function LoadingProgress({ currentStage, failedStage }: LoadingProgressProps) {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage)

  return (
    <div className="flex justify-center px-4" role="status" aria-live="polite">
      <div className="flex flex-col space-y-4">
        {STAGES.map((stage, i) => {
          const isDone = i < currentIndex
          const isActive = stage.key === currentStage
          const isFailed = stage.key === failedStage
          const isPending = i > currentIndex

          return (
            <div
              key={stage.key}
              className={cn(
                "flex items-center gap-4 transition-opacity duration-300",
                isPending && "opacity-35"
              )}
            >
              <div className="flex-shrink-0">
                {isFailed ? (
                  <XCircle className="h-5 w-5 text-destructive" />
                ) : isDone ? (
                  <CheckCircle className="h-5 w-5 text-primary" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-border" />
                )}
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm font-medium",
                    isFailed
                      ? "text-destructive"
                      : isActive
                      ? "text-foreground"
                      : isDone
                      ? "text-muted-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {stage.label}
                </p>
                {isActive && !isFailed && (
                  <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
