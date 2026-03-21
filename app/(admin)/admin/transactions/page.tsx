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
    const [type, setType] = React.useState("all");
    const [date, setDate] = React.useState<DateRange | undefined>();
    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Transaksi</h1>
                    <div className="flex gap-2">
                        <Button size="sm">Catat Pembayaran</Button>
                        <Button size="sm" variant="outline">
                            Ekspor
                        </Button>
                    </div>
                </div>

                <Card className="shadow-none">
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Riwayat Transaksi</CardTitle>
                        <FilterBar
                            search={{
                                value: search,
                                onChange: setSearch,
                                placeholder: "Cari nama / referensi...",
                            }}
                            dateRange={{
                                value: date,
                                onChange: setDate,
                            }}
                            select={{
                                value: type,
                                onChange: setType,
                                placeholder: "Tipe",
                                options: [
                                    { value: "all", label: "Semua" },
                                    { value: "income", label: "Pemasukan" },
                                    { value: "expense", label: "Pengeluaran" },
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
                                            Tanggal
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Deskripsi
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Tipe
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Metode
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Nominal
                                        </th>
                                        <th className="text-right px-4 py-3 font-medium">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&>tr:last-child]:border-0">
                                    <tr className="border-b">
                                        <td className="px-4 py-3">
                                            12 Mar 2026
                                        </td>
                                        <td className="px-4 py-3">
                                            Pembayaran sewa • Aulia N
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                                Pemasukan
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Transfer
                                        </td>
                                        <td className="px-4 py-3 text-emerald-600 font-medium">
                                            +{currency(750000)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button size="xs" variant="ghost">
                                                Detail
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="px-4 py-3">
                                            10 Mar 2026
                                        </td>
                                        <td className="px-4 py-3">
                                            Perbaikan pipa • K-08
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-700">
                                                Pengeluaran
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Biaya Maintenance
                                        </td>
                                        <td className="px-4 py-3 text-red-600 font-medium">
                                            -{currency(250000)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button size="xs" variant="ghost">
                                                Detail
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
