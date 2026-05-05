"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    HomeIcon,
    CameraIcon,
    CreditCardIcon,
    WrenchIcon,
    MessageCircleMoreIcon,
} from "lucide-react";
import Link from "next/link";
import type { User } from "@/types/users";

function initials(name?: string) {
    const n = (name || "").trim();
    if (!n) return "?";
    const parts = n.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
    return (first + last).toUpperCase();
}

export function SummarySidebar({ user }: { user: User | null }) {
    const name = user?.fullName || "Pengguna";
    const email = user?.email || "";
    const role = user?.role === "tenant" ? "Penghuni" : user?.role || "";
    const room = user?.currentStay?.roomNumber || "-";
    const avatarUrl = user?.profile?.avatarUrl || undefined;

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
                        >
                            <CameraIcon className="size-3.5" />
                        </Button>
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
                                12
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Bulan
                            </p>
                        </div>
                        <div>
                            <p className="text-xl sm:text-2xl font-semibold">
                                18M
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
