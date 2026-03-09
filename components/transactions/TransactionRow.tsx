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
} from "lucide-react";

type Status = "dibayar" | "pending" | "terlambat" | "dibatalkan";

const badgeClassByStatus: Record<Status, string> = {
  dibayar: "bg-green-50 border-green-200 text-green-900",
  pending: "bg-amber-50 border-amber-200 text-amber-900",
  terlambat: "bg-red-50 border-red-200 text-red-900",
  dibatalkan: "bg-grey-50 border-grey-200 text-grey-900",
};

const badgeIconByStatus: Record<Status, LucideIcon> = {
  dibayar: CircleCheckBigIcon,
  pending: ClockIcon,
  terlambat: InfoIcon,
  dibatalkan: CircleXIcon,
};

const badgeIconColorByStatus: Record<Status, string> = {
  dibayar: "green",
  pending: "orange",
  terlambat: "red",
  dibatalkan: "grey",
};

function TransactionRow({
  iconBgClass = "bg-green-100",
  iconColor = "oklch(72.3% 0.219 149.579)",
  trxId,
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
  methodLabel: string;
  dueDateLabel: string;
  paidDateLabel?: string;
  amountLabel: string;
  status: Status;
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
          <IconSurface bgClass={iconBgClass} className="self-center w-min">
            <ReceiptIcon color={iconColor} />
          </IconSurface>
          <div className="flex flex-col">
            <p className="font-semibold">{trxId}</p>
            <p className="text-muted-foreground text-sm">{methodLabel}</p>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-sm">Jatuh Tempo</p>
          <div className="flex gap-2 items-center">
            <CalendarIcon size={14} color="var(--color-muted-foreground)" />
            <p className="text-sm font-medium">{dueDateLabel}</p>
          </div>
        </div>

        {paidDateLabel ? (
          <div>
            <p className="text-muted-foreground text-sm">Tanggal Bayar</p>
            <div className="flex gap-2 items-center">
              <CircleCheckBigIcon size={14} color="green" />
              <p className="text-sm font-medium">{paidDateLabel}</p>
            </div>
          </div>
        ) : (
          <div />
        )}

        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-end">
            <p className="font-bold text-lg">{amountLabel}</p>
            <Badge variant="secondary" className={badgeClass}>
              <BadgeIcon color={badgeIconColor} /> {statusLabel ?? status[0].toUpperCase() + status.slice(1)}
            </Badge>
          </div>

          {actionLabel && (
            <Button size="sm" variant="default" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
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
