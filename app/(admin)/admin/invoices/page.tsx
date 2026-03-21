"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { FilterBar } from "@/components/filters/FilterBar";
import type { DateRange } from "react-day-picker";

const currency = (n: number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(n);

export default function Page() {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState("all");
    const [date, setDate] = React.useState<DateRange | undefined>();
    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Invoice</h1>
                    <div className="flex gap-2">
                        <Button size="sm">Buat Invoice</Button>
                        <Button size="sm" variant="outline">
                            Ekspor
                        </Button>
                    </div>
                </div>

                <Card className="shadow-none">
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Daftar Invoice</CardTitle>
                        <FilterBar
                            search={{
                                value: search,
                                onChange: setSearch,
                                placeholder: "Cari nama / nomor invoice...",
                            }}
                            dateRange={{
                                value: date,
                                onChange: setDate,
                            }}
                            select={{
                                value: status,
                                onChange: setStatus,
                                placeholder: "Status",
                                options: [
                                    { value: "all", label: "Semua" },
                                    { value: "paid", label: "Lunas" },
                                    { value: "unpaid", label: "Belum Lunas" },
                                    { value: "overdue", label: "Terlambat" },
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
                                            Penghuni
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Periode
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Total
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Status
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Jatuh Tempo
                                        </th>
                                        <th className="text-right px-4 py-3 font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&>tr:last-child]:border-0">
                                    <tr className="border-b">
                                        <td className="px-4 py-3">INV-001</td>
                                        <td className="px-4 py-3">Aulia N</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Mar 2026
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {currency(750000)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                                Lunas
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            10 Mar 2026
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button size="xs" variant="ghost">
                                                Detail
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="px-4 py-3">INV-002</td>
                                        <td className="px-4 py-3">Raka P</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Mar 2026
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {currency(750000)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">
                                                Terlambat
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            05 Mar 2026
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button size="xs" variant="ghost">
                                                Kirim Pengingat
                                            </Button>
                                        </td>
                                    </tr>
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
