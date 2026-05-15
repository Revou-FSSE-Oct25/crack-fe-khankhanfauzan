"use client";
import { Card, CardContent } from "@/components/ui/card";
import { IconSurface } from "@/components/ui/icon-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CalendarIcon,
    CircleCheckBigIcon,
    ClockIcon,
    InfoIcon,
    CircleXIcon,
    type LucideIcon,
    ReceiptIcon,
    FileTextIcon,
    XCircleIcon,
    CheckCircleIcon,
    CreditCardIcon,
    HourglassIcon,
} from "lucide-react";
import Link from "next/link";
import { InvoiceStatus } from "@/types/invoices";

const badgeClassByStatus: Record<InvoiceStatus, string> = {
    paid: "bg-green-50 border-green-200 text-green-900",
    unpaid: "bg-amber-50 border-amber-200 text-amber-900",
    expired: "bg-gray-50 border-gray-200 text-gray-900",
    partially_paid: "bg-blue-50 border-blue-200 text-blue-900",
    cancelled: "bg-red-50 border-red-200 text-red-900",
};

const badgeIconByStatus: Record<InvoiceStatus, LucideIcon> = {
    paid: CircleCheckBigIcon,
    expired: XCircleIcon,
    partially_paid: CheckCircleIcon,
    unpaid: CreditCardIcon,
    cancelled: XCircleIcon,
};

const badgeIconColorByStatus: Record<InvoiceStatus, string> = {
    paid: "green",
    expired: "gray",
    partially_paid: "blue",
    unpaid: "amber",
    cancelled: "red",
};

function TransactionRow({
    iconBgClass = "bg-green-100",
    iconColor = "oklch(72.3% 0.219 149.579)",
    trxId,
    bookingId,
    methodLabel,
    dueDateLabel,
    paidDateLabel,
    amountLabel,
    status,
    statusLabel,
    actionLabel,
    onAction,
    showInvoiceButton = false,
}: {
    iconBgClass?: string;
    iconColor?: string;
    trxId: string;
    bookingId: string;
    methodLabel: string;
    dueDateLabel: string;
    paidDateLabel?: string;
    amountLabel: string;
    status: InvoiceStatus;
    statusLabel?: string;
    actionLabel?: string;
    onAction?: () => void;
    showInvoiceButton?: boolean;
}) {
    const BadgeIcon = badgeIconByStatus[status];
    const badgeIconColor = badgeIconColorByStatus[status];
    const badgeClass = badgeClassByStatus[status];
    return (
        <Card className="shadow-none">
            <CardContent className="flex gap-2 items-center justify-between">
                <div className="flex gap-2">
                    <IconSurface
                        bgClass={iconBgClass}
                        className="self-center w-min"
                    >
                        <ReceiptIcon color={iconColor} />
                    </IconSurface>
                    <div className="flex flex-col">
                        <p className="font-semibold">{trxId}</p>
                        <p className="text-muted-foreground text-sm">
                            {methodLabel}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="text-muted-foreground text-sm">Jatuh Tempo</p>
                    <div className="flex gap-2 items-center">
                        <CalendarIcon
                            size={14}
                            color="var(--color-muted-foreground)"
                        />
                        <p className="text-sm font-medium">{dueDateLabel}</p>
                    </div>
                </div>

                {paidDateLabel ? (
                    <div>
                        <p className="text-muted-foreground text-sm">
                            Tanggal Bayar
                        </p>
                        <div className="flex gap-2 items-center">
                            <CircleCheckBigIcon size={14} color="green" />
                            <p className="text-sm font-medium">
                                {paidDateLabel}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div />
                )}

                <div className="flex gap-4 items-center">
                    <div className="flex flex-col items-end">
                        <p className="text-muted-foreground text-sm">
                            Total Tagihan
                        </p>
                        <p className="font-bold text-lg">{amountLabel}</p>
                        <Badge variant="secondary" className={badgeClass}>
                            <BadgeIcon
                                color={badgeIconColor}
                                size={14}
                                className="mr-1"
                            />
                            {statusLabel ??
                                status[0].toUpperCase() + status.slice(1)}
                        </Badge>
                    </div>

                    {actionLabel && (
                        <Link href={`/user/bookings/${bookingId}/payment`}>
                            <Button
                                size="sm"
                                variant="default"
                                onClick={onAction}
                            >
                                {actionLabel}
                            </Button>
                        </Link>
                    )}
                    <Link href={`/user/transactions/${trxId}`}>
                        <Button variant="outline" size="sm">
                            <FileTextIcon className="w-4 h-4 mr-1" /> Detail
                        </Button>
                    </Link>
                    {showInvoiceButton && (
                        <Button variant="outline" size="sm">
                            <FileTextIcon /> Invoice
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export { TransactionRow };
