"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { updateFacility, deleteFacility } from "@/services/facilities";
import type { Facility } from "@/types/facilities";
import { getSession } from "@/actions/auth";
import { Spinner } from "@/components/ui/spinner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FormValues = {
    name: string;
    description: string;
};

interface FacilityDetailsFormProps {
    facility: Facility;
}

export default function FacilityDetailsForm({
    facility,
}: FacilityDetailsFormProps) {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { register, handleSubmit } = useForm<FormValues>({
        defaultValues: {
            name: facility?.name ?? "",
            description: facility?.description ?? "",
        },
    });

    async function onSubmit(values: FormValues) {
        if (!facility?.id) return;
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const session = getSession();
            const token = session?.accessToken;

            const payload = {
                name: values.name,
                description: values.description || null,
            };
            await updateFacility(facility.id, payload, { token });
            router.push("/admin/facilities");
            router.refresh();
        } catch (e: any) {
            const msg = e?.message || "Gagal memperbarui fasilitas";
            setErrorMsg(msg);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function onDelete() {
        if (!facility?.id) return;
        setIsDeleteDialogOpen(false);
        setIsDeleting(true);
        setErrorMsg(null);

        try {
            const session = getSession();
            const token = session?.accessToken;

            await deleteFacility(facility.id, { token });
            router.push("/admin/facilities");
            router.refresh();
        } catch (e: any) {
            const msg = e?.message || "Gagal menghapus fasilitas";
            setErrorMsg(msg);
            setIsDeleting(false);
        }
    }

    if (!facility) {
        return (
            <div className="bg-muted h-full flex items-center justify-center">
                <p className="text-muted-foreground">
                    Fasilitas tidak ditemukan
                </p>
            </div>
        );
    }

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Detail Fasilitas</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/facilities">
                            <Button
                                variant="outline"
                                disabled={isDeleting || isSubmitting}
                            >
                                Kembali
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            onClick={() => setIsDeleteDialogOpen(true)}
                            disabled={isDeleting || isSubmitting}
                        >
                            {isDeleting && <Spinner className="w-4 h-4 mr-2" />}
                            {isDeleting ? "Menghapus..." : "Hapus"}
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
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isDeleting}
                                >
                                    {isSubmitting && (
                                        <Spinner className="w-4 h-4 mr-2" />
                                    )}
                                    {isSubmitting
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus fasilitas ini?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={onDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
