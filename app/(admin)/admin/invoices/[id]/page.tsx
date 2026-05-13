"use client";

import { getSession } from "@/actions/auth";
import { getInvoiceById, verifyTransaction } from "@/services/transactions";
import { Invoice } from "@/types/invoices";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { formatDate, formatRupiah, formatDurationUnit } from "@/utils/format";
import Link from "next/link";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import {
    CalendarIcon,
    CreditCardIcon,
    FileTextIcon,
    HomeIcon,
    ReceiptIcon,
    ArrowLeftIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
    InfoIcon,
    ShieldAlertIcon,
    UserIcon,
    ImageIcon,
} from "lucide-react";

const badgeClassByStatus: Record<string, string> = {
    paid: "bg-green-50 border-green-200 text-green-900",
    unpaid: "bg-amber-50 border-amber-200 text-amber-900",
    expired: "bg-gray-50 border-gray-200 text-gray-900",
    partially_paid: "bg-blue-50 border-blue-200 text-blue-900",
    cancelled: "bg-red-50 border-red-200 text-red-900",
};

const formatInvoiceStatusLabel = (status: string) => {
    switch (status) {
        case "unpaid":
            return "Belum Dibayar";
        case "paid":
            return "Lunas";
        case "expired":
            return "Kedaluwarsa";
        case "partially_paid":
            return "Dibayar Sebagian";
        case "cancelled":
            return "Dibatalkan";
        default:
            return status;
    }
};

const formatTransactionStatusLabel = (status: string) => {
    switch (status) {
        case "pending":
            return "Menunggu Verifikasi";
        case "verified":
            return "Berhasil diverifikasi";
        case "rejected":
            return "Ditolak";
        default:
            return status;
    }
};

const transactionStatusIcon = (status: string) => {
    switch (status) {
        case "pending":
            return <ClockIcon className="w-4 h-4 text-amber-600" />;
        case "verified":
            return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
        case "rejected":
            return <XCircleIcon className="w-4 h-4 text-red-600" />;
        default:
            return <InfoIcon className="w-4 h-4 text-gray-600" />;
    }
};

export default function InvoiceDetailPage() {
    const params = useParams();
    const id = String(params?.id ?? "");

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);

    // Form state for verification
    const { control, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            status: "verified" as "verified" | "rejected",
            rejectReason: "",
        },
    });
    const formStatus = watch("status");

    const fetchInvoiceData = () => {
        const session = getSession();
        const token = session?.accessToken;

        getInvoiceById(id, { token: token })
            .then((value) => setInvoice(value.data))
            .catch((e) => setErrorMsg(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchInvoiceData();
    }, [id]);

    const onSubmitVerification = async (data: any, transactionId: string) => {
        setUpdating(true);
        try {
            const session = getSession();
            const token = session?.accessToken;

            const payload = {
                status: data.status,
                rejectReason:
                    data.status === "rejected" ? data.rejectReason : undefined,
            };

            await verifyTransaction(transactionId, payload as any, { token });
            toast.success("Transaksi berhasil diverifikasi");
            reset();
            fetchInvoiceData(); // Refresh data to get updated status
        } catch (error: any) {
            toast.error(error.message || "Gagal memverifikasi transaksi");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <Spinner className="flex h-full mx-auto justify-center min-h-[50vh]" />
        );
    }

    if (errorMsg || !invoice) {
        return (
            <div className="p-4 max-w-7xl mx-auto text-center mt-10">
                <p className="text-red-500 mb-4">
                    {errorMsg || "Tagihan tidak ditemukan"}
                </p>
                <Link href="/admin/invoices">
                    <Button variant="outline">Kembali ke Daftar Tagihan</Button>
                </Link>
            </div>
        );
    }

    const booking = invoice.booking;
    const room = booking?.room;
    // @ts-ignore
    const tenant = booking?.tenant;

    // Sort transactions by date descending so the latest is on top
    const transactions = [...(invoice.transactions || [])].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latestTransaction = transactions.length > 0 ? transactions[0] : null;

    // Kalkulasi total yang sudah dibayar (hanya transaksi yang sukses/verified)
    const totalPaid = (invoice.transactions || [])
        .filter((t) => t.status === "verified")
        .reduce((sum, t) => sum + Number(t.amount), 0);

    const remainingAmount =
        Number(invoice.totalAmount) +
        Number(invoice.penaltyAmount || 0) -
        totalPaid;

    return (
        <div className="p-4 mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/invoices">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Button>
                </Link>
                <div className="flex-1 flex items-center justify-between">
                    <h1 className="text-lg sm:text-xl font-semibold">
                        Detail Tagihan
                    </h1>
                    <Badge
                        variant="secondary"
                        className={
                            badgeClassByStatus[invoice.status] ||
                            "bg-gray-50 border-gray-200 text-gray-900"
                        }
                    >
                        {formatInvoiceStatusLabel(invoice.status)}
                    </Badge>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Riwayat Pembayaran / Transaksi */}
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <ReceiptIcon className="w-4 h-4 text-primary" />
                                Informasi Pembayaran
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {transactions.length === 0 ? (
                                <div className="text-center py-6 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                                    <ReceiptIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm font-medium">
                                        Belum Ada Pembayaran
                                    </p>
                                    <p className="text-xs">
                                        Silakan lakukan pembayaran untuk tagihan
                                        ini.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {transactions.map((trx, index) => (
                                        <div
                                            key={trx.id}
                                            className={`p-4 rounded-lg border ${index === 0 ? "border-primary/20 bg-primary/5" : "border-gray-100 bg-gray-50"}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className="text-sm font-medium mb-1 flex items-center gap-2">
                                                        {trx.paymentMethod ||
                                                            "Transfer Bank"}
                                                        {index === 0 && (
                                                            <Badge
                                                                variant="outline"
                                                                className="text-[10px] h-5 px-1.5"
                                                            >
                                                                Terbaru
                                                            </Badge>
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(
                                                            trx.createdAt,
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border text-xs font-medium">
                                                    {transactionStatusIcon(
                                                        trx.status,
                                                    )}
                                                    <span
                                                        className={
                                                            trx.status ===
                                                            "verified"
                                                                ? "text-green-700"
                                                                : trx.status ===
                                                                    "rejected"
                                                                  ? "text-red-700"
                                                                  : "text-amber-700"
                                                        }
                                                    >
                                                        {formatTransactionStatusLabel(
                                                            trx.status,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center text-sm border-t border-gray-200/60 pt-3 mt-3">
                                                <span className="text-muted-foreground">
                                                    Nominal
                                                </span>
                                                <span className="font-semibold">
                                                    {formatRupiah(
                                                        Number(trx.amount),
                                                    )}
                                                </span>
                                            </div>

                                            {trx.rejectReason &&
                                                trx.status === "rejected" && (
                                                    <div className="mt-3 p-3 bg-red-50 text-red-800 text-xs rounded border border-red-100 flex gap-2">
                                                        <InfoIcon className="w-4 h-4 shrink-0" />
                                                        <p>
                                                            <strong>
                                                                Alasan Ditolak:
                                                            </strong>{" "}
                                                            {trx.rejectReason}
                                                        </p>
                                                    </div>
                                                )}

                                            {/* Bukti Transfer */}
                                            {trx.proofUrl && (
                                                <div className="mt-4 pt-4 border-t border-dashed">
                                                    <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                                        <ImageIcon className="w-4 h-4 text-muted-foreground" />
                                                        Bukti Transfer
                                                    </p>
                                                    <div className="relative w-full aspect-4/3 max-w-sm rounded-lg overflow-hidden border">
                                                        <Image
                                                            src={trx.proofUrl}
                                                            alt="Bukti Transfer"
                                                            fill
                                                            className="object-contain bg-black/5"
                                                        />
                                                    </div>
                                                    <a
                                                        href={trx.proofUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-primary hover:underline mt-2 inline-block"
                                                    >
                                                        Buka gambar di tab baru
                                                        ↗
                                                    </a>
                                                </div>
                                            )}

                                            {/* Form Verifikasi Transaksi (Hanya muncul di transaksi terbaru yang statusnya pending) */}
                                            {index === 0 &&
                                                trx.status === "pending" && (
                                                    <div className="mt-4 pt-4 border-t border-dashed">
                                                        <p className="text-sm font-semibold mb-3">
                                                            Verifikasi
                                                            Pembayaran
                                                        </p>
                                                        <form
                                                            onSubmit={handleSubmit(
                                                                (data) =>
                                                                    onSubmitVerification(
                                                                        data,
                                                                        trx.id,
                                                                    ),
                                                            )}
                                                            className="space-y-3"
                                                        >
                                                            <div className="space-y-1.5">
                                                                <label className="text-xs font-medium text-muted-foreground">
                                                                    Status
                                                                    Verifikasi
                                                                </label>
                                                                <Controller
                                                                    name="status"
                                                                    control={
                                                                        control
                                                                    }
                                                                    render={({
                                                                        field,
                                                                    }) => (
                                                                        <Select
                                                                            value={
                                                                                field.value
                                                                            }
                                                                            onValueChange={
                                                                                field.onChange
                                                                            }
                                                                        >
                                                                            <SelectTrigger className="bg-white">
                                                                                <SelectValue placeholder="Pilih status" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="verified">
                                                                                    Verifikasi
                                                                                    (Berhasil)
                                                                                </SelectItem>
                                                                                <SelectItem value="rejected">
                                                                                    Tolak
                                                                                </SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    )}
                                                                />
                                                            </div>

                                                            {formStatus ===
                                                                "rejected" && (
                                                                <div className="space-y-1.5">
                                                                    <label className="text-xs font-medium text-muted-foreground">
                                                                        Alasan
                                                                        Penolakan
                                                                    </label>
                                                                    <Controller
                                                                        name="rejectReason"
                                                                        control={
                                                                            control
                                                                        }
                                                                        rules={{
                                                                            required:
                                                                                formStatus ===
                                                                                "rejected"
                                                                                    ? "Alasan penolakan harus diisi"
                                                                                    : false,
                                                                        }}
                                                                        render={({
                                                                            field,
                                                                            fieldState,
                                                                        }) => (
                                                                            <>
                                                                                <Textarea
                                                                                    placeholder="Masukkan alasan kenapa pembayaran ditolak..."
                                                                                    className={`bg-white text-sm ${fieldState.error ? "border-red-500" : ""}`}
                                                                                    rows={
                                                                                        2
                                                                                    }
                                                                                    {...field}
                                                                                />
                                                                                {fieldState.error && (
                                                                                    <p className="text-[10px] text-red-500">
                                                                                        {
                                                                                            fieldState
                                                                                                .error
                                                                                                .message
                                                                                        }
                                                                                    </p>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                    />
                                                                </div>
                                                            )}

                                                            <Button
                                                                type="submit"
                                                                size="sm"
                                                                className="w-full mt-2"
                                                                disabled={
                                                                    updating
                                                                }
                                                            >
                                                                {updating ? (
                                                                    <Spinner className="w-3 h-3 mr-2" />
                                                                ) : (
                                                                    <ShieldAlertIcon className="w-3 h-3 mr-2" />
                                                                )}
                                                                Simpan
                                                                Verifikasi
                                                            </Button>
                                                        </form>
                                                    </div>
                                                )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <HomeIcon className="w-4 h-4 text-primary" />
                                Informasi Kamar
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-y-4 gap-x-2">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Kamar
                                </p>
                                <p className="font-medium">
                                    {room?.roomNumber || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Gedung
                                </p>
                                <p className="font-medium">
                                    {room?.building || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Lantai
                                </p>
                                <p className="font-medium">
                                    {room?.floor || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Ukuran
                                </p>
                                <p className="font-medium">
                                    {room?.area || "-"} m²
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-primary" />
                                Detail Sewa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-y-4 gap-x-2">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Durasi
                                </p>
                                <p className="font-medium">
                                    {booking?.duration}{" "}
                                    {booking
                                        ? formatDurationUnit(booking.rentType)
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tipe Sewa
                                </p>
                                <p className="font-medium capitalize">
                                    {booking?.rentType || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tanggal Masuk
                                </p>
                                <p className="font-medium">
                                    {booking
                                        ? formatDate(booking.startDate)
                                        : "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tanggal Keluar
                                </p>
                                <p className="font-medium">
                                    {booking
                                        ? formatDate(booking.endDate)
                                        : "-"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Tenant Info */}
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-primary" />
                                Informasi Penyewa
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Nama Lengkap
                                </p>
                                <p className="font-medium">
                                    {tenant?.profile?.fullName || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Email
                                </p>
                                <p className="font-medium">
                                    {tenant?.email || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    No. Whatsapp
                                </p>
                                <p className="font-medium">
                                    {tenant?.profile?.whatsappNumber || "-"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none border-primary/20">
                        <CardHeader className="bg-primary/5 pb-4">
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileTextIcon className="w-4 h-4 text-primary" />
                                Ringkasan Tagihan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            <div className="flex justify-between items-center border-b border-dashed pb-3">
                                <p className="text-sm text-muted-foreground">
                                    Total Tagihan
                                </p>
                                <p className="font-medium">
                                    {formatRupiah(Number(invoice.totalAmount))}
                                </p>
                            </div>
                            {Number(invoice.penaltyAmount) > 0 && (
                                <div className="flex justify-between items-center border-b border-dashed pb-3">
                                    <p className="text-sm text-red-500">
                                        Denda Keterlambatan
                                    </p>
                                    <p className="font-medium text-red-600">
                                        {formatRupiah(
                                            Number(invoice.penaltyAmount),
                                        )}
                                    </p>
                                </div>
                            )}
                            {totalPaid > 0 && (
                                <div className="flex justify-between items-center border-b border-dashed pb-3">
                                    <p className="text-sm text-emerald-600">
                                        Sudah Dibayar
                                    </p>
                                    <p className="font-medium text-emerald-700">
                                        - {formatRupiah(totalPaid)}
                                    </p>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-1">
                                <p className="text-sm font-semibold">
                                    Sisa Bayar
                                </p>
                                <p className="font-bold text-lg text-primary">
                                    {formatRupiah(Math.max(0, remainingAmount))}
                                </p>
                            </div>

                            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 mt-4">
                                <p className="text-xs text-amber-800 font-medium mb-1">
                                    Batas Pembayaran:
                                </p>
                                <p className="text-sm font-semibold text-amber-900">
                                    {formatDate(invoice.dueDate)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
