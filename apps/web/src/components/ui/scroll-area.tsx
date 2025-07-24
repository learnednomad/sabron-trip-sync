"use client"

import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"
import * as React from "react"

import { cn } from "@/lib/utils"

interface ScrollAreaProps {
  className?: string
  children?: React.ReactNode
}

const ScrollArea = React.forwardRef<
  HTMLDivElement,
  ScrollAreaProps
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="size-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = "ScrollArea"

interface ScrollBarProps {
  className?: string
  orientation?: 'vertical' | 'horizontal'
}

const ScrollBar = React.forwardRef<
  HTMLDivElement,
  ScrollBarProps
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    orientation={orientation}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = "ScrollBar"

export { ScrollArea, ScrollBar }
