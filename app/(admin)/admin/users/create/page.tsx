"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createUser, updateProfile } from "@/services/users";
import { useForm, Controller } from "react-hook-form";
import type { CreateUserPayload } from "@/types/users";
import Link from "next/link";
import { getSession } from "@/actions/auth";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import {
    PencilIcon,
    IdCardIcon,
    BookOpenCheckIcon,
    MailIcon,
    PhoneIcon,
    UserIcon,
} from "lucide-react";

export default function Page() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { errors },
    } = useForm<
        CreateUserPayload & {
            ktpFile?: File | null;
            marriageFile?: File | null;
            avatarFile?: File | null;
        }
    >({
        defaultValues: {
            fullName: "",
            email: "",
            whatsappNumber: "",
            role: "tenant",
            ktpFile: null,
            marriageFile: null,
            avatarFile: null,
        },
    });

    const watchFullName = watch("fullName");
    const watchEmail = watch("email");
    const watchRole = watch("role");

    // File watches for preview
    const ktpFile = watch("ktpFile");
    const marriageFile = watch("marriageFile");
    const avatarFile = watch("avatarFile");

    const ktpInputRef = useRef<HTMLInputElement>(null);
    const marriageInputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange =
        (field: "ktpFile" | "marriageFile" | "avatarFile") =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                setValue(field, file);
            }
        };

    function initials(name: string) {
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "?";
        const first = parts[0]?.[0] ?? "";
        const last =
            parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
        return (first + last).toUpperCase();
    }

    const onSave = async (
        data: CreateUserPayload & {
            ktpFile?: File | null;
            marriageFile?: File | null;
            avatarFile?: File | null;
        },
    ) => {
        setSaving(true);
        try {
            const session = getSession();
            const token = session?.accessToken;

            // 1. Create User
            const res = await createUser(
                {
                    fullName: data.fullName,
                    email: data.email,
                    whatsappNumber: data.whatsappNumber,
                    role: data.role,
                },
                { token },
            );
            const u = res.data;

            // 2. Upload Files if any
            if (data.avatarFile || data.ktpFile || data.marriageFile) {
                const formData = new FormData();
                if (data.avatarFile) formData.append("avatar", data.avatarFile);
                if (data.ktpFile) formData.append("ktp", data.ktpFile);
                if (data.marriageFile)
                    formData.append("marriage", data.marriageFile);

                try {
                    await updateProfile(u.id, formData, { token });
                } catch (uploadErr) {
                    console.error("Gagal mengunggah dokumen:", uploadErr);
                    toast.error(
                        "Pengguna dibuat, tetapi gagal mengunggah dokumen/foto",
                    );
                }
            }

            toast.success("Pengguna berhasil dibuat");
            router.push(`/admin/users/${u.id}`);
        } catch (err: any) {
            toast.error(err.message || "Gagal membuat pengguna");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Buat Pengguna</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/users">
                            <Button variant="outline">Kembali</Button>
                        </Link>
                        <Button
                            variant="outline"
                            onClick={() => reset()}
                            disabled={saving}
                            type="button"
                        >
                            Reset
                        </Button>
                        <Button
                            onClick={handleSubmit(onSave)}
                            disabled={saving}
                        >
                            {saving ? (
                                <Spinner className="w-4 h-4 mr-2" />
                            ) : null}
                            Simpan
                        </Button>
                    </div>
                </div>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle>Informasi Pengguna</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSave)}>
                            <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage
                                                src={
                                                    avatarFile
                                                        ? URL.createObjectURL(
                                                              avatarFile,
                                                          )
                                                        : undefined
                                                }
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="text-xl">
                                                {initials(watchFullName || "")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                avatarInputRef.current?.click()
                                            }
                                            className="absolute bottom-0 right-0 p-1.5 bg-primary text-primary-foreground rounded-full border-2 border-white hover:bg-primary/90 transition-colors"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <input
                                            type="file"
                                            accept="image/png, image/jpeg, image/jpg"
                                            className="hidden"
                                            ref={avatarInputRef}
                                            onChange={handleFileChange(
                                                "avatarFile",
                                            )}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h2 className="font-semibold text-lg">
                                            {watchFullName || "-"}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {watchRole || "-"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 w-full">
                                    <div className="grid grid-cols-1 gap-4">
                                        <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
                                            <Field>
                                                <FieldLabel htmlFor="fullName">
                                                    Nama Lengkap{" "}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="fullName"
                                                        type="text"
                                                        placeholder="Masukkan nama lengkap"
                                                        {...register(
                                                            "fullName",
                                                            {
                                                                required:
                                                                    "Nama lengkap wajib diisi",
                                                            },
                                                        )}
                                                    />
                                                    <InputGroupAddon>
                                                        <UserIcon />
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <FieldError>
                                                    {errors.fullName?.message?.toString()}
                                                </FieldError>
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="email">
                                                    Email{" "}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="email"
                                                        type="email"
                                                        placeholder="Masukkan email"
                                                        {...register("email", {
                                                            required:
                                                                "Email wajib diisi",
                                                            pattern: {
                                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                                message:
                                                                    "Format email tidak valid",
                                                            },
                                                        })}
                                                    />
                                                    <InputGroupAddon>
                                                        <MailIcon />
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <FieldError>
                                                    {errors.email?.message?.toString()}
                                                </FieldError>
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="whatsappNumber">
                                                    No. WhatsApp{" "}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FieldLabel>
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="whatsappNumber"
                                                        type="tel"
                                                        placeholder="Contoh: 081234567890"
                                                        {...register(
                                                            "whatsappNumber",
                                                            {
                                                                required:
                                                                    "No. WhatsApp wajib diisi",
                                                            },
                                                        )}
                                                    />
                                                    <InputGroupAddon>
                                                        <PhoneIcon />
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <FieldError>
                                                    {errors.whatsappNumber?.message?.toString()}
                                                </FieldError>
                                            </Field>

                                            <Field>
                                                <FieldLabel htmlFor="role">
                                                    Peran (Role){" "}
                                                    <span className="text-destructive">
                                                        *
                                                    </span>
                                                </FieldLabel>
                                                <Controller
                                                    name="role"
                                                    control={control}
                                                    rules={{
                                                        required:
                                                            "Peran wajib dipilih",
                                                    }}
                                                    render={({ field }) => (
                                                        <Select
                                                            value={field.value}
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                        >
                                                            <SelectTrigger className="bg-white">
                                                                <SelectValue placeholder="Pilih Peran" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="tenant">
                                                                    Tenant
                                                                </SelectItem>
                                                                <SelectItem value="admin">
                                                                    Admin
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                                <FieldError>
                                                    {errors.role?.message?.toString()}
                                                </FieldError>
                                            </Field>
                                        </FieldGroup>

                                        {/* Upload Documents */}
                                        <div className="mt-4 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-2">
                                                <FieldLabel>
                                                    Foto KTP (Opsional)
                                                </FieldLabel>
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full sm:w-auto"
                                                        onClick={() =>
                                                            ktpInputRef.current?.click()
                                                        }
                                                    >
                                                        <IdCardIcon className="w-4 h-4 mr-2" />
                                                        Pilih File KTP
                                                    </Button>
                                                    <input
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/jpg"
                                                        className="hidden"
                                                        ref={ktpInputRef}
                                                        onChange={handleFileChange(
                                                            "ktpFile",
                                                        )}
                                                    />
                                                </div>
                                                {ktpFile && (
                                                    <div className="mt-3 relative w-full max-w-50 aspect-video rounded-md overflow-hidden border">
                                                        <Image
                                                            src={URL.createObjectURL(
                                                                ktpFile,
                                                            )}
                                                            alt="Preview KTP"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <FieldLabel>
                                                    Buku Nikah (Opsional)
                                                </FieldLabel>
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full sm:w-auto"
                                                        onClick={() =>
                                                            marriageInputRef.current?.click()
                                                        }
                                                    >
                                                        <BookOpenCheckIcon className="w-4 h-4 mr-2" />
                                                        Pilih Buku Nikah
                                                    </Button>
                                                    <input
                                                        type="file"
                                                        accept="image/png, image/jpeg, image/jpg"
                                                        className="hidden"
                                                        ref={marriageInputRef}
                                                        onChange={handleFileChange(
                                                            "marriageFile",
                                                        )}
                                                    />
                                                </div>
                                                {marriageFile && (
                                                    <div className="mt-3 relative w-full max-w-50 aspect-video rounded-md overflow-hidden border">
                                                        <Image
                                                            src={URL.createObjectURL(
                                                                marriageFile,
                                                            )}
                                                            alt="Preview Buku Nikah"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
