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
import { Skeleton } from "@/components/ui/skeleton";

import { ApiPaginatedResponse } from "@/types/types";

export default function Page() {
    const [query, setQuery] = useState("");
    const [debouncedQuery, setDebouncedQuery] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [facilitiesResponse, setFacilitiesResponse] =
        useState<ApiPaginatedResponse<Facility[]> | null>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
            setCurrentPage(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        setLoading(true);
        const session = getSession();
        const token = session?.accessToken;

        fetchFacilities(
            {
                page: currentPage,
                perPage: itemsPerPage,
                search: debouncedQuery,
            },
            { token },
        )
            .then((value) => {
                setFacilitiesResponse(value);
                setErrorMsg(null);
            })
            .catch((e) => setErrorMsg(e.message))
            .finally(() => setLoading(false));
    }, [currentPage, debouncedQuery]);

    const paginatedFacilities = facilitiesResponse?.data || [];
    const totalPages = facilitiesResponse?.meta?.totalPages || 1;

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
                                        Array.from({ length: 5 }).map(
                                            (_, i) => (
                                                <tr
                                                    className="border-b"
                                                    key={`sk-${i}`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-4 w-12" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-4 w-32" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-4 w-48" />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Skeleton className="h-8 w-8 ml-auto rounded" />
                                                    </td>
                                                </tr>
                                            ),
                                        )
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
