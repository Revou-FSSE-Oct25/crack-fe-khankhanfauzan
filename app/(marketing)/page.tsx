import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconSurface } from "@/components/ui/icon-surface";
import {
    BathIcon,
    BedIcon,
    CalendarIcon,
    ClockIcon,
    Columns2Icon,
    CookingPotIcon,
    HomeIcon,
    LampDeskIcon,
    MaximizeIcon,
    ShieldIcon,
    StarIcon,
    UsersIcon,
    UsersRoundIcon,
    WifiIcon,
    WindIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function page() {
    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 p-6 pt-0">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold">Emerald House</h1>
                        <p className="text-muted-foreground">
                            Jl. Pasaeno Lrg. Swadaya, Kota Kendari
                        </p>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-semibold">Rp 1.000.000</h2>
                        <p className="text-muted-foreground">/ bulan</p>
                    </div>
                    <Link href="/rooms">
                        <Button
                            variant="outline"
                            className="rounded-full h-12 w-fit px-6 font-semibold"
                        >
                            Cek Ketersediaan
                            <CalendarIcon />
                        </Button>
                    </Link>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <UsersRoundIcon />
                            <div className="flex flex-col">
                                <p className="text-muted-foreground">
                                    Kapasitas
                                </p>
                                <p>2 Orang</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <BedIcon />
                            <div className="flex flex-col">
                                <p className="text-muted-foreground">Kasur</p>
                                <p>Queen</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MaximizeIcon />
                            <div className="flex flex-col">
                                <p className="text-muted-foreground">Ukuran</p>
                                <p>3x4 m</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg font-semibold">
                            Tentang Properti
                        </h2>
                        <p className="text-muted-foreground">
                            Emerald House menawarkan hunian kost eksklusif
                            dengan desain modern minimalis di lokasi strategis
                            Kota Kendari. Emerald House memberikan kenyamanan
                            maksimal bagi penghuni dengan fasilitas lengkap dan
                            sistem manajemen digital.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold">Fasilitas</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <IconSurface
                                        bgClass="bg-accent"
                                        rounded="rounded-xl"
                                    >
                                        <WifiIcon color="var(--color-primary)" />
                                    </IconSurface>
                                    Wi‑Fi
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <IconSurface
                                        bgClass="bg-accent"
                                        rounded="rounded-xl"
                                    >
                                        <WindIcon color="var(--color-primary)" />
                                    </IconSurface>
                                    AC
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <IconSurface
                                        bgClass="bg-accent"
                                        rounded="rounded-xl"
                                    >
                                        <BathIcon color="var(--color-primary)" />
                                    </IconSurface>
                                    Kamar Mandi Dalam
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <IconSurface
                                        bgClass="bg-accent"
                                        rounded="rounded-xl"
                                    >
                                        <CookingPotIcon color="var(--color-primary)" />
                                    </IconSurface>
                                    Dapur
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <IconSurface
                                        bgClass="bg-accent"
                                        rounded="rounded-xl"
                                    >
                                        <Columns2Icon color="var(--color-primary)" />
                                    </IconSurface>
                                    Lemari Pakaian
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <IconSurface
                                        bgClass="bg-accent"
                                        rounded="rounded-xl"
                                    >
                                        <LampDeskIcon color="var(--color-primary)" />
                                    </IconSurface>
                                    Meja Kerja
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <StarIcon fill="orange" stroke="0" />
                            <h2 className="text-xl font-semibold">4.9</h2>
                            <p className="text-muted-foreground">· 2 ulasan</p>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <Card>
                                <CardContent className="flex gap-4 items-start">
                                    <Avatar size="lg">
                                        <AvatarImage src="https://i.pravatar.cc/300" />
                                        <AvatarFallback>AP</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="font-semibold">
                                            Andi Pratama
                                        </h2>
                                        <div className="flex">
                                            <StarIcon
                                                fill="orange"
                                                stroke="0"
                                            />
                                            <StarIcon
                                                fill="orange"
                                                stroke="0"
                                            />
                                            <StarIcon
                                                fill="orange"
                                                stroke="0"
                                            />
                                            <StarIcon
                                                fill="orange"
                                                stroke="0"
                                            />
                                            <StarIcon
                                                fill="orange"
                                                stroke="0"
                                            />
                                        </div>
                                        <p className="text-muted-foreground">
                                            Kosan yang sangat nyaman dan bersih.
                                            Lokasi strategis dan admin sangat
                                            responsif. Highly recommended!
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex gap-4 items-start">
                                    <Avatar size="lg">
                                        <AvatarImage src="https://i.pravatar.cc/300" />
                                        <AvatarFallback>SW</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="font-semibold">
                                            Sarah Wijaya
                                        </h2>
                                        <div className="flex">
                                            <StarIcon
                                                fill="orange"
                                                stroke="0"
                                            />
                                            <StarIcon
                                                fill="orange"
                                                stroke="0"
                                            />
                                            <StarIcon
                                                fill="orange"
                                                stroke="0"
                                            />
                                            <StarIcon
                                                fill="orange"
                                                stroke="0"
                                            />
                                            <StarIcon
                                                fill="orange"
                                                stroke="0"
                                            />
                                        </div>
                                        <p className="text-muted-foreground">
                                            Fasilitas lengkap, harga terjangkau.
                                            Sistem booking online sangat
                                            memudahkan. Puas banget!
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4 md:sticky md:top-6 md:self-start">
                    <div className="relative w-full overflow-hidden rounded-3xl aspect-4/3 md:sticky md:top-6">
                        <Image
                            src="https://cdn.dribbble.com/userupload/7081336/file/original-941b828d84271ab086e87f6c8fa8ebb3.png?resize=752x&vertical=center"
                            alt="Emerald House"
                            fill
                            sizes="(min-width: 768px) 50vw, 100vw"
                            className="object-cover"
                            priority
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="relative w-full overflow-hidden rounded-2xl aspect-4/3">
                            <Image
                                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                alt="Gallery 1"
                                fill
                                sizes="(min-width: 768px) 16vw, 90vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="relative w-full overflow-hidden rounded-2xl aspect-4/3">
                            <Image
                                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop"
                                alt="Gallery 2"
                                fill
                                sizes="(min-width: 768px) 16vw, 90vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="relative w-full overflow-hidden rounded-2xl aspect-4/3">
                            <Image
                                src="https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1200&auto=format&fit=crop"
                                alt="Gallery 3"
                                fill
                                sizes="(min-width: 768px) 16vw, 90vw"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-6 pt-0">
                <div className="mt-8 w-full items-center text-center">
                    <h2 className="text-2xl font-bold">
                        Mengapa Memilih Emerald Kos?
                    </h2>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="flex flex-col gap-2 text-start">
                                <IconSurface
                                    bgClass="bg-accent"
                                    className="w-min"
                                >
                                    <HomeIcon color="var(--color-primary)" />
                                </IconSurface>
                                <h3 className="font-semibold">
                                    Lokasi Strategis
                                </h3>
                                <p className="text-muted-foreground">
                                    Dekat Mall, Perkantoran dan Pusat Kota
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex flex-col gap-2 text-start">
                                <IconSurface
                                    bgClass="bg-accent"
                                    className="w-min"
                                >
                                    <ShieldIcon color="var(--color-primary)" />
                                </IconSurface>
                                <h3 className="font-semibold">Keamanan 24/7</h3>
                                <p className="text-muted-foreground">
                                    CCTV dan sistem keamanan terpadu
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex flex-col gap-2 text-start">
                                <IconSurface
                                    bgClass="bg-accent"
                                    className="w-min"
                                >
                                    <UsersIcon color="var(--color-primary)" />
                                </IconSurface>
                                <h3 className="font-semibold">
                                    Komunitas Friendly
                                </h3>
                                <p className="text-muted-foreground">
                                    Lingkungan penghuni yang ramah dan supportif
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="flex flex-col gap-2 text-start">
                                <div className="p-2 bg-accent rounded-lg w-min ">
                                    <ClockIcon color="var(--color-primary)" />
                                </div>
                                <h3 className="font-semibold">
                                    Akses Fleksibel
                                </h3>
                                <p className="text-muted-foreground">
                                    Check-in/out mudah dengan sistem digital
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default page;
