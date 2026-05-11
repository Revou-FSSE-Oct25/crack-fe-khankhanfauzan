"use client";

import { getSession } from "@/actions/auth";
import { AlertBanner } from "@/components/ui/alert-banner";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldTitle,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { getMe } from "@/services/auth";
import { fetchRoomById } from "@/services/rooms";
import { createBooking } from "@/services/bookings";
import { RentType, RentTypeLabel } from "@/types/bookings";
import { Room } from "@/types/rooms";
import { User } from "@/types/users";
import { formatRupiah } from "@/utils/format";
import { CreditCardIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";

type BookingFormInputs = {
    rentType: RentType;
    duration: number;
    startDate: string;
};

function BookingForm() {
    const router = useRouter();

    // Get all query params
    const searchParams = useSearchParams();
    const roomId = searchParams.get("roomId");
    const isExtension = searchParams.get("extend") === "true";

    // state for form
    const [user, setProfile] = useState<User | null>(null);
    const [room, setRoom] = useState<Room | null>(null);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<BookingFormInputs>({
        defaultValues: {
            rentType: "monthly",
            duration: 1,
            startDate: new Date().toISOString().split("T")[0],
        },
    });

    const rentType = watch("rentType");
    const duration = watch("duration");
    const startDate = watch("startDate");

    useEffect(() => {
        const session = getSession();
        const token = session?.accessToken;

        Promise.all([
            getMe(token!).then((value) => setProfile(value.data)),
            roomId
                ? fetchRoomById(roomId, { token }).then((value) =>
                      setRoom(value.data),
                  )
                : Promise.resolve(null),
        ])
            .catch((e) => setErrorMsg(e.message))
            .finally(() => setLoading(false));
    }, [roomId]);

    // Calculate price per unit
    const getPricePerUnit = (type: RentType) => {
        if (!room) return 0;
        if (type === "daily") return room.priceDaily || 0;
        if (type === "weekly") return room.priceWeekly || 0;
        if (type === "monthly") return room.priceMonthly || 0;
        if (type === "yearly") return room.priceYearly || 0;
        return 0;
    };

    const pricePerUnit = getPricePerUnit(rentType);
    const totalPrice = pricePerUnit * (duration || 0);

    const isRentTypeAvailable = (type: RentType) => {
        if (!room) return false;
        if (type === "daily") return room.priceDaily != null;
        if (type === "weekly") return room.priceWeekly != null;
        if (type === "monthly") return room.priceMonthly != null;
        if (type === "yearly") return room.priceYearly != null;
        return false;
    };

    // Auto switch to available rent type if current is not available when room loads
    useEffect(() => {
        if (room && !isRentTypeAvailable(rentType)) {
            const availableTypes =
                Object.values(RentType).filter(isRentTypeAvailable);
            if (availableTypes.length > 0) {
                setValue("rentType", availableTypes[0]);
            }
        }
    }, [room, rentType, setValue]);

    const onSubmit = async (data: BookingFormInputs) => {
        if (!room || !user) return;

        const confirm = window.confirm(
            "Apakah anda sudah yakin dengan data tersebut?",
        );
        if (!confirm) return;

        setIsSubmitting(true);
        setErrorMsg(null);
        try {
            const session = getSession();
            const response = await createBooking(
                {
                    roomId: room.id.toString(), // assuming roomId is needed as string
                    rentType: data.rentType,
                    duration: Number(data.duration),
                    startDate: new Date(data.startDate).toISOString(),
                },
                { token: session?.accessToken },
            );

            if (response.data && response.data.id) {
                router.push(`/user/bookings/${response.data.id}/payment`);
            }
        } catch (error: any) {
            console.error("Booking error:", error);
            setErrorMsg(
                error?.response?.data?.message ||
                    error.message ||
                    "Gagal melakukan booking",
            );
            alert(
                error?.response?.data?.message ||
                    error.message ||
                    "Gagal melakukan booking",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Spinner className="items-center" />;

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-4">
            <div>
                <h1 className="text-lg sm:text-xl font-semibold">
                    {isExtension ? "Perpanjang Sewa" : "Booking"}
                </h1>
            </div>

            {!user?.profile?.maritalStatus && (
                <AlertBanner
                    variant="warning"
                    title="Lengkapi data diri anda."
                    description="Lengkapi status kawin dan unggah dokumen:
                                    Foto KTP serta Buku Nikah (jika status kawin
                                    = menikah). Setelah lengkap, Anda dapat
                                    melanjutkan proses booking."
                    action={
                        <Link href="/user/profile">
                            <Button size="sm" variant="ghost">
                                Lengkapi
                            </Button>
                        </Link>
                    }
                />
            )}

            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
                <Card className="shadow-none">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <CardHeader>
                            <CardTitle>
                                {isExtension
                                    ? "Form Perpanjangan"
                                    : "Form Booking"}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FieldSet>
                                <FieldGroup>
                                    <Field orientation="responsive">
                                        <FieldLabel className="flex flex-col items-start">
                                            <FieldTitle>Tipe Sewa</FieldTitle>
                                            <FieldDescription>
                                                Pilih Harian, Mingguan, Bulanan,
                                                atau Tahunan
                                            </FieldDescription>
                                        </FieldLabel>
                                        <FieldContent>
                                            <Controller
                                                name="rentType"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                        disabled={!room}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Object.values(
                                                                RentType,
                                                            ).map((type) => {
                                                                const available =
                                                                    isRentTypeAvailable(
                                                                        type,
                                                                    );
                                                                return (
                                                                    <SelectItem
                                                                        key={
                                                                            type
                                                                        }
                                                                        value={
                                                                            type
                                                                        }
                                                                        disabled={
                                                                            !available
                                                                        }
                                                                    >
                                                                        {
                                                                            RentTypeLabel[
                                                                                type
                                                                            ]
                                                                        }{" "}
                                                                        {!available &&
                                                                            "(Tidak Tersedia)"}
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </FieldContent>
                                    </Field>

                                    <Field orientation="responsive">
                                        <FieldLabel className="flex flex-col items-start">
                                            <FieldTitle>Durasi Sewa</FieldTitle>
                                            <FieldDescription>
                                                Berapa lama menyewa kamar
                                            </FieldDescription>
                                        </FieldLabel>
                                        <FieldContent>
                                            <Controller
                                                name="duration"
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    min: 1,
                                                }}
                                                render={({ field }) => (
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        placeholder="Contoh: 1"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                ) || 0,
                                                            )
                                                        }
                                                    />
                                                )}
                                            />
                                        </FieldContent>
                                    </Field>

                                    <Field orientation="responsive">
                                        <FieldLabel className="flex flex-col items-start">
                                            <FieldTitle>
                                                Rencana Masuk
                                            </FieldTitle>
                                            <FieldDescription>
                                                Tanggal mulai menempati kamar
                                            </FieldDescription>
                                        </FieldLabel>
                                        <FieldContent>
                                            <Controller
                                                name="startDate"
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <Input
                                                        type="date"
                                                        {...field}
                                                    />
                                                )}
                                            />
                                        </FieldContent>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>
                        </CardContent>
                        <CardFooter className="mt-4">
                            <div className="flex flex-col gap-2 w-full">
                                <Button
                                    type="submit"
                                    disabled={
                                        !user?.profile?.maritalStatus ||
                                        isSubmitting ||
                                        !room
                                    }
                                    className="w-full rounded-full"
                                >
                                    {isSubmitting ? (
                                        <Loader2Icon className="mr-2 animate-spin" />
                                    ) : (
                                        <CreditCardIcon className="mr-2" />
                                    )}
                                    {isExtension
                                        ? "Konfirmasi Perpanjangan"
                                        : "Konfirmasi Booking"}
                                </Button>
                                {!user?.profile?.maritalStatus && (
                                    <p className="text-xs text-muted-foreground text-center">
                                        Lengkapi profil terlebih dahulu untuk
                                        melanjutkan. Buka halaman Profil.
                                    </p>
                                )}
                            </div>
                        </CardFooter>
                    </form>
                </Card>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle>Ringkasan Booking</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kamar
                                </p>
                                <p className="font-medium">
                                    {room?.roomNumber || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Lantai
                                </p>
                                <p className="font-medium">
                                    {room?.floor || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Ukuran
                                </p>
                                <p className="font-medium">
                                    {room?.dimensions?.area || "-"}m²
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Harga/{RentTypeLabel[rentType] || "Sewa"}
                                </p>
                                <p className="font-medium">
                                    {pricePerUnit
                                        ? formatRupiah(pricePerUnit)
                                        : "-"}
                                </p>
                            </div>
                        </div>
                        <div className="rounded-md bg-muted px-3 py-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Total</p>
                                <p className="text-lg font-semibold">
                                    {formatRupiah(totalPrice)}
                                </p>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Dengan melanjutkan, Anda menyetujui syarat dan
                            ketentuan yang berlaku.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense fallback={<Spinner className="items-center" />}>
            <BookingForm />
        </Suspense>
    );
}
