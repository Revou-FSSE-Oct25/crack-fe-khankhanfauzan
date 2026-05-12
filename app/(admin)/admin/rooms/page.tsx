"use client";
import { Fragment, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { FilterBar } from "@/components/filters/FilterBar";
import { Room } from "@/types/rooms";
import { fetchRooms } from "@/services/rooms";
import { cn } from "@/lib/utils";
import { InfoIcon } from "lucide-react";
import { getSession } from "@/actions/auth";
import { BasePaginationMeta } from "@/types/types";

export default function Page() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [status, setStatus] = useState("semua");
    const [rooms, setRooms] = useState<Room[]>([]);
    const [errorMsg, setErrorMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [meta, setMeta] = useState<BasePaginationMeta | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        const session = getSession();
        const token = session?.accessToken;

        setLoading(true);
        fetchRooms(
            {
                page,
                perPage,
                search: debouncedQuery,
                status: status === "semua" ? undefined : status,
            },
            { token },
        )
            .then((value) => {
                setMeta(value.meta);
                return setRooms(value.data);
            })
            .catch((e) => setErrorMsg(e.message))
            .finally(() => setLoading(false));
    }, [page, perPage, debouncedQuery, status]);

    const statusLabelColor = (room: Room) => {
        if (room.status === "available") {
            return "bg-emerald-100 text-emerald-700";
        } else if (room.status === "occupied") {
            return "bg-amber-100 text-amber-700";
        } else {
            return "bg-red-100 text-red-700";
        }
    };

    const lastPage = meta?.totalPages ?? 1;
    const canPrev = page > 1;
    const canNext = page < lastPage;
    function goto(p: number) {
        if (p < 1 || p > lastPage) return;
        setPage(p);
    }
    function pagesToShow() {
        const total = lastPage;
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        const set = new Set<number>([
            1,
            2,
            total - 1,
            total,
            page - 1,
            page,
            page + 1,
        ]);
        return Array.from(set)
            .filter((n) => n >= 1 && n <= total)
            .sort((a, b) => a - b);
    }

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
                                    {loading &&
                                        Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <tr
                                                    className="border-b"
                                                    key={`sk-${i}`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-4 w-16" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-4 w-24" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-4 w-28" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-5 w-20 rounded" />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Skeleton className="h-8 w-8 ml-auto rounded" />
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    {!loading && errorMsg && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="px-4 py-8 text-center text-destructive"
                                            >
                                                {errorMsg}
                                            </td>
                                        </tr>
                                    )}
                                    {!loading &&
                                        !errorMsg &&
                                        rooms.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={5}
                                                    className="px-4 py-8 text-center text-muted-foreground"
                                                >
                                                    Tidak ada kamar ditemukan
                                                </td>
                                            </tr>
                                        )}
                                    {!loading &&
                                        !errorMsg &&
                                        rooms.map((room) => (
                                            <tr
                                                className="border-b"
                                                key={room.id}
                                            >
                                                <td className="px-4 py-3">
                                                    {room.roomNumber}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {room.roomType}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    Rp{room.priceMonthly}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={cn(
                                                            "text-xs px-2 py-0.5 rounded",
                                                            statusLabelColor(
                                                                room,
                                                            ),
                                                        )}
                                                    >
                                                        {room.status ===
                                                        "available"
                                                            ? "Tersedia"
                                                            : room.status ===
                                                                "occupied"
                                                              ? "Terisi"
                                                              : "Tidak Tersedia"}
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
                                <PaginationPrevious
                                    href="#"
                                    aria-disabled={!canPrev}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (canPrev) goto(page - 1);
                                    }}
                                />
                            </PaginationItem>
                            {pagesToShow().map((p, idx, arr) => {
                                const prev = arr[idx - 1];
                                const needEllipsis = prev && p - prev > 1;
                                return (
                                    <Fragment key={p}>
                                        {needEllipsis && (
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        )}
                                        <PaginationItem>
                                            <PaginationLink
                                                href="#"
                                                isActive={p === page}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    goto(p);
                                                }}
                                            >
                                                {p}
                                            </PaginationLink>
                                        </PaginationItem>
                                    </Fragment>
                                );
                            })}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    aria-disabled={!canNext}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (canNext) goto(page + 1);
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </Card>
            </div>
        </div>
    );
}
