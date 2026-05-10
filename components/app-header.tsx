"use client"

import { Logo } from "./logo"

interface AppHeaderProps {
  onNewSearch: () => void
}

export function AppHeader({ onNewSearch }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={onNewSearch}
          className="flex-shrink-0"
          aria-label="Long Covid Compass home"
        >
          <Logo compact className="h-14 w-14" />
        </button>
        <button
          onClick={onNewSearch}
          className="flex-shrink-0 px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          New search
        </button>
      </div>
    </header>
  )
}
