import { cn } from "@/utils/cn";
import React from "react";

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> { }

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
    ({ className, ...props }, ref) => {
        return (
            <label
                ref={ref}
                className={cn(
                    "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 mb-1.5 block",
                    className
                )}
                {...props}
            />
        );
    }
);

Label.displayName = "Label";
