import { cn } from "../../lib/utils"
import { forwardRef } from "react"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          {
            'border-transparent bg-primary-600 text-white hover:bg-primary-700': variant === 'default',
            'border-transparent bg-secondary-200 text-secondary-900 hover:bg-secondary-300': variant === 'secondary',
            'border-transparent bg-red-600 text-white hover:bg-red-700': variant === 'destructive',
            'text-foreground': variant === 'outline',
            'border-transparent bg-green-600 text-white hover:bg-green-700': variant === 'success',
            'border-transparent bg-yellow-600 text-white hover:bg-yellow-700': variant === 'warning',
          },
          className
        )}
        {...props}
      />
    )
  }
)

Badge.displayName = "Badge"

export { Badge }
