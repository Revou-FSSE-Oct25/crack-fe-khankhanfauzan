"use client";
import { useCallback, useEffect, useState } from "react";
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
} from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { http } from "@/lib/http/client";
import { AlertBanner } from "@/components/ui/alert-banner";

type FormValues = {
    fullname: string;
    email: string;
    whatsappNumber?: string;
    marital_status: "single" | "married";
    address?: string;
    ktp?: string;
    marriage?: string;
};

function readSession() {
    const cookies = document.cookie ? document.cookie.split("; ") : [];
    for (const c of cookies) {
        const [k, ...rest] = c.split("=");
        if (k === "session") {
            try {
                return JSON.parse(decodeURIComponent(rest.join("="))) as {
                    userId?: string | number;
                    accessToken?: string;
                };
            } catch {
                return null;
            }
        }
    }
    return null;
}

export function PersonalInfoSection() {
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
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            fullname: "",
            email: "",
            whatsappNumber: "",
            marital_status: "single",
            address: "",
            ktp: "",
            marriage: "",
        },
    });
    const marital = useWatch({ control, name: "marital_status" });

    const loadMe = useCallback(async () => {
        const s = readSession();
        const token = s?.accessToken;
        if (!token) return;
        try {
            const res = await http.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
                cache: "no-store",
            });
            const u =
                (
                    res as {
                        data?: {
                            fullname?: string;
                            email?: string;
                            whatsappNumber?: string;
                            marital_status?: string;
                        };
                    }
                )?.data ?? {};
            reset({
                fullname: u.fullname ?? "",
                email: u.email ?? "",
                whatsappNumber: u.whatsappNumber ?? "",
                marital_status:
                    (u.marital_status as "single" | "married") ?? "single",
                address: "",
                ktp: "",
                marriage: "",
            });
        } catch {
            setBanner({ type: "error", text: "Gagal memuat profil" });
        }
    }, [reset]);

    useEffect(() => {
        const t = setTimeout(() => {
            void loadMe();
        }, 0);
        return () => clearTimeout(t);
    }, [loadMe]);

    async function onSubmit(values: FormValues) {
        const s = readSession();
        const token = s?.accessToken;
        const userId = s?.userId;
        if (!token || !userId) {
            setBanner({
                type: "error",
                text: "Sesi tidak ditemukan. Silakan login kembali.",
            });
            return;
        }
        const payload = {
            fullname: values.fullname,
            email: values.email,
            whatsappNumber: values.whatsappNumber || undefined,
            marital_status: values.marital_status,
            address: values.address || undefined,
            ktp: values.ktp || undefined,
            marriage: values.marriage || undefined,
        };
        try {
            await http.patch(`/users/${userId}/profile`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
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
                            <FieldLabel htmlFor="email">
                                Email{" "}
                                <span className="text-destructive">*</span>
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="email"
                                    type="email"
                                    disabled={!isEditing}
                                    {...register("email", {
                                        required: "Email wajib diisi",
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
                            <Controller
                                control={control}
                                name="marital_status"
                                render={({ field }) => (
                                    <Select
                                        value={field.value}
                                        onValueChange={field.onChange}
                                    >
                                        <SelectTrigger disabled={!isEditing}>
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
                            <FieldLabel htmlFor="ktp">KTP</FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="ktp"
                                    type="text"
                                    disabled={!isEditing}
                                    {...register("ktp")}
                                />
                                <InputGroupAddon>
                                    <IdCardIcon />
                                </InputGroupAddon>
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="marriage">
                                Buku Nikah{" "}
                                {marital === "married" ? (
                                    <span className="text-destructive">*</span>
                                ) : null}
                            </FieldLabel>
                            <InputGroup>
                                <InputGroupInput
                                    id="marriage"
                                    type="text"
                                    disabled={!isEditing}
                                    {...register("marriage")}
                                />
                                <InputGroupAddon>
                                    <BookOpenCheckIcon />
                                </InputGroupAddon>
                            </InputGroup>
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
                            Submit
                        </Button>
                    </CardFooter>
                ) : null}
            </Card>
        </form>
    );
}
