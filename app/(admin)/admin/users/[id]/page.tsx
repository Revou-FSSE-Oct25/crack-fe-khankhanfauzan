"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchUserById, updateUser } from "@/services/users";
import type { User } from "@/types/users";
import Link from "next/link";
import { useEffect, useState } from "react";
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
    BookOpenCheckIcon,
    IdCardIcon,
    MailIcon,
    PhoneIcon,
    UserIcon,
    PencilIcon,
} from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { getSession } from "@/actions/auth";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { useRef } from "react";
import { updateProfile } from "@/services/users";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type FormValues = {
    fullname: string;
    email: string;
    whatsappNumber: string;
    marital_status: "single" | "married";
    role: "tenant" | "admin";
};

export default function Page() {
    const params = useParams();
    const id = String(params?.id ?? "");

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [detail, setDetail] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<
        FormValues & {
            ktpFile?: File | null;
            marriageFile?: File | null;
            avatarFile?: File | null;
        }
    >({
        defaultValues: {
            fullname: "",
            email: "",
            whatsappNumber: "",
            marital_status: "single",
            role: "tenant",
            ktpFile: null,
            marriageFile: null,
            avatarFile: null,
        },
    });

    // File watches for preview
    const ktpFile = useWatch({ control, name: "ktpFile" });
    const marriageFile = useWatch({ control, name: "marriageFile" });
    const avatarFile = useWatch({ control, name: "avatarFile" });

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

    const loadData = async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const session = getSession();
            const token = session?.accessToken;

            const res = await fetchUserById(id, { token });
            const data = res.data;

            setDetail(data);
            reset({
                fullname: data?.profile?.fullName ?? "",
                email: data?.email ?? "",
                whatsappNumber: data?.profile?.whatsappNumber ?? "",
                marital_status:
                    (data?.profile?.maritalStatus as "single" | "married") ??
                    "single",
                role: (data?.role as "tenant" | "admin") ?? "tenant",
                ktpFile: null,
                marriageFile: null,
                avatarFile: null,
            });
        } catch (e: any) {
            setErrorMsg(e.message || "Gagal memuat data pengguna");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const onSubmit = async (
        data: FormValues & {
            ktpFile?: File | null;
            marriageFile?: File | null;
            avatarFile?: File | null;
        },
    ) => {
        setIsSaving(true);
        try {
            const session = getSession();
            const token = session?.accessToken;

            // 1. Update User Admin Info
            await updateUser(
                id,
                {
                    fullName: data.fullname,
                    whatsappNumber: data.whatsappNumber,
                    maritalStatus: data.marital_status,
                    role: data.role,
                },
                { token },
            );

            // 2. Upload Files if any
            if (data.avatarFile || data.ktpFile || data.marriageFile) {
                const formData = new FormData();
                if (data.avatarFile) formData.append("fotoProfile", data.avatarFile);
                if (data.ktpFile) formData.append("fotoKtp", data.ktpFile);
                if (data.marriageFile)
                    formData.append("fotoBukuNikah", data.marriageFile);

                try {
                    await updateProfile(id, formData, { token });
                } catch (uploadErr) {
                    console.error("Gagal mengunggah dokumen:", uploadErr);
                    toast.error(
                        "Data berhasil disimpan, tetapi gagal mengunggah dokumen/foto",
                    );
                }
            }

            toast.success("Berhasil memperbarui data pengguna");
            setIsEditing(false);
            loadData(); // Refresh data
        } catch (e: any) {
            toast.error(e.message || "Gagal memperbarui data pengguna");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Detail Pengguna</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/users">
                            <Button variant="outline">Kembali</Button>
                        </Link>
                        {!isEditing ? (
                            <Button
                                onClick={() => setIsEditing(true)}
                                disabled={loading || !!errorMsg}
                            >
                                Edit
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setIsEditing(false);
                                        reset();
                                    }}
                                    disabled={isSaving}
                                >
                                    Batal
                                </Button>
                                <Button
                                    onClick={handleSubmit(onSubmit)}
                                    disabled={isSaving}
                                >
                                    {isSaving && (
                                        <Spinner className="w-4 h-4 mr-2" />
                                    )}
                                    Simpan
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle>Informasi Pengguna</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading && (
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-10 rounded-full" />
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-64" />
                                </div>
                            </div>
                        )}
                        {!loading && errorMsg && (
                            <div className="text-sm">{errorMsg}</div>
                        )}
                        {!loading && !errorMsg && detail && (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar size="lg">
                                            <AvatarImage
                                                src={
                                                    avatarFile
                                                        ? URL.createObjectURL(
                                                              avatarFile,
                                                          )
                                                        : (detail.document
                                                              ?.fotoProfileUrl ??
                                                          undefined)
                                                }
                                                alt={detail.profile?.fullName}
                                                className="object-cover"
                                            />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                        {isEditing && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        avatarInputRef.current?.click()
                                                    }
                                                    className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full border-2 border-white hover:bg-primary/90 transition-colors"
                                                >
                                                    <PencilIcon className="w-3 h-3" />
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
                                            </>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-semibold">
                                            {detail.profile?.fullName}
                                        </div>
                                        <div className="text-muted-foreground text-sm">
                                            {detail.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
                                        <Field>
                                            <FieldLabel htmlFor="fullname">
                                                Nama Lengkap{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    id="fullname"
                                                    type="text"
                                                    disabled={!isEditing}
                                                    {...register("fullname", {
                                                        required:
                                                            "Nama Lengkap wajib diisi",
                                                    })}
                                                />
                                                <InputGroupAddon>
                                                    <UserIcon />
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <FieldError>
                                                {errors.fullname?.message?.toString()}
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
                                                    disabled={!isEditing}
                                                    {...register("email", {
                                                        required:
                                                            "Email wajib diisi",
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
                                            <FieldLabel htmlFor="whatsappnumber">
                                                Nomor Whatsapp{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    id="whatsappnumber"
                                                    type="tel"
                                                    disabled={!isEditing}
                                                    {...register(
                                                        "whatsappNumber",
                                                        {
                                                            required:
                                                                "Nomor Whatsapp wajib diisi",
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
                                            <FieldLabel htmlFor="maritalstatus">
                                                Status Kawin{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </FieldLabel>
                                            <Controller
                                                control={control}
                                                name="marital_status"
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            disabled={
                                                                !isEditing
                                                            }
                                                        >
                                                            <SelectValue placeholder="Select Marital Status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="married">
                                                                Married
                                                            </SelectItem>
                                                            <SelectItem value="single">
                                                                Single
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />
                                        </Field>
                                        <Field>
                                            <FieldLabel htmlFor="role">
                                                Peran (Role){" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </FieldLabel>
                                            <Controller
                                                control={control}
                                                name="role"
                                                render={({ field }) => (
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            disabled={
                                                                !isEditing
                                                            }
                                                        >
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
                                        </Field>
                                        {/* Upload Documents for Admin */}
                                        <div className="mt-4 pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div className="flex flex-col gap-2">
                                                <FieldLabel>
                                                    Foto KTP
                                                </FieldLabel>
                                                {isEditing ? (
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
                                                ) : null}

                                                {ktpFile ? (
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
                                                ) : detail.document
                                                      ?.fotoKtpUrl ? (
                                                    <div className="mt-3 relative w-full max-w-50 aspect-video rounded-md overflow-hidden border">
                                                        <Image
                                                            src={
                                                                detail.document
                                                                    .fotoKtpUrl
                                                            }
                                                            alt="KTP Terdaftar"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground mt-2">
                                                        Belum ada KTP
                                                    </p>
                                                )}
                                                {detail.document
                                                    ?.fotoKtpUrl && (
                                                    <a
                                                        href={
                                                            detail.document
                                                                ?.fotoKtpUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[10px] text-primary hover:underline mt-1 block"
                                                    >
                                                        Buka KTP penuh ↗
                                                    </a>
                                                )}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <FieldLabel>
                                                    Buku Nikah
                                                </FieldLabel>
                                                {isEditing ? (
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
                                                            ref={
                                                                marriageInputRef
                                                            }
                                                            onChange={handleFileChange(
                                                                "marriageFile",
                                                            )}
                                                        />
                                                    </div>
                                                ) : null}

                                                {marriageFile ? (
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
                                                ) : detail.document
                                                      ?.fotoBukuNikahUrl ? (
                                                    <div className="mt-3 relative w-full max-w-50 aspect-video rounded-md overflow-hidden border">
                                                        <Image
                                                            src={
                                                                detail.document
                                                                    .fotoBukuNikahUrl
                                                            }
                                                            alt="Buku Nikah Terdaftar"
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground mt-2">
                                                        Belum ada Buku Nikah
                                                    </p>
                                                )}
                                                {detail.document
                                                    ?.fotoBukuNikahUrl && (
                                                    <a
                                                        href={
                                                            detail.document
                                                                ?.fotoBukuNikahUrl
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-[10px] text-primary hover:underline mt-1 block"
                                                    >
                                                        Buka Buku Nikah penuh ↗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </FieldGroup>

                                    {/* TODO: IMPORTANT */}
                                    {/* <div className="flex flex-col gap-1">
                                        <div className="text-sm font-medium">
                                            Hunian Saat Ini
                                        </div>
                                        <div className="text-sm">
                                            Kamar:{" "}
                                            {detail.currentStay?.roomNumber ||
                                                "-"}
                                        </div>
                                        <div className="text-sm">
                                            Properti:{" "}
                                            {detail.currentStay?.propertyName ||
                                                "-"}
                                        </div>
                                        <div className="text-sm">
                                            Status:{" "}
                                            {detail.currentStay?.status || "-"}
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
