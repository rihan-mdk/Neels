"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

// ── useMeasure hook ──
export function useMeasure<T extends HTMLElement>(): [
  React.RefObject<T | null>,
  { width: number; height: number },
] {
  const ref = React.useRef<T | null>(null);
  const [bounds, setBounds] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        setBounds({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, bounds];
}

// ── AnimatedTabs ──
const AnimatedTabs = TabsPrimitive.Root;

// ── AnimatedTabsList ──
const AnimatedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-12 w-full items-center justify-center rounded-2xl bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
AnimatedTabsList.displayName = "AnimatedTabsList";

// ── AnimatedTabsTrigger ──
const AnimatedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "relative inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-colors data-[state=active]:text-foreground data-[state=active]:bg-background data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
AnimatedTabsTrigger.displayName = "AnimatedTabsTrigger";

// ── AnimatedTabsContent ──
const AnimatedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn("outline-none", className)}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  </TabsPrimitive.Content>
));
AnimatedTabsContent.displayName = "AnimatedTabsContent";

export {
  AnimatedTabs,
  AnimatedTabsList,
  AnimatedTabsTrigger,
  AnimatedTabsContent,
};
