"use client"

import { useState, useCallback } from "react"
import type { AppState, QueryStage, ErrorResponse } from "./types"
import { isClarification, isError, isQueryResponse } from "./types"
import { MOCK_ANSWER } from "./mock-data"

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
    async (
      query: string,
      options?: {
        selected_rewrite_index?: number
        edited_query?: string
        original_query?: string
      }
    ) => {
      const resolvedQuery = options?.edited_query ?? query
      setState({ status: "loading", stage: "rewriting", query: resolvedQuery })

      try {
        let response

        if (API_BASE) {
          // Real API call — run stage simulation concurrently with the fetch.
          // Stages always advance through all four labels; after simulateStages
          // resolves the UI is left at "synthesizing" until the fetch completes.
          const body: Record<string, unknown> = { query: resolvedQuery }
          if (options?.selected_rewrite_index !== undefined) {
            body.selected_rewrite_index = options.selected_rewrite_index
          }
          if (options?.original_query) {
            body.original_query = options.original_query
          }

          const fetchPromise = fetch(`${API_BASE}/query`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          })

          // Both must resolve before we transition — whichever finishes last
          // determines the wait. Stages finishing first leaves UI at "synthesizing".
          const [res] = await Promise.all([
            fetchPromise,
            simulateStages((stage) =>
              setState({ status: "loading", stage, query: resolvedQuery })
            ),
          ])

          if (!res.ok) {
            let failed_stage: QueryStage = "synthesizing"
            try {
              const errBody: ErrorResponse = await res.json()
              if (errBody?.failed_stage) failed_stage = errBody.failed_stage
            } catch {
              // Non-JSON error body (e.g. 422 Pydantic validation) — keep fallback
            }
            setState({ status: "error", failed_stage, query: resolvedQuery })
            return
          }

          response = await res.json()
        } else {
          // Mock mode — no API_BASE set
          await simulateStages((stage) =>
            setState({ status: "loading", stage, query: resolvedQuery })
          )
          response = MOCK_ANSWER
        }

        if (isClarification(response)) {
          setState({ status: "clarification", data: response })
        } else if (isError(response)) {
          setState({
            status: "error",
            failed_stage: response.failed_stage ?? "synthesizing",
            query: resolvedQuery,
          })
        } else if (isQueryResponse(response)) {
          if (!response.sources || response.sources.length === 0) {
            setState({ status: "empty", query: resolvedQuery })
          } else {
            setState({ status: "answer", data: response })
          }
        }
      } catch {
        setState({ status: "error", failed_stage: "synthesizing", query: resolvedQuery })
      }
    },
    []
  )

  const reset = useCallback(() => setState({ status: "idle" }), [])

  return { state, submitQuery, reset }
}
