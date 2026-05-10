export type QueryStage = "rewriting" | "searching" | "reading" | "synthesizing"

export type PolicyBlockType = "emergency" | "prescriber" | null

export interface PolicyBlock {
  type: PolicyBlockType
  markdown: string
}

export interface Source {
  n: number
  text: string
  post_title: string
  chunk_type: string
  comment_score: number | null
  post_score: number | null
  num_comments: number | null
  post_summary: string | null
  created_utc: string | null
  permalink: string
}

export interface QueryMetadata {
  latency_ms: number
  chunks_retrieved: number
  chunks_cited: number
  reranker_used?: boolean
  model?: string
}

export interface QueryResponse {
  policy_block: PolicyBlock
  answer_markdown: string
  sources: Source[]
  rewritten_query: string
  original_query: string
  metadata: QueryMetadata
}

export interface RewriteCandidate {
  query: string
  explanation: string
  confidence: number
}

export interface ClarificationResponse {
  mode: "clarification"
  intent: string
  rewrites: RewriteCandidate[]
  original_query: string
}

export interface ErrorBody {
  code: string
  message: string
}

export interface ErrorResponse {
  error: ErrorBody
  failed_stage: QueryStage | null
}

export type ApiResponse = QueryResponse | ClarificationResponse | ErrorResponse

export function isClarification(r: ApiResponse): r is ClarificationResponse {
  return (r as ClarificationResponse).mode === "clarification"
}

export function isError(r: ApiResponse): r is ErrorResponse {
  const e = (r as ErrorResponse).error
  return e !== null && typeof e === "object" && typeof (e as ErrorBody).code === "string"
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
