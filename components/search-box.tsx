"use client"

import { useState, useRef, useId } from "react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const MAX_QUERY_LENGTH = 8000
const CHAR_COUNTER_THRESHOLD = 7500

// Must contain at least one run of 3+ consecutive letters
const ALPHA_RUN_RE = /[a-zA-Z]{3}/

// Soft-check patterns that look like prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+previous/i,
  /disregard\s+the\s+above/i,
  /system\s*:/i,
  /###/,
  /```/,
  /you\s+are\s+now/i,
  /\bDAN\b/,
  /sudo\s+mode/i,
  // Long runs of nested quotes (5+ of the same quote char in a row)
  /['"]{5,}/,
]

function validateQuery(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null // empty — handled by disabled button, not inline error

  if (!ALPHA_RUN_RE.test(trimmed)) {
    return "Please rephrase as a normal question about Long COVID"
  }

  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(trimmed)) {
      return "Please rephrase as a normal question about Long COVID"
    }
  }

  return null
}

interface SearchBoxProps {
  onSubmit: (query: string) => void
  placeholder?: string
  defaultValue?: string
  autoFocus?: boolean
  className?: string
  isLoading?: boolean
}

export function SearchBox({
  onSubmit,
  placeholder = "Describe your symptom, question, or concern...",
  defaultValue = "",
  autoFocus = false,
  className,
  isLoading = false,
}: SearchBoxProps) {
  const [value, setValue] = useState(defaultValue)
  const [validationError, setValidationError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const errorId = useId()

  function handleSubmit() {
    const trimmed = value.trim()
    if (!trimmed || isLoading) return
    const error = validateQuery(trimmed)
    if (error) {
      setValidationError(error)
      return
    }
    setValidationError(null)
    onSubmit(trimmed)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const next = e.target.value
    if (next.length > MAX_QUERY_LENGTH) return
    setValue(next)
    // Clear inline error as soon as the user edits
    if (validationError) setValidationError(null)
    // Auto-grow textarea
    const el = textareaRef.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }
  }

  const trimmed = value.trim()
  const hasValue = trimmed.length > 0
  const isDisabled = !hasValue || isLoading
  const showCharCounter = value.length >= CHAR_COUNTER_THRESHOLD
  const isInvalid = validationError !== null

  return (
    <div className={cn("flex flex-col gap-1.5 w-full", className)}>
      <div
        className={cn(
          "relative flex items-end gap-3 w-full rounded-2xl border bg-card px-4 py-3 shadow-sm transition-shadow",
          isInvalid
            ? "border-destructive focus-within:shadow-md focus-within:border-destructive"
            : "border-border focus-within:shadow-md focus-within:border-primary/40"
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
          maxLength={MAX_QUERY_LENGTH}
          aria-label="Search query"
          aria-invalid={isInvalid}
          aria-describedby={isInvalid ? errorId : undefined}
          className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed overflow-hidden min-h-[24px] max-h-48"
        />
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          aria-label="Submit query"
          className={cn(
            "shrink-0 flex items-center justify-center w-9 h-9 rounded-full transition-all duration-150",
            isDisabled
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          )}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Inline validation error */}
      {isInvalid && (
        <p id={errorId} className="text-xs text-destructive px-1">
          {validationError}
        </p>
      )}

      {/* Character counter (only near limit) */}
      {showCharCounter && (
        <p className="text-xs text-muted-foreground text-right px-1">
          {value.length.toLocaleString()} / {MAX_QUERY_LENGTH.toLocaleString()}
        </p>
      )}
    </div>
  )
}
