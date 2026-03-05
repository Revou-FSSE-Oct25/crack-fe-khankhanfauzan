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

function Page() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                        <form action="">
                            <FieldSet className="w-full">
                                <h2 className="font-bold text-2xl">Register</h2>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="fullname">
                                            Fullname
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                id="fullname"
                                                type="text"
                                                placeholder="John Doe"
                                            />
                                            <InputGroupAddon>
                                                <UserIcon />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>

                                    <Field>
                                        <FieldLabel htmlFor="email">
                                            Email
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput
                                                id="email"
                                                type="text"
                                                placeholder="example@mail.com"
                                            />
                                            <InputGroupAddon>
                                                <MailIcon />
                                            </InputGroupAddon>
                                        </InputGroup>
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
                                            />
                                            <InputGroupAddon>
                                                <PhoneIcon />
                                            </InputGroupAddon>
                                        </InputGroup>
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
                                    </Field>

                                    <Button className="rounded-full font-semibold">
                                        Daftar
                                    </Button>
                                    <div className="flex justify-center text-center items-center">
                                        <p>Sudah punya akun? </p>
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
