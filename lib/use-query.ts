"use client"

import { useState, useCallback } from "react"
import type { AppState, QueryStage } from "./types"
import { isClarification, isError, isQueryResponse } from "./types"
import { MOCK_CLARIFICATION, MOCK_ANSWER, MOCK_EMPTY } from "./mock-data"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ""

const STAGE_DELAYS: Record<QueryStage, number> = {
  rewriting: 600,
  searching: 1200,
  reading: 1800,
  synthesizing: 900,
}

async function simulateStages(
  onStage: (stage: QueryStage) => void
): Promise<void> {
  const stages: QueryStage[] = ["rewriting", "searching", "reading", "synthesizing"]
  for (const stage of stages) {
    onStage(stage)
    await new Promise((r) => setTimeout(r, STAGE_DELAYS[stage]))
  }
}

export function useCompassQuery() {
  const [state, setState] = useState<AppState>({ status: "idle" })

  const submitQuery = useCallback(
    async (query: string, options?: { selected_rewrite_index?: number; edited_query?: string }) => {
      const resolvedQuery = options?.edited_query ?? query
      setState({ status: "loading", stage: "rewriting", query: resolvedQuery })

      // Simulate stage progression
      const stagePromise = simulateStages((stage) =>
        setState({ status: "loading", stage, query: resolvedQuery })
      )

      try {
        let response

        if (API_BASE) {
          // Real API call
          const body: Record<string, unknown> = { query: resolvedQuery }
          if (options?.selected_rewrite_index !== undefined) {
            body.selected_rewrite_index = options.selected_rewrite_index
          }
          const res = await fetch(`${API_BASE}/query`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })
          response = await res.json()
        } else {
          // Mock: return static mock data when no API is available
          await stagePromise
          response = MOCK_ANSWER
        }

        if (isClarification(response)) {
          setState({ status: "clarification", data: response })
        } else if (isError(response)) {
          setState({ status: "error", failed_stage: response.failed_stage, query: resolvedQuery })
        } else if (isQueryResponse(response)) {
          if (!response.sources || response.sources.length === 0) {
            setState({ status: "empty", query: resolvedQuery })
          } else {
            setState({ status: "answer", data: response })
          }
        }
      } catch {
        await stagePromise
        setState({ status: "error", failed_stage: "synthesizing", query: resolvedQuery })
      }
    },
    []
  )

  const reset = useCallback(() => setState({ status: "idle" }), [])

  return { state, submitQuery, reset }
}
