/**
 * Filled upward wedge — reads as Reddit-style upvote, not a generic chevron.
 */
export function RedditUpvoteIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 12 12"
      fill="currentColor"
      aria-hidden
    >
      <path d="M6 1.2 10.65 9.9H1.35L6 1.2z" />
    </svg>
  )
}
