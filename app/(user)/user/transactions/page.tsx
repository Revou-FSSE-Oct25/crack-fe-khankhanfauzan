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
import { EmptyState } from "@/components/ui/empty-state";

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
                                Total Tagihan
                            </p>
                            <p className="text-xl font-bold">
                                {invoices?.length || 0}
                            </p>
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
                            <p className="text-xl font-bold">
                                {invoices?.filter((i) => i.status === "paid")
                                    .length || 0}
                            </p>
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
                            <p className="text-xl font-bold">
                                {invoices?.filter((i) => i.status === "unpaid")
                                    .length || 0}
                            </p>
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
                            <p className="text-xl font-bold">
                                {formatRupiah(
                                    invoices
                                        ?.filter((i) => i.status === "paid")
                                        .reduce(
                                            (acc, curr) =>
                                                acc + Number(curr.totalAmount),
                                            0,
                                        ) || 0,
                                    { notation: "compact" },
                                )}
                            </p>
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
                    placeholder: "Cari tagihan...",
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
                        { value: "unpaid", label: "Belum Bayar" },
                        { value: "partialy_paid", label: "Dibayar Sebagian" },
                        { value: "paid", label: "Dibayar" },
                        { value: "expired", label: "Expired" },
                    ],
                }}
            />
            <div className="flex flex-col gap-4">
                {invoices && invoices.length > 0 ? (
                    invoices.map((invoice) => {
                        const iconBg =
                            invoice.booking.status === "confirmed"
                                ? "bg-green-100"
                                : invoice.booking.status === "pending_payment"
                                  ? "bg-amber-100"
                                  : invoice.booking.status ===
                                      "pending_approval"
                                    ? "bg-purple-100"
                                    : invoice.booking.status === "cancelled"
                                      ? "bg-red-100"
                                      : "bg-gray-100";

                        const iconColor =
                            invoice.booking.status === "confirmed"
                                ? "oklch(72.3% 0.219 149.579)"
                                : invoice.booking.status === "pending_payment"
                                  ? "orange"
                                  : invoice.booking.status ===
                                      "pending_approval"
                                    ? "purple"
                                    : invoice.booking.status === "cancelled"
                                      ? "red"
                                      : "gray";

                        const statusLabel =
                            invoice.status === "unpaid"
                                ? "Belum Dibayar"
                                : invoice.status === "partially_paid"
                                  ? "Dibayar Sebagian"
                                  : invoice.status === "paid"
                                    ? "Dibayar"
                                    : invoice.status === "expired"
                                      ? "Expired"
                                      : "Dibatalkan";

                        const actionLabel =
                            (invoice.status === "unpaid" ||
                                invoice.status === "partially_paid") &&
                            invoice.booking.status !== "pending_approval"
                                ? "Bayar"
                                : undefined;
                        const latestTransaction =
                            invoice.transactions &&
                            invoice.transactions.length > 0
                                ? invoice.transactions.reduce(
                                      (latest, current) =>
                                          new Date(current.createdAt) >
                                          new Date(latest.createdAt)
                                              ? current
                                              : latest,
                                  )
                                : null;

                        return (
                            <TransactionRow
                                key={invoice.id}
                                iconBgClass={iconBg}
                                iconColor={iconColor}
                                trxId={invoice.id}
                                bookingId={invoice.bookingId}
                                methodLabel={
                                    latestTransaction?.paymentMethod || "-"
                                }
                                dueDateLabel={
                                    invoice.dueDate
                                        ? formatDate(invoice.dueDate, {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : "-"
                                }
                                paidDateLabel={
                                    latestTransaction?.paidAt
                                        ? formatDate(latestTransaction.paidAt, {
                                              day: "numeric",
                                              month: "long",
                                              year: "numeric",
                                          })
                                        : "-"
                                }
                                amountLabel={
                                    invoice.totalAmount
                                        ? formatRupiah(invoice.totalAmount)
                                        : "-"
                                }
                                status={invoice.status}
                                statusLabel={statusLabel}
                                actionLabel={actionLabel}
                            />
                        );
                    })
                ) : (
                    <EmptyState
                        icon={ReceiptIcon}
                        title="Belum Ada Transaksi"
                        description="Anda belum memiliki riwayat transaksi pembayaran apa pun saat ini."
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
