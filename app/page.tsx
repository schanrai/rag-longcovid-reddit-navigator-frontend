"use client"

import { useCallback } from "react"
import { useCompassQuery } from "@/lib/use-query"
import { HomePage } from "@/components/home-page"
import { AppHeader } from "@/components/app-header"
import { LoadingProgress } from "@/components/loading-progress"
import { ClarificationView } from "@/components/clarification-view"
import { AnswerView } from "@/components/answer-view"
import { ErrorView, EmptyView } from "@/components/error-states"

export default function Home() {
  const { state, submitQuery, reset } = useCompassQuery()

  const handleSubmit = useCallback(
    (query: string) => submitQuery(query),
    [submitQuery]
  )

  const handleClarificationSelect = useCallback(
    (query: string, index?: number) => {
      const original_query =
        state.status === "clarification" ? state.data.original_query : undefined
      submitQuery(query, { selected_rewrite_index: index, original_query })
    },
    [state, submitQuery]
  )

  const handleEditQuery = useCallback(
    (query: string) => submitQuery(query, { edited_query: query }),
    [submitQuery]
  )

  const handleRetry = useCallback(() => {
    if (state.status === "error") {
      submitQuery(state.query)
    }
  }, [state, submitQuery])

  // Idle → show homepage
  if (state.status === "idle") {
    return <HomePage onSubmit={handleSubmit} isLoading={state.status === "loading"} />
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <AppHeader onNewSearch={reset} isLoading={state.status === "loading"} />

      <div className="flex-1 min-h-0 flex flex-col">
        {state.status === "loading" && (
          <div className="flex-1 flex items-center justify-center">
            <LoadingProgress currentStage={state.stage} />
          </div>
        )}

        {state.status === "clarification" && (
          <div className="flex-1 overflow-y-auto flex items-start justify-center pt-4">
            <ClarificationView
              data={state.data}
              onSelect={handleClarificationSelect}
            />
          </div>
        )}

        {state.status === "answer" && (
          <AnswerView
            data={state.data}
            onEditQuery={handleEditQuery}
          />
        )}

        {state.status === "error" && (
          <div className="flex-1 flex items-center justify-center">
            <ErrorView
              failedStage={state.failed_stage}
              onRetry={handleRetry}
              onNewSearch={reset}
            />
          </div>
        )}

        {state.status === "empty" && (
          <div className="flex-1 flex items-center justify-center">
            <EmptyView query={state.query} onNewSearch={reset} />
          </div>
        )}
      </div>
    </div>
  )
}
