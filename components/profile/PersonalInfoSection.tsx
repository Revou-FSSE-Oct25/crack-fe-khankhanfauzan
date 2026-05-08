"use client";
import { useEffect, useState, useRef } from "react";
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
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldDescription,
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
import {
    MailIcon,
    PhoneIcon,
    UserIcon,
    PencilIcon,
    IdCardIcon,
    BookOpenCheckIcon,
    Loader2Icon,
} from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { http } from "@/lib/http/client";
import { updateProfile } from "@/services/users";
import { AlertBanner } from "@/components/ui/alert-banner";
import type { User } from "@/types/users";
import Image from "next/image";
import { getSession } from "@/actions/auth";

type FormValues = {
    fullname: string;
    email: string;
    whatsappNumber?: string;
    marital_status: "single" | "married";
    address?: string;
    ktp?: string;
    marriage?: string;
    ktpFile?: File | null;
    marriageFile?: File | null;
};

export function PersonalInfoSection({ user }: { user: User | null }) {
    const [isMounted, setIsMounted] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [banner, setBanner] = useState<{
        type: "success" | "error" | "info";
        text: string;
    } | null>(null);

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            fullname: user?.profile?.fullName || "",
            email: user?.email || "",
            whatsappNumber:
                user?.profile?.whatsappNumber ||
                user?.profile?.whatsappNumber ||
                "",
            marital_status:
                (user?.profile?.maritalStatus as "single" | "married") ||
                "single",
            address: "",
            ktp: user?.document?.fotoKtpUrl || "",
            marriage: user?.document?.fotoBukuNikahUrl || "",
            ktpFile: null,
            marriageFile: null,
        },
    });

    const marital = useWatch({ control, name: "marital_status" });
    const ktpUrl = useWatch({ control, name: "ktp" });
    const marriageUrl = useWatch({ control, name: "marriage" });
    const ktpFile = useWatch({ control, name: "ktpFile" });
    const marriageFile = useWatch({ control, name: "marriageFile" });

    const ktpInputRef = useRef<HTMLInputElement>(null);
    const marriageInputRef = useRef<HTMLInputElement>(null);

    const handleKtpFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("ktpFile", file);
            setValue("ktp", URL.createObjectURL(file));
        }
    };

    const handleMarriageFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            setValue("marriageFile", file);
            setValue("marriage", URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (user) {
            reset({
                fullname: user.profile?.fullName || "",
                email: user.email || "",
                whatsappNumber:
                    user.profile?.whatsappNumber ||
                    user.profile?.whatsappNumber ||
                    "",
                marital_status:
                    (user.profile?.maritalStatus as "single" | "married") ||
                    "single",
                address: "",
                ktp: user.document?.fotoKtpUrl || "",
                marriage: user.document?.fotoBukuNikahUrl || "",
            });
        }
    }, [user, reset]);

    async function onSubmit(values: FormValues) {
        const s = getSession();
        const token = s?.accessToken;
        const userId = s?.userId;
        if (!token || !userId) {
            setBanner({
                type: "error",
                text: "Sesi tidak ditemukan. Silakan login kembali.",
            });
            return;
        }

        const formData = new FormData();
        if (values.fullname) formData.append("fullName", values.fullname);
        if (values.whatsappNumber)
            formData.append("whatsappNumber", values.whatsappNumber);
        if (values.marital_status)
            formData.append("maritalStatus", values.marital_status);

        if (values.ktpFile) {
            formData.append("fotoKtp", values.ktpFile);
        }

        if (values.marital_status === "married" && values.marriageFile) {
            formData.append("fotoBukuNikah", values.marriageFile);
        }

        try {
            await updateProfile(userId.toString(), formData, { token });
            setIsEditing(false);
            setBanner({ type: "success", text: "Profil berhasil diperbarui" });
        } catch {
            setBanner({ type: "error", text: "Gagal memperbarui profil" });
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {banner ? (
                <AlertBanner
                    variant={
                        banner.type === "success"
                            ? "success"
                            : banner.type === "error"
                              ? "error"
                              : "default"
                    }
                    description={banner.text}
                />
            ) : null}
            <Card className="shadow-none">
                <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                        <h2 className="text-base sm:text-lg font-semibold">
                            Informasi Pribadi
                        </h2>
                        <Button
                            type="button"
                            className="w-min"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditing((v) => !v)}
                        >
                            <PencilIcon />
                            {isEditing ? "Batal" : "Edit"}
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
                        <Field>
                            <FieldLabel htmlFor="fullname">
                                Nama Lengkap{" "}
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="fullname"
                                    type="text"
                                    disabled={!isEditing}
                                    {...register("fullname", {
                                        required: "Nama Lengkap wajib diisi",
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
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="email"
                                    type="email"
                                    disabled={true}
                                    {...register("email")}
                                />
                                <InputGroupAddon>
                                    <MailIcon />
                                </InputGroupAddon>
                            </InputGroup>
                            <FieldDescription>
                                Email tidak dapat diubah
                            </FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="whatsappnumber">
                                Nomor Whatsapp{" "}
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="whatsappnumber"
                                    type="tel"
                                    disabled={!isEditing}
                                    {...register("whatsappNumber", {
                                        required: "Nomor Whatsapp wajib diisi",
                                    })}
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
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            {isMounted ? (
                                <Controller
                                    control={control}
                                    name="marital_status"
                                    render={({ field }) => (
                                        <Select
                                            value={field.value}
                                            onValueChange={field.onChange}
                                        >
                                            <SelectTrigger
                                                disabled={!isEditing}
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
                            ) : (
                                <div className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 opacity-50"></div>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="ktp">KTP</FieldLabel>
                            {isEditing ? (
                                <div className="flex items-center gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            ktpInputRef.current?.click()
                                        }
                                    >
                                        Pilih File KTP
                                    </Button>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        className="hidden"
                                        ref={ktpInputRef}
                                        onChange={handleKtpFileChange}
                                    />
                                    <span className="text-sm text-muted-foreground truncate max-w-50">
                                        {ktpFile?.name ||
                                            "Belum ada file terpilih"}
                                    </span>
                                </div>
                            ) : null}

                            {ktpUrl && (
                                <div className="mt-2">
                                    <Image
                                        src={ktpUrl}
                                        alt="KTP"
                                        width={200}
                                        height={125}
                                        className="rounded-md object-cover border"
                                        unoptimized={ktpUrl.startsWith("blob:")}
                                    />
                                </div>
                            )}
                            {!isEditing && !ktpUrl && (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada KTP yang diunggah
                                </p>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="marriage">
                                Buku Nikah{" "}
                                {marital === "married" ? (
                                    <span className="text-destructive">*</span>
                                ) : null}
                            </FieldLabel>
                            {isEditing ? (
                                <div className="flex items-center gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() =>
                                            marriageInputRef.current?.click()
                                        }
                                    >
                                        Pilih File Buku Nikah
                                    </Button>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, image/jpg"
                                        className="hidden"
                                        ref={marriageInputRef}
                                        onChange={handleMarriageFileChange}
                                    />
                                    <span className="text-sm text-muted-foreground truncate max-w-50">
                                        {marriageFile?.name ||
                                            "Belum ada file terpilih"}
                                    </span>
                                </div>
                            ) : null}

                            {marriageUrl && (
                                <div className="mt-2">
                                    <Image
                                        src={marriageUrl}
                                        alt="Buku Nikah"
                                        width={200}
                                        height={125}
                                        className="rounded-md object-cover border"
                                        unoptimized={marriageUrl.startsWith(
                                            "blob:",
                                        )}
                                    />
                                </div>
                            )}
                            {!isEditing && !marriageUrl && (
                                <p className="text-sm text-muted-foreground">
                                    Belum ada Buku Nikah yang diunggah
                                </p>
                            )}
                        </Field>
                    </FieldGroup>
                </CardContent>
                {isEditing ? (
                    <CardFooter>
                        <Button
                            className="w-full"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isSubmitting
                                ? "Mengunggah..."
                                : "Simpan Perubahan"}
                        </Button>
                    </CardFooter>
                ) : null}
            </Card>
        </form>
    );
}
