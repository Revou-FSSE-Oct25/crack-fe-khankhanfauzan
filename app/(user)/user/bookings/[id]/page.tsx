"use client";

import { getSession } from "@/actions/auth";
import { getBookingById } from "@/services/bookings";
import { Booking } from "@/types/bookings";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { formatDate, formatRupiah, formatDurationUnit } from "@/utils/format";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    CalendarIcon,
    CreditCardIcon,
    FileTextIcon,
    HomeIcon,
    MapPinIcon,
    UserIcon,
} from "lucide-react";
import { Status } from "@/components/bookings/BookingRow";

const badgeClassByStatus: Record<Status, string> = {
    completed: "bg-blue-50 border-blue-200 text-blue-900",
    cancelled: "bg-red-50 border-red-200 text-red-900",
    expired: "bg-gray-50 border-gray-200 text-gray-900",
    confirmed: "bg-green-50 border-green-200 text-green-900",
    pending_payment: "bg-amber-50 border-amber-200 text-amber-900",
    pending_approval: "bg-purple-50 border-purple-200 text-purple-900",
};

const formatStatusLabel = (status: Status) => {
    switch (status) {
        case "pending_approval":
            return "Menunggu Persetujuan";
        case "pending_payment":
            return "Menunggu Pembayaran";
        case "completed":
            return "Selesai";
        case "cancelled":
            return "Dibatalkan";
        case "expired":
            return "Kedaluwarsa";
        case "confirmed":
            return "Dikonfirmasi";
        default:
            return status;
    }
};

function Page() {
    const params = useParams();

    const bookingId = String(params?.id ?? "");

    const [booking, setBooking] = useState<Booking | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const session = getSession();
        const token = session?.accessToken;

        getBookingById(bookingId, { token: token })
            .then((value) => setBooking(value.data))
            .catch((e) => setErrorMsg(e.message))
            .finally(() => setLoading(false));
    }, [bookingId]);

    if (loading) {
        return (
            <Spinner className="flex h-full mx-auto justify-center min-h-[50vh]" />
        );
    }

    if (errorMsg || !booking) {
        return (
            <div className="p-4 max-w-7xl mx-auto text-center mt-10">
                <p className="text-red-500 mb-4">
                    {errorMsg || "Booking tidak ditemukan"}
                </p>
                <Link href="/user/bookings">
                    <Button variant="outline">Kembali ke Daftar Booking</Button>
                </Link>
            </div>
        );
    }

    // Determine logical status
    const status: Status =
        booking.status === "completed"
            ? "completed"
            : booking.status === "cancelled"
              ? "cancelled"
              : booking.status === "confirmed"
                ? "confirmed"
                : booking.status === "pending_approval"
                  ? "pending_approval"
                  : "pending_payment";

    const canPay = status === "pending_payment";
    const tenant = booking.tenant;

    const invoice = booking.invoices?.[0];
    const totalPaid = (invoice?.transactions || [])
        .filter((t: any) => t.status === "verified")
        .reduce((sum: number, t: any) => sum + Number(t.amount), 0);

    const remainingAmount =
        Number(booking.totalPrice) +
        Number(invoice?.penaltyAmount || 0) -
        totalPaid;

    return (
        <div className="p-4 mx-auto space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg sm:text-xl font-semibold">
                    Detail Booking
                </h1>
                <Badge
                    variant="secondary"
                    className={badgeClassByStatus[status]}
                >
                    {formatStatusLabel(status)}
                </Badge>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                    {/* Info Tenant */}
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-primary" />
                                Informasi Tenant
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-y-4 gap-x-2">
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
                                    No. WA
                                </p>
                                <p className="font-medium">
                                    {tenant?.profile?.whatsappNumber || "-"}
                                </p>
                            </div>
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
                                    {booking.room?.roomNumber}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Gedung
                                </p>
                                <p className="font-medium">
                                    {booking.room?.building}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Lantai
                                </p>
                                <p className="font-medium">
                                    {booking.room?.floor}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Ukuran
                                </p>
                                <p className="font-medium">
                                    {booking.room?.area} m²
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
                                    {booking.duration}{" "}
                                    {formatDurationUnit(booking.rentType)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tipe Sewa
                                </p>
                                <p className="font-medium capitalize">
                                    {booking.rentType}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tanggal Masuk
                                </p>
                                <p className="font-medium">
                                    {formatDate(booking.startDate)}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tanggal Keluar
                                </p>
                                <p className="font-medium">
                                    {formatDate(booking.endDate)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <FileTextIcon className="w-4 h-4 text-primary" />
                                Ringkasan Biaya
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center border-b pb-2">
                                <p className="text-sm text-muted-foreground">
                                    Harga per{" "}
                                    {formatDurationUnit(booking.rentType)}
                                </p>
                                <p className="font-medium">
                                    {formatRupiah(Number(booking.pricePerUnit))}
                                </p>
                            </div>
                            {Number(invoice?.penaltyAmount) > 0 && (
                                <div className="flex justify-between items-center border-b pb-2">
                                    <p className="text-sm text-red-500">
                                        Denda Keterlambatan
                                    </p>
                                    <p className="font-medium text-red-600">
                                        {formatRupiah(
                                            Number(invoice?.penaltyAmount),
                                        )}
                                    </p>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-2">
                                <p className="text-sm font-semibold">
                                    Total Tagihan
                                </p>
                                <p className="font-bold text-lg">
                                    {formatRupiah(
                                        Number(booking.totalPrice) +
                                            Number(invoice?.penaltyAmount || 0),
                                    )}
                                </p>
                            </div>

                            {totalPaid > 0 && (
                                <div className="flex justify-between items-center border-b border-dashed pb-3 pt-2">
                                    <p className="text-sm text-emerald-600">
                                        Sudah Dibayar
                                    </p>
                                    <p className="font-medium text-emerald-700">
                                        - {formatRupiah(totalPaid)}
                                    </p>
                                </div>
                            )}

                            {canPay && (
                                <div className="flex justify-between items-center pt-1 pb-2">
                                    <p className="text-sm font-semibold">
                                        Sisa Bayar
                                    </p>
                                    <p className="font-bold text-lg text-primary">
                                        {formatRupiah(
                                            Math.max(0, remainingAmount),
                                        )}
                                    </p>
                                </div>
                            )}

                            {canPay && (
                                <Link
                                    href={`/user/bookings/${booking.id}/payment?roomId=${booking.roomId}&price=${booking.pricePerUnit}&floor=${booking.room?.floor}&size=${booking.room?.area}`}
                                    className="block mt-4"
                                >
                                    <Button className="w-full rounded-full">
                                        <CreditCardIcon className="mr-2 w-4 h-4" />{" "}
                                        Bayar Sekarang
                                    </Button>
                                </Link>
                            )}

                            {booking.status === "confirmed" && (
                                <Link
                                    href={`/user/bookings/create?roomId=${booking.roomId}&extend=true`}
                                    className="block mt-4"
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full rounded-full"
                                    >
                                        <FileTextIcon className="mr-2 w-4 h-4" />{" "}
                                        Perpanjang Masa Sewa
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Page;
