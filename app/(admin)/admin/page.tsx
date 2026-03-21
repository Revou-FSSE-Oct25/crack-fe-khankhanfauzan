import { StatCard } from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    UsersIcon,
    DoorClosedIcon,
    AlertTriangleIcon,
    DollarSignIcon,
} from "lucide-react";
import React from "react";

function Page() {
    const currency = (n: number) =>
        new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(n);

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                    <StatCard
                        icon={UsersIcon}
                        title="Total Penghuni"
                        value={42}
                        iconBgClass="bg-emerald-100"
                        iconColor="var(--color-emerald-600)"
                        subtitle="Aktif"
                    />
                    <StatCard
                        icon={DoorClosedIcon}
                        title="Tingkat Hunian"
                        value="86%"
                        iconBgClass="bg-blue-100"
                        iconColor="var(--color-blue-600)"
                        subtitle="43/50 Kamar"
                    />
                    <StatCard
                        icon={AlertTriangleIcon}
                        title="Ticket Maintenance"
                        value={5}
                        iconBgClass="bg-amber-100"
                        iconColor="var(--color-amber-600)"
                        subtitle="3 prioritas tinggi"
                    />
                    <StatCard
                        icon={DollarSignIcon}
                        title="Tagihan Tertunggak"
                        value={currency(3200000)}
                        iconBgClass="bg-red-100"
                        iconColor="var(--color-red-600)"
                        subtitle="Periode berjalan"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle>Aktivitas Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <p className="text-sm">
                                    Pembayaran sewa • Aulia N
                                </p>
                                <p className="text-sm font-medium">
                                    {currency(750000)}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">
                                    Booking kamar • Raka P
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    K-12
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">
                                    Perpanjangan kontrak • Dina S
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    12 bln
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle>Maintenance Terbaru</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium">
                                        Plumbing • K-08
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Bocor wastafel
                                    </p>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                                    Tinggi
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium">
                                        Listrik • K-21
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Stop kontak rusak
                                    </p>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                                    Sedang
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium">
                                        Umum • Lorong 2
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Lampu mati
                                    </p>
                                </div>
                                <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
                                    Rendah
                                </span>
                            </div>
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
                                <p className="text-sm font-medium">3</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Check-out</p>
                                <p className="text-sm font-medium">2</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Tenggat pembayaran</p>
                                <p className="text-sm font-medium">4</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Status Kamar</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <span className="text-sm text-muted-foreground">
                                    Terisi
                                </span>
                                <span className="text-sm font-medium">43</span>
                            </div>
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <span className="text-sm text-muted-foreground">
                                    Kosong
                                </span>
                                <span className="text-sm font-medium">7</span>
                            </div>
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <span className="text-sm text-muted-foreground">
                                    Maintenance
                                </span>
                                <span className="text-sm font-medium">2</span>
                            </div>
                            <div className="flex items-center justify-between rounded-md border p-3">
                                <span className="text-sm text-muted-foreground">
                                    Diblokir
                                </span>
                                <span className="text-sm font-medium">0</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Page;
