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
    const [search, setSearch] = React.useState("");
    const [priority, setPriority] = React.useState("all");
    const [date, setDate] = React.useState<DateRange | undefined>();
    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Komplain & Maintenance
                    </h1>
                    <div className="flex gap-2">
                        <Link href="/admin/maintenances/create">
                            <Button size="sm">Buat Tiket</Button>
                        </Link>
                    </div>
                </div>

                <Card className="shadow-none">
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Daftar Tiket</CardTitle>
                        <FilterBar
                            search={{
                                value: search,
                                onChange: setSearch,
                                placeholder: "Cari unit / pelapor...",
                            }}
                            dateRange={{
                                value: date,
                                onChange: setDate,
                            }}
                            select={{
                                value: priority,
                                onChange: setPriority,
                                placeholder: "Prioritas",
                                options: [
                                    { value: "all", label: "Semua" },
                                    { value: "high", label: "Tinggi" },
                                    { value: "medium", label: "Sedang" },
                                    { value: "low", label: "Rendah" },
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
                                            Prioritas
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
                                        <td className="px-4 py-3">MT-001</td>
                                        <td className="px-4 py-3">Plumbing</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            K-08
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Aulia N
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-700">
                                                Tinggi
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Baru
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href="/admin/maintenances/MT-001">
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                >
                                                    Kelola
                                                </Button>
                                            </Link>
                                        </td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="px-4 py-3">MT-002</td>
                                        <td className="px-4 py-3">Listrik</td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            K-21
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Raka P
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-xs px-2 py-0.5 rounded bg-yellow-100 text-yellow-700">
                                                Sedang
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            Proses
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link href="/admin/maintenances/MT-002">
                                                <Button
                                                    size="xs"
                                                    variant="ghost"
                                                >
                                                    Kelola
                                                </Button>
                                            </Link>
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
