"use client";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { HouseIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { isValidEmail } from "@/lib/utils";

function Page() {
    const [sent, setSent] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<{ email: string }>();

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
                            Atur Ulang Kata Sandi
                        </h1>
                        <p>Masukkan email untuk menerima tautan reset</p>
                    </div>
                    <div className="bg-white w-2/4 p-4 text-start">
                        <form
                            onSubmit={handleSubmit(({ email }) => {
                                setSent(true);
                                console.log("forgot-password submit", {
                                    email,
                                });
                            })}
                        >
                            <FieldSet className="w-full">
                                <h2 className="font-bold text-2xl">
                                    Lupa Password
                                </h2>
                                <FieldGroup>
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

                                    <Button
                                        className="rounded-full font-semibold"
                                        type="submit"
                                        disabled={sent}
                                    >
                                        {sent
                                            ? "Tautan Terkirim"
                                            : "Kirim Tautan Reset"}
                                    </Button>

                                    <div className="flex justify-center text-center items-center">
                                        <Link href="/login">
                                            <Button variant="link">
                                                Kembali ke Login
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
