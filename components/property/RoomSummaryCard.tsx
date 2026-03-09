import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FacilitiesList } from "@/components/property/FacilitiesList";
import { cn } from "@/lib/utils";
import { MapPinIcon } from "lucide-react";
import Image from "next/image";

type FacilityItem = Parameters<typeof FacilitiesList>[0]["items"];

function RoomSummaryCard({
    imageSrc,
    imageAlt,
    roomName,
    floorLabel,
    sizeLabel,
    sinceLabel,
    priceLabel,
    facilities,
    className,
}: {
    imageSrc: string;
    imageAlt: string;
    roomName: string;
    floorLabel: string;
    sizeLabel: string;
    sinceLabel: string;
    priceLabel: string;
    facilities: FacilityItem;
    className?: string;
}) {
    return (
        <Card className={cn("shadow-none p-0 overflow-hidden", className)}>
            <CardHeader className="p-0">
                <div className="relative">
                    <Image
                        src={imageSrc}
                        alt={imageAlt}
                        width={1080}
                        height={1080}
                        className="w-full object-cover h-42"
                    />
                    <Badge className="absolute right-2 top-2 text-xs">
                        Kamar Anda
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex text-xs justify-between pb-4 border-b">
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2 items-center">
                            <h1 className="text-2xl font-bold">{roomName}</h1>
                            <Badge
                                variant="outline"
                                className="text-primary border-primary h-min"
                            >
                                {floorLabel}
                            </Badge>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                            <div className="flex items-center">
                                <MapPinIcon size={16} />
                                <p>{sizeLabel}</p>
                            </div>
                            <p>•</p>
                            <p>{sinceLabel}</p>
                        </div>
                    </div>
                    <div className="flex flex-col text-right">
                        <p className="text-muted-foreground">Harga/bulan</p>
                        <p className="text-2xl font-bold">{priceLabel}</p>
                    </div>
                </div>
                <div className="py-4 text-xs">
                    <p className="text-muted-foreground">Fasilitas Kamar</p>
                    <FacilitiesList items={facilities} />
                </div>
            </CardContent>
        </Card>
    );
}

export { RoomSummaryCard };
