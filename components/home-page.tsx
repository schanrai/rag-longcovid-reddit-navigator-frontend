"use client"

import { Logo } from "./logo"
import { SearchBox } from "./search-box"
import { POPULAR_QUERIES } from "@/lib/mock-data"

interface HomePageProps {
  onSubmit: (query: string) => void
}

export function HomePage({ onSubmit }: HomePageProps) {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 pb-20">
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* Logo */}
        <div className="mb-12 w-full flex justify-center">
          <Logo className="h-20 w-auto max-w-full sm:h-28 md:h-36" />
        </div>

        {/* Tagline */}
        <p className="text-xl text-foreground text-center mb-8 text-balance leading-relaxed font-medium">
          Navigate Long COVID through real-world experiences.
        </p>

        {/* Search box */}
        <SearchBox
          onSubmit={onSubmit}
          autoFocus
          className="w-full mb-8"
        />

        {/* Popular queries */}
        <div className="w-full">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center">
            Popular topics
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {POPULAR_QUERIES.map((q) => (
              <button
                key={q}
                onClick={() => onSubmit(q)}
                className="px-3.5 py-2 rounded-full border border-border bg-card text-sm text-foreground hover:border-primary/40 hover:bg-accent hover:text-foreground transition-all duration-150"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
