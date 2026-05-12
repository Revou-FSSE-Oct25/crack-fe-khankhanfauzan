"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventListItem } from "@/components/events/EventListItem";
import {
    CalendarMonth,
    type CalendarEvent,
} from "@/components/calendar/CalendarMonth";
import React, { useEffect, useState } from "react";
import { RoomSummaryCard } from "@/components/property/RoomSummaryCard";
import {
    CalendarIcon,
    ChevronRightIcon,
    ClockIcon,
    InfoIcon,
    WrenchIcon,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { NextPaymentCard } from "@/components/payments/NextPaymentCard";
import { TransactionItem } from "@/components/transactions/TransactionItem";
import { AlertBanner } from "@/components/ui/alert-banner";
import Link from "next/link";
import { User } from "@/types/users";
import { getSession } from "@/actions/auth";
import { getMe } from "@/services/auth";
import { TenantDashboardData } from "@/types/tenant-dashboard";
import { fetchTenantDashboard } from "@/services/dashboard";
import { formatDate, formatDurationUnit, formatRupiah } from "@/utils/format";
import { iconMap } from "@/components/facilities/FacilityIcon";
import { EmptyState } from "@/components/ui/empty-state";
import { DoorOpenIcon, ReceiptIcon } from "lucide-react";

function Page() {
    const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
    const [profile, setProfile] = useState<User | null>(null);
    const [tenantDashboard, setTenantDashboard] =
        useState<TenantDashboardData | null>(null);
    const [errorMsg, seterrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const getStatusVariant = (
        txStatus: string,
    ): "lunas" | "pending" | "gagal" | "dibatalkan" | "refund" => {
        if (txStatus === "verified") return "lunas";
        if (txStatus === "rejected") return "gagal";
        return "pending";
    };

    const getStatusLabel = (txStatus: string): string => {
        if (txStatus === "verified") return "Berhasil";
        if (txStatus === "rejected") return "Gagal";
        return "Menunggu";
    };

    const getEventVariant = (
        type: string,
    ): "warning" | "danger" | "info" | "muted" | "success" => {
        if (type === "payment_due") return "danger";
        if (type === "maintenance_reported") return "warning";
        return "info";
    };

    const events: CalendarEvent[] =
        tenantDashboard?.calendarEvents?.map((ev) => ({
            date: ev.date.split("T")[0], // Ensure format is YYYY-MM-DD
            title: ev.title,
            variant: getEventVariant(ev.type),
        })) || [];

    const eventsBySelected = events.filter((e) => e.date === selectedDate);

    useEffect(() => {
        const session = getSession();
        const token = session?.accessToken;

        getMe(token!)
            .then((value) => setProfile(value.data))
            .catch((e) => seterrorMsg(e.message))
            .finally(() => setLoading(false));

        fetchTenantDashboard({ token: token })
            .then((value) => setTenantDashboard(value.data))
            .catch((e) => seterrorMsg(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col md:flex-row gap-4 md:gap-8 p-4 md:p-6">
                <div className="flex flex-col flex-1 gap-4">
                    {!profile?.verified.isProfileVerified && (
                        <AlertBanner
                            variant="warning"
                            description="Lengkapi data diri anda."
                            action={
                                <Link href="/user/profile">
                                    <Button size="sm" variant="ghost">
                                        Lengkapi
                                    </Button>
                                </Link>
                            }
                        />
                    )}

                    {!tenantDashboard?.activeBooking ? (
                        <EmptyState
                            icon={DoorOpenIcon}
                            title="Belum Ada Kamar Aktif"
                            description="Anda belum memiliki kamar yang sedang disewa atau booking yang aktif."
                            action={
                                <Link href="/rooms">
                                    <Button>Cari Kamar Sekarang</Button>
                                </Link>
                            }
                        />
                    ) : (
                        <>
                            <RoomSummaryCard
                                imageSrc="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"
                                imageAlt="room"
                                roomName={`Kamar ${tenantDashboard?.activeBooking?.room?.roomNumber || "---"}`}
                                floorLabel={`Lantai ${tenantDashboard?.activeBooking?.room?.floor || "-"}`}
                                sizeLabel={`${tenantDashboard?.activeBooking?.room?.area || "-"}m²`}
                                sinceLabel={`Sejak ${formatDate(tenantDashboard?.activeBooking?.startDate) || "-"}`}
                                priceLabel={`${formatRupiah(tenantDashboard?.activeBooking?.room?.priceMonthly, { notation: "compact" })}`}
                                facilities={
                                    tenantDashboard?.activeBooking?.room?.roomFacilities?.map(
                                        (rf) => ({
                                            icon:
                                                iconMap[rf.facility.iconUrl] ||
                                                InfoIcon,
                                            label: rf.facility.name,
                                        }),
                                    ) || []
                                }
                            />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                                <StatCard
                                    icon={ClockIcon}
                                    title="Sudah tinggal"
                                    value={Number(
                                        tenantDashboard?.stayInfo?.daysStayed ||
                                            0,
                                    )}
                                    subtitle="hari"
                                    iconColor="blue"
                                    iconBgClass="bg-blue-100"
                                />
                                <StatCard
                                    icon={CalendarIcon}
                                    title="Durasi Kontrak"
                                    value={Number(
                                        tenantDashboard?.stayInfo
                                            ?.contractDuration || 0,
                                    )}
                                    subtitle={formatDurationUnit(
                                        tenantDashboard?.stayInfo?.rentType ||
                                            "monthly",
                                    )}
                                    iconColor="var(--color-primary)"
                                    iconBgClass="bg-accent"
                                />
                                <StatCard
                                    icon={InfoIcon}
                                    title="Jatuh Tempo"
                                    value={Number(
                                        tenantDashboard?.paymentReminder
                                            ?.countdownDays || 0,
                                    )}
                                    subtitle="hari lagi"
                                    iconColor="orange"
                                    iconBgClass="bg-orange-100"
                                />
                                <StatCard
                                    icon={WrenchIcon}
                                    title="Komplain"
                                    value={Number(
                                        tenantDashboard?.activeComplaints
                                            ?.length || 0,
                                    )}
                                    subtitle="aktif"
                                    iconColor="purple"
                                    iconBgClass="bg-purple-100"
                                />
                            </div>
                        </>
                    )}

                    {tenantDashboard?.paymentReminder && (
                        <NextPaymentCard
                            dueDateLabel={`Jatuh tempo: ${formatDate(tenantDashboard?.paymentReminder?.dueDate, { day: "numeric", month: "long", year: "numeric" })}`}
                            daysRemainingLabel={`${tenantDashboard?.paymentReminder?.countdownDays} hari lagi`}
                            amountLabel={formatRupiah(
                                tenantDashboard?.paymentReminder?.totalAmount,
                            )}
                        />
                    )}

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="justify-between flex items-center">
                                <h2>Transaksi Terakhir</h2>
                                <Button size="xs" variant="ghost">
                                    Lihat Semua <ChevronRightIcon />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {tenantDashboard?.recentTransactions &&
                            tenantDashboard.recentTransactions.length > 0 ? (
                                tenantDashboard.recentTransactions.map(
                                    (transaction) => (
                                        <TransactionItem
                                            key={transaction.id}
                                            status={getStatusVariant(
                                                transaction.status,
                                            )}
                                            trxId={transaction.id
                                                .slice(0, 8)
                                                .toUpperCase()}
                                            dateLabel={formatDate(
                                                transaction.createdAt,
                                                {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                },
                                            )}
                                            amountLabel={formatRupiah(
                                                transaction.amount,
                                            )}
                                            statusLabel={getStatusLabel(
                                                transaction.status,
                                            )}
                                        />
                                    ),
                                )
                            ) : (
                                <EmptyState
                                    icon={ReceiptIcon}
                                    title="Belum Ada Transaksi"
                                    description="Anda belum memiliki riwayat transaksi pembayaran apa pun saat ini."
                                    className="p-4"
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <CalendarMonth
                        events={events}
                        selectedDate={selectedDate}
                        onSelectDate={(iso) => setSelectedDate(iso)}
                    />
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle>Event Mendatang</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            {eventsBySelected.length ? (
                                eventsBySelected.map((ev, i) => (
                                    <EventListItem
                                        key={i}
                                        variant={ev.variant}
                                        dateLabel={new Date(
                                            ev.date,
                                        ).toLocaleDateString("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                        })}
                                        title={ev.title}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">
                                    Pilih tanggal pada kalender untuk melihat
                                    detail event.
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
