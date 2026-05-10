import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  compact?: boolean
}

export function Logo({ className, compact = false }: LogoProps) {
  if (compact) {
    // Icon mark only
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 200"
        role="img"
        aria-label="Long Covid Compass"
        className={cn("h-8 w-8", className)}
      >
        <title>Long Covid Compass</title>
        <g transform="translate(10, 10) scale(0.9)">
          <g fill="none" stroke="#F97316" strokeWidth="6" strokeLinecap="round">
            <path d="M 176.815 86.460 A 78 78 0 0 0 113.544 23.189" />
            <path d="M 86.456 23.184 A 78 78 0 0 0 23.185 86.456" />
            <path d="M 23.185 113.544 A 78 78 0 0 0 86.456 176.816" />
            <path d="M 113.544 176.811 A 78 78 0 0 0 176.815 113.540" />
          </g>
          <g fill="#F97316">
            <circle cx="100" cy="22" r="7" />
            <circle cx="178" cy="100" r="7" />
            <circle cx="100" cy="178" r="7" />
            <circle cx="22" cy="100" r="7" />
          </g>
          <g transform="rotate(-45 100 100)">
            <path d="M 100 46 L 114 100 L 100 100 L 86 100 Z" fill="#F97316" />
            <path d="M 100 154 L 86 100 L 100 100 L 114 100 Z" fill="#081D2D" />
            <circle cx="100" cy="100" r="3" fill="#081D2D" />
          </g>
        </g>
      </svg>
    )
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 780 300"
      role="img"
      aria-label="Long Covid Compass"
      className={cn("h-16 w-auto", className)}
    >
      <title>Long Covid Compass</title>
      <g transform="translate(10, 10) scale(1.4)">
        <g fill="none" stroke="#F97316" strokeWidth="6" strokeLinecap="round">
          <path d="M 176.815 86.460 A 78 78 0 0 0 113.544 23.189" />
          <path d="M 86.456 23.184 A 78 78 0 0 0 23.185 86.456" />
          <path d="M 23.185 113.544 A 78 78 0 0 0 86.456 176.816" />
          <path d="M 113.544 176.811 A 78 78 0 0 0 176.815 113.540" />
        </g>
        <g fill="#F97316">
          <circle cx="100" cy="22" r="7" />
          <circle cx="178" cy="100" r="7" />
          <circle cx="100" cy="178" r="7" />
          <circle cx="22" cy="100" r="7" />
        </g>
        <g transform="rotate(-45 100 100)">
          <path d="M 100 46 L 114 100 L 100 100 L 86 100 Z" fill="#F97316" />
          <path d="M 100 154 L 86 100 L 100 100 L 114 100 Z" fill="#081D2D" />
          <circle cx="100" cy="100" r="3" fill="#081D2D" />
        </g>
      </g>
      <g fontFamily="Inter, system-ui, -apple-system, sans-serif">
        <text x="310" y="130" fill="#081D2D" fontWeight="500" fontSize="84">Long Covid</text>
        <text x="310" y="230" fill="#F97316" fontWeight="500" fontSize="101.2">Compass</text>
        <line x1="310" y1="270" x2="424" y2="270" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  )
}
