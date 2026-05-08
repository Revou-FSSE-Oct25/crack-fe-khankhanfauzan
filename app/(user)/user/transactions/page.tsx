"use client";

import { Card, CardContent } from "@/components/ui/card";
import { addDays, format } from "date-fns";
import {
    CircleCheckBigIcon,
    ClockIcon,
    CreditCardIcon,
    ReceiptIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { IconSurface } from "@/components/ui/icon-surface";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { MOCK_TRANSACTIONS, TxStatus } from "@/mocks/transactions";
import { FilterBar } from "@/components/filters/FilterBar";
import { Invoice } from "@/types/invoices";
import { fetchInvoices } from "@/services/transactions";
import { getSession } from "@/actions/auth";
import { formatDate, formatRupiah } from "@/utils/format";
import { BookingStatus } from "@/mocks/booking_history";

function Page() {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 20),
        to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
    });
    const [search, setSearch] = React.useState<string>("");
    const [status, setStatus] = React.useState<TxStatus | "semua">("semua");
    const [page, setPage] = React.useState<number>(1);
    const pageSize = 10;

    const filtered = React.useMemo(() => {
        return MOCK_TRANSACTIONS.filter((tx) => {
            const matchSearch =
                !search ||
                tx.id.toLowerCase().includes(search.toLowerCase()) ||
                tx.method.toLowerCase().includes(search.toLowerCase());
            const matchStatus = status === "semua" || tx.status === status;
            const inRange = (() => {
                if (!date?.from && !date?.to) return true;
                const d = tx.dueDate.getTime();
                if (date?.from && date?.to) {
                    return d >= date.from.getTime() && d <= date.to.getTime();
                }
                if (date?.from) return d >= date.from.getTime();
                if (date?.to) return d <= date.to.getTime();
                return true;
            })();
            return matchSearch && matchStatus && inRange;
        });
    }, [search, status, date]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const currentPage = Math.min(page, totalPages);
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = filtered.slice(start, end);
    void currentPage;

    function formatAmount(n: number) {
        return `Rp ${n.toLocaleString("id-ID")}`;
    }

    const [invoices, setInvoices] = useState<Invoice[] | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const session = getSession();
        const token = session?.accessToken;

        fetchInvoices({}, { token: token })
            .then((value) => setInvoices(value.data))
            .catch((e) => setErrorMsg(e.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="grid grid-cols-4 gap-4">
                <Card className="shadow-none">
                    <CardContent className="flex gap-2 justify-between">
                        <div className="flex flex-col">
                            <p className="text-sm text-muted-foreground">
                                Total Transaksi
                            </p>
                            <p className="text-xl font-bold">5</p>
                        </div>
                        <IconSurface
                            bgClass="bg-blue-100"
                            className="self-center"
                        >
                            <ReceiptIcon color="oklch(62.3% 0.214 259.815)" />
                        </IconSurface>
                    </CardContent>
                </Card>
                <Card className="shadow-none">
                    <CardContent className="flex gap-2 justify-between">
                        <div className="flex flex-col">
                            <p className="text-sm text-muted-foreground">
                                Dibayar
                            </p>
                            <p className="text-xl font-bold">2</p>
                        </div>
                        <IconSurface
                            bgClass="bg-green-100"
                            className="self-center"
                        >
                            <CircleCheckBigIcon color="oklch(72.3% 0.219 149.579)" />
                        </IconSurface>
                    </CardContent>
                </Card>
                <Card className="shadow-none">
                    <CardContent className="flex gap-2 justify-between">
                        <div className="flex flex-col">
                            <p className="text-sm text-muted-foreground">
                                Pending
                            </p>
                            <p className="text-xl font-bold">2</p>
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
                                Total Bayar
                            </p>
                            <p className="text-xl font-bold">Rp 3.0M</p>
                        </div>
                        <IconSurface
                            bgClass="bg-green-100"
                            className="self-center"
                        >
                            <CreditCardIcon color="oklch(72.3% 0.219 149.579)" />
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
                    placeholder: "Cari transaksi...",
                }}
                dateRange={{
                    value: date,
                    onChange: setDate,
                }}
                select={{
                    value: status,
                    onChange: (v) => {
                        setStatus(v as TxStatus | "semua");
                        setPage(1);
                    },
                    placeholder: "Pilih Status",
                    options: [
                        { value: "semua", label: "Semua" },
                        { value: "dibayar", label: "Dibayar" },
                        { value: "pending", label: "Pending" },
                        { value: "terlambat", label: "Terlambat" },
                        { value: "dibatalkan", label: "Dibatalkan" },
                    ],
                }}
            />
            <div className="flex flex-col gap-4">
                {/* {pageItems.map((tx) => (
                    <TransactionRow
                        key={tx.id}
                        iconBgClass={
                            tx.status === "dibayar"
                                ? "bg-green-100"
                                : tx.status === "pending"
                                  ? "bg-amber-100"
                                  : tx.status === "terlambat"
                                    ? "bg-red-100"
                                    : "bg-gray-100"
                        }
                        iconColor={
                            tx.status === "dibayar"
                                ? "oklch(72.3% 0.219 149.579)"
                                : tx.status === "pending"
                                  ? "orange"
                                  : tx.status === "terlambat"
                                    ? "red"
                                    : "gray"
                        }
                        trxId={tx.id}
                        methodLabel={tx.method}
                        dueDateLabel={format(tx.dueDate, "d MMM yyyy")}
                        paidDateLabel={
                            tx.paidDate
                                ? format(tx.paidDate, "d MMM yyyy")
                                : undefined
                        }
                        amountLabel={formatAmount(tx.amount)}
                        status={tx.status}
                        statusLabel={
                            tx.status === "dibayar"
                                ? "Dibayar"
                                : tx.status === "pending"
                                  ? "Pending"
                                  : tx.status === "terlambat"
                                    ? "Terlambat"
                                    : "Dibatalkan"
                        }
                        actionLabel={
                            tx.status === "pending" ? "Bayar" : undefined
                        }
                    />
                ))} */}
                {invoices?.map((invoice) => {
                    const iconBg =
                        invoice.booking.status === "confirmed"
                            ? "bg-green-100"
                            : invoice.booking.status === "pending_payment"
                              ? "bg-amber-100"
                              : invoice.booking.status === "cancelled"
                                ? "bg-red-100"
                                : "bg-gray-100";

                    const iconColor =
                        invoice.booking.status === "confirmed"
                            ? "oklch(72.3% 0.219 149.579)"
                            : invoice.booking.status === "pending_payment"
                              ? "orange"
                              : invoice.booking.status === "cancelled"
                                ? "red"
                                : "gray";

                    const statusLabel =
                        invoice.booking.status === "confirmed"
                            ? "Dikonfirmasi"
                            : invoice.booking.status === "pending_payment"
                              ? "Pembayaran tertunda"
                              : invoice.booking.status === "cancelled"
                                ? "Dibatalkan"
                                : "Selesai";

                    /**
                     * pending_payment
                        confirmed
                        cancelled
                        completed
                     * 
                     */

                    const actionLabel =
                        invoice.booking.status === "pending_payment"
                            ? "Bayar"
                            : undefined;
                    return (
                        <TransactionRow
                            key={invoice.id}
                            iconBgClass={iconBg}
                            iconColor={iconColor}
                            trxId={invoice.id}
                            bookingId={invoice.bookingId}
                            methodLabel={
                                invoice.transactions[0].paymentMethod || "-"
                            }
                            dueDateLabel={formatDate(invoice.dueDate, {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                            paidDateLabel={formatDate(
                                invoice.transactions[0].paidAt,
                                {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                },
                            )}
                            amountLabel={formatRupiah(
                                invoice.transactions[0].amount,
                            )}
                            status={invoice.booking.status as BookingStatus}
                            statusLabel={statusLabel}
                            actionLabel={actionLabel}
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
