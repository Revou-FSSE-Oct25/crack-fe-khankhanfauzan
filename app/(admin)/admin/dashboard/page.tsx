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
import { IconSurface } from "@/components/ui/icon-surface";
import {
    AlertTriangleIcon,
    DollarSignIcon,
    DoorClosedIcon,
    HomeIcon,
    Grid2x2Icon,
    WrenchIcon,
    BathIcon,
    ZapIcon,
} from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { fetchAdminDashboardSummary } from "@/services/dashboard";
import { getSession } from "@/actions/auth";
import { AdminDashboardData } from "@/types/admin-dashboard";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

function Page() {
    const router = useRouter();
    const [range, setRange] = useState("weekday");
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let aborted = false;
        async function load() {
            setLoading(true);
            try {
                const session = getSession();
                const token = session?.accessToken;
                const res = await fetchAdminDashboardSummary(range, { token });
                if (!aborted && res?.data) {
                    setData(res.data);
                }
            } catch (err: any) {
                console.error(err);
                if (err?.status === 401) {
                    router.push("/login");
                }
            } finally {
                if (!aborted) setLoading(false);
            }
        }
        load();
        return () => {
            aborted = true;
        };
    }, [range]);

    const salesData = useMemo(() => {
        if (!data?.salesReport) return [];
        return data.salesReport.map((item) => ({
            day: item.label,
            value: item.value,
        }));
    }, [data?.salesReport]);

    const breakdown = useMemo(() => {
        // Fallback mock breakdown since BE skips it
        if (data?.costBreakdown && data.costBreakdown.length > 0) {
            return data.costBreakdown;
        }
        return [
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
        ];
    }, [data?.costBreakdown]);

    const totalBreakdown = useMemo(
        () => breakdown.reduce((acc, b) => acc + b.value, 0),
        [breakdown],
    );
    const currency = (n: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(n);

    if (loading && !data) {
        return <div className="p-6">Loading...</div>;
    }

    if (!data) {
        return <div className="p-6">Failed to load dashboard.</div>;
    }

    const totalRevenue = salesData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="bg-muted h-full">
            <AppHeader />
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                    <StatCard
                        icon={DoorClosedIcon}
                        title="Available Rooms"
                        value={data.roomStatus.empty}
                        iconBgClass="bg-blue-100"
                        iconColor="var(--color-blue-500)"
                    />
                    <StatCard
                        icon={AlertTriangleIcon}
                        title="Total Maintenance"
                        value={data.statistics.activeMaintenances.value}
                        iconBgClass="bg-amber-100"
                        iconColor="var(--color-amber-500)"
                    />
                    <StatCard
                        icon={DollarSignIcon}
                        title="Payment Received"
                        value={currency(totalRevenue)}
                        iconBgClass="bg-green-100"
                        iconColor="var(--color-green-500)"
                    />
                    <StatCard
                        icon={DollarSignIcon}
                        title="Outstanding Payment"
                        value={currency(
                            data.statistics.outstandingInvoices.value,
                        )}
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
                                    {currency(totalRevenue)} •{" "}
                                    {format(new Date(), "E, dd MMM")}
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
                            {data.recentActivities.length > 0 ? (
                                data.recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <IconSurface
                                                bgClass={
                                                    activity.type === "payment"
                                                        ? "bg-emerald-100"
                                                        : "bg-blue-100"
                                                }
                                            >
                                                {activity.type === "payment" ? (
                                                    <HomeIcon color="var(--color-emerald-600)" />
                                                ) : (
                                                    <Grid2x2Icon color="var(--color-blue-600)" />
                                                )}
                                            </IconSurface>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {activity.title}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {format(
                                                        new Date(activity.date),
                                                        "dd MMM yyyy, HH:mm",
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {activity.type === "payment"
                                                ? currency(
                                                      Number(activity.subtitle),
                                                  )
                                                : activity.subtitle}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Tidak ada transaksi terbaru.
                                </p>
                            )}
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
                            {data.recentMaintenances.length > 0 ? (
                                data.recentMaintenances.map((maintenance) => {
                                    const priorityColors: Record<
                                        string,
                                        {
                                            bg: string;
                                            text: string;
                                            icon: React.ReactNode;
                                        }
                                    > = {
                                        high: {
                                            bg: "bg-amber-100",
                                            text: "text-red-600",
                                            icon: (
                                                <WrenchIcon color="var(--color-amber-600)" />
                                            ),
                                        },
                                        medium: {
                                            bg: "bg-blue-100",
                                            text: "text-amber-600",
                                            icon: (
                                                <ZapIcon color="var(--color-blue-600)" />
                                            ),
                                        },
                                        low: {
                                            bg: "bg-emerald-100",
                                            text: "text-green-600",
                                            icon: (
                                                <BathIcon color="var(--color-emerald-600)" />
                                            ),
                                        },
                                    };
                                    const pColor =
                                        priorityColors[maintenance.priority] ||
                                        priorityColors.low;

                                    return (
                                        <div
                                            key={maintenance.id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-start gap-3">
                                                <IconSurface
                                                    bgClass={pColor.bg}
                                                >
                                                    {pColor.icon}
                                                </IconSurface>
                                                <div className="flex flex-col">
                                                    <p className="font-medium text-sm">
                                                        {maintenance.category} |{" "}
                                                        {maintenance.room}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Request ID:{" "}
                                                        {maintenance.id
                                                            .substring(0, 8)
                                                            .toUpperCase()}
                                                    </p>
                                                    <p
                                                        className={`text-xs ${pColor.text}`}
                                                    >
                                                        {
                                                            maintenance.description
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Tidak ada maintenance terbaru.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Page;
