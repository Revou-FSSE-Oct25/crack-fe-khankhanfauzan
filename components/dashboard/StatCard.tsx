import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

function StatCard({
    icon: Icon,
    title,
    value,
    subtitle,
    iconColor = "var(--color-primary)",
    iconBgClass = "bg-accent",
    className,
    contentClassName,
}: {
    icon: LucideIcon;
    title: string;
    value: number | string;
    subtitle?: string;
    iconColor?: string;
    iconBgClass?: string;
    className?: string;
    contentClassName?: string;
}) {
    return (
        <Card className={cn("shadow-none", className)}>
            <CardContent
                className={cn(
                    "flex items-center gap-2 sm:gap-3",
                    contentClassName,
                )}
            >
                <div
                    className={cn(
                        "p-2 sm:p-2.5 w-min h-min rounded-lg",
                        iconBgClass,
                    )}
                >
                    <Icon color={iconColor} />
                </div>
                <div className="flex flex-col gap-0.5 sm:gap-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                        {title}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold">{value}</p>
                    {subtitle && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export { StatCard };
