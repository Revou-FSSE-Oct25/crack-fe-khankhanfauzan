import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

function page() {
    return (
        <div className="mx-4">
            <div className="grid grid-cols-2">
                <div className="flex flex-col">
                    <div className="flex flex-col">
                        <h1>Emerald Residence</h1>
                        <p>Jl. Pasaeno Lrg. Swadaya, Kota Kendari</p>
                        <span className="flex">
                            <h2>Rp.1.500.000</h2> <p>/ bulan</p>
                        </span>
                        <Button className="w-min rounded-full font-semibold">
                            <CalendarIcon />
                            Cek Ketersediaan
                        </Button>

                        <div className="flex gap-2">
                            <div className="flex items-center gap-2">
                                <UsersRoundIcon />
                                <div className="flex flex-col">
                                    <p>Kapasitas</p>
                                    <p>1 Orang</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <BedIcon />
                                <div className="flex flex-col">
                                    <p>Kasur</p>
                                    <p>Single</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <MaximizeIcon />
                                <div className="flex flex-col">
                                    <p>Ukuran</p>
                                    <p>3x4 m</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h2>Tentang Properti</h2>
                        <p>
                            Emerald Residence menawarkan hunian kost eksklusif
                            dengan desain modern minimalis di lokasi strategis
                            Kota Kendari. Dilengkapi dengan fasilitas lengkap
                            dan sistem manajemen digital untuk kenyamanan
                            maksimal penghuni.
                        </p>
                    </div>
                    <div>
                        <h2>Fasilitas</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <div className="p-2 bg-accent rounded-xl">
                                        <WifiIcon color="var(--color-primary)" />
                                    </div>
                                    Wi-Fi
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <div className="p-2 bg-accent rounded-xl">
                                        <WindIcon color="var(--color-primary)" />
                                    </div>
                                    AC
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <div className="p-2 bg-accent rounded-xl">
                                        <BathIcon color="var(--color-primary)" />
                                    </div>
                                    Kamar Mandi Dalam
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <div className="p-2 bg-accent rounded-xl">
                                        <CookingPotIcon color="var(--color-primary)" />
                                    </div>
                                    Dapur
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <div className="p-2 bg-accent rounded-xl">
                                        <Columns2Icon color="var(--color-primary)" />
                                    </div>
                                    Lemari Pakaian
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex gap-2 items-center">
                                    <div className="p-2 bg-accent rounded-xl">
                                        <LampDeskIcon color="var(--color-primary)" />
                                    </div>
                                    Meja Kerja
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <div>
                        <div className="flex gap-2">
                            <StarIcon fill="orange" stroke="0" />
                            <h2>4.9</h2>
                            <p>· 2 ulasan</p>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            <Card>
                                <CardContent className="flex gap-4 items-start">
                                    <Avatar size="lg">
                                        <AvatarImage src="https://i.pravatar.cc/300" />
                                        <AvatarFallback>AP</AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col gap-2 ">
                                        <h2>Andi Pratama</h2>
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
                                        <p>
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
                                    <div className="flex flex-col gap-2 ">
                                        <h2>Sarah Wijaya</h2>
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
                                        <p>
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
                <div>Image</div>
            </div>
            <div className="mt-8 w-full items-center text-center">
                <h2 className="text-2xl font-bold">
                    Mengapa Memilih Emerald Kos?
                </h2>
                <div className="flex gap-4">
                    <Card>
                        <CardContent className="flex flex-col gap-2 text-start">
                            <div className="p-2 bg-accent rounded-lg w-min ">
                                <HomeIcon color="var(--color-primary)" />
                            </div>

                            <h3>Lokasi Strategis</h3>
                            <p>Dekat Mall, Perkantoran dan Pusat Kota</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col gap-2 text-start">
                            <div className="p-2 bg-accent rounded-lg w-min ">
                                <ShieldIcon color="var(--color-primary)" />
                            </div>

                            <h3>Keamanan 24/7</h3>
                            <p>CCTV dan sistem keamanan terpadu</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col gap-2 text-start">
                            <div className="p-2 bg-accent rounded-lg w-min ">
                                <UsersIcon color="var(--color-primary)" />
                            </div>

                            <h3>Komunitas Friendly</h3>
                            <p>Lingkungan penghuni yang ramah dan supportif</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex flex-col gap-2 text-start">
                            <div className="p-2 bg-accent rounded-lg w-min ">
                                <ClockIcon color="var(--color-primary)" />
                            </div>

                            <h3>Akses Fleksibel</h3>
                            <p>Check-in/out mudah dengan sistem digital</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default page;
