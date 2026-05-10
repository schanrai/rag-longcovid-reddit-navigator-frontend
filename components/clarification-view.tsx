"use client"

import { useState } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ClarificationResponse } from "@/lib/types"

interface ClarificationViewProps {
  data: ClarificationResponse
  onSelect: (query: string, index?: number) => void
}

export function ClarificationView({ data, onSelect }: ClarificationViewProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [otherSelected, setOtherSelected] = useState(false)
  const [otherText, setOtherText] = useState("")

  function handleOptionClick(index: number) {
    setSelectedIndex(index)
    setOtherSelected(false)
  }

  function handleOtherClick() {
    setOtherSelected(true)
    setSelectedIndex(null)
  }

  function handleSubmit() {
    if (otherSelected && otherText.trim()) {
      onSelect(otherText.trim())
    } else if (selectedIndex !== null) {
      onSelect(data.rewrites[selectedIndex], selectedIndex)
    }
  }

  const canSubmit =
    (selectedIndex !== null) || (otherSelected && otherText.trim().length > 0)

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
        We can help in a few ways...
      </p>
      <h2 className="text-xl font-semibold text-foreground mb-6 text-balance leading-snug">
        Which of these is closest to what you&apos;re looking for?
      </h2>

      <div className="space-y-2">
        {data.rewrites.map((rewrite, i) => (
          <button
            key={i}
            onClick={() => handleOptionClick(i)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left text-sm transition-all duration-150",
              selectedIndex === i
                ? "border-primary bg-accent text-foreground"
                : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-accent/50"
            )}
          >
            <span
              className={cn(
                "flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                selectedIndex === i ? "border-primary bg-primary" : "border-border"
              )}
            >
              {selectedIndex === i && (
                <svg viewBox="0 0 10 8" className="w-3 h-3 fill-white">
                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="leading-relaxed">{rewrite}</span>
          </button>
        ))}

        {/* Other option */}
        <button
          onClick={handleOtherClick}
          className={cn(
            "w-full flex items-start gap-3 px-4 py-3.5 rounded-xl border text-left text-sm transition-all duration-150",
            otherSelected
              ? "border-primary bg-accent"
              : "border-border bg-card hover:border-primary/40 hover:bg-accent/50"
          )}
        >
          <span
            className={cn(
              "flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
              otherSelected ? "border-primary bg-primary" : "border-border"
            )}
          >
            {otherSelected && (
              <svg viewBox="0 0 10 8" className="w-3 h-3 fill-white">
                <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <div className="flex-1">
            <span className="text-foreground">Other</span>
            {otherSelected && (
              <textarea
                autoFocus
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                placeholder="Type your question..."
                rows={2}
                onClick={(e) => e.stopPropagation()}
                className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/40 leading-relaxed"
              />
            )}
          </div>
        </button>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Original: &ldquo;{data.original_query}&rdquo;
        </p>
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150",
            canSubmit
              ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          Search
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
