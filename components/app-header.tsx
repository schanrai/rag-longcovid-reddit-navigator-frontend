"use client"

import { cn } from "@/lib/utils"
import { Logo } from "./logo"

interface AppHeaderProps {
  onNewSearch: () => void
  isLoading?: boolean
}

export function AppHeader({ onNewSearch, isLoading = false }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={isLoading ? undefined : onNewSearch}
          disabled={isLoading}
          className={cn("shrink-0", isLoading && "opacity-40 cursor-not-allowed")}
          aria-label="Long Covid Compass home"
        >
          <Logo compact className="h-14 w-14" />
        </button>
        <button
          onClick={isLoading ? undefined : onNewSearch}
          disabled={isLoading}
          className={cn(
            "shrink-0 px-4 py-2 rounded-md font-medium text-sm transition-colors",
            isLoading
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          )}
        >
          New search
        </button>
      </div>
    </header>
  )
}
