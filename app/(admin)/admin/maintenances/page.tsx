"use client";
import React, { useEffect, useState } from "react";
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
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { FilterBar } from "@/components/filters/FilterBar";
import type { DateRange } from "react-day-picker";
import { fetchMaintenances } from "@/services/maintenances";
import { getSession } from "@/actions/auth";
import { Maintenance } from "@/types/maintenances";
import { formatDate } from "@/utils/format";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

export default function Page() {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("all");
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [page, setPage] = React.useState(1);

    const [maintenances, setMaintenances] = useState<Maintenance[] | null>(
        null,
    );
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = getSession();
        fetchMaintenances({}, { token: session?.accessToken })
            .then((res) => setMaintenances(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const all = maintenances || [];
    const pageSize = 10;

    const filtered = React.useMemo(() => {
        let res = all;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            res = res.filter(
                (m) =>
                    m.id.toLowerCase().includes(q) ||
                    (m.room?.roomNumber || "").toLowerCase().includes(q) ||
                    (m.tenant?.profile?.fullName || "")
                        .toLowerCase()
                        .includes(q) ||
                    m.category.toLowerCase().includes(q),
            );
        }
        if (status !== "all") {
            res = res.filter((m) => m.status === status);
        }
        if (date?.from) {
            const from = date.from.getTime();
            const to = date.to?.getTime() ?? Number.POSITIVE_INFINITY;
            res = res.filter((m) => {
                const t = new Date(m.createdAt).getTime();
                return t >= from && t <= to;
            });
        }
        return res;
    }, [all, search, status, date]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = filtered.slice(start, end);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                        Menunggu Diproses
                    </Badge>
                );
            case "in_progress":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-amber-50 text-amber-700 border-amber-200"
                    >
                        Sedang Dikerjakan
                    </Badge>
                );
            case "resolved":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-green-50 text-green-700 border-green-200"
                    >
                        Selesai
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-red-50 text-red-700 border-red-200"
                    >
                        Ditolak
                    </Badge>
                );
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatCategoryLabel = (category: string) => {
        switch (category) {
            case "plumbing":
                return "Saluran Air / Pipa";
            case "electrical":
                return "Kelistrikan";
            case "ac":
                return "AC (Air Conditioning)";
            case "furniture":
                return "Perabotan";
            case "others":
                return "Lainnya";
            default:
                return category;
        }
    };

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Komplain & Maintenance
                    </h1>
                </div>

                <Card className="shadow-none">
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Daftar Tiket</CardTitle>
                        <FilterBar
                            search={{
                                value: search,
                                onChange: (v) => {
                                    setSearch(v);
                                    setPage(1);
                                },
                                placeholder: "Cari ID / unit / pelapor...",
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
                                    { value: "pending", label: "Menunggu" },
                                    { value: "in_progress", label: "Proses" },
                                    { value: "resolved", label: "Selesai" },
                                    { value: "rejected", label: "Ditolak" },
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
                                            ID
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Kategori
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Unit
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Pelapor
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Tanggal Masuk
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
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center py-8"
                                            >
                                                <Spinner className="mx-auto" />
                                            </td>
                                        </tr>
                                    ) : pageItems.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                Tidak ada data komplain.
                                            </td>
                                        </tr>
                                    ) : (
                                        pageItems.map((m) => (
                                            <tr
                                                key={m.id}
                                                className="border-b hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="px-4 py-3 font-mono text-xs">
                                                    {m.id.split("-")[0]}...
                                                </td>
                                                <td className="px-4 py-3">
                                                    {formatCategoryLabel(
                                                        m.category,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {m.room?.roomNumber || "-"}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {m.tenant?.profile
                                                        ?.fullName ||
                                                        m.tenant?.email ||
                                                        "-"}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {formatDate(m.createdAt)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getStatusBadge(m.status)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link
                                                        href={`/admin/maintenances/${m.id}`}
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
