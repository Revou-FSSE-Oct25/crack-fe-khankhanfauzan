import * as React from "react";
import { cn } from "@/lib/utils";

function LegendItem({
    colorClass,
    label,
}: {
    colorClass: string;
    label: string;
}) {
    return (
        <div className="flex items-center gap-2">
            <span className={cn("size-4 rounded-xs border", colorClass)} />
            <span className="text-sm">{label}</span>
        </div>
    );
}

function RoomsLegend({ className }: { className?: string }) {
    return (
        <div className={cn("flex flex-wrap gap-4", className)}>
            <LegendItem
                colorClass="bg-green-500 border-green-700"
                label="Tersedia"
            />
            <LegendItem colorClass="bg-red-400 border-red-700" label="Terisi" />
            <LegendItem
                colorClass="bg-amber-400 border-amber-700"
                label="Booking Pending"
            />
        </div>
    );
}

export { RoomsLegend };
