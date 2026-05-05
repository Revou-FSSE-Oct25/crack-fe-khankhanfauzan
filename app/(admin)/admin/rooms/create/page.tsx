"use client";

import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { Field, FieldGroup } from "@/components/ui/field";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFacilities } from "@/services/facilities";
import { createRoom } from "@/services/rooms";
import { Facility } from "@/types/facilities";
import { getSession } from "@/actions/auth";
import { CheckCircle2 } from "lucide-react";

type FormValues = {
    roomNumber: string;
    roomType: string;
    floor: number | undefined;
    price: number | undefined;
    status: "available" | "occupied" | "unavailable";
    facilities: number[];
    length: number | undefined;
    width: number | undefined;
    area?: number | undefined;
    unit?: "m";
};

export default function Page() {
    const router = useRouter();
    const [facilities, setFacilities] = useState<Facility[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const { register, handleSubmit, control, reset, setValue, watch } =
        useForm<FormValues>({
            defaultValues: {
                roomNumber: "",
                roomType: "standard",
                floor: undefined,
                price: undefined,
                status: "available",
                facilities: [],
                length: undefined,
                width: undefined,
                area: undefined,
                unit: "m",
            },
        });

    const facilitiesWatch = watch("facilities");

    async function onSubmit(values: FormValues) {
        try {
            const session = getSession();
            const token = session?.accessToken;

            const selectedFacilities = facilities
                .filter((f) => facilitiesWatch.includes(f.id))
                .map((f) => ({
                    id: f.id,
                    name: f.name,
                    description: f.description ?? null,
                }));

            console.log(selectedFacilities);
            const payload = {
                roomNumber: values.roomNumber,
                floor: values.floor ?? 0,
                roomType: values.roomType || "standard",
                price: values.price ?? 0,
                status: values.status,
                facilities: selectedFacilities,
                dimensions: {
                    length: values.length ?? 0,
                    width: values.width ?? 0,
                    area: values.area,
                    unit: values.unit ?? "m",
                },
            };
            await createRoom(payload, { token });
            reset();
            setErrorMsg(null);
            setIsSuccessModalOpen(true);
        } catch (e) {
            const msg = e instanceof Error ? e.message : "Gagal membuat kamar";
            setErrorMsg(msg);
        }
    }

    function toggleFacility(val: number, checked: boolean) {
        const set = new Set(facilitiesWatch);
        if (checked) set.add(val);
        else set.delete(val);
        setValue("facilities", Array.from(set));
    }

    useEffect(() => {
        const session = getSession();
        const token = session?.accessToken;

        fetchFacilities({ token })
            .then((value) => setFacilities(value.data))
            .catch((e) =>
                setErrorMsg(e instanceof Error ? e.message : String(e)),
            )
            .finally();
    }, []);

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Buat Kamar</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/rooms">
                            <Button variant="outline">Kembali</Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() =>
                                reset({
                                    roomNumber: "",
                                    roomType: "standard",
                                    floor: undefined,
                                    price: undefined,
                                    status: "available",
                                    facilities: [],
                                    length: undefined,
                                    width: undefined,
                                    area: undefined,
                                    unit: "m",
                                })
                            }
                        >
                            Reset
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)}>Simpan</Button>
                    </div>
                </div>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle>Informasi Kamar</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="roomNumber">Room Number</Label>
                                <Input
                                    id="roomNumber"
                                    {...register("roomNumber")}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="floor">Lantai</Label>
                                <Input
                                    id="floor"
                                    type="number"
                                    {...register("floor", {
                                        valueAsNumber: true,
                                    })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Room Type</Label>
                                <Controller
                                    name="roomType"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-56 bg-card">
                                                <SelectValue placeholder="Pilih Tipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="standard">
                                                    Standard
                                                </SelectItem>
                                                <SelectItem value="deluxe">
                                                    Deluxe
                                                </SelectItem>
                                                <SelectItem value="superior">
                                                    Superior
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="price">Harga Bulanan</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    {...register("price", {
                                        valueAsNumber: true,
                                    })}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Status</Label>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-56 bg-card">
                                                <SelectValue placeholder="Pilih Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="available">
                                                    Available
                                                </SelectItem>
                                                <SelectItem value="occupied">
                                                    Occupied
                                                </SelectItem>
                                                <SelectItem value="unavailable">
                                                    Unavailable
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="length">Panjang (m)</Label>
                                    <Input
                                        id="length"
                                        type="number"
                                        step="0.1"
                                        {...register("length", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="width">Lebar (m)</Label>
                                    <Input
                                        id="width"
                                        type="number"
                                        step="0.1"
                                        {...register("width", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="area">
                                        Luas (opsional)
                                    </Label>
                                    <Input
                                        id="area"
                                        type="number"
                                        step="0.1"
                                        {...register("area", {
                                            valueAsNumber: true,
                                        })}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Controller
                                        name="unit"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-28 bg-card">
                                                    <SelectValue placeholder="m" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="m">
                                                        m
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Fasilitas</Label>
                                <FieldGroup>
                                    {facilities.map((facility) => (
                                        <Field
                                            key={facility.id}
                                            orientation="horizontal"
                                        >
                                            <Checkbox
                                                id={facility.id.toString()}
                                                checked={facilitiesWatch.includes(
                                                    facility.id,
                                                )}
                                                onCheckedChange={(v) =>
                                                    toggleFacility(
                                                        facility.id,
                                                        Boolean(v),
                                                    )
                                                }
                                            />
                                            <Label
                                                htmlFor={facility.id.toString()}
                                            >
                                                {facility.name}
                                            </Label>
                                        </Field>
                                    ))}
                                </FieldGroup>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Success Modal */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <Card className="w-87.5 shadow-lg animate-in fade-in zoom-in duration-200">
                        <CardHeader className="text-center pb-2">
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            </div>
                            <CardTitle className="text-2xl">
                                Berhasil!
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 text-center">
                            <p className="text-muted-foreground">
                                Kamar baru telah berhasil ditambahkan.
                            </p>
                            <Button
                                className="w-full mt-2"
                                onClick={() => {
                                    setIsSuccessModalOpen(false);
                                    router.push("/admin/rooms");
                                }}
                            >
                                Kembali ke Daftar Kamar
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
