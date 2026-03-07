"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
    EyeIcon,
    EyeOffIcon,
    HouseIcon,
    LockIcon,
    MailIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidEmail } from "@/lib/utils";
import { redirect } from "next/navigation";

function Page() {
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ email: string; password: string; remember: boolean }>();

    const onSubmit = (data: {
        email: string;
        password: string;
        remember: boolean;
    }) => {
        // Submit handler placeholder
        console.log("login submit", data);

        redirect("/user");
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
                            Selamat Datang Kembali
                        </h1>
                        <p>Masuk ke akun Emerald Kos Anda</p>
                    </div>
                    <div className="bg-white w-2/4 p-4 text-start">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FieldSet className="w-full gap-4">
                                <h2 className="font-bold text-2xl">Login</h2>
                                <FieldGroup className="gap-0">
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

                                    <div className="flex">
                                        <Field orientation="horizontal">
                                            <Checkbox
                                                id="terms-checkbox"
                                                {...register("remember")}
                                            />
                                            <Label htmlFor="terms-checkbox">
                                                Ingat Saya
                                            </Label>
                                        </Field>

                                        <Button variant="link" asChild>
                                            <Link href="/forgot-password">
                                                Lupa Password?
                                            </Link>
                                        </Button>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="rounded-full font-semibold my-2"
                                    >
                                        Masuk
                                    </Button>
                                    <div className="flex justify-center text-center items-center mt-2">
                                        <p className="text-muted-foreground text-sm">
                                            Belum punya akun?
                                        </p>
                                        <Link href="/register">
                                            <Button variant="link">
                                                Daftar Sekarang
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
