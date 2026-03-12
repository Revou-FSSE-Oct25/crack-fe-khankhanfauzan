 "use client";
import { Card, CardContent } from "@/components/ui/card";
import { IconSurface } from "@/components/ui/icon-surface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ClockIcon,
  CircleCheckBigIcon,
  TriangleAlertIcon,
  CircleXIcon,
  CalendarIcon,
  EllipsisVerticalIcon,
  type LucideIcon,
  WrenchIcon,
  WifiIcon,
  WindIcon,
  BathIcon,
} from "lucide-react";

type Status = "open" | "in_progress" | "resolved" | "rejected";

const badgeClassByStatus: Record<Status, string> = {
  open: "bg-amber-50 border-amber-200 text-amber-900",
  in_progress: "bg-blue-50 border-blue-200 text-blue-900",
  resolved: "bg-green-50 border-green-200 text-green-900",
  rejected: "bg-red-50 border-red-200 text-red-900",
};

const badgeIconByStatus: Record<Status, LucideIcon> = {
  open: ClockIcon,
  in_progress: TriangleAlertIcon,
  resolved: CircleCheckBigIcon,
  rejected: CircleXIcon,
};

const badgeIconColorByStatus: Record<Status, string> = {
  open: "orange",
  in_progress: "oklch(62.3% 0.214 259.815)",
  resolved: "green",
  rejected: "red",
};

const categoryIconByLabel: Record<string, LucideIcon> = {
  plumbing: BathIcon,
  air_conditioning: WindIcon,
  internet: WifiIcon,
  electrical: WrenchIcon,
  cleaning: WrenchIcon,
  security: WrenchIcon,
  appliance: WrenchIcon,
};

function ComplaintRow({
  iconBgClass = "bg-blue-100",
  iconColor = "oklch(62.3% 0.214 259.815)",
  categoryLabel,
  complaintId,
  titleLabel,
  roomLabel,
  createdLabel,
  resolvedLabel,
  description,
  status,
  statusLabel,
  className,
}: {
  iconBgClass?: string;
  iconColor?: string;
  categoryLabel: string;
  complaintId: string;
  titleLabel: string;
  roomLabel: string;
  createdLabel: string;
  resolvedLabel?: string;
  description: string;
  status: Status;
  statusLabel?: string;
  className?: string;
}) {
  const BadgeIcon = badgeIconByStatus[status];
  const badgeIconColor = badgeIconColorByStatus[status];
  const badgeClass = badgeClassByStatus[status];
  const CategoryIcon =
    categoryIconByLabel[categoryLabel] ?? WrenchIcon;

  return (
    <Card className={className ?? "shadow-none"}>
      <CardContent className="flex gap-4 items-start justify-between">
        <div className="flex gap-3">
          <IconSurface bgClass={iconBgClass} className="self-start w-min">
            <CategoryIcon color={iconColor} />
          </IconSurface>
          <div className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <span className="text-xs font-medium text-muted-foreground">
                {complaintId}
              </span>
            </div>
            <p className="font-semibold text-base">{titleLabel}</p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="flex flex-col gap-1 min-w-56">
          <p className="text-sm">
            {roomLabel} • {categoryLabel[0].toUpperCase() + categoryLabel.slice(1)}
          </p>
          <div className="flex gap-2 items-center">
            <CalendarIcon size={14} color="var(--color-muted-foreground)" />
            <p className="text-xs text-muted-foreground">Dibuat: {createdLabel}</p>
          </div>
          {resolvedLabel && (
            <div className="flex gap-2 items-center">
              <CircleCheckBigIcon size={14} color="green" />
              <p className="text-xs text-green-800">Selesai: {resolvedLabel}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={badgeClass}>
            <BadgeIcon color={badgeIconColor} /> {statusLabel}
          </Badge>
          <Button variant="ghost" size="icon">
            <EllipsisVerticalIcon />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export { ComplaintRow };
