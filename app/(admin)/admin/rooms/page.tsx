"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { FilterBar } from "@/components/filters/FilterBar";
import { Room } from "@/types/rooms";
import { fetchRooms } from "@/services/rooms";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import { getSession } from "@/actions/auth";

export default function Page() {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("semua");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const session = getSession();
        const token = session?.accessToken;

        fetchRooms(undefined, { token })
            .then((value) => {
                console.log(value);
                return setRooms(value.data);
            })
            .catch((e) => setErrorMsg(e.message))
            .finally(() => setLoading(false));
    }, []);

    const statusLabelColor = (room: Room) => {
        if (room.status === "available") {
            return "bg-emerald-100 text-emerald-700";
        } else if (room.status === "occupied") {
            return "bg-amber-100 text-amber-700";
        } else {
            return "bg-red-100 text-red-700";
        }
    };

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Kamar</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/rooms/create">
                            <Button size="sm">Tambah Kamar</Button>
                        </Link>
                    </div>
                </div>

                <Card className="shadow-none">
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Daftar Kamar</CardTitle>
                        <FilterBar
                            search={{
                                value: query,
                                onChange: setQuery,
                                placeholder: "Cari nomor/tipe kamar...",
                            }}
                            // dateRange={{
                            //     value: date,
                            //     onChange: setDate,
                            // }}
                            select={{
                                value: status,
                                onChange: setStatus,
                                placeholder: "Status",
                                options: [
                                    { value: "semua", label: "Semua" },
                                    { value: "terisi", label: "Terisi" },
                                    { value: "kosong", label: "Kosong" },
                                    {
                                        value: "maintenance",
                                        label: "Maintenance",
                                    },
                                ],
                                triggerClassName: "w-36",
                            }}
                        />
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b">
                                        <th className="text-left px-4 py-3 font-medium">
                                            Nomor
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Tipe
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Harga
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="text-right px-4 py-3 font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&>tr:last-child]:border-0">
                                    {rooms.map((room) => (
                                        <tr className="border-b" key={room.id}>
                                            <td className="px-4 py-3">
                                                {room.roomNumber}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {room.roomType}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                Rp{room.price}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={cn(
                                                        "text-xs px-2 py-0.5 rounded",
                                                        statusLabelColor(room),
                                                    )}
                                                >
                                                    {room.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={`/admin/rooms/${room.id}`}
                                                >
                                                    <Button
                                                        size="icon-sm"
                                                        variant="outline"
                                                    >
                                                        <InfoIcon />
                                                    </Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    <Pagination className="p-3">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>
                                    1
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </Card>
            </div>
        </div>
    );
}
