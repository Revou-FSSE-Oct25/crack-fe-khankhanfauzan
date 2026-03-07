import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const containerVariants = cva("p-2 rounded-lg flex flex-col gap-1 border", {
    variants: {
        variant: {
            danger: "bg-red-50 border-red-200",
            info: "bg-blue-50 border-blue-200",
            warning: "bg-yellow-50 border-yellow-200",
            success: "bg-green-50 border-green-200",
            muted: "bg-gray-50 border-gray-200",
        },
    },
    defaultVariants: {
        variant: "info",
    },
});

const dateTextByVariant: Record<
    NonNullable<VariantProps<typeof containerVariants>["variant"]>,
    string
> = {
    danger: "text-red-900",
    info: "text-blue-900",
    warning: "text-yellow-900",
    success: "text-green-900",
    muted: "text-gray-900",
};

const titleTextByVariant: Record<
    NonNullable<VariantProps<typeof containerVariants>["variant"]>,
    string
> = {
    danger: "text-red-900",
    info: "text-blue-900",
    warning: "text-yellow-900",
    success: "text-green-900",
    muted: "text-gray-900",
};

function EventListItem({
    dateLabel,
    title,
    variant = "info",
    className,
}: {
    dateLabel: string;
    title: string;
    variant?: VariantProps<typeof containerVariants>["variant"];
    className?: string;
}) {
    const v = variant ?? "info";
    return (
        <div className={cn(containerVariants({ variant: v }), className)}>
            <p className={cn("text-xs", dateTextByVariant[v])}>{dateLabel}</p>
            <p className={cn("text-xs font-semibold", titleTextByVariant[v])}>
                {title}
            </p>
        </div>
    );
}

export { EventListItem };
