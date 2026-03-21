"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoomsLegend } from "@/components/rooms/RoomsLegend";
import { RoomDetailsCard } from "@/components/rooms/RoomDetailsCard";
import { RoomTile, type Room } from "@/components/rooms/RoomTile";
import { ArrowLeftIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

function RoomsPage() {
    const [selected, setSelected] = useState<Room | undefined>(undefined);
    const isGuest = false;

    const router = useRouter();

    const rooms: Room[] = useMemo(
        () => [
            {
                id: "101",
                floor: 1,
                price: 1300000,
                size: 12,
                status: "terisi",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "102",
                floor: 1,
                price: 1300000,
                size: 12,
                status: "tersedia",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "103",
                floor: 1,
                price: 1300000,
                size: 12,
                status: "terisi",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "104",
                floor: 1,
                price: 1300000,
                size: 12,
                status: "pending",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "105",
                floor: 1,
                price: 1300000,
                size: 12,
                status: "terisi",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "106",
                floor: 1,
                price: 1300000,
                size: 12,
                status: "tersedia",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "201",
                floor: 2,
                price: 1300000,
                size: 12,
                status: "tersedia",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "202",
                floor: 2,
                price: 1300000,
                size: 12,
                status: "tersedia",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "203",
                floor: 2,
                price: 1300000,
                size: 12,
                status: "terisi",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "204",
                floor: 2,
                price: 1300000,
                size: 12,
                status: "tersedia",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "205",
                floor: 2,
                price: 1300000,
                size: 12,
                status: "terisi",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "206",
                floor: 2,
                price: 1300000,
                size: 12,
                status: "tersedia",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "301",
                floor: 3,
                price: 1300000,
                size: 12,
                status: "tersedia",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "302",
                floor: 3,
                price: 1300000,
                size: 12,
                status: "terisi",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "303",
                floor: 3,
                price: 1300000,
                size: 12,
                status: "pending",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "304",
                floor: 3,
                price: 1300000,
                size: 12,
                status: "tersedia",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "305",
                floor: 3,
                price: 1300000,
                size: 12,
                status: "tersedia",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
            {
                id: "306",
                floor: 3,
                price: 1300000,
                size: 12,
                status: "terisi",
                facilities: ["AC", "Wi-Fi", "Kamar Mandi Luar"],
            },
        ],
        [],
    );

    const counts = useMemo(() => {
        const available = rooms.filter((r) => r.status === "tersedia").length;
        const occupied = rooms.filter((r) => r.status === "terisi").length;
        const pending = rooms.filter((r) => r.status === "pending").length;
        return { available, occupied, pending };
    }, [rooms]);

    const floors = useMemo(() => {
        const groups: Record<number, Room[]> = {};
        rooms.forEach((r) => {
            groups[r.floor] ??= [];
            groups[r.floor].push(r);
        });
        return Object.entries(groups)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([floor, items]) => ({ floor: Number(floor), items }));
    }, [rooms]);

    return (
        <div className="px-4 py-4 max-w-7xl mx-auto">
            <div className="mb-4 flex items-center gap-2">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeftIcon size={20} /> Kembali
                </Button>
                <h1 className="text-lg sm:text-xl font-bold">
                    Pilih Kamar Anda
                </h1>
                <div className="ml-auto">
                    <Badge className="bg-emerald-50 text-emerald-900">
                        {counts.available} kamar tersedia
                    </Badge>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_380px] gap-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="shadow-none">
                            <CardContent className="flex flex-col text-center">
                                <p className="text-2xl font-bold text-green-500">
                                    11
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Tersedia
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none">
                            <CardContent className="flex flex-col text-center">
                                <p className="text-2xl font-bold text-red-500">
                                    6
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Terisi
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none">
                            <CardContent className="flex flex-col text-center">
                                <p className="text-2xl font-bold text-amber-500">
                                    1
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Pending
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Alert className="border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-50">
                        <InfoIcon />
                        <AlertTitle>Tips Memilih Kamar.</AlertTitle>
                        <AlertDescription className="text-blue-700">
                            Klik pada kamar yang tersedia (hijau) untuk melihat
                            detail dan melakukan booking. Kamar merah sudah
                            terisi, kamar kuning sedang dalam proses booking.
                        </AlertDescription>
                    </Alert>

                    <Card className="shadow-none">
                        <CardContent className="py-4 px-4">
                            <Card className="shadow-none py-3 mb-4">
                                <CardContent className="px-3">
                                    <RoomsLegend />
                                </CardContent>
                            </Card>
                            <div className="space-y-6">
                                {floors.map(({ floor, items }) => (
                                    <div key={floor} className="space-y-2">
                                        <div className="flex gap-4 items-center">
                                            <p className="font-semibold">
                                                Lantai {floor}
                                            </p>
                                            <div className="border-b flex-1"></div>
                                        </div>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                            {items.map((room) => (
                                                <RoomTile
                                                    key={room.id}
                                                    room={room}
                                                    selected={
                                                        selected?.id === room.id
                                                    }
                                                    onSelect={setSelected}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <RoomDetailsCard
                    room={selected}
                    isGuest={isGuest}
                    onBook={(room) => {
                        const bookingId = `BK-${room.id}-${Date.now()}`;
                        router.push(
                            `/user/bookings/${bookingId}/payment?roomId=${room.id}&price=${room.price}&size=${room.size}&floor=${room.floor}`,
                        );
                    }}
                />
            </div>
        </div>
    );
}

export default RoomsPage;
