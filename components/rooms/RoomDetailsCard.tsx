import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FacilitiesList } from "@/components/property/FacilitiesList";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
    BathIcon,
    WifiIcon,
    WindIcon,
    InfoIcon,
    CalendarIcon,
} from "lucide-react";
import type { Room, RoomStatus } from "./RoomTile";

function statusLabel(status: RoomStatus) {
    if (status === "tersedia") return "Tersedia";
    if (status === "pending") return "Booking Pending";
    return "Terisi";
}

function statusClass(status: RoomStatus) {
    if (status === "tersedia") return "text-green-600";
    if (status === "pending") return "text-amber-600";
    return "text-red-600";
}

function formatIDR(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function mapFacilities(items: string[]) {
    return items.map((label) => {
        if (label.toLowerCase().includes("ac"))
            return { icon: WindIcon, label: "AC" };
        if (
            label.toLowerCase().includes("wifi") ||
            label.toLowerCase().includes("wi-fi")
        )
            return { icon: WifiIcon, label: "Wi-Fi" };
        return { icon: BathIcon, label };
    });
}

function RoomDetailsCard({
    room,
    onBook,
    isGuest = true,
    className,
}: {
    room?: Room;
    onBook?: (room: Room) => void;
    isGuest?: boolean;
    className?: string;
}) {
    const router = useRouter();
    const disabled = !room || room.status !== "tersedia";

    return (
        <Card className={cn("sticky top-4 shadow-none", className)}>
            {room ? (
                <>
                    <CardHeader>
                        <CardTitle>{`Kamar ${room.id}`}</CardTitle>
                        <p className="text-muted-foreground">
                            Lantai {room.floor}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-end gap-2 bg-emerald-50 px-4 py-3 rounded-md">
                            <p className="text-2xl font-bold">
                                {formatIDR(room.price)}
                            </p>
                            <p className="text-muted-foreground">/bulan</p>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between border-b pb-2">
                                <p className="text-sm text-muted-foreground">
                                    Ukuran
                                </p>
                                <p className="font-medium">{`${room.size}m²`}</p>
                            </div>
                            <div className="flex justify-between border-b pb-2">
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>
                                <p
                                    className={cn(
                                        "font-medium",
                                        statusClass(room.status),
                                    )}
                                >
                                    {statusLabel(room.status)}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium">Fasilitas</p>
                            <FacilitiesList
                                items={mapFacilities(room.facilities)}
                                className="grid-cols-1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Button
                                disabled={disabled}
                                className="w-full rounded-full shadow-md"
                                onClick={() => {
                                    if (!room) return;
                                    if (isGuest) {
                                        router.push("/register");
                                        return;
                                    }
                                    onBook?.(room);
                                }}
                            >
                                <CalendarIcon /> Booking Sekarang
                            </Button>
                            <p className="text-xs text-muted-foreground text-center">
                                Dengan melanjutkan, Anda menyetujui syarat dan
                                ketentuan yang berlaku
                            </p>
                        </div>
                    </CardContent>
                </>
            ) : (
                <CardContent className="py-12 flex flex-col items-center text-center gap-3">
                    <div className="size-14 sm:size-16 rounded-full bg-emerald-50 flex items-center justify-center">
                        <InfoIcon className="text-emerald-600" />
                    </div>
                    <p className="text-lg sm:text-xl font-semibold">
                        Pilih Kamar
                    </p>
                    <p className="text-sm text-muted-foreground max-w-xs">
                        Klik pada kamar yang tersedia di peta untuk melihat
                        detail dan melakukan booking
                    </p>
                </CardContent>
            )}
        </Card>
    );
}

export { RoomDetailsCard };
