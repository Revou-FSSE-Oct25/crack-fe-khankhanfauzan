"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

type FormValues = {
    user_id: string;
    room_id: string;
    category: "electrical" | "plumbing" | "hvac" | "general";
    status: "new" | "in_progress" | "resolved" | "rejected";
    priority: "high" | "medium" | "low";
    description: string;
};

function getDefaults(id: string): FormValues {
    if (id === "MT-001") {
        return {
            user_id: "USR-0001",
            room_id: "K-08",
            category: "plumbing",
            status: "new",
            priority: "high",
            description: "Kebocoran pipa di kamar mandi.",
        };
    }
    if (id === "MT-002") {
        return {
            user_id: "USR-0002",
            room_id: "K-21",
            category: "electrical",
            status: "in_progress",
            priority: "medium",
            description: "Listrik sering turun, perlu pengecekan MCB.",
        };
    }
    return {
        user_id: "",
        room_id: "",
        category: "electrical",
        status: "new",
        priority: "medium",
        description: "",
    };
}

export default function Page() {
    const params = useParams();
    const id = String(params?.id ?? "");
    const defaults = React.useMemo(() => getDefaults(id), [id]);

    const { register, handleSubmit, control, reset } = useForm<FormValues>({
        defaultValues: defaults,
    });

    React.useEffect(() => {
        reset(defaults);
    }, [defaults, reset]);

    function onSubmit(values: FormValues) {
        void values;
    }

    function onReset() {
        reset(defaults);
    }

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Detail Tiket</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/maintenances">
                            <Button variant="outline">Kembali</Button>
                        </Link>
                        <Button variant="outline" onClick={onReset}>
                            Reset
                        </Button>
                        <Button onClick={handleSubmit(onSubmit)}>Simpan</Button>
                    </div>
                </div>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle>{id}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="user_id">User ID</Label>
                                <Input id="user_id" {...register("user_id")} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="room_id">Room ID</Label>
                                <Input id="room_id" {...register("room_id")} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Kategori</Label>
                                <Controller
                                    name="category"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-56 bg-card">
                                                <SelectValue placeholder="Pilih Kategori" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="electrical">
                                                    Electrical
                                                </SelectItem>
                                                <SelectItem value="plumbing">
                                                    Plumbing
                                                </SelectItem>
                                                <SelectItem value="hvac">
                                                    HVAC
                                                </SelectItem>
                                                <SelectItem value="general">
                                                    General
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
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
                                                <SelectItem value="new">
                                                    Baru
                                                </SelectItem>
                                                <SelectItem value="in_progress">
                                                    Proses
                                                </SelectItem>
                                                <SelectItem value="resolved">
                                                    Selesai
                                                </SelectItem>
                                                <SelectItem value="rejected">
                                                    Ditolak
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label>Prioritas</Label>
                                <Controller
                                    name="priority"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger className="w-56 bg-card">
                                                <SelectValue placeholder="Pilih Prioritas" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="high">
                                                    Tinggi
                                                </SelectItem>
                                                <SelectItem value="medium">
                                                    Sedang
                                                </SelectItem>
                                                <SelectItem value="low">
                                                    Rendah
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="description">Deskripsi</Label>
                                <Textarea
                                    id="description"
                                    rows={5}
                                    {...register("description")}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
