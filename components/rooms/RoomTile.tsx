import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    CheckIcon,
    CircleCheckIcon,
    DoorClosedIcon,
    LockIcon,
} from "lucide-react";
import * as React from "react";

type RoomStatus = "tersedia" | "terisi" | "pending";

type Room = {
    id: string;
    floor: number;
    price: number;
    size: number;
    status: RoomStatus;
    facilities: string[];
};

function statusClasses(status: RoomStatus) {
    if (status === "tersedia") {
        return "bg-green-500  text-white border-3 border-green-600  transition duration-200";
    }
    if (status === "pending") {
        return "bg-amber-400 text-white border-3 border-amber-600";
    }
    return "bg-red-400 text-white border-3 border-red-600";
}

function RoomTile({
    room,
    selected,
    onSelect,
}: {
    room: Room;
    selected?: boolean;
    onSelect?: (room: Room) => void;
}) {
    const disabled = room.status !== "tersedia";
    const content = (
        <div
            className={cn(
                "transition duration-200 rounded-md aspect-square relative",
                selected ? "ring-4 ring-green-500" : "",
                room.status === "tersedia"
                    ? "hover:scale-105 hover:bg-green-600"
                    : "",
            )}
        >
            <button
                type="button"
                aria-disabled={disabled}
                onClick={() => {
                    if (disabled) return;
                    onSelect?.(room);
                }}
                className={cn(
                    "relative flex flex-col items-center justify-center rounded-md p-3 h-full w-full",
                    statusClasses(room.status),
                    disabled
                        ? "cursor-not-allowed opacity-70"
                        : "cursor-pointer hover:brightness-95",
                    selected ? "ring-2 ring-white  shadow-md " : "",
                )}
            >
                <DoorClosedIcon />
                <span className="mt-1 font-semibold">{room.id}</span>
            </button>
            {selected && (
                <CheckIcon
                    size={20}
                    className="absolute -top-1 -right-1 bg-green-500 rounded-full"
                    color="white"
                />
            )}
        </div>
    );

    if (disabled) {
        return content;
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{content}</TooltipTrigger>
                <TooltipContent sideOffset={8}>
                    <div className="space-y-1">
                        <p className="font-semibold">Kamar {room.id}</p>
                        <p>Status: Tersedia</p>
                        <p>Harga: {formatIDR(room.price)}/bulan</p>
                        <p>Ukuran: {room.size}m²</p>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

function formatIDR(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
}

export type { Room, RoomStatus };
export { RoomTile };
