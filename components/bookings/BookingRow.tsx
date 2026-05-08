"use client";
import { Card, CardContent } from "@/components/ui/card";
import { IconSurface } from "@/components/ui/icon-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CalendarIcon,
    CircleCheckBigIcon,
    ClockIcon,
    XCircleIcon,
    HomeIcon,
    type LucideIcon,
    FileTextIcon,
    CheckCircleIcon,
    AlertCircleIcon,
} from "lucide-react";

export type Status =
    | "completed"
    | "cancelled"
    | "expired"
    | "confirmed"
    | "pending_payment";

const badgeClassByStatus: Record<Status, string> = {
    completed: "bg-blue-50 border-blue-200 text-blue-900",
    cancelled: "bg-red-50 border-red-200 text-red-900",
    expired: "bg-gray-50 border-gray-200 text-gray-900",
    confirmed: "bg-green-50 border-green-200 text-green-900",
    pending_payment: "bg-amber-50 border-amber-200 text-amber-900",
};

const badgeIconByStatus: Record<Status, LucideIcon> = {
    completed: CircleCheckBigIcon,
    cancelled: XCircleIcon,
    expired: ClockIcon,
    confirmed: CheckCircleIcon,
    pending_payment: AlertCircleIcon,
};

const badgeIconColorByStatus: Record<Status, string> = {
    completed: "oklch(62.3% 0.214 259.815)",
    cancelled: "red",
    expired: "gray",
    confirmed: "green",
    pending_payment: "orange",
};

const formatStatusLabel = (status: Status) => {
    switch (status) {
        case "pending_payment":
            return "Menunggu Pembayaran";
        case "completed":
            return "Selesai";
        case "cancelled":
            return "Dibatalkan";
        case "expired":
            return "Kedaluwarsa";
        case "confirmed":
            return "Dikonfirmasi";
        default:
            return status;
    }
};

function BookingRow({
    iconBgClass = "bg-emerald-100",
    iconColor = "oklch(72.3% 0.219 149.579)",
    roomLabel,
    floorLabel,
    bookingIdLabel,
    startDateLabel,
    endDateLabel,
    durationLabel,
    priceLabel,
    amountLabel,
    status,
    showDetailButton = true,
    actionLabel,
    onAction,
}: {
    iconBgClass?: string;
    iconColor?: string;
    roomLabel: string;
    floorLabel: string;
    bookingIdLabel: string;
    startDateLabel: string;
    endDateLabel: string;
    durationLabel: string;
    priceLabel: string;
    amountLabel: string;
    status: Status;
    showDetailButton?: boolean;
    actionLabel?: string;
    onAction?: () => void;
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
                        <HomeIcon color={iconColor} />
                    </IconSurface>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold">{roomLabel}</p>
                            <Badge
                                variant="outline"
                                className="text-primary border-primary h-min"
                            >
                                {floorLabel}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                            Booking ID: {bookingIdLabel}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="text-muted-foreground text-sm">
                        Periode Sewa
                    </p>
                    <div className="flex gap-2 items-center">
                        <CalendarIcon
                            size={14}
                            color="var(--color-muted-foreground)"
                        />
                        <p className="text-sm font-medium">{startDateLabel}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <CalendarIcon
                            size={14}
                            color="var(--color-muted-foreground)"
                        />
                        <p className="text-sm font-medium">{endDateLabel}</p>
                    </div>
                </div>

                <div>
                    <p className="text-muted-foreground text-sm">
                        Durasi & Harga
                    </p>
                    <div className="flex gap-2 items-center">
                        <ClockIcon
                            size={14}
                            color="var(--color-muted-foreground)"
                        />
                        <p className="text-sm font-medium">{durationLabel}</p>
                    </div>
                    <div className="flex gap-2 items-center">
                        <FileTextIcon
                            size={14}
                            color="var(--color-muted-foreground)"
                        />
                        <p className="text-sm font-medium">{priceLabel}</p>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <div className="flex flex-col items-end">
                        <p className="text-muted-foreground text-sm">
                            Total Dibayar
                        </p>
                        <p className="font-bold text-lg">{amountLabel}</p>
                        <Badge variant="secondary" className={badgeClass}>
                            <BadgeIcon
                                color={badgeIconColor}
                                size={14}
                                className="mr-1"
                            />
                            {formatStatusLabel(status)}
                        </Badge>
                    </div>

                    <div className="flex flex-col gap-2">
                        {showDetailButton && (
                            <Button variant="outline" size="sm">
                                <FileTextIcon /> Detail
                            </Button>
                        )}
                        {actionLabel && (
                            <Button
                                size="sm"
                                variant="default"
                                onClick={onAction}
                            >
                                {actionLabel}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export { BookingRow };
