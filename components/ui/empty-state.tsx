import { cn } from "@/lib/utils";
import { FolderSearchIcon, LucideIcon } from "lucide-react";
import React from "react";

interface EmptyStateProps {
    title?: string;
    description?: string;
    icon?: LucideIcon;
    action?: React.ReactNode;
    className?: string;
}

export function EmptyState({
    title = "Tidak ada data",
    description = "Data yang Anda cari tidak ditemukan atau belum tersedia.",
    icon: Icon = FolderSearchIcon,
    action,
    className,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed bg-muted/30",
                className,
            )}
        >
            <div className="bg-muted p-3 rounded-full mb-4">
                <Icon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">
                {description}
            </p>
            {action && <div>{action}</div>}
        </div>
    );
}
