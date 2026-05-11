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
import { fetchInvoices } from "@/services/transactions";
import { getSession } from "@/actions/auth";
import { Invoice } from "@/types/invoices";
import { formatDate, formatRupiah } from "@/utils/format";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

export default function Page() {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("all");
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [page, setPage] = React.useState(1);

    const [invoices, setInvoices] = useState<Invoice[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = getSession();
        fetchInvoices({}, { token: session?.accessToken })
            .then((res) => setInvoices(res.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    const all = invoices || [];
    const pageSize = 10;

    const filtered = React.useMemo(() => {
        let res = all;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            res = res.filter(
                (inv) =>
                    inv.id.toLowerCase().includes(q) ||
                    (inv.booking?.tenant?.profile?.fullName || "")
                        .toLowerCase()
                        .includes(q),
            );
        }
        if (status !== "all") {
            res = res.filter((inv) => inv.status === status);
        }
        if (date?.from) {
            const from = date.from.getTime();
            const to = date.to?.getTime() ?? Number.POSITIVE_INFINITY;
            res = res.filter((inv) => {
                const t = new Date(inv.createdAt).getTime();
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
            case "paid":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                    >
                        Lunas
                    </Badge>
                );
            case "unpaid":
                return (
                    <Badge
                        variant="secondary"
                        className="bg-amber-100 text-amber-700 hover:bg-amber-100"
                    >
                        Belum Lunas
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
                    <h1 className="text-xl font-semibold">Invoice</h1>
                </div>

                <Card className="shadow-none">
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Daftar Invoice</CardTitle>
                        <FilterBar
                            search={{
                                value: search,
                                onChange: (v) => {
                                    setSearch(v);
                                    setPage(1);
                                },
                                placeholder: "Cari nama / id...",
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
                                    { value: "paid", label: "Lunas" },
                                    { value: "unpaid", label: "Belum Lunas" },
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
                                            Penghuni
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Tanggal Dibuat
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Jatuh Tempo
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Total
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
                                                Tidak ada data invoice.
                                            </td>
                                        </tr>
                                    ) : (
                                        pageItems.map((inv) => (
                                            <tr
                                                key={inv.id}
                                                className="border-b hover:bg-muted/30 transition-colors"
                                            >
                                                <td className="px-4 py-3 font-mono text-xs">
                                                    {inv.id.split("-")[0]}...
                                                </td>
                                                <td className="px-4 py-3">
                                                    {inv.booking?.tenant
                                                        ?.profile?.fullName ||
                                                        inv.booking?.tenant
                                                            ?.email ||
                                                        "-"}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {formatDate(inv.createdAt)}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {formatDate(inv.dueDate)}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {formatRupiah(
                                                        Number(inv.totalAmount),
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {getStatusBadge(inv.status)}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link
                                                        href={`/admin/invoices/${inv.id}`}
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
