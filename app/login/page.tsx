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

function Page() {
    const [showPassword, setShowPassword] = useState(false);
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
                        <form action="">
                            <FieldSet className="w-full">
                                <h2 className="font-bold text-2xl">Login</h2>
                                <FieldGroup>
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

                                    <div className="flex">
                                        <Field orientation="horizontal">
                                            <Checkbox
                                                id="terms-checkbox"
                                                name="terms-checkbox"
                                            />
                                            <Label htmlFor="terms-checkbox">
                                                Remember Me
                                            </Label>
                                        </Field>

                                        <Button variant="link">
                                            {" "}
                                            Lupa Password?
                                        </Button>
                                    </div>

                                    <Button className="rounded-full font-semibold">
                                        Masuk
                                    </Button>
                                    <div className="flex justify-center text-center items-center">
                                        <p>Belum punya akun? </p>
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
