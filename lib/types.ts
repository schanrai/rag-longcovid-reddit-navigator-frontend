export type QueryStage = "rewriting" | "searching" | "reading" | "synthesizing"

export interface Source {
  citation_number: number
  reddit_url: string
  subreddit: string
  post_title: string
  chunk_text: string
  chunk_type: "post" | "comment"
  score: number
  date: string
  summary: string
}

export interface QueryResponse {
  answer_markdown: string
  sources: Source[]
  rewritten_query: string
  original_query: string
  metadata: {
    total_sources: number
    processing_time_ms: number
  }
}

export interface ClarificationResponse {
  mode: "clarification"
  intent: string
  rewrites: string[]
  original_query: string
}

export interface ErrorResponse {
  error: true
  failed_stage: QueryStage
  message: string
}

export type ApiResponse = QueryResponse | ClarificationResponse | ErrorResponse

export function isClarification(r: ApiResponse): r is ClarificationResponse {
  return (r as ClarificationResponse).mode === "clarification"
}

export function isError(r: ApiResponse): r is ErrorResponse {
  return (r as ErrorResponse).error === true
}

export function isQueryResponse(r: ApiResponse): r is QueryResponse {
  return !isClarification(r) && !isError(r)
}

export type AppState =
  | { status: "idle" }
  | { status: "loading"; stage: QueryStage; query: string }
  | { status: "clarification"; data: ClarificationResponse }
  | { status: "answer"; data: QueryResponse }
  | { status: "error"; failed_stage: QueryStage; query: string }
  | { status: "empty"; query: string }
