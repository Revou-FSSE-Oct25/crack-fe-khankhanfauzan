"use client";

import { getSession } from "@/actions/auth";
import {
    getMaintenanceById,
    updateMaintenanceStatus,
} from "@/services/maintenances";
import { Maintenance, ComplaintStatus } from "@/types/maintenances";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/utils/format";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeftIcon,
    CalendarIcon,
    CheckCircleIcon,
    ClockIcon,
    ImageIcon,
    MapPinIcon,
    ShieldAlertIcon,
    TriangleAlertIcon,
    UserIcon,
    WrenchIcon,
    UploadIcon,
    XIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const badgeClassByStatus: Record<string, string> = {
    open: "bg-blue-50 border-blue-200 text-blue-900",
    in_progress: "bg-amber-50 border-amber-200 text-amber-900",
    resolved: "bg-green-50 border-green-200 text-green-900",
    closed: "bg-red-50 border-red-200 text-red-900",
};

const formatStatusLabel = (status: string) => {
    switch (status) {
        case "open":
            return "Menunggu Diproses";
        case "in_progress":
            return "Sedang Dikerjakan";
        case "resolved":
            return "Selesai";
        case "closed":
            return "Ditutup / Ditolak";
        default:
            return status;
    }
};

const formatCategoryLabel = (category: string) => {
    switch (category) {
        case "plumbing":
            return "Saluran Air / Pipa";
        case "electrical":
            return "Kelistrikan";
        case "ac":
            return "AC (Air Conditioning)";
        case "furniture":
            return "Perabotan";
        case "others":
            return "Lainnya";
        default:
            return category;
    }
};

const statusIcon = (status: string) => {
    switch (status) {
        case "open":
            return <ClockIcon className="w-4 h-4" />;
        case "in_progress":
            return <TriangleAlertIcon className="w-4 h-4" />;
        case "resolved":
            return <CheckCircleIcon className="w-4 h-4" />;
        case "closed":
            return <ShieldAlertIcon className="w-4 h-4" />;
        default:
            return <ClockIcon className="w-4 h-4" />;
    }
};

export default function ComplaintDetailPage() {
    const params = useParams();
    const id = String(params?.id ?? "");

    const [complaint, setComplaint] = useState<Maintenance | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    // Form state
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            status: "open" as ComplaintStatus,
            adminNotes: "",
        },
    });

    useEffect(() => {
        const session = getSession();
        const token = session?.accessToken;

        getMaintenanceById(id, { token })
            .then((value) => {
                setComplaint(value.data);
                if (value.data) {
                    reset({
                        status: value.data.status,
                        adminNotes: value.data.adminNotes || "",
                    });
                }
            })
            .catch((e) => setErrorMsg(e.message))
            .finally(() => setLoading(false));
    }, [id, reset]);

    const onSubmit = async (data: any) => {
        setUpdating(true);
        try {
            const session = getSession();
            const token = session?.accessToken;

            const res = await updateMaintenanceStatus(
                id,
                {
                    status: data.status,
                    adminNotes: data.adminNotes,
                },
                { token },
            );
            setComplaint(res.data);

            toast.success("Status komplain berhasil diperbarui");
        } catch (error: any) {
            toast.error(error.message || "Gagal memperbarui status komplain");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center min-h-[50vh]">
                <Spinner />
            </div>
        );
    }

    if (errorMsg || !complaint) {
        return (
            <div className="p-4 max-w-7xl mx-auto text-center mt-10">
                <p className="text-red-500 mb-4">
                    {errorMsg || "Komplain tidak ditemukan"}
                </p>
                <Link href="/admin/maintenances">
                    <Button variant="outline">
                        Kembali ke Daftar Komplain
                    </Button>
                </Link>
            </div>
        );
    }

    const room = complaint.room;
    const tenant = complaint.tenant;

    return (
        <div className="p-4 mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/maintenances">
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
                        Detail Komplain
                    </h1>
                    <Badge
                        variant="secondary"
                        className={`flex items-center gap-1.5 ${badgeClassByStatus[complaint.status] || "bg-gray-50 border-gray-200 text-gray-900"}`}
                    >
                        {statusIcon(complaint.status)}
                        {formatStatusLabel(complaint.status)}
                    </Badge>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Detail Komplain */}
                    <Card className="shadow-none">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-base flex items-center gap-2">
                                <WrenchIcon className="w-4 h-4 text-primary" />
                                Informasi Kendala
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        ID Komplain
                                    </p>
                                    <p className="font-medium text-sm">
                                        {complaint.id}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Kategori
                                    </p>
                                    <p className="font-medium text-sm">
                                        {formatCategoryLabel(
                                            complaint.category,
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Dibuat Pada
                                    </p>
                                    <p className="font-medium text-sm flex items-center gap-1.5">
                                        <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                                        {formatDate(complaint.createdAt, {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                {complaint.resolvedAt && (
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">
                                            Diselesaikan Pada
                                        </p>
                                        <p className="font-medium text-sm flex items-center gap-1.5 text-green-700">
                                            <CheckCircleIcon className="w-3.5 h-3.5" />
                                            {formatDate(complaint.resolvedAt, {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <p className="text-xs text-muted-foreground mb-2">
                                    Deskripsi
                                </p>
                                <div className="bg-gray-50 p-4 rounded-md text-sm border">
                                    {complaint.description}
                                </div>
                            </div>

                            {complaint.adminNotes && (
                                <div className="mt-4">
                                    <p className="text-xs text-muted-foreground mb-2">
                                        Catatan Admin/Teknisi
                                    </p>
                                    <div className="bg-blue-50 text-blue-900 p-4 rounded-md text-sm border border-blue-100 flex gap-2">
                                        <TriangleAlertIcon className="w-5 h-5 shrink-0 text-blue-500" />
                                        <p>{complaint.adminNotes}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Foto Bukti */}
                    <Card className="shadow-none">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-base flex items-center gap-2">
                                <ImageIcon className="w-4 h-4 text-primary" />
                                Lampiran Foto
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                            {complaint.images &&
                            complaint.images.filter((img) => img.imageUrl)
                                .length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {complaint.images
                                        .filter((img) => img.imageUrl)
                                        .map((img, index) => (
                                            <div
                                                key={img.id || `img-${index}`}
                                                className="relative aspect-square rounded-lg overflow-hidden border"
                                            >
                                                <Image
                                                    src={img.imageUrl}
                                                    alt={`Lampiran Komplain ${index + 1}`}
                                                    fill
                                                    className="object-cover hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground bg-gray-50 rounded-lg border border-dashed">
                                    <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                                    <p className="text-sm">
                                        Tidak ada lampiran foto
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    {/* Info Tenant */}
                    <Card className="shadow-none">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-base flex items-center gap-2">
                                <UserIcon className="w-4 h-4 text-primary" />
                                Informasi Tenant
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {tenant ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-dashed pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Nama
                                        </span>
                                        <span className="text-sm font-medium">
                                            {tenant.profile?.fullName || "-"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-dashed pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Email
                                        </span>
                                        <span className="text-sm font-medium">
                                            {tenant.email || "-"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            No. WA
                                        </span>
                                        <span className="text-sm font-medium">
                                            {tenant.profile?.whatsappNumber ||
                                                "-"}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-center py-4 text-muted-foreground bg-gray-50 rounded-lg border">
                                    Informasi tenant tidak tersedia
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Update Status (Admin Only) */}
                    <Card className="shadow-none border-primary/20">
                        <CardHeader className="bg-primary/5 pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShieldAlertIcon className="w-4 h-4 text-primary" />
                                Update Status Komplain
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Status
                                    </label>
                                    <Controller
                                        name="status"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Pilih status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="open">
                                                        Menunggu Diproses
                                                    </SelectItem>
                                                    <SelectItem value="in_progress">
                                                        Sedang Dikerjakan
                                                    </SelectItem>
                                                    <SelectItem value="resolved">
                                                        Selesai
                                                    </SelectItem>
                                                    <SelectItem value="closed">
                                                        Ditutup / Ditolak
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-muted-foreground">
                                        Catatan Admin
                                    </label>
                                    <Controller
                                        name="adminNotes"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                placeholder="Tambahkan catatan untuk teknisi atau tenant..."
                                                {...field}
                                                rows={3}
                                            />
                                        )}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full mt-2"
                                    disabled={updating}
                                >
                                    {updating ? (
                                        <Spinner className="w-4 h-4 mr-2" />
                                    ) : null}
                                    Simpan Perubahan
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader className="pb-3 border-b border-gray-100">
                            <CardTitle className="text-base flex items-center gap-2">
                                <MapPinIcon className="w-4 h-4 text-primary" />
                                Informasi Lokasi
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 space-y-4">
                            {room ? (
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b border-dashed pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Kamar
                                        </span>
                                        <span className="text-sm font-medium">
                                            {room.roomNumber}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-b border-dashed pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Gedung
                                        </span>
                                        <span className="text-sm font-medium">
                                            {room.building}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pb-2">
                                        <span className="text-sm text-muted-foreground">
                                            Lantai
                                        </span>
                                        <span className="text-sm font-medium">
                                            {room.floor}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-center py-4 text-muted-foreground bg-gray-50 rounded-lg border">
                                    Informasi kamar tidak tersedia
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
