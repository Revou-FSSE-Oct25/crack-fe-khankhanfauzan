"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RoomsLegend } from "@/components/rooms/RoomsLegend";
import { RoomDetailsCard } from "@/components/rooms/RoomDetailsCard";
import { RoomTile } from "@/components/rooms/RoomTile";
import { ArrowLeftIcon, InfoIcon, SearchIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { fetchRooms } from "@/services/rooms";
import type { Room, GetRoomsParams, RoomMeta } from "@/types/rooms";
import { ApiPaginatedResponse } from "@/types/types";

function RoomsPage() {
    const [selected, setSelected] = useState<Room | undefined>(undefined);
    const [roomsResponse, setRoomsResponse] =
        useState<ApiPaginatedResponse<Room[], RoomMeta>>();
    const [filters, setFilters] = useState<GetRoomsParams>({
        page: 1,
        perPage: 50,
        search: "",
        status: undefined,
    });

    // Debounce search
    const [searchTerm, setSearchTerm] = useState("");

    const router = useRouter();
    const isGuest = false;

    useEffect(() => {
        const timer = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchTerm, page: 1 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    useEffect(() => {
        fetchRooms(filters)
            .then(setRoomsResponse)
            .catch((e) => {});
    }, [filters]);

    const uiRooms: Room[] = useMemo(() => {
        return roomsResponse?.data ?? [];
    }, [roomsResponse]);

    const selectedApi: Room | undefined = selected;

    const roomGroups = useMemo(() => {
        // const groups: Record<number, Room[]> = {};
        // uiRooms.forEach((r) => {
        //     groups[r.floor] ??= [];
        //     groups[r.floor].push(r);
        // });
        // return Object.entries(groups)
        //     .sort((a, b) => Number(a[0]) - Number(b[0]))
        //     .map(([floor, items]) => ({ floor: Number(floor), items }));

        const groups: Record<string, Record<number, Room[]>> = {};

        uiRooms.forEach((room) => {
            const type = room.roomType;
            if (!groups[type]) groups[type] = {};

            if (!groups[type][room.floor]) {
                groups[type][room.floor] = [];
            }

            groups[type][room.floor].push(room);
        });

        return Object.entries(groups).map(([typeName, floorsObj]) => ({
            typeName,
            floors: Object.entries(floorsObj)
                .sort((a, b) => Number(a[0]) - Number(b[0]))
                .map(([floor, items]) => ({
                    floor: Number(floor),
                    items: items.sort((a, b) =>
                        a.roomNumber.localeCompare(b.roomNumber),
                    ),
                })),
        }));
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
                    <Card className="shadow-none">
                        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <Input
                                    placeholder="Cari nomor kamar..."
                                    className="pl-9"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <div className="w-full sm:w-48">
                                <Select
                                    value={filters.status || "all"}
                                    onValueChange={(val) =>
                                        setFilters((prev) => ({
                                            ...prev,
                                            status:
                                                val === "all" ? undefined : val,
                                        }))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status Kamar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Status
                                        </SelectItem>
                                        <SelectItem value="available">
                                            Tersedia
                                        </SelectItem>
                                        <SelectItem value="occupied">
                                            Terisi
                                        </SelectItem>
                                        <SelectItem value="unavailable">
                                            Tidak Tersedia
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

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
                        <CardContent>
                            <RoomsLegend />
                        </CardContent>
                    </Card>

                    {roomGroups.map((group) => (
                        <Card key={group.typeName} className="shadow-none">
                            <CardHeader>
                                <h2 className="text-lg font-bold uppercase tracking-tight text-secondary-foreground border-b pb-2">
                                    {group.typeName}
                                </h2>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {group.floors.map(({ floor, items }) => (
                                    <div key={floor} className="space-y-2">
                                        <div className="flex gap-4 items-center">
                                            <p className="font-semibold">
                                                Lantai {floor}
                                            </p>
                                        </div>
                                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                                            {items.map((room) => (
                                                <RoomTile
                                                    key={
                                                        room.roomNumber ??
                                                        String(room.id)
                                                    }
                                                    room={room}
                                                    selected={
                                                        selected?.roomNumber ===
                                                        room.roomNumber
                                                    }
                                                    onSelect={(r) =>
                                                        setSelected(r)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}

                    {/* <Card className="shadow-none">
                        <CardContent className="py-4 px-4">
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
                                                    key={
                                                        room.roomNumber ??
                                                        String(room.id)
                                                    }
                                                    room={room}
                                                    selected={
                                                        selected?.roomNumber ===
                                                        room.roomNumber
                                                    }
                                                    onSelect={(r) =>
                                                        setSelected(r)
                                                    }
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card> */}
                </div>

                <RoomDetailsCard
                    room={selectedApi}
                    isGuest={isGuest}
                    onBook={(room) => {
                        const bookingId = `BK-${room.roomNumber}-${Date.now()}`;
                        const size = room.dimensions?.area ?? 12;
                        // router.push(
                        //     `/user/bookings/${bookingId}/payment?roomId=${room.roomNumber}&price=${room.price}&size=${size}&floor=${room.floor}`,
                        // );
                        router.push(`/user/bookings/create?roomId=${room.id}`);
                    }}
                />
            </div>
        </div>
    );
}

export default RoomsPage;
