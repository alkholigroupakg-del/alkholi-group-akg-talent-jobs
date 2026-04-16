import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    style={{
      width: "var(--switch-track-width, 36px)",
      height: "var(--switch-track-height, 20px)",
    }}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className="pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform"
      style={{
        width: "var(--switch-thumb-size, 14px)",
        height: "var(--switch-thumb-size, 14px)",
        transform: undefined,
      }}
      data-thumb="true"
    />
    <style>{`
      [data-thumb][data-state="checked"] {
        transform: translateX(var(--switch-thumb-checked-x, 16px));
      }
      [data-thumb][data-state="unchecked"] {
        transform: translateX(var(--switch-thumb-unchecked-x, 2px));
      }
    `}</style>
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
