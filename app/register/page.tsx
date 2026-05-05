"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    EyeIcon,
    EyeOffIcon,
    LockIcon,
    MailIcon,
    PhoneIcon,
    UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidEmail } from "@/lib/utils";
import { register as registerApi } from "@/services/auth";
import { useRouter } from "next/navigation";
import type { ApiError } from "@/lib/http/client";
import { Spinner } from "@/components/ui/spinner";

function Page() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<{
        fullname: string;
        email: string;
        whatsapp: string;
        password: string;
        confirmPassword: string;
    }>();

    const onSubmit = async (data: {
        fullname: string;
        email: string;
        whatsapp: string;
        password: string;
        confirmPassword: string;
    }) => {
        setErrorMsg(null);
        setLoading(true);
        try {
            const res = await registerApi({
                fullname: data.fullname,
                email: data.email,
                whatsappNumber: data.whatsapp,
                password: data.password,
                confirmPassword: data.confirmPassword,
            });
            console.log(res);
            if (res?.status === 201 || res?.status === 200) {
                router.push("/login");
                return;
            }
            setErrorMsg(res?.message || "Pendaftaran gagal");
        } catch (e) {
            const err = e as ApiError;
            setErrorMsg(err?.message || "Pendaftaran gagal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
            <div className="w-full max-w-sm">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FieldSet className="w-full gap-6">
                        <FieldGroup className="gap-4">
                            <Field>
                                <FieldLabel htmlFor="fullname">
                                    Fullname
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="fullname"
                                        type="text"
                                        placeholder="John Doe"
                                        aria-invalid={
                                            errors.fullname ? true : undefined
                                        }
                                        {...register("fullname", {
                                            required: "Nama wajib diisi",
                                        })}
                                    />
                                    <InputGroupAddon>
                                        <UserIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                                <p className="text-destructive text-sm min-h-5">
                                    {errors.fullname?.message?.toString()}
                                </p>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="email"
                                        type="email"
                                        placeholder="example@mail.com"
                                        aria-invalid={
                                            errors.email ? true : undefined
                                        }
                                        {...register("email", {
                                            required: "Email wajib diisi",
                                            validate: (v) =>
                                                isValidEmail(v) ||
                                                "Email tidak valid",
                                        })}
                                    />
                                    <InputGroupAddon>
                                        <MailIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                                <p className="text-destructive text-sm min-h-5">
                                    {errors.email?.message?.toString()}
                                </p>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="whatsapp">
                                    WhatsApp Number
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="whatsapp"
                                        type="tel"
                                        placeholder="+62 812-1234-5678"
                                        aria-invalid={
                                            errors.whatsapp ? true : undefined
                                        }
                                        {...register("whatsapp", {
                                            required:
                                                "Nomor WhatsApp wajib diisi",
                                        })}
                                    />
                                    <InputGroupAddon>
                                        <PhoneIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                                <p className="text-destructive text-sm min-h-5">
                                    {errors.whatsapp?.message?.toString()}
                                </p>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password">
                                    Password
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="••••••••"
                                        aria-invalid={
                                            errors.password ? true : undefined
                                        }
                                        {...register("password", {
                                            required: "Password wajib diisi",
                                            minLength: {
                                                value: 8,
                                                message: "Minimal 8 karakter",
                                            },
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((prev) => !prev)
                                        }
                                    >
                                        <InputGroupAddon align="inline-end">
                                            {showPassword ? (
                                                <EyeIcon />
                                            ) : (
                                                <EyeOffIcon />
                                            )}
                                        </InputGroupAddon>
                                    </button>
                                    <InputGroupAddon>
                                        <LockIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                                <p className="text-destructive text-sm min-h-5">
                                    {errors.password?.message?.toString()}
                                </p>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="confirm-password">
                                    Confirm Password
                                </FieldLabel>
                                <InputGroup>
                                    <InputGroupInput
                                        id="confirm-password"
                                        type={
                                            showConfirmPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="••••••••"
                                        aria-invalid={
                                            errors.confirmPassword
                                                ? true
                                                : undefined
                                        }
                                        {...register("confirmPassword", {
                                            required:
                                                "Konfirmasi password wajib diisi",
                                            validate: (v) =>
                                                v === watch("password") ||
                                                "Konfirmasi password tidak cocok",
                                        })}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowConfirmPassword(
                                                (prev) => !prev,
                                            )
                                        }
                                    >
                                        <InputGroupAddon align="inline-end">
                                            {showConfirmPassword ? (
                                                <EyeIcon />
                                            ) : (
                                                <EyeOffIcon />
                                            )}
                                        </InputGroupAddon>
                                    </button>
                                    <InputGroupAddon>
                                        <LockIcon />
                                    </InputGroupAddon>
                                </InputGroup>
                                <p className="text-destructive text-sm min-h-5">
                                    {errors.confirmPassword?.message?.toString()}
                                </p>
                            </Field>
                            <Button
                                type="submit"
                                className="rounded-full font-semibold my-2"
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : "Daftar"}
                            </Button>
                            <p className="text-destructive text-sm min-h-5">
                                {errorMsg ?? ""}
                            </p>
                            <div className="flex justify-center items-center mt-2">
                                <p className="text-muted-foreground text-sm">
                                    Sudah punya akun?
                                </p>
                                <Link href="/login">
                                    <Button variant="link">
                                        Masuk Sekarang
                                    </Button>
                                </Link>
                            </div>
                        </FieldGroup>
                    </FieldSet>
                </form>
            </div>
        </div>
    );
}

export default Page;
