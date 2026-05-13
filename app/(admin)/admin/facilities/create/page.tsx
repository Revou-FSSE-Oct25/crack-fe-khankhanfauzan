"use client";

import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";
import { createFacility } from "@/services/facilities";
import { useRouter } from "next/navigation";
import { getSession } from "@/actions/auth";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

type FormValues = {
    name: string;
    description: string;
};

export default function Page() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { register, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: {
            name: "",
            description: "",
        },
    });

    async function onSubmit(values: FormValues) {
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const session = getSession();
            const token = session?.accessToken;

            const payload = {
                name: values.name,
                description: values.description || null,
            };
            await createFacility(payload, { token });
            reset();
            toast.success("Fasilitas berhasil dibuat");
            router.push("/admin/facilities");
        } catch (e: any) {
            const msg = e?.message || "Gagal membuat fasilitas";
            setErrorMsg(msg);
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Buat Fasilitas</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/facilities">
                            <Button variant="outline" disabled={isSubmitting}>
                                Kembali
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() => reset()}
                            disabled={isSubmitting}
                        >
                            Reset
                        </Button>
                    </div>
                </div>

                <Card className="shadow-none border-0">
                    <CardHeader>
                        <CardTitle>Informasi Fasilitas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {errorMsg && (
                            <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-6">
                                {errorMsg}
                            </div>
                        )}
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="name">
                                            Nama Fasilitas
                                        </Label>
                                        <Input
                                            id="name"
                                            placeholder="Contoh: AC, Wi-Fi, Kolam Renang"
                                            {...register("name", {
                                                required: true,
                                            })}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="description">
                                            Deskripsi (Opsional)
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Deskripsi fasilitas..."
                                            {...register("description")}
                                            rows={4}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && (
                                        <Spinner className="w-4 h-4 mr-2" />
                                    )}
                                    {isSubmitting
                                        ? "Menyimpan..."
                                        : "Simpan Fasilitas"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
