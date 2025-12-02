import * as React from "react";
import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: number;
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = "", fallback, size = 40, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ width: size, height: size }}
        className={cn(
          "relative flex shrink-0 overflow-hidden rounded-full bg-muted text-muted-foreground",
          className,
        )}
        {...props}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            onError={(e) => {
              if (fallback) {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }
            }}
          />
        ) : null}
        {!src && fallback && (
          <span className="flex h-full w-full items-center justify-center text-sm font-medium">
            {fallback}
          </span>
        )}
      </div>
    );
  },
);
Avatar.displayName = "Avatar";

export const AvatarImage: React.FC<{ src: string; alt?: string; className?: string }> = ({ src, alt = "", className }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} className={cn("h-full w-full object-cover", className)} />
);

export const AvatarFallback: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => (
  <span className={cn("flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium", className)}>
    {children}
  </span>
);
