"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchUsers } from "@/services/users";
import type { User } from "@/types/users";
import type { BasePaginationMeta } from "@/types/types";
import type { DateRange } from "react-day-picker";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { FilterBar } from "@/components/filters/FilterBar";
import { Fragment, useEffect, useMemo, useState } from "react";
import { getSession } from "@/actions/auth";

export default function Page() {
    const [users, setUsers] = useState<
        {
            id: string;
            name: string;
            email: string;
            status: "active" | "inactive";
            joinedAt?: string | null;
            role?: string;
        }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [query, setQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState<"semua" | "admin" | "tenant">(
        "semua",
    );
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [meta, setMeta] = useState<BasePaginationMeta | null>(null);

    // Debounce query
    const [debouncedQuery, setDebouncedQuery] = useState("");
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 500);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        let aborted = false;
        async function load() {
            setLoading(true);
            setError(null);
            try {
                const session = getSession();
                const token = session?.accessToken;

                const resp = await fetchUsers(
                    {
                        page,
                        perPage,
                        search: debouncedQuery || undefined,
                        role: roleFilter === "semua" ? undefined : roleFilter,
                    },
                    { token },
                );

                if (!aborted) {
                    setMeta(resp?.meta ?? null);
                    setUsers(
                        (resp?.data || []).map((u: User) => ({
                            id: u.id,
                            name: u.profile?.fullName || "No Name",
                            email: u.email,
                            status: "active", // Default status, replace with actual status if available
                            joinedAt: u.createdAt ?? null,
                            role: u.role,
                        })),
                    );
                }
            } catch (e: any) {
                if (!aborted) {
                    console.error("Fetch Users Error:", e);
                    setError(e.message || "Gagal memuat data pengguna");
                }
            } finally {
                if (!aborted) {
                    setLoading(false);
                }
            }
        }
        load();
        return () => {
            aborted = true;
        };
    }, [page, perPage, debouncedQuery, roleFilter]);

    const filtered = useMemo(() => {
        let arr = users;
        return arr;
    }, [users]);

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
                    <h1 className="text-xl font-semibold">Pengguna</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/users/create">
                            <Button size="sm">Tambah Pengguna</Button>
                        </Link>
                        <Button size="sm" variant="outline">
                            Impor CSV
                        </Button>
                    </div>
                </div>

                <Card className="shadow-none">
                    <CardHeader className="flex-row items-center justify-between">
                        <CardTitle>Daftar Pengguna</CardTitle>
                        <FilterBar
                            search={{
                                value: query,
                                onChange: (v) => {
                                    setQuery(v);
                                    setPage(1);
                                },
                                placeholder: "Cari nama atau email...",
                            }}
                            // dateRange={{
                            //     value: date,
                            //     onChange: setDate,
                            // }}
                            select={{
                                value: roleFilter,
                                onChange: (v) => {
                                    setRoleFilter(
                                        v as "semua" | "admin" | "tenant",
                                    );
                                    setPage(1);
                                },
                                placeholder: "Peran",
                                options: [
                                    { value: "semua", label: "Semua" },
                                    { value: "admin", label: "Admin" },
                                    { value: "tenant", label: "Tenant" },
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
                                            Nama
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Email
                                        </th>
                                        <th className="text-left px-4 py-3 font-medium">
                                            Peran
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
                                        Array.from({ length: 3 }).map(
                                            (_, i) => (
                                                <tr
                                                    className="border-b"
                                                    key={`sk-${i}`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-4 w-40" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-4 w-56" />
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Skeleton className="h-5 w-16 rounded" />
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <Skeleton className="h-6 w-16 rounded" />
                                                    </td>
                                                </tr>
                                            ),
                                        )}
                                    {!loading && error && (
                                        <tr className="border-b">
                                            <td
                                                className="px-4 py-3"
                                                colSpan={4}
                                            >
                                                {error}
                                            </td>
                                        </tr>
                                    )}
                                    {!loading &&
                                        !error &&
                                        filtered.length === 0 && (
                                            <tr className="border-b">
                                                <td
                                                    className="px-4 py-3"
                                                    colSpan={4}
                                                >
                                                    Tidak ada data
                                                </td>
                                            </tr>
                                        )}
                                    {!loading &&
                                        !error &&
                                        filtered.map((u) => (
                                            <tr className="border-b" key={u.id}>
                                                <td className="px-4 py-3">
                                                    {u.name}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">
                                                    {u.email}
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground capitalize">
                                                    {u.role}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {u.status === "active" ? (
                                                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs px-2 py-0.5 rounded bg-zinc-100 text-zinc-700">
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link
                                                        href={`/admin/users/${u.id}`}
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
