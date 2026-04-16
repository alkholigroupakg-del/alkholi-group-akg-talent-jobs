import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, style, checked, defaultChecked, ...props }, ref) => {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (val: boolean) => {
    if (!isControlled) setInternalChecked(val);
    props.onCheckedChange?.(val);
  };

  return (
    <SwitchPrimitives.Root
      className={cn(
        "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      style={{
        width: "var(--switch-track-width, 36px)",
        height: "var(--switch-track-height, 20px)",
        ...style,
      }}
      checked={checked}
      defaultChecked={defaultChecked}
      {...props}
      onCheckedChange={handleChange}
      ref={ref}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform"
        )}
        style={{
          width: "var(--switch-thumb-size, 14px)",
          height: "var(--switch-thumb-size, 14px)",
          transform: isChecked
            ? "translateX(var(--switch-thumb-checked-x, 16px))"
            : "translateX(var(--switch-thumb-unchecked-x, 2px))",
        }}
      />
    </SwitchPrimitives.Root>
  );
});
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
