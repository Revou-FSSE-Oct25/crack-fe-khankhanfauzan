"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import type { DateRange } from "react-day-picker";
import { fetchBookings } from "@/services/bookings";
import { getSession } from "@/actions/auth";
import { Booking } from "@/types/bookings";
import { formatDate, formatDurationUnit } from "@/utils/format";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { ApiPaginatedResponse } from "@/types/types";

export default function Page() {
    const [search, setSearch] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    const [status, setStatus] = React.useState("all");
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [page, setPage] = React.useState(1);
    const pageSize = 10;

    const [bookingsResponse, setBookingsResponse] =
        useState<ApiPaginatedResponse<Booking[]> | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        const session = getSession();
        setLoading(true);
        fetchBookings(
            {
                page,
                perPage: pageSize,
                search: debouncedSearch,
                status: status === "all" ? undefined : status,
                startDate: date?.from ? date.from.toISOString() : undefined,
                endDate: date?.to ? date.to.toISOString() : undefined,
            },
            { token: session?.accessToken },
        )
            .then((res) => setBookingsResponse(res))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [debouncedSearch, status, page, date]);

    const pageItems = bookingsResponse?.data || [];
    const totalPages = bookingsResponse?.meta?.totalPages || 1;
    const currentPage = bookingsResponse?.meta?.page || 1;

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    >
                        Dikonfirmasi
                    </Badge>
                );
            case "pending_payment":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-700 hover:bg-amber-100"
                    >
                        Menunggu Pembayaran
                    </Badge>
                );
            case "pending_approval":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-purple-100 text-purple-700 hover:bg-purple-100"
                    >
                        Menunggu Persetujuan
                    </Badge>
                );
            case "cancelled":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-red-100 text-red-700 hover:bg-red-100"
                    >
                        Dibatalkan
                    </Badge>
                );
            case "completed":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                    >
                        Selesai
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Booking</h1>
                </div>

                <Card className="shadow-none">
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Daftar Booking</CardTitle>
                        <FilterBar
                            search={{
                                value: search,
                                onChange: (v) => {
                                    setSearch(v);
                                    setPage(1);
                                },
                                placeholder: "Cari nama / kamar / id...",
                            }}
                            dateRange={{
                                value: date,
                                onChange: (v) => {
                                    setDate(v);
                                    setPage(1);
                                },
                            }}
                            select={{
                                value: status,
                                onChange: (v) => {
                                    setStatus(v);
                                    setPage(1);
                                },
                                placeholder: "Status",
                                options: [
                                    { value: "all", label: "Semua" },
                                    {
                                        value: "confirmed",
                                        label: "Dikonfirmasi",
                                    },
                                    {
                                        value: "pending_payment",
                                        label: "Menunggu Pembayaran",
                                    },
                                    { value: "completed", label: "Selesai" },
                                    { value: "cancelled", label: "Dibatalkan" },
                                ],
                                triggerClassName: "w-48",
                            }}
                        />
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b">
                                        <th className="text-left px-4 py-3 font-medium">
                                            ID
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Nama
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Kamar
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Check-in
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Durasi
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
                                    {loading ? (
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
                                                        <Skeleton className="h-4 w-32" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-4 w-16" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-4 w-24" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-4 w-20" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-6 w-24 rounded-full" />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Skeleton className="h-8 w-16 ml-auto rounded" />
                                                    </td>
                                                </tr>
                                            ),
                                        )
                                    ) : pageItems.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                Tidak ada data booking.
                                            </td>
                                        </tr>
                                    ) : (
                                        pageItems.map((booking) => (
                                            <tr
                                                key={booking.id}
                                                className="border-b hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="px-4 py-3 font-mono text-xs">
                                                    {booking.id.split("-")[0]}
                                                    ...
                                                </td>
                                                <td className="px-4 py-3">
                                                    {booking.tenant?.profile
                                                        ?.fullName ||
                                                        booking.tenant?.email ||
                                                        "-"}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {booking.room?.roomNumber ||
                                                        "-"}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {formatDate(
                                                        booking.startDate,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {booking.duration}{" "}
                                                    {formatDurationUnit(
                                                        booking.rentType,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getStatusBadge(
                                                        booking.status,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link
                                                        href={`/admin/bookings/${booking.id}`}
                                                    >
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                        >
                                                            Detail
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                    {!loading && totalPages > 0 && (
                        <Pagination className="p-3">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage((p) => Math.max(1, p - 1));
                                        }}
                                    />
                                </PaginationItem>

                                {Array.from(
                                    { length: totalPages },
                                    (_, i) => i + 1,
                                )
                                    .filter(
                                        (n) =>
                                            n === 1 ||
                                            n === totalPages ||
                                            Math.abs(n - currentPage) <= 1,
                                    )
                                    .map((n, i, arr) => (
                                        <React.Fragment key={n}>
                                            {i > 0 && arr[i - 1] !== n - 1 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                            <PaginationItem>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={n === currentPage}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setPage(n);
                                                    }}
                                                >
                                                    {n}
                                                </PaginationLink>
                                            </PaginationItem>
                                        </React.Fragment>
                                    ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage((p) =>
                                                Math.min(totalPages, p + 1),
                                            );
                                        }}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </Card>
            </div>
        </div>
    );
}
