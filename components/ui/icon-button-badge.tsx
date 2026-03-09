import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import * as React from "react";

type ButtonVariant = React.ComponentProps<typeof Button>["variant"];
type ButtonSize = React.ComponentProps<typeof Button>["size"];

function IconButtonBadge({
    icon,
    badgeContent,
    showBadge = true,
    badgeVariant = "destructive",
    variant = "outline",
    size = "icon-sm",
    className,
    badgeClassName,
    ...props
}: {
    icon: React.ElementType | React.ReactNode;
    badgeContent?: React.ReactNode;
    showBadge?: boolean;
    badgeVariant?: React.ComponentProps<typeof Badge>["variant"];
    variant?: ButtonVariant;
    size?: ButtonSize;
    className?: string;
    badgeClassName?: string;
} & Omit<
    React.ComponentProps<typeof Button>,
    "variant" | "size" | "children"
>) {
    let iconNode: React.ReactNode = null;
    if (React.isValidElement(icon)) {
        iconNode = icon;
    } else if (icon) {
        const C = icon as React.ElementType;
        iconNode = React.createElement(C);
    }
    return (
        <Button
            size={size}
            variant={variant}
            className={cn("rounded-full relative", className)}
            {...props}
        >
            {iconNode}
            {showBadge && (
                <Badge
                    variant={badgeVariant}
                    className={cn(
                        "absolute -top-1 -right-1 flex min-w-3 min-h-3 items-center justify-center rounded-full p-0 text-[10px]",
                        badgeClassName,
                    )}
                >
                    {badgeContent}
                </Badge>
            )}
        </Button>
    );
}

export { IconButtonBadge };
