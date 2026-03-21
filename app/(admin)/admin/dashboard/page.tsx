"use client";
import { StatCard } from "@/components/dashboard/StatCard";
import AppHeader from "@/components/headers/AppHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent,
} from "@/components/ui/chart";
import {
    BarChart as RechartBarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { IconSurface } from "@/components/ui/icon-surface";
import {
    AlertTriangleIcon,
    DollarSignIcon,
    DoorClosedIcon,
    HomeIcon,
    CalendarIcon,
    Grid2x2Icon,
    WrenchIcon,
    BathIcon,
    ZapIcon,
} from "lucide-react";
import React from "react";

function Page() {
    const salesData = React.useMemo(
        () => [
            { day: "Mon", value: 2400000 },
            { day: "Tue", value: 3100000 },
            { day: "Wed", value: 2500000 },
            { day: "Thu", value: 8400000 },
            { day: "Fri", value: 2600000 },
            { day: "Sat", value: 2800000 },
        ],
        [],
    );
    const [range, setRange] = React.useState("weekday");

    const breakdown = React.useMemo(
        () => [
            {
                label: "Maintenance",
                value: 1200000,
                color: "var(--color-green-500)",
            },
            { label: "Repair", value: 850000, color: "var(--color-amber-500)" },
            {
                label: "Taxes",
                value: 1100000,
                color: "var(--color-violet-500)",
            },
            { label: "Saving", value: 1600000, color: "var(--color-blue-500)" },
        ],
        [],
    );
    const totalBreakdown = React.useMemo(
        () => breakdown.reduce((acc, b) => acc + b.value, 0),
        [breakdown],
    );
    const currency = (n: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(n);

    return (
        <div className="bg-muted h-full">
            <AppHeader />
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                    <StatCard
                        icon={DoorClosedIcon}
                        title="Available Rooms"
                        value={16}
                        iconBgClass="bg-blue-100"
                        iconColor="var(--color-blue-500)"
                    />
                    <StatCard
                        icon={AlertTriangleIcon}
                        title="Total Maintenance"
                        value={7}
                        iconBgClass="bg-amber-100"
                        iconColor="var(--color-amber-500)"
                    />
                    <StatCard
                        icon={DollarSignIcon}
                        title="Payment Received"
                        value={currency(8400000)}
                        iconBgClass="bg-green-100"
                        iconColor="var(--color-green-500)"
                    />
                    <StatCard
                        icon={DollarSignIcon}
                        title="Outstanding Payment"
                        value={currency(4800000)}
                        iconBgClass="bg-red-100"
                        iconColor="var(--color-red-500)"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <Card className="shadow-none lg:col-span-2">
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Report Sales</CardTitle>
                            <Select value={range} onValueChange={setRange}>
                                <SelectTrigger className="w-32 bg-card">
                                    <SelectValue placeholder="Range" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weekday">
                                        Weekday
                                    </SelectItem>
                                    <SelectItem value="monthly">
                                        Monthly
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <ChartContainer
                                className="aspect-video"
                                config={{
                                    revenue: {
                                        label: "Revenue",
                                        color: "var(--color-green-500)",
                                    },
                                }}
                            >
                                <RechartBarChart
                                    data={salesData}
                                    margin={{ left: 12, right: 12 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="day"
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v) =>
                                            new Intl.NumberFormat("id-ID", {
                                                notation: "compact",
                                                compactDisplay: "short",
                                            }).format(v)
                                        }
                                    />
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />
                                    <Bar
                                        dataKey="value"
                                        fill="var(--color-revenue)"
                                        radius={[8, 8, 0, 0]}
                                    />
                                    <ChartLegend
                                        verticalAlign="bottom"
                                        content={<ChartLegendContent />}
                                    />
                                </RechartBarChart>
                            </ChartContainer>
                            <div className="flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                                <p className="text-sm text-muted-foreground">
                                    Revenue
                                </p>
                                <p className="text-sm font-medium">
                                    {currency(8400000)} • Thu 12 Jul
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader className="flex-row items-center justify-between">
                            <CardTitle>Cost Breakdown</CardTitle>
                            <Button size="xs" variant="ghost">
                                See Detail
                            </Button>
                        </CardHeader>
                        <CardContent className="flex gap-4 items-center justify-between">
                            <div className="flex items-center gap-4">
                                <ChartContainer
                                    className="w-45 h-45 aspect-square"
                                    config={{
                                        maintenance: {
                                            label: "Maintenance",
                                            color: "var(--color-green-500)",
                                        },
                                        repair: {
                                            label: "Repair",
                                            color: "var(--color-amber-500)",
                                        },
                                        taxes: {
                                            label: "Taxes",
                                            color: "var(--color-violet-500)",
                                        },
                                        saving: {
                                            label: "Saving",
                                            color: "var(--color-blue-500)",
                                        },
                                    }}
                                >
                                    <PieChart>
                                        <ChartTooltip
                                            content={
                                                <ChartTooltipContent
                                                    nameKey="label"
                                                    labelKey="label"
                                                />
                                            }
                                        />
                                        <Pie
                                            data={breakdown.map((b) => ({
                                                label: b.label.toLowerCase(),
                                                value: b.value,
                                            }))}
                                            dataKey="value"
                                            nameKey="label"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={4}
                                        >
                                            {breakdown.map((b, idx) => (
                                                <Cell
                                                    key={idx}
                                                    fill={`var(--color-${b.label.toLowerCase()})`}
                                                />
                                            ))}
                                        </Pie>
                                        <ChartLegend
                                            verticalAlign="bottom"
                                            content={<ChartLegendContent />}
                                        />
                                    </PieChart>
                                </ChartContainer>
                                <div className="flex flex-col items-start">
                                    <p className="text-lg font-bold">
                                        {new Intl.NumberFormat("id-ID", {
                                            notation: "compact",
                                            compactDisplay: "short",
                                        }).format(totalBreakdown)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Total
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Last Transaction</span>
                                <Button size="xs" variant="ghost">
                                    See All
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <IconSurface bgClass="bg-emerald-100">
                                        <HomeIcon color="var(--color-emerald-600)" />
                                    </IconSurface>
                                    <div>
                                        <p className="font-medium">
                                            123 Maple Avenue Springfield
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            12 Sep 2024, 9:29
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium">Rp 30k</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <IconSurface bgClass="bg-amber-100">
                                        <CalendarIcon color="var(--color-amber-600)" />
                                    </IconSurface>
                                    <div>
                                        <p className="font-medium">
                                            Booking 987 Villa Street
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            10 Sep 2024, 9:29
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium">Rp 10k</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <IconSurface bgClass="bg-blue-100">
                                        <Grid2x2Icon color="var(--color-blue-600)" />
                                    </IconSurface>
                                    <div>
                                        <p className="font-medium">
                                            Apartment Booking On Garden Street
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            08 Sep 2024, 9:29
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium">Rp 20k</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>Maintenance Request</span>
                                <Button size="xs" variant="ghost">
                                    See All
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <IconSurface bgClass="bg-amber-100">
                                        <WrenchIcon color="var(--color-amber-600)" />
                                    </IconSurface>
                                    <div className="flex flex-col">
                                        <p className="font-medium">
                                            Plumbing | 721 Meadowview
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Request ID: MR-001
                                        </p>
                                        <p className="text-xs text-red-600">
                                            Broke Garbage
                                        </p>
                                    </div>
                                </div>
                                <Avatar>
                                    <AvatarFallback>JJ</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <IconSurface bgClass="bg-blue-100">
                                        <ZapIcon color="var(--color-blue-600)" />
                                    </IconSurface>
                                    <div className="flex flex-col">
                                        <p className="font-medium">
                                            Electrical | 721 Meadowview
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Request ID: MR-002
                                        </p>
                                        <p className="text-xs text-red-600">
                                            No Heat Bathroom
                                        </p>
                                    </div>
                                </div>
                                <Avatar>
                                    <AvatarFallback>AF</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-start gap-3">
                                    <IconSurface bgClass="bg-emerald-100">
                                        <BathIcon color="var(--color-emerald-600)" />
                                    </IconSurface>
                                    <div className="flex flex-col">
                                        <p className="font-medium">
                                            HVAC | 721 Meadowview
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Request ID: MR-003
                                        </p>
                                        <p className="text-xs text-red-600">
                                            Non Functional Fan
                                        </p>
                                    </div>
                                </div>
                                <Avatar>
                                    <AvatarFallback>RF</AvatarFallback>
                                </Avatar>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Page;
