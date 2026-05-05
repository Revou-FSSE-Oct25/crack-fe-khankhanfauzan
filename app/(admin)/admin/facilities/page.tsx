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
import { Facility } from "@/types/facilities";
import { fetchFacilities } from "@/services/facilities";
import { PencilIcon } from "lucide-react";
import { getSession } from "@/actions/auth";

export default function Page() {
    const [query, setQuery] = useState("");
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Filter state
    const filteredFacilities = facilities.filter(
        (f) =>
            f.name.toLowerCase().includes(query.toLowerCase()) ||
            (f.description &&
                f.description.toLowerCase().includes(query.toLowerCase())),
    );

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalPages = Math.ceil(filteredFacilities.length / itemsPerPage);

    const paginatedFacilities = filteredFacilities.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    useEffect(() => {
        setLoading(true);
        const session = getSession();
        const token = session?.accessToken;

        fetchFacilities({ token })
            .then((value) => {
                setFacilities(value.data);
                setErrorMsg(null);
            })
            .catch((e) => setErrorMsg(e.message))
            .finally(() => setLoading(false));
    }, []);

    // Reset pagination when query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [query]);

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Fasilitas</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/facilities/create">
                            <Button size="sm">Tambah Fasilitas</Button>
                        </Link>
                    </div>
                </div>

                <Card className="shadow-none flex-1 flex flex-col">
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Daftar Fasilitas</CardTitle>
                        <FilterBar
                            search={{
                                value: query,
                                onChange: setQuery,
                                placeholder: "Cari nama atau deskripsi...",
                            }}
                        />
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <div className="overflow-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50">
                                    <tr className="border-b">
                                        <th className="text-left px-4 py-3 font-medium w-16">
                                            ID
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Nama Fasilitas
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Deskripsi
                                        </th>
                                        <th className="text-right px-4 py-3 font-medium w-24">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="[&>tr:last-child]:border-0">
                                    {loading ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                Memuat data...
                                            </td>
                                        </tr>
                                    ) : errorMsg ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="text-center py-8 text-destructive"
                                            >
                                                {errorMsg}
                                            </td>
                                        </tr>
                                    ) : paginatedFacilities.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="text-center py-8 text-muted-foreground"
                                            >
                                                Tidak ada fasilitas yang
                                                ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedFacilities.map((facility) => (
                                            <tr
                                                className="border-b"
                                                key={facility.id}
                                            >
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    #{facility.id}
                                                </td>
                                                <td className="px-4 py-3 font-medium">
                                                    {facility.name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground truncate max-w-75">
                                                    {facility.description ||
                                                        "-"}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link
                                                        href={`/admin/facilities/${facility.id}`}
                                                    >
                                                        <Button
                                                            size="icon-sm"
                                                            variant="outline"
                                                        >
                                                            <PencilIcon className="h-4 w-4" />
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

                    {totalPages > 1 && (
                        <div className="p-4 border-t mt-auto">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage((prev) =>
                                                    Math.max(1, prev - 1),
                                                );
                                            }}
                                            className={
                                                currentPage === 1
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>

                                    {Array.from({ length: totalPages }).map(
                                        (_, i) => (
                                            <PaginationItem key={i}>
                                                <PaginationLink
                                                    href="#"
                                                    isActive={
                                                        currentPage === i + 1
                                                    }
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setCurrentPage(i + 1);
                                                    }}
                                                >
                                                    {i + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ),
                                    )}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage((prev) =>
                                                    Math.min(
                                                        totalPages,
                                                        prev + 1,
                                                    ),
                                                );
                                            }}
                                            className={
                                                currentPage === totalPages
                                                    ? "pointer-events-none opacity-50"
                                                    : ""
                                            }
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}
