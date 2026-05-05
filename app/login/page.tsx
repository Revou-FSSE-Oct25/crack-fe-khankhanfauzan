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
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidEmail } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { login as loginAction, getSession } from "@/actions/auth";
import type { LoginActionResult } from "@/actions/auth";
import { ApiError } from "@/lib/http/client";
import { Spinner } from "@/components/ui/spinner";

function Page() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ email: string; password: string; remember: boolean }>();

    const onSubmit = async (data: {
        email: string;
        password: string;
        remember: boolean;
    }) => {
        setErrorMsg(null);
        setLoading(true);
        try {
            const form = new FormData();
            form.set("email", data.email);
            form.set("password", data.password);
            form.set("remember", data.remember ? "on" : "off");
            const res: LoginActionResult = await loginAction(form);
            if (res?.success) {
                const s = getSession();
                const role = s?.role;
                router.push(role === "admin" ? "/admin" : "/user");
                return;
            }
            setErrorMsg(res?.message || "Login gagal");
        } catch (e) {
            const err = e as ApiError;
            setErrorMsg(err?.message || "Login gagal");
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
                            <div className="flex items-center justify-between">
                                <Field orientation="horizontal">
                                    <Checkbox
                                        id="remember"
                                        {...register("remember")}
                                    />
                                    <Label htmlFor="remember">Ingat Saya</Label>
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
                                disabled={loading}
                            >
                                {loading ? <Spinner /> : "Masuk"}
                            </Button>
                            <p className="text-destructive text-sm min-h-5">
                                {errorMsg ?? ""}
                            </p>
                            <div className="flex justify-center items-center mt-2">
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
    );
}

export default Page;
