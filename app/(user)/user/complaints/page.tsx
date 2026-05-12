"use client";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import { IconSurface } from "@/components/ui/icon-surface";
import { Button } from "@/components/ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { ComplaintRow } from "@/components/complaints/ComplaintRow";
import {
    CircleCheckBigIcon,
    ClockIcon,
    TriangleAlertIcon,
    WrenchIcon,
    PlusIcon,
} from "lucide-react";
import { FilterBar } from "@/components/filters/FilterBar";
import { getSession } from "@/actions/auth";
import { fetchMaintenances } from "@/services/maintenances";
import { ComplaintStatus, Maintenance } from "@/types/maintenances";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { EmptyState } from "@/components/ui/empty-state";

import { ApiPaginatedResponse } from "@/types/types";

function Page() {
    const [search, setSearch] = React.useState("");
    const [debouncedSearch, setDebouncedSearch] = React.useState("");
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [status, setStatus] = React.useState<ComplaintStatus | "semua">(
        "semua",
    );
    const [page, setPage] = React.useState(1);
    const pageSize = 10;

    const [maintenancesResponse, setMaintenancesResponse] =
        useState<ApiPaginatedResponse<Maintenance[]> | null>(null);
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
        fetchMaintenances(
            {
                page,
                perPage: pageSize,
                search: debouncedSearch,
                status: status === "semua" ? undefined : status,
                startDate: date?.from ? date.from.toISOString() : undefined,
                endDate: date?.to ? date.to.toISOString() : undefined,
            },
            { token: session?.accessToken },
        )
            .then((res) => setMaintenancesResponse(res))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [debouncedSearch, status, page, date]);

    const pageItems = maintenancesResponse?.data || [];
    const totalPages = maintenancesResponse?.meta?.totalPages || 1;
    const currentPage = maintenancesResponse?.meta?.page || 1;

    // TODO: Need real dashboard stats for total, pending, progress, resolved
    const totalCount = maintenancesResponse?.meta?.totalItems || 0;
    const pendingCount = pageItems.filter((c) => c.status === "open").length;
    const progressCount = pageItems.filter(
        (c) => c.status === "in_progress",
    ).length;
    const resolvedCount = pageItems.filter(
        (c) => c.status === "resolved",
    ).length;

    const statusLabel = (s: ComplaintStatus) =>
        s === "open"
            ? "Open"
            : s === "in_progress"
              ? "In Progress"
              : s === "resolved"
                ? "Resolved"
                : "Closed";
    const toTitle = (desc: string) => {
        const first = desc.split(",")[0]?.trim() || desc.trim();
        return first.charAt(0).toUpperCase() + first.slice(1);
    };
    const categoryBg: Record<string, string> = {
        plumbing: "bg-blue-100",
        air_conditioning: "bg-cyan-100",
        internet: "bg-purple-100",
        electrical: "bg-amber-100",
        cleaning: "bg-pink-100",
        security: "bg-gray-100",
        appliance: "bg-indigo-100",
    };
    const categoryColor: Record<string, string> = {
        plumbing: "oklch(62.3% 0.214 259.815)",
        air_conditioning: "oklch(62.3% 0.214 210.815)",
        internet: "oklch(62.3% 0.214 310.815)",
        electrical: "orange",
        cleaning: "oklch(62.3% 0.214 340.815)",
        security: "gray",
        appliance: "oklch(62.3% 0.214 261.325)",
    };

    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Komplain</h1>
                <Link href="/user/complaints/create">
                    <Button className="rounded-full">
                        <PlusIcon className="w-4 h-4 mr-2" /> Buat Komplain
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-4 gap-4">
                <Card className="shadow-none">
                    <CardContent className="flex gap-2 justify-between">
                        <div className="flex flex-col">
                            <p className="text-sm text-muted-foreground">
                                Total
                            </p>
                            <p className="text-xl font-bold">{totalCount}</p>
                        </div>
                        <IconSurface
                            bgClass="oklch(96.7% 0.003 264.542)"
                            className="self-center"
                        >
                            <WrenchIcon color="oklch(70.7% 0.022 261.325)" />
                        </IconSurface>
                    </CardContent>
                </Card>
                <Card className="shadow-none">
                    <CardContent className="flex gap-2 justify-between">
                        <div className="flex flex-col">
                            <p className="text-sm text-muted-foreground">
                                Pending
                            </p>
                            <p className="text-xl font-bold">{pendingCount}</p>
                        </div>
                        <IconSurface
                            bgClass="bg-amber-100"
                            className="self-center"
                        >
                            <ClockIcon color="oklch(76.9% 0.188 70.08)" />
                        </IconSurface>
                    </CardContent>
                </Card>
                <Card className="shadow-none">
                    <CardContent className="flex gap-2 justify-between">
                        <div className="flex flex-col">
                            <p className="text-sm text-muted-foreground">
                                Progress
                            </p>
                            <p className="text-xl font-bold">{progressCount}</p>
                        </div>
                        <IconSurface
                            bgClass="bg-blue-100"
                            className="self-center"
                        >
                            <TriangleAlertIcon color="oklch(62.3% 0.214 259.815)" />
                        </IconSurface>
                    </CardContent>
                </Card>
                <Card className="shadow-none">
                    <CardContent className="flex gap-2 justify-between">
                        <div className="flex flex-col">
                            <p className="text-sm text-muted-foreground">
                                Selesai
                            </p>
                            <p className="text-xl font-bold">{resolvedCount}</p>
                        </div>
                        <IconSurface
                            bgClass="bg-green-100"
                            className="self-center"
                        >
                            <CircleCheckBigIcon color="oklch(72.3% 0.219 149.579)" />
                        </IconSurface>
                    </CardContent>
                </Card>
            </div>
            <FilterBar
                search={{
                    value: search,
                    onChange: (v) => {
                        setSearch(v);
                        setPage(1);
                    },
                    placeholder: "Cari komplain...",
                    iconColor: "oklch(70.7% 0.022 261.325)",
                }}
                dateRange={{
                    value: date,
                    onChange: setDate,
                }}
                select={{
                    value: status,
                    onChange: (v) => {
                        setStatus(v as ComplaintStatus | "semua");
                        setPage(1);
                    },
                    placeholder: "Pilih Status",
                    options: [
                        { value: "semua", label: "Semua" },
                        { value: "open", label: "Open" },
                        { value: "in_progress", label: "Progress" },
                        { value: "resolved", label: "Selesai" },
                        { value: "rejected", label: "Ditolak" },
                    ],
                }}
            />
            <div className="flex flex-col gap-4">
                {loading ? (
                    <div className="flex justify-center p-8">
                        <Spinner />
                    </div>
                ) : pageItems.length > 0 ? (
                    pageItems.map((c) => (
                        <ComplaintRow
                            key={c.id}
                            iconBgClass={
                                categoryBg[c.category] ?? "bg-blue-100"
                            }
                            iconColor={
                                categoryColor[c.category] ??
                                "oklch(62.3% 0.214 259.815)"
                            }
                            categoryLabel={c.category}
                            complaintId={c.id}
                            titleLabel={toTitle(c.description)}
                            roomLabel={`Kamar ${c.room?.roomNumber || c.roomId || "-"}`}
                            createdLabel={format(
                                new Date(c.createdAt),
                                "dd MMM yyyy, HH:mm",
                            )}
                            resolvedLabel={
                                c.status === "resolved" && c.resolvedAt
                                    ? format(
                                          new Date(c.resolvedAt),
                                          "dd MMM yyyy, HH:mm",
                                      )
                                    : undefined
                            }
                            description={c.description}
                            status={c.status as any}
                            statusLabel={statusLabel(c.status)}
                            detailHref={`/user/complaints/${c.id}`}
                        />
                    ))
                ) : (
                    <EmptyState
                        icon={WrenchIcon}
                        title="Belum Ada Komplain"
                        description="Anda belum memiliki riwayat komplain apa pun saat ini."
                        className="p-4"
                    />
                )}
                <Pagination className="mt-2">
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
                        {currentPage > 2 && (
                            <>
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(1);
                                        }}
                                    >
                                        1
                                    </PaginationLink>
                                </PaginationItem>
                                {currentPage > 3 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}
                            </>
                        )}
                        {[currentPage - 1, currentPage, currentPage + 1]
                            .filter((n) => n >= 1 && n <= totalPages)
                            .map((n) => (
                                <PaginationItem key={n}>
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
                            ))}
                        {currentPage < totalPages - 1 && (
                            <>
                                {currentPage < totalPages - 2 && (
                                    <PaginationItem>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                )}
                                <PaginationItem>
                                    <PaginationLink
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setPage(totalPages);
                                        }}
                                    >
                                        {totalPages}
                                    </PaginationLink>
                                </PaginationItem>
                            </>
                        )}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPage((p) => Math.min(totalPages, p + 1));
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    );
}

export default Page;
