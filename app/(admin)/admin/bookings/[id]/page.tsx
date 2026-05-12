"use client";

import { getSession } from "@/actions/auth";
import {
    getBookingById,
    approveBooking,
    rejectBooking,
} from "@/services/bookings";
import { Booking } from "@/types/bookings";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { formatDate, formatRupiah, formatDurationUnit } from "@/utils/format";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
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
    ArrowLeftIcon,
    UserIcon,
    CheckIcon,
    XIcon,
} from "lucide-react";
import { Status } from "@/components/bookings/BookingRow";

const badgeClassByStatus: Record<Status, string> = {
    completed: "bg-blue-50 border-blue-200 text-blue-900",
    cancelled: "bg-red-50 border-red-200 text-red-900",
    expired: "bg-gray-50 border-gray-200 text-gray-900",
    confirmed: "bg-green-50 border-green-200 text-green-900",
    pending_payment: "bg-amber-50 border-amber-200 text-amber-900",
};

const formatStatusLabel = (status: Status) => {
    switch (status) {
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

function page() {
    const params = useParams();
    const router = useRouter();

    const bookingId = String(params?.id ?? "");

    const [booking, setBooking] = useState<Booking | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);

    const fetchBooking = () => {
        const session = getSession();
        const token = session?.accessToken;

        getBookingById(bookingId, { token: token })
            .then((value) => setBooking(value.data))
            .catch((e) => setErrorMsg(e.message))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchBooking();
    }, [bookingId]);

    const handleApprove = async () => {
        if (
            !confirm(
                "Apakah Anda yakin ingin menyetujui booking ini? Tenant akan dapat melanjutkan ke proses pembayaran.",
            )
        )
            return;

        setIsUpdating(true);
        try {
            const session = getSession();
            await approveBooking(bookingId, { token: session?.accessToken });
            toast.success("Booking berhasil disetujui!");
            fetchBooking();
        } catch (error: any) {
            toast.error(error.message || "Gagal menyetujui booking");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleReject = async () => {
        if (
            !confirm(
                "Apakah Anda yakin ingin menolak booking ini? Tindakan ini tidak dapat dibatalkan.",
            )
        )
            return;

        setIsUpdating(true);
        try {
            const session = getSession();
            await rejectBooking(bookingId, { token: session?.accessToken });
            toast.success("Booking berhasil ditolak.");
            fetchBooking();
        } catch (error: any) {
            toast.error(error.message || "Gagal menolak booking");
        } finally {
            setIsUpdating(false);
        }
    };

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
                <Link href="/admin/bookings">
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
                : "pending_payment";

    const tenant = booking.tenant;

    return (
        <div className="p-4 mx-auto space-y-4">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/bookings">
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
                        Detail Booking
                    </h1>
                    <Badge
                        variant="secondary"
                        className={badgeClassByStatus[status]}
                    >
                        {formatStatusLabel(status)}
                    </Badge>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                    {/* Info Tenant (KYC) */}
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-primary" />
                                Informasi Tenant (KYC)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 border-b border-dashed pb-4">
                                <div className="relative w-16 h-16 rounded-full overflow-hidden border bg-muted shrink-0">
                                    {tenant?.profile?.fotoProfileUrl ? (
                                        <Image
                                            src={tenant.profile.fotoProfileUrl}
                                            alt="Foto Profil"
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <UserIcon className="w-8 h-8 m-auto mt-4 text-muted-foreground" />
                                    )}
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 flex-1">
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
                                            {tenant?.profile?.whatsappNumber ||
                                                "-"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            Status Perkawinan
                                        </p>
                                        <p className="font-medium">
                                            {tenant?.profile?.maritalStatus ||
                                                "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Foto KTP */}
                                {tenant?.profile?.fotoKtpUrl && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Foto KTP
                                        </p>
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                            <Image
                                                src={tenant.profile.fotoKtpUrl}
                                                alt="KTP"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <a
                                            href={tenant.profile.fotoKtpUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-primary hover:underline mt-1 block"
                                        >
                                            Buka KTP penuh ↗
                                        </a>
                                    </div>
                                )}

                                {/* Foto Buku Nikah */}
                                {tenant?.profile?.fotoBukuNikahUrl && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-2">
                                            Foto Buku Nikah
                                        </p>
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                                            <Image
                                                src={
                                                    tenant.profile
                                                        .fotoBukuNikahUrl
                                                }
                                                alt="Buku Nikah"
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <a
                                            href={
                                                tenant.profile.fotoBukuNikahUrl
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[10px] text-primary hover:underline mt-1 block"
                                        >
                                            Buka Buku Nikah penuh ↗
                                        </a>
                                    </div>
                                )}
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
                            <div className="flex justify-between items-center pt-2">
                                <p className="text-sm font-semibold">
                                    Total Harga
                                </p>
                                <p className="font-bold text-lg text-primary">
                                    {formatRupiah(Number(booking.totalPrice))}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Aksi Booking */}
                    {status === "pending_payment" && (
                        <Card className="shadow-none border-amber-200 bg-amber-50/50">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base flex items-center gap-2 text-amber-900">
                                    Verifikasi Booking
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <p className="text-sm text-amber-800 mb-2">
                                    Penyewa ini menunggu persetujuan Anda
                                    sebelum dapat melanjutkan ke pembayaran.
                                </p>
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                    onClick={handleApprove}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <Spinner className="w-4 h-4 mr-2" />
                                    ) : (
                                        <CheckIcon className="w-4 h-4 mr-2" />
                                    )}
                                    Setujui Booking
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                                    onClick={handleReject}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <Spinner className="w-4 h-4 mr-2" />
                                    ) : (
                                        <XIcon className="w-4 h-4 mr-2" />
                                    )}
                                    Tolak Booking
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

export default page;
