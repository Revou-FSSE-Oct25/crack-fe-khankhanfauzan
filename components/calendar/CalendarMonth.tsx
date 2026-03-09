import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";

type EventVariant = "danger" | "info" | "warning" | "success" | "muted";

type CalendarEvent = {
    date: string;
    title: string;
    variant?: EventVariant;
};

function getMonthDays(year: number, monthIndex: number) {
    const firstDay = new Date(year, monthIndex, 1);
    const lastDay = new Date(year, monthIndex + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startWeekIndex = firstDay.getDay();
    const grid: Array<{ date: Date | null }> = [];
    for (let i = 0; i < startWeekIndex; i++) {
        grid.push({ date: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
        grid.push({ date: new Date(year, monthIndex, d) });
    }
    while (grid.length % 7 !== 0) {
        grid.push({ date: null });
    }
    return { grid, daysInMonth, startWeekIndex };
}

function toISODate(d: Date) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function dotClassByVariant(variant?: EventVariant) {
    switch (variant) {
        case "danger":
            return "bg-red-500";
        case "warning":
            return "bg-yellow-500";
        case "success":
            return "bg-green-500";
        case "muted":
            return "bg-gray-500";
        default:
            return "bg-blue-500";
    }
}

function CalendarMonth({
    events = [],
    selectedDate,
    onSelectDate,
    className,
}: {
    events?: CalendarEvent[];
    selectedDate?: string | null;
    onSelectDate?: (iso: string) => void;
    className?: string;
}) {
    const today = new Date();
    const [view, setView] = React.useState({
        year: today.getFullYear(),
        month: today.getMonth(),
    });

    const { grid } = React.useMemo(
        () => getMonthDays(view.year, view.month),
        [view.year, view.month],
    );

    const eventsByDate = React.useMemo(() => {
        const map = new Map<string, CalendarEvent[]>();
        for (const ev of events) {
            const arr = map.get(ev.date) ?? [];
            arr.push(ev);
            map.set(ev.date, arr);
        }
        return map;
    }, [events]);

    const monthName = new Date(view.year, view.month, 1).toLocaleString(
        "id-ID",
        {
            month: "long",
            year: "numeric",
        },
    );

    function prevMonth() {
        setView((v) =>
            v.month === 0
                ? { year: v.year - 1, month: 11 }
                : { year: v.year, month: v.month - 1 },
        );
    }

    function nextMonth() {
        setView((v) =>
            v.month === 11
                ? { year: v.year + 1, month: 0 }
                : { year: v.year, month: v.month + 1 },
        );
    }

    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    return (
        <Card className={cn("shadow-none", className)}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="text-base font-semibold">{monthName}</div>
                    <div className="flex gap-2">
                        <Button size="xs" variant="outline" onClick={prevMonth}>
                            ‹
                        </Button>
                        <Button size="xs" variant="outline" onClick={nextMonth}>
                            ›
                        </Button>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-7 gap-1 sm:gap-2 text-xs text-muted-foreground mb-2">
                    {dayNames.map((n) => (
                        <div key={n} className="text-center">
                            {n}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {grid.map((cell, idx) => {
                        if (!cell.date) {
                            return (
                                <div
                                    key={idx}
                                    className="w-full aspect-square rounded-lg border bg-muted/30"
                                />
                            );
                        }
                        const iso = toISODate(cell.date);
                        const evs = eventsByDate.get(iso) ?? [];
                        const isSelected = selectedDate === iso;
                        return (
                            <button
                                key={iso}
                                className={cn(
                                    "w-full aspect-square rounded-lg border p-1 sm:p-2 text-left flex flex-col justify-between transition",
                                    isSelected
                                        ? "border-primary ring-2 ring-primary/20"
                                        : "hover:border-input",
                                )}
                                onClick={() => onSelectDate?.(iso)}
                            >
                                <span className="text-xs">
                                    {cell.date.getDate()}
                                </span>
                                <div className="flex gap-1">
                                    {evs.slice(0, 3).map((ev, i) => (
                                        <span
                                            key={i}
                                            className={cn(
                                                "size-1.5 rounded-full",
                                                dotClassByVariant(ev.variant),
                                            )}
                                        />
                                    ))}
                                    {evs.length > 3 && (
                                        <span className="text-[10px] text-muted-foreground">
                                            +{evs.length - 3}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

export type { CalendarEvent, EventVariant };
export { CalendarMonth };
