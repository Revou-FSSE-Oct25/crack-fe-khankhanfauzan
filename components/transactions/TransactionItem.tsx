import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
    CircleCheckBigIcon,
    ClockIcon,
    XCircleIcon,
    BanIcon,
    RotateCcwIcon,
    type LucideIcon,
} from "lucide-react";

const containerVariants = cva(
    "rounded-xl p-4 flex gap-2 items-center justify-between border transition",
    {
        variants: {
            status: {
                lunas: "bg-green-50 border-green-50 hover:border-green-200",
                pending:
                    "bg-yellow-50 border-yellow-50 hover:border-yellow-200",
                gagal: "bg-red-50 border-red-50 hover:border-red-200",
                dibatalkan: "bg-gray-50 border-gray-50 hover:border-gray-200",
                refund: "bg-blue-50 border-blue-50 hover:border-blue-200",
            },
        },
        defaultVariants: {
            status: "lunas",
        },
    },
);

const iconBgByStatus: Record<
    NonNullable<VariantProps<typeof containerVariants>["status"]>,
    string
> = {
    lunas: "bg-green-100",
    pending: "bg-yellow-100",
    gagal: "bg-red-100",
    dibatalkan: "bg-gray-100",
    refund: "bg-blue-100",
};

const iconColorByStatus: Record<
    NonNullable<VariantProps<typeof containerVariants>["status"]>,
    string
> = {
    lunas: "var(--color-primary)",
    pending: "orange",
    gagal: "red",
    dibatalkan: "gray",
    refund: "blue",
};

const badgeClassByStatus: Record<
    NonNullable<VariantProps<typeof containerVariants>["status"]>,
    string
> = {
    lunas: "bg-green-100 text-primary",
    pending: "bg-yellow-100 text-yellow-900",
    gagal: "bg-red-100 text-red-900",
    dibatalkan: "bg-gray-100 text-gray-900",
    refund: "bg-blue-100 text-blue-900",
};

const defaultIconByStatus: Record<
    NonNullable<VariantProps<typeof containerVariants>["status"]>,
    LucideIcon
> = {
    lunas: CircleCheckBigIcon,
    pending: ClockIcon,
    gagal: XCircleIcon,
    dibatalkan: BanIcon,
    refund: RotateCcwIcon,
};

type TransactionStatus =
    | "lunas"
    | "pending"
    | "gagal"
    | "dibatalkan"
    | "refund";

function TransactionItem({
    status = "lunas",
    trxId,
    dateLabel,
    amountLabel,
    statusLabel,
    icon,
    className,
}: {
    status?: TransactionStatus;
    trxId: string;
    dateLabel: string;
    amountLabel: string;
    statusLabel: string;
    icon?: LucideIcon;
    className?: string;
}) {
    const IconComp = icon ?? defaultIconByStatus[status];
    return (
        <div className={cn(containerVariants({ status }), className)}>
            <div className="flex gap-2 items-center">
                <div
                    className={cn(
                        "p-2 rounded-lg w-min h-min",
                        iconBgByStatus[status],
                    )}
                >
                    <IconComp color={iconColorByStatus[status]} />
                </div>
                <div className="flex flex-col">
                    <h2 className="text-base font-medium">{trxId}</h2>
                    <p className="text-xs text-muted-foreground">{dateLabel}</p>
                </div>
            </div>
            <div className="flex flex-col items-end">
                <p className="text-base font-bold">{amountLabel}</p>
                <Badge className={badgeClassByStatus[status]}>
                    {statusLabel}
                </Badge>
            </div>
        </div>
    );
}

export { TransactionItem };
