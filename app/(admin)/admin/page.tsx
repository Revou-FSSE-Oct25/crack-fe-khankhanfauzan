"use client";

import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    UsersIcon,
    DoorClosedIcon,
    AlertTriangleIcon,
    DollarSignIcon,
} from "lucide-react";
import { fetchAdminDashboardSummary } from "@/services/dashboard";
import { useRouter } from "next/navigation";
import { getSession } from "@/actions/auth";
import { useEffect, useState } from "react";
import { AdminDashboardData } from "@/types/admin-dashboard";

function Page() {
    const router = useRouter();
    const [data, setData] = useState<AdminDashboardData | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        let aborted = false;
        async function load() {
            setLoading(true);
            try {
                const session = getSession();
                const token = session?.accessToken;
                const res = await fetchAdminDashboardSummary("weekday", {
                    token,
                });
                if (!aborted && res?.data) {
                    setData(res.data);
                }
            } catch (err: any) {
                console.error(err);
                if (err?.status === 401) {
                    router.push("/login");
                } else {
                    setErrorMsg(
                        err.message || "Failed to load dashboard data.",
                    );
                }
            } finally {
                if (!aborted) setLoading(false);
            }
        }
        load();
        return () => {
            aborted = true;
        };
    }, [router]);

    const currency = (n: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(n);

    if (loading) {
        return <div className="p-4">Loading dashboard data...</div>;
    }

    if (errorMsg) {
        return <div className="p-4 text-red-500">{errorMsg}</div>;
    }

    if (!data) {
        return <div className="p-4">Failed to load dashboard data.</div>;
    }

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                    <StatCard
                        icon={UsersIcon}
                        title="Total Penghuni"
                        value={data.statistics.totalTenants.value}
                        iconBgClass="bg-emerald-100"
                        iconColor="var(--color-emerald-600)"
                        subtitle={data.statistics.totalTenants.subtitle}
                    />
                    <StatCard
                        icon={DoorClosedIcon}
                        title="Tingkat Hunian"
                        value={data.statistics.occupancy.value}
                        iconBgClass="bg-blue-100"
                        iconColor="var(--color-blue-600)"
                        subtitle={data.statistics.occupancy.subtitle}
                    />
                    <StatCard
                        icon={AlertTriangleIcon}
                        title="Ticket Maintenance"
                        value={data.statistics.activeMaintenances.value}
                        iconBgClass="bg-amber-100"
                        iconColor="var(--color-amber-600)"
                        subtitle={data.statistics.activeMaintenances.subtitle}
                    />
                    <StatCard
                        icon={DollarSignIcon}
                        title="Tagihan Tertunggak"
                        value={currency(
                            data.statistics.outstandingInvoices.value,
                        )}
                        iconBgClass="bg-red-100"
                        iconColor="var(--color-red-600)"
                        subtitle={data.statistics.outstandingInvoices.subtitle}
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle>Aktivitas Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {data.recentActivities.length > 0 ? (
                                data.recentActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between"
                                    >
                                        <p className="text-sm">
                                            {activity.title}
                                        </p>
                                        <p
                                            className={`text-sm ${activity.type === "payment" ? "font-medium" : "text-muted-foreground"}`}
                                        >
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
                                    Tidak ada aktivitas terbaru.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle>Maintenance Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            {data.recentMaintenances.length > 0 ? (
                                data.recentMaintenances.map((maintenance) => {
                                    const priorityColors: Record<
                                        string,
                                        { bg: string; text: string }
                                    > = {
                                        high: {
                                            bg: "bg-amber-100",
                                            text: "text-amber-700",
                                        },
                                        medium: {
                                            bg: "bg-yellow-100",
                                            text: "text-yellow-700",
                                        },
                                        low: {
                                            bg: "bg-green-100",
                                            text: "text-green-700",
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
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium">
                                                    {maintenance.category} •{" "}
                                                    {maintenance.room}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {maintenance.description}
                                                </p>
                                            </div>
                                            <span
                                                className={`text-xs px-2 py-0.5 rounded ${pColor.bg} ${pColor.text} capitalize`}
                                            >
                                                {maintenance.priority === "high"
                                                    ? "Tinggi"
                                                    : maintenance.priority ===
                                                        "medium"
                                                      ? "Sedang"
                                                      : "Rendah"}
                                            </span>
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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                    <Card className="shadow-none lg:col-span-1">
                        <CardHeader>
                            <CardTitle>Agenda Hari Ini</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Check-in</p>
                                <p className="text-sm font-medium">
                                    {data.agenda.checkIn || 0}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Check-out</p>
                                <p className="text-sm font-medium">
                                    {data.agenda.checkOut || 0}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Maintenance</p>
                                <p className="text-sm font-medium">
                                    {data.agenda.maintenance || 0}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Tour</p>
                                <p className="text-sm font-medium">
                                    {data.agenda.tour || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Status Kamar</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <span className="text-sm text-muted-foreground">
                                    Terisi
                                </span>
                                <span className="text-sm font-medium">
                                    {data.roomStatus.occupied || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <span className="text-sm text-muted-foreground">
                                    Kosong
                                </span>
                                <span className="text-sm font-medium">
                                    {data.roomStatus.empty || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <span className="text-sm text-muted-foreground">
                                    Maintenance
                                </span>
                                <span className="text-sm font-medium">
                                    {data.roomStatus.maintenance || 0}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Page;
