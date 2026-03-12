"use client";
import React from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { IconSurface } from "@/components/ui/icon-surface";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    SearchIcon,
    TriangleAlertIcon,
    WrenchIcon,
} from "lucide-react";
import { MOCK_COMPLAINTS, ComplaintStatus } from "@/mocks/complaints";

function Page() {
    const [search, setSearch] = React.useState("");
    const [date, setDate] = React.useState<DateRange | undefined>();
    const [status, setStatus] = React.useState<ComplaintStatus | "semua">(
        "semua",
    );
    const [page, setPage] = React.useState(1);

    const all = MOCK_COMPLAINTS.data;
    const pageSize = MOCK_COMPLAINTS.meta.limit;

    const filtered = React.useMemo(() => {
        let res = all;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            res = res.filter(
                (c) =>
                    c.complaint_id.toLowerCase().includes(q) ||
                    c.room_id.toLowerCase().includes(q) ||
                    c.tenant_name.toLowerCase().includes(q) ||
                    c.category.toLowerCase().includes(q) ||
                    c.description.toLowerCase().includes(q),
            );
        }
        if (status !== "semua") {
            res = res.filter((c) => c.status === status);
        }
        if (date?.from) {
            const from = date.from.getTime();
            const to = date.to?.getTime() ?? Number.POSITIVE_INFINITY;
            res = res.filter((c) => {
                const t = new Date(c.created_at).getTime();
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

    const totalCount = all.length;
    const openCount = all.filter((c) => c.status === "open").length;
    const progressCount = all.filter((c) => c.status === "in_progress").length;
    const resolvedCount = all.filter((c) => c.status === "resolved").length;

    const statusLabel = (s: ComplaintStatus) =>
        s === "open"
            ? "Pending"
            : s === "in_progress"
              ? "In Progress"
              : s === "resolved"
                ? "Completed"
                : "Ditolak";
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
                                Open
                            </p>
                            <p className="text-xl font-bold">{openCount}</p>
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
            <div className="flex gap-4">
                <InputGroup className="bg-card">
                    <InputGroupInput
                        placeholder="Cari komplain..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                    <InputGroupAddon>
                        <SearchIcon color="oklch(70.7% 0.022 261.325)" />
                    </InputGroupAddon>
                </InputGroup>

                <DateRangePicker value={date} onChange={setDate} />
                <Select
                    value={status}
                    onValueChange={(v) => {
                        setStatus(v as ComplaintStatus | "semua");
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Pilih Status">
                            {status === "semua" ? "Semua" : status}
                        </SelectValue>
                        <SelectContent>
                            <SelectItem value="semua">Semua</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in_progress">
                                Progress
                            </SelectItem>
                            <SelectItem value="resolved">Selesai</SelectItem>
                            <SelectItem value="rejected">Ditolak</SelectItem>
                        </SelectContent>
                    </SelectTrigger>
                </Select>
            </div>
            <div className="flex flex-col gap-4">
                {pageItems.map((c) => (
                    <ComplaintRow
                        key={c.complaint_id}
                        iconBgClass={categoryBg[c.category] ?? "bg-blue-100"}
                        iconColor={
                            categoryColor[c.category] ??
                            "oklch(62.3% 0.214 259.815)"
                        }
                        categoryLabel={c.category}
                        complaintId={c.complaint_id}
                        titleLabel={toTitle(c.description)}
                        roomLabel={`Kamar ${c.room_id}`}
                        createdLabel={format(
                            new Date(c.created_at),
                            "dd MMM yyyy, HH:mm",
                        )}
                        resolvedLabel={
                            c.status === "resolved"
                                ? format(
                                      new Date(c.updated_at),
                                      "dd MMM yyyy, HH:mm",
                                  )
                                : undefined
                        }
                        description={c.description}
                        status={c.status}
                        statusLabel={statusLabel(c.status)}
                    />
                ))}
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
