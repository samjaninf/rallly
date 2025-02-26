import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import * as React from "react";

import type {
  ComponentPropsWithout,
  RemovedProps,
} from "./helpers/component-props";
import { cn } from "./lib/utils";

type FlexElement = React.ElementRef<"div">;
type FlexDivProps = { as?: "div" } & ComponentPropsWithout<"div", RemovedProps>;
type FlexSpanProps = { as: "span" } & ComponentPropsWithout<
  "span",
  RemovedProps
>;
type FlexAttributeProps = FlexSpanProps | FlexDivProps;

const flexVariants = cva("box-border flex justify-start", {
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
    },
    wrap: {
      noWrap: "flex-nowrap",
      wrap: "flex-wrap",
      wrapReverse: "flex-wrap-reverse",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
  },
  defaultVariants: {
    direction: "row",
    align: "center",
    justify: "start",
    wrap: "noWrap",
    gap: "none",
  },
});

interface FlexProps extends VariantProps<typeof flexVariants> {
  asChild?: boolean;
}

const Flex = React.forwardRef<FlexElement, FlexProps & FlexAttributeProps>(
  (props, forwardedRef) => {
    const { className, asChild, as: Tag = "div", ...flexProps } = props;
    const Comp = asChild ? Slot : Tag;
    return (
      <Comp
        {...flexProps}
        ref={forwardedRef}
        className={cn(flexVariants(flexProps), className)}
      />
    );
  },
);
Flex.displayName = "Flex";

export { Flex };
export type { FlexProps };
