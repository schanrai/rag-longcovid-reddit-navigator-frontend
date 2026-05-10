"use client"

import { useState, useRef } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchBoxProps {
  onSubmit: (query: string) => void
  placeholder?: string
  defaultValue?: string
  autoFocus?: boolean
  className?: string
}

export function SearchBox({
  onSubmit,
  placeholder = "Describe your symptom, question, or concern...",
  defaultValue = "",
  autoFocus = false,
  className,
}: SearchBoxProps) {
  const [value, setValue] = useState(defaultValue)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit(trimmed)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setValue(e.target.value)
    // Auto-grow textarea
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }
  }

  const hasValue = value.trim().length > 0

  return (
    <div
      className={cn(
        "relative flex items-end gap-3 w-full rounded-2xl border border-border bg-card px-4 py-3 shadow-sm transition-shadow focus-within:shadow-md focus-within:border-primary/40",
        className
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoFocus={autoFocus}
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed overflow-hidden min-h-[24px] max-h-48"
        aria-label="Search query"
      />
      <button
        onClick={handleSubmit}
        disabled={!hasValue}
        aria-label="Submit query"
        className={cn(
          "flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150",
          hasValue
            ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
            : "bg-muted text-muted-foreground cursor-not-allowed"
        )}
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  )
}
