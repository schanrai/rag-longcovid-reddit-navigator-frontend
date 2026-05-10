"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Pencil, ExternalLink, ChevronUp, AlertCircle, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { QueryResponse, Source } from "@/lib/types"
import { CitationTooltip, CitationSidebar, CitationModal } from "./citation-panel"

interface AnswerViewProps {
  data: QueryResponse
  onEditQuery: (query: string) => void
}

export function AnswerView({ data, onEditQuery }: AnswerViewProps) {
  const [activeTab, setActiveTab] = useState<"answer" | "links">("answer")
  const [openSource, setOpenSource] = useState<Source | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(data.rewritten_query)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleEditConfirm = useCallback(() => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== data.rewritten_query) {
      onEditQuery(trimmed)
    }
    setIsEditing(false)
  }, [editValue, data.rewritten_query, onEditQuery])

  const handleEditCancel = useCallback(() => {
    setEditValue(data.rewritten_query)
    setIsEditing(false)
  }, [data.rewritten_query])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleEditConfirm()
    if (e.key === "Escape") handleEditCancel()
  }, [handleEditConfirm, handleEditCancel])

  const sourceMap = new Map(data.sources.map((s) => [s.citation_number, s]))

  const handleOpenSource = useCallback((source: Source) => {
    setOpenSource(source)
  }, [])

  const handleCloseSource = useCallback(() => {
    setOpenSource(null)
  }, [])

  // Parse inline citations: replace [n] with citation buttons
  function renderAnswerContent(markdown: string) {
    // Split on citation pattern [n] or [n][m] etc.
    const parts = markdown.split(/(\[\d+\])/g)
    return parts.map((part, i) => {
      const match = part.match(/^\[(\d+)\]$/)
      if (match) {
        const num = parseInt(match[1], 10)
        const source = sourceMap.get(num)
        if (source) {
          return (
            <CitationTooltip key={i} source={source} onOpen={() => handleOpenSource(source)}>
              {part}
            </CitationTooltip>
          )
        }
        // Unresolved citation — render as plain text
        return <span key={i} className="text-muted-foreground text-xs">{part}</span>
      }
      return part
    })
  }

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto px-4 pt-8 pb-16">
          {/* Query headline */}
          <h1 className="text-2xl font-semibold text-foreground leading-snug mb-4 text-pretty">
            {data.original_query}
          </h1>

          {/* "We searched for" bar */}
          <div className="mb-6 text-sm text-muted-foreground space-y-1">
            <span className="block">We searched for:</span>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 text-sm font-medium text-foreground bg-card border border-primary rounded-lg px-3 py-1.5 outline-none ring-1 ring-primary"
                  aria-label="Edit search query"
                />
                <button
                  onClick={handleEditConfirm}
                  className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                  aria-label="Confirm edit"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={handleEditCancel}
                  className="flex-shrink-0 flex items-center justify-center h-7 w-7 rounded-lg bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
                  aria-label="Cancel edit"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <span className="font-medium text-foreground text-pretty">
                  &ldquo;{data.rewritten_query}&rdquo;
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-shrink-0 flex items-center gap-1 text-xs text-primary hover:underline mt-0.5"
                  aria-label="Edit query"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl mb-6 w-fit">
            {(["answer", "links"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 capitalize",
                  activeTab === tab
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
                {tab === "links" && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {data.sources.length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Answer tab */}
          {activeTab === "answer" && (
            <div className="animate-in fade-in duration-200">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  p({ children }) {
                    // Flatten children so we can intercept citation strings
                    const processed = processChildren(children, renderAnswerContent)
                    return <p className="text-sm text-foreground leading-relaxed mb-4">{processed}</p>
                  },
                  h2({ children }) {
                    return <h2 className="text-base font-semibold text-foreground mt-6 mb-3">{children}</h2>
                  },
                  h3({ children }) {
                    return <h3 className="text-sm font-semibold text-foreground mt-4 mb-2">{children}</h3>
                  },
                  ul({ children }) {
                    return <ul className="space-y-1.5 mb-4 ml-4 list-disc marker:text-muted-foreground">{children}</ul>
                  },
                  ol({ children }) {
                    return <ol className="space-y-1.5 mb-4 ml-4 list-decimal marker:text-muted-foreground">{children}</ol>
                  },
                  li({ children }) {
                    const processed = processChildren(children, renderAnswerContent)
                    return <li className="text-sm text-foreground leading-relaxed">{processed}</li>
                  },
                  strong({ children }) {
                    return <strong className="font-semibold text-foreground">{children}</strong>
                  },
                  blockquote({ children }) {
                    return (
                      <blockquote className="mt-6 flex gap-3 rounded-xl bg-accent border border-primary/10 px-4 py-3 text-sm text-muted-foreground leading-relaxed">
                        <AlertCircle className="flex-shrink-0 mt-0.5 h-4 w-4 text-primary" />
                        <div>{children}</div>
                      </blockquote>
                    )
                  },
                }}
              >
                {data.answer_markdown}
              </ReactMarkdown>
            </div>
          )}

          {/* Links tab */}
          {activeTab === "links" && (
            <div className="animate-in fade-in duration-200 space-y-3">
              {data.sources.map((source) => (
                <div
                  key={source.citation_number}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded text-[11px] font-semibold bg-accent text-primary border border-primary/20 mt-0.5">
                      {source.citation_number}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-primary mb-0.5">{source.subreddit}</p>
                      <p className="text-sm font-medium text-foreground leading-snug mb-2">
                        {source.post_title}
                      </p>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
                        &ldquo;{source.chunk_text}&rdquo;
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="capitalize bg-secondary px-2 py-0.5 rounded-full">
                            {source.chunk_type}
                          </span>
                          <span>
                            {new Date(source.date).toLocaleDateString("en-GB", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <ChevronUp className="h-3 w-3" />
                            {source.score.toLocaleString()}
                          </span>
                        </div>
                        <a
                          href={source.reddit_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline w-fit self-end sm:self-auto"
                        >
                          Go to Reddit
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop citation sidebar */}
      <CitationSidebar source={openSource} onClose={handleCloseSource} />

      {/* Mobile citation modal */}
      <CitationModal source={openSource} onClose={handleCloseSource} />
    </div>
  )
}

// Helper: walk React children and process string nodes for citation replacement
function processChildren(
  children: React.ReactNode,
  process: (text: string) => React.ReactNode
): React.ReactNode {
  if (typeof children === "string") {
    return process(children)
  }
  if (Array.isArray(children)) {
    return children.map((child, i) => {
      if (typeof child === "string") {
        const result = process(child)
        // If it's an array (split citations), wrap with fragment
        if (Array.isArray(result)) {
          return <span key={i}>{result}</span>
        }
        return <span key={i}>{result}</span>
      }
      return child
    })
  }
  return children
}
