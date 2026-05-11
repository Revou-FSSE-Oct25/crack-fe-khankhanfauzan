"use client";
import React, { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/StatCard";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { BookingRow } from "@/components/bookings/BookingRow";
import {
    MOCK_BOOKING_HISTORY,
    type BookingStatus,
} from "@/mocks/booking_history";
import {
    CalendarIcon,
    ClockIcon,
    CircleCheckBigIcon,
    CreditCardIcon,
    PlusIcon,
} from "lucide-react";
import { FilterBar } from "@/components/filters/FilterBar";
import type { DateRange } from "react-day-picker";
import { fetchBookings } from "@/services/bookings";
import { getSession } from "@/actions/auth";
import { Booking } from "@/types/bookings";
import { formatDate, formatRupiah } from "@/utils/format";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function Page() {
    const [search, setSearch] = React.useState("");
    const [status, setStatus] = React.useState<BookingStatus | "semua">(
        "semua",
    );
    const [page, setPage] = React.useState(1);
    const [date, setDate] = React.useState<DateRange | undefined>();

    const router = useRouter();

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

    const [booking, setBooking] = useState<Booking[] | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const session = getSession();
        const token = session?.accessToken;

        fetchBookings({}, { token: token })
            .then((value) => setBooking(value.data))
            .catch((e) => setErrorMsg(e.message))
            .finally(() => setLoading(false));

    }, []);

    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Booking</h1>
                <Link href="/rooms">
                    <Button className="rounded-full">
                        <PlusIcon className="w-4 h-4 mr-2" /> Booking Baru
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-4 gap-4">
                <StatCard
                    icon={CalendarIcon}
                    title="Total Booking"
                    value={booking?.length || 0}
                    iconBgClass="bg-blue-50"
                    iconColor="oklch(62.3% 0.214 259.815)"
                />
                <StatCard
                    icon={ClockIcon}
                    title="Aktif"
                    value={
                        booking?.filter((b) => b.status === "confirmed")
                            .length || 0
                    }
                    iconBgClass="bg-emerald-50"
                    iconColor="oklch(72.3% 0.219 149.579)"
                />
                <StatCard
                    icon={CircleCheckBigIcon}
                    title="Selesai"
                    value={
                        booking?.filter((b) => b.status === "completed")
                            .length || 0
                    }
                    iconBgClass="bg-blue-50"
                    iconColor="oklch(62.3% 0.214 259.815)"
                />
                <StatCard
                    icon={CreditCardIcon}
                    title="Total Bayar"
                    value={formatRupiah(
                        booking
                            ?.filter(
                                (b) =>
                                    b.status === "confirmed" ||
                                    b.status === "completed",
                            )
                            .reduce(
                                (sum, b) => sum + Number(b.totalPrice),
                                0,
                            ) || 0,
                        { notation: "compact" },
                    )}
                    iconBgClass="bg-emerald-50"
                    iconColor="oklch(72.3% 0.219 149.579)"
                />
            </div>
            <FilterBar
                search={{
                    value: search,
                    onChange: (v) => {
                        setSearch(v);
                        setPage(1);
                    },
                    placeholder: "Cari booking...",
                }}
                dateRange={{
                    value: date,
                    onChange: setDate,
                }}
                select={{
                    value: status,
                    onChange: (v) => {
                        setStatus(v as BookingStatus | "semua");
                        setPage(1);
                    },
                    placeholder: "Pilih Status",
                    options: [
                        { value: "semua", label: "Semua" },
                        { value: "completed", label: "Completed" },
                        { value: "cancelled", label: "Cancelled" },
                        { value: "expired", label: "Expired" },
                    ],
                }}
            />
            <div className="flex flex-col gap-4">
                {booking?.map((value) => {
                    return (
                        <BookingRow
                            key={value.id}
                            roomLabel={`Kamar ${value.room?.roomNumber}`}
                            floorLabel={`Lt. ${value.room?.floor}`}
                            bookingIdLabel={value.id}
                            startDateLabel={formatDate(value.startDate, {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                            endDateLabel={formatDate(value.endDate, {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                            durationLabel={`${value.duration}`}
                            priceLabel={formatRupiah(value.pricePerUnit)}
                            amountLabel={formatRupiah(value.totalPrice)}
                            status={
                                value.status === "completed"
                                    ? "completed"
                                    : value.status === "cancelled"
                                      ? "cancelled"
                                      : value.status === "confirmed"
                                        ? "confirmed"
                                        : "pending_payment"
                            }
                            actionLabel={
                                value.status === "cancelled"
                                    ? undefined
                                    : value.status === "completed"
                                      ? undefined
                                      : value.status === "confirmed"
                                        ? undefined
                                        : "Bayar"
                            }
                            onAction={() => {
                                router.push(
                                    `/user/bookings/${value.id}/payment`,
                                );
                            }}
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
