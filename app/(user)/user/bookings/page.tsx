 "use client";
import React from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { BookingRow } from "@/components/bookings/BookingRow";
import { MOCK_BOOKING_HISTORY, type BookingStatus } from "@/mocks/booking_history";
import { CalendarIcon, ClockIcon, CircleCheckBigIcon, CreditCardIcon, SearchIcon } from "lucide-react";
import { format } from "date-fns";

function Page() {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState<BookingStatus | "semua">("semua");
    const [page, setPage] = React.useState(1);

    const all = MOCK_BOOKING_HISTORY.data;
    const pageSize = MOCK_BOOKING_HISTORY.meta.limit;

    const filtered = React.useMemo(() => {
        let res = all;
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            res = res.filter(
                (b) =>
                    b.booking_id.toLowerCase().includes(q) ||
                    b.room.room_id.toLowerCase().includes(q) ||
                    b.room.room_type.toLowerCase().includes(q),
            );
        }
        if (status !== "semua") {
            res = res.filter((b) => b.status === status);
        }
        return res;
    }, [all, search, status]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = filtered.slice(start, end);

    const totalCount = all.length;
    const activeCount = all.filter((b) => {
        const now = new Date();
        const from = new Date(b.period.start_date).getTime();
        const to = new Date(b.period.end_date).getTime();
        return b.status !== "cancelled" && now.getTime() >= from && now.getTime() <= to;
    }).length;
    const completedCount = all.filter((b) => b.status === "completed").length;
    const totalPaid = all.reduce((sum, b) => sum + (b.total_paid ?? 0), 0);

    function formatAmount(n: number) {
        return `Rp ${n.toLocaleString("id-ID")}`;
    }

    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="grid grid-cols-4 gap-4">
                <StatCard icon={CalendarIcon} title="Total Booking" value={totalCount} iconBgClass="bg-blue-50" iconColor="oklch(62.3% 0.214 259.815)" />
                <StatCard icon={ClockIcon} title="Aktif" value={activeCount} iconBgClass="bg-emerald-50" iconColor="oklch(72.3% 0.219 149.579)" />
                <StatCard icon={CircleCheckBigIcon} title="Selesai" value={completedCount} iconBgClass="bg-blue-50" iconColor="oklch(62.3% 0.214 259.815)" />
                <StatCard icon={CreditCardIcon} title="Total Bayar" value={formatAmount(totalPaid)} iconBgClass="bg-emerald-50" iconColor="oklch(72.3% 0.219 149.579)" />
            </div>
            <div className="flex gap-4">
                <InputGroup className="bg-card">
                    <InputGroupInput
                        placeholder="Cari booking..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />
                    <InputGroupAddon>
                        <SearchIcon />
                    </InputGroupAddon>
                </InputGroup>
                <Select
                    value={status}
                    onValueChange={(v) => {
                        setStatus(v as BookingStatus | "semua");
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Pilih Status">
                            {status === "semua" ? "Semua" : status}
                        </SelectValue>
                        <SelectContent>
                            <SelectItem value="semua">Semua</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                            <SelectItem value="expired">Expired</SelectItem>
                        </SelectContent>
                    </SelectTrigger>
                </Select>
            </div>
            <div className="flex flex-col gap-4">
                {pageItems.map((b) => {
                    const isMonthly = b.period.rent_type === "monthly";
                    const durLabel = isMonthly ? `${b.period.duration} Bulan` : `${b.period.duration} Hari`;
                    const priceLabel = isMonthly ? `Rp ${(b.total_paid ?? 0) / Math.max(1, b.period.duration)}/bln` : `Rp ${(b.total_paid ?? 0) / Math.max(1, b.period.duration)}/hari`;
                    return (
                        <BookingRow
                            key={b.booking_id}
                            roomLabel={`Kamar ${b.room.room_id}`}
                            floorLabel={`Lt. ${b.room.floor}`}
                            bookingIdLabel={b.booking_id}
                            startDateLabel={format(new Date(b.period.start_date), "d MMM yyyy")}
                            endDateLabel={format(new Date(b.period.end_date), "d MMM yyyy")}
                            durationLabel={durLabel}
                            priceLabel={priceLabel}
                            amountLabel={formatAmount(b.total_paid ?? 0)}
                            status={b.status}
                            statusLabel={
                                b.status === "completed"
                                    ? "Selesai"
                                    : b.status === "cancelled"
                                      ? "Dibatalkan"
                                      : "Expired"
                            }
                            actionLabel={b.status === "cancelled" ? undefined : b.status === "completed" ? undefined : "Bayar"}
                        />
                    );
                })}
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
