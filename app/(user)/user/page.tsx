"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventListItem } from "@/components/events/EventListItem";
import {
    CalendarMonth,
    type CalendarEvent,
} from "@/components/calendar/CalendarMonth";
import React from "react";
import { RoomSummaryCard } from "@/components/property/RoomSummaryCard";
import {
    BathIcon,
    BedIcon,
    BellIcon,
    CalendarIcon,
    ChevronRightIcon,
    ClockIcon,
    Columns2Icon,
    InfoIcon,
    LampDeskIcon,
    MessageCircleIcon,
    UserIcon,
    WifiIcon,
    WindIcon,
    WrenchIcon,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { NextPaymentCard } from "@/components/payments/NextPaymentCard";
import { TransactionItem } from "@/components/transactions/TransactionItem";
import { IconButtonBadge } from "@/components/ui/icon-button-badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PageHeader } from "@/components/layout/PageHeader";

function Page() {
    const [selectedDate, setSelectedDate] = React.useState<string | null>(null);
    const events: CalendarEvent[] = [
        {
            date: "2026-03-29",
            title: "Reminder Pembayaran (H-3)",
            variant: "warning",
        },
        {
            date: "2026-04-01",
            title: "Jatuh Tempo Pembayaran",
            variant: "danger",
        },
        { date: "2026-03-15", title: "Maintenance AC Rutin", variant: "info" },
        { date: "2026-03-22", title: "Pembersihan Mingguan", variant: "muted" },
        {
            date: "2026-03-10",
            title: "Penggantian Filter Air",
            variant: "success",
        },
    ];
    const eventsBySelected = events.filter((e) => e.date === selectedDate);
    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col md:flex-row gap-4 md:gap-8 p-4 md:p-6">
                <div className="flex flex-col flex-1 gap-4">
                    <RoomSummaryCard
                        imageSrc="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800"
                        imageAlt="room"
                        roomName="Kamar 301"
                        floorLabel="Lantai 3"
                        sizeLabel="12m²"
                        sinceLabel="Sejak Maret 2025"
                        priceLabel="Rp 1.5jt"
                        facilities={[
                            { icon: BedIcon, label: "Kasur Queen" },
                            { icon: WindIcon, label: "AC" },
                            { icon: WifiIcon, label: "Wi-Fi" },
                            { icon: BathIcon, label: "Kamar Mandi Dalam" },
                            { icon: Columns2Icon, label: "Lemari Pakaian" },
                            { icon: LampDeskIcon, label: "Meja Kerja" },
                        ]}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                        <StatCard
                            icon={ClockIcon}
                            title="Sudah tinggal"
                            value={371}
                            subtitle="hari"
                            iconColor="blue"
                            iconBgClass="bg-blue-100"
                        />
                        <StatCard
                            icon={CalendarIcon}
                            title="Durasi Kontrak"
                            value={12}
                            subtitle="bulan"
                            iconColor="var(--color-primary)"
                            iconBgClass="bg-accent"
                        />
                        <StatCard
                            icon={InfoIcon}
                            title="Jatuh Tempo"
                            value={30}
                            subtitle="hari lagi"
                            iconColor="orange"
                            iconBgClass="bg-orange-100"
                        />
                        <StatCard
                            icon={WrenchIcon}
                            title="Komplain"
                            value={2}
                            subtitle="aktif"
                            iconColor="purple"
                            iconBgClass="bg-purple-100"
                        />
                    </div>
                    <NextPaymentCard
                        dueDateLabel="Jatuh tempo: 1 April 2026"
                        daysRemainingLabel="30 hari lagi"
                        amountLabel="Rp 1.500.000"
                    />
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
                            <TransactionItem
                                status="lunas"
                                trxId="TRX001"
                                dateLabel="28 Februari 2026"
                                amountLabel="Rp 1.500.000"
                                statusLabel="Lunas"
                            />
                            <TransactionItem
                                status="pending"
                                trxId="TRX001"
                                dateLabel="28 Februari 2026"
                                amountLabel="Rp 1.500.000"
                                statusLabel="Pending"
                            />
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
