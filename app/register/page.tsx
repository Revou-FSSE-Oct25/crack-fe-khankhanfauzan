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
    HouseIcon,
    LockIcon,
    MailIcon,
    PhoneIcon,
    UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidEmail } from "@/lib/utils";

function Page() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    const onSubmit = (data: {
        fullname: string;
        email: string;
        whatsapp: string;
        password: string;
        confirmPassword: string;
    }) => {
        console.log("register submit", data);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <main className="flex flex-col items-center justify-center w-full flex-1 px-12 text-center">
                <div className="bg-white rounded-2xl shadow-2xl flex w-full max-w-6xl overflow-hidden">
                    <div className="bg-primary w-2/4 p-5 text-white items-center flex flex-col gap-2 justify-center">
                        <div className="bg-white p-4 rounded-md w-min mx-auto">
                            <HouseIcon
                                color="var(--color-primary)"
                                size={32}
                                strokeWidth={2.5}
                            />
                        </div>
                        <h1 className="text-2xl font-semibold">
                            Selamat Datang
                        </h1>
                        <p>Buat akun Emerald Kos Anda</p>
                    </div>
                    <div className="bg-white w-2/4 p-4 text-start">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FieldSet className="w-full gap-4">
                                <h2 className="font-bold text-2xl">Register</h2>
                                <FieldGroup className="gap-0">
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
                                                    errors.fullname
                                                        ? true
                                                        : undefined
                                                }
                                                {...register("fullname", {
                                                    required:
                                                        "Nama wajib diisi",
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
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                id="email"
                                                type="email"
                                                placeholder="example@mail.com"
                                                aria-invalid={
                                                    errors.email
                                                        ? true
                                                        : undefined
                                                }
                                                {...register("email", {
                                                    required:
                                                        "Email wajib diisi",
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
                                                    errors.whatsapp
                                                        ? true
                                                        : undefined
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
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                placeholder="••••••••"
                                                aria-invalid={
                                                    errors.password
                                                        ? true
                                                        : undefined
                                                }
                                                {...register("password", {
                                                    required:
                                                        "Password wajib diisi",
                                                    minLength: {
                                                        value: 8,
                                                        message:
                                                            "Minimal 8 karakter",
                                                    },
                                                })}
                                            />
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(
                                                        (prev) => !prev,
                                                    )
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
                                                {...register(
                                                    "confirmPassword",
                                                    {
                                                        required:
                                                            "Konfirmasi password wajib diisi",
                                                        validate: (v) =>
                                                            v ===
                                                                watch(
                                                                    "password",
                                                                ) ||
                                                            "Konfirmasi password tidak cocok",
                                                    },
                                                )}
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
                                    >
                                        Daftar
                                    </Button>
                                    <div className="flex justify-center text-center items-center mt-2">
                                        <p className="text-muted-foreground text-sm">
                                            Sudah punya akun?{" "}
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
            </main>
        </div>
    );
}

export default Page;
