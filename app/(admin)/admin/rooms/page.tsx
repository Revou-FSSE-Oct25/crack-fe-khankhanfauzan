"use client";
import React from "react";
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
import type { DateRange } from "react-day-picker";

export default function Page() {
    const [query, setQuery] = React.useState("");
    const [status, setStatus] = React.useState("semua");
    const [date, setDate] = React.useState<DateRange | undefined>();
    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Kamar</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/rooms/create">
                            <Button size="sm">Tambah Kamar</Button>
                        </Link>
                        <Button size="sm" variant="outline">
                            Atur Tipe Kamar
                        </Button>
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
                                    <tr className="border-b">
                                        <td className="px-4 py-3">K-01</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Standard
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Rp 1.000.000
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                                Terisi
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href="/admin/rooms/K-01">
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                >
                                                    Detail
                                                </Button>
                                            </Link>
                                            <Button size="xs" variant="ghost">
                                                Atur
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="px-4 py-3">K-12</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Deluxe
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Rp 1.300.000
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                                                Kosong
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href="/admin/rooms/K-12">
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                >
                                                    Detail
                                                </Button>
                                            </Link>
                                            <Button size="xs" variant="ghost">
                                                Atur
                                            </Button>
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="px-4 py-3">K-21</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Standard
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Rp 1.000.000
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                                                Maintenance
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href="/admin/rooms/K-21">
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                >
                                                    Detail
                                                </Button>
                                            </Link>
                                            <Button size="xs" variant="ghost">
                                                Atur
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
