"use client";

import { Card, CardContent } from "@/components/ui/card";
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
import { addDays, format } from "date-fns";
import {
    CircleCheckBigIcon,
    ClockIcon,
    CreditCardIcon,
    ReceiptIcon,
    SearchIcon,
} from "lucide-react";
import React from "react";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
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
            <div className="flex gap-4">
                <InputGroup className="bg-card">
                    <InputGroupInput
                        placeholder="Cari transaksi..."
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

                <DateRangePicker value={date} onChange={setDate} />
                <Select
                    value={status}
                    onValueChange={(v) => {
                        setStatus(v as TxStatus | "semua");
                        setPage(1);
                    }}
                >
                    <SelectTrigger className="bg-card">
                        <SelectValue placeholder="Pilih Status">
                            {status === "semua" ? "Semua" : status}
                        </SelectValue>
                        <SelectContent>
                            <SelectItem value="semua">Semua</SelectItem>
                            <SelectItem value="dibayar">Dibayar</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="terlambat">Terlambat</SelectItem>
                            <SelectItem value="dibatalkan">
                                Dibatalkan
                            </SelectItem>
                        </SelectContent>
                    </SelectTrigger>
                </Select>
            </div>
            <div className="flex flex-col gap-4">
                {pageItems.map((tx) => (
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
