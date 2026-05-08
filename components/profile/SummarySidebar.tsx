"use client";
import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    HomeIcon,
    CameraIcon,
    CreditCardIcon,
    WrenchIcon,
    MessageCircleMoreIcon,
    Loader2Icon,
} from "lucide-react";
import Link from "next/link";
import type { User } from "@/types/users";
import { updateProfile } from "@/services/users";
import { getSession } from "@/actions/auth";
import { TenantDashboardData } from "@/types/tenant-dashboard";
import { formatRupiah } from "@/utils/format";

function initials(name?: string) {
    const n = (name || "").trim();
    if (!n) return "?";
    const parts = n.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return (first + last).toUpperCase();
}

export function SummarySidebar({
    user,
    tenantDashboard,
}: {
    user: User | null;
    tenantDashboard: TenantDashboardData | null;
}) {
    const name = user?.profile?.fullName || "Pengguna";
    const email = user?.email || "";
    const role = user?.role === "tenant" ? "Penghuni" : user?.role || "";
    const room = tenantDashboard?.activeBooking?.room.roomNumber || "-";
    const [avatarUrl, setAvatarUrl] = useState(
        user?.document?.fotoProfileUrl || undefined,
    );
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const s = getSession();
        const token = s?.accessToken;
        const userId = s?.userId;

        if (!token || !userId) {
            alert("Sesi tidak ditemukan. Silakan login kembali.");
            return;
        }

        // Optimistic UI update
        const objectUrl = URL.createObjectURL(file);
        setAvatarUrl(objectUrl);
        setIsUploading(true);

        const formData = new FormData();
        formData.append("fotoProfile", file);

        try {
            await updateProfile(userId.toString(), formData, { token });
            // Profile updated successfully
        } catch (error) {
            console.error("Gagal mengunggah foto profil:", error);
            alert("Gagal mengunggah foto profil. Silakan coba lagi.");
            // Revert optimistic update
            setAvatarUrl(user?.document.fotoProfileUrl || undefined);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <>
            <Card className="shadow-none">
                <CardContent className="flex flex-col gap-4 items-center justify-center text-center">
                    <div className="relative">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={avatarUrl} alt={name} />
                            <AvatarFallback className="font-bold text-xl text-white bg-primary">
                                {initials(name)}
                            </AvatarFallback>
                        </Avatar>
                        <Button
                            size="icon-sm"
                            className="absolute -bottom-1 -right-1 rounded-full border-4 border-white"
                            variant="default"
                            aria-label="Edit foto profil"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                        >
                            {isUploading ? (
                                <Loader2Icon className="size-3.5 animate-spin" />
                            ) : (
                                <CameraIcon className="size-3.5" />
                            )}
                        </Button>
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                    </div>
                    <div className="flex flex-col">
                        <h2 className="text-lg sm:text-xl font-semibold">
                            {name}
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                            {role}
                        </p>
                    </div>
                    <div className="bg-accent p-2 flex items-center justify-center gap-2 rounded-md w-full">
                        <HomeIcon color="var(--color-primary)" />
                        <div className="text-primary">
                            <p className="font-medium text-xs">Kamar Anda</p>
                            <p className="font-semibold">{room}</p>
                        </div>
                    </div>
                    <div className="flex justify-evenly w-full">
                        <div>
                            <p className="text-xl sm:text-2xl font-semibold">
                                {tenantDashboard?.stayInfo?.contractDuration}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Bulan
                            </p>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-semibold">
                                {formatRupiah(
                                    tenantDashboard?.activeBooking?.totalPrice,
                                    { notation: "compact" },
                                )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Total Bayar
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle>
                        <h2 className="text-base font-semibold">
                            Quick Actions
                        </h2>
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    <Link href="/user/transactions">
                        <Button
                            className="flex gap-2 items-center justify-start w-full"
                            variant="ghost"
                        >
                            <CreditCardIcon
                                color="var(--color-primary)"
                                size={20}
                            />
                            <p className="text-sm font-medium">
                                Riwayat Transaksi
                            </p>
                        </Button>
                    </Link>
                    <Link href="/user/maintenances">
                        <Button
                            className="flex gap-2 items-center justify-start w-full"
                            variant="ghost"
                        >
                            <WrenchIcon
                                color="var(--color-primary)"
                                size={20}
                            />
                            <p className="text-sm font-medium">
                                Laporan Maintenance
                            </p>
                        </Button>
                    </Link>
                    <Link href="/user/chat">
                        <Button
                            className="flex gap-2 items-center justify-start w-full"
                            variant="ghost"
                        >
                            <MessageCircleMoreIcon
                                color="var(--color-primary)"
                                size={20}
                            />
                            <p className="text-sm font-medium">
                                Chat dengan Admin
                            </p>
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        </>
    );
}
