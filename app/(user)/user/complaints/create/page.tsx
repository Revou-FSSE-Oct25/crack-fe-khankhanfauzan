"use client";

import { createMaintenance } from "@/services/maintenances";
import { getSession } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeftIcon, UploadIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { ComplaintCategory } from "@/types/maintenances";
import Image from "next/image";

const formSchema = z.object({
    category: z.string().min(1, "Kategori harus dipilih"),
    description: z.string().min(10, "Deskripsi minimal 10 karakter"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateComplaintPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: "",
            description: "",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);

            // Limit to 5 images total
            if (images.length + newFiles.length > 5) {
                toast.error("Maksimal 5 gambar yang diperbolehkan");
                return;
            }

            const validFiles = newFiles.filter((file) => {
                if (!file.type.startsWith("image/")) {
                    toast.error(`${file.name} bukan file gambar valid`);
                    return false;
                }
                if (file.size > 5 * 1024 * 1024) {
                    toast.error(`${file.name} melebihi ukuran maksimal 5MB`);
                    return false;
                }
                return true;
            });

            if (validFiles.length > 0) {
                setImages((prev) => [...prev, ...validFiles]);

                // Create previews
                const newPreviews = validFiles.map((file) =>
                    URL.createObjectURL(file),
                );
                setImagePreviews((prev) => [...prev, ...newPreviews]);
            }
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));

        // Revoke URL to prevent memory leaks
        URL.revokeObjectURL(imagePreviews[index]);
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FormValues) => {
        setLoading(true);
        try {
            const session = getSession();
            const token = session?.accessToken;

            const payload = new FormData();
            payload.append("category", data.category);
            payload.append("description", data.description);

            // Append all images
            images.forEach((image) => {
                payload.append("images", image);
            });

            await createMaintenance(payload, { token });
            toast.success("Komplain berhasil dibuat");
            router.push("/user/complaints");
        } catch (error: any) {
            toast.error(error.message || "Gagal membuat komplain");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/user/complaints">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                    </Button>
                </Link>
                <h1 className="text-xl font-bold">Buat Komplain Baru</h1>
            </div>

            <Card className="shadow-none border">
                <CardHeader>
                    <CardTitle>Form Komplain</CardTitle>
                    <CardDescription>
                        Silakan isi detail kendala yang Anda alami di bawah ini.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <Label htmlFor="category">
                                Kategori Komplain{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.category
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Pilih kategori kendala" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="plumbing">
                                                Saluran Air / Pipa (Plumbing)
                                            </SelectItem>
                                            <SelectItem value="electrical">
                                                Kelistrikan (Electrical)
                                            </SelectItem>
                                            <SelectItem value="ac">
                                                AC (Air Conditioning)
                                            </SelectItem>
                                            <SelectItem value="furniture">
                                                Perabotan (Furniture)
                                            </SelectItem>
                                            <SelectItem value="others">
                                                Lainnya (Others)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.category && (
                                <p className="text-sm text-red-500">
                                    {errors.category.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">
                                Deskripsi Kendala{" "}
                                <span className="text-red-500">*</span>
                            </Label>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        id="description"
                                        placeholder="Jelaskan detail kendala yang Anda alami..."
                                        rows={4}
                                        className={
                                            errors.description
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                )}
                            />
                            {errors.description && (
                                <p className="text-sm text-red-500">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-3">
                            <Label>Lampiran Foto (Opsional, maks 5)</Label>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {imagePreviews.map((preview, idx) => (
                                    <div
                                        key={idx}
                                        className="relative aspect-square rounded-lg overflow-hidden border group"
                                    >
                                        <Image
                                            src={preview}
                                            alt={`Preview ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <XIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                {images.length < 5 && (
                                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <UploadIcon className="w-6 h-6 text-gray-400 mb-2" />
                                        <span className="text-xs text-gray-500">
                                            Tambah Foto
                                        </span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto"
                            >
                                {loading ? (
                                    <>
                                        <Spinner className="mr-2 h-4 w-4" />{" "}
                                        Mengirim...
                                    </>
                                ) : (
                                    "Kirim Komplain"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
