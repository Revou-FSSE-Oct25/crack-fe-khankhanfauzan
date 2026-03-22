"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RoomsLegend } from "@/components/rooms/RoomsLegend";
import { RoomDetailsCard } from "@/components/rooms/RoomDetailsCard";
import {
    RoomTile,
    type Room as UiRoom,
    type RoomStatus as UiRoomStatus,
} from "@/components/rooms/RoomTile";
import { ArrowLeftIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { fetchRooms } from "@/services/rooms";
import type { RoomsResponse, Room as ApiRoom } from "@/types/rooms";

function RoomsPage() {
    const [selected, setSelected] = useState<UiRoom | undefined>(undefined);
    const isGuest = false;

    const router = useRouter();

    const [roomsResponse, setRoomsResponse] = useState<RoomsResponse>();

    useEffect(() => {
        fetchRooms()
            .then(setRoomsResponse)
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const uiRooms: UiRoom[] = useMemo(() => {
        const data = roomsResponse?.data ?? [];
        const statusMap: Record<string, UiRoomStatus> = {
            available: "available",
            occupied: "occupied",
            unavailable: "unavailable",
        };
        return data.map((r: ApiRoom) => ({
            id: r.roomNumber,
            floor: r.floor,
            price: r.price,
            size: 12,
            status: statusMap[r.status] ?? "unavailable",
            facilities: r.facilities,
        }));
    }, [roomsResponse]);

    const floors = useMemo(() => {
        const groups: Record<number, UiRoom[]> = {};
        uiRooms.forEach((r) => {
            groups[r.floor] ??= [];
            groups[r.floor].push(r);
        });
        return Object.entries(groups)
            .sort((a, b) => Number(a[0]) - Number(b[0]))
            .map(([floor, items]) => ({ floor: Number(floor), items }));
    }, [uiRooms]);

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
                        {roomsResponse?.meta.totalAvailable} kamar tersedia
                    </Badge>
                </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_380px] gap-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                        <Card className="shadow-none">
                            <CardContent className="flex flex-col text-center">
                                <p className="text-2xl font-bold text-green-500">
                                    {roomsResponse?.meta.totalAvailable ?? 0}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Tersedia
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none">
                            <CardContent className="flex flex-col text-center">
                                <p className="text-2xl font-bold text-red-500">
                                    {roomsResponse?.meta.totalOccupied ?? 0}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Terisi
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-none">
                            <CardContent className="flex flex-col text-center">
                                <p className="text-2xl font-bold text-amber-500">
                                    {roomsResponse?.meta.totalUnavailable ?? 0}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Tidak Tersedia
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
