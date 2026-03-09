"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
    BellIcon,
    CreditCardIcon,
    HomeIcon,
    LockIcon,
    LogOutIcon,
    MailIcon,
    MessageCircleMoreIcon,
    PencilIcon,
    CameraIcon,
    PhoneIcon,
    UserIcon,
    WrenchIcon,
} from "lucide-react";

import React from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { IconSurface } from "@/components/ui/icon-surface";

function Page() {
    const [isEditing, setIsEditing] = React.useState(false);
    const [maritalStatus, setMaritalStatus] = React.useState<
        "single" | "married"
    >("single");
    return (
        <div className="bg-muted min-h-svh">
            <div className="max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-4 md:gap-6 p-4">
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                    <Card className="shadow-none">
                        <CardContent className="flex flex-col gap-4 items-center justify-center text-center">
                            <div className="relative">
                                <Avatar className="h-20 w-20">
                                    <AvatarImage />
                                    <AvatarFallback className="font-bold text-xl text-white bg-primary">
                                        JD
                                    </AvatarFallback>
                                </Avatar>
                                <Button
                                    size="icon-sm"
                                    className="absolute -bottom-1 -right-1 rounded-full border-4 border-white"
                                    variant="default"
                                    aria-label="Edit foto profil"
                                >
                                    <CameraIcon className="size-3.5" />
                                </Button>
                            </div>
                            <div className="flex flex-col">
                                <h2 className="text-lg sm:text-xl font-semibold">
                                    John Doe
                                </h2>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                    Penghuni
                                </p>
                            </div>
                            <div className="bg-accent p-2 flex items-center justify-center gap-2 rounded-md w-full">
                                <HomeIcon color="var(--color-primary)" />
                                <div className="text-primary">
                                    <p className="font-medium text-xs">
                                        Kamar Anda
                                    </p>
                                    <p className="font-semibold">301</p>
                                </div>
                            </div>
                            <div className="flex justify-evenly w-full">
                                <div>
                                    <p className="text-xl sm:text-2xl font-semibold">
                                        12
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Bulan
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xl sm:text-2xl font-semibold">
                                        18M
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Total Bayar
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle>
                                <h2 className="text-base font-semibold">
                                    Quick Actions
                                </h2>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-2">
                            <Button
                                className="flex gap-2 items-center justify-start"
                                variant="ghost"
                            >
                                <CreditCardIcon
                                    color="var(--color-primary)"
                                    size={20}
                                />
                                <p className="text-sm font-medium">
                                    Riwayat Transaksi
                                </p>
                            </Button>
                            <Button
                                className="flex gap-2 items-center justify-start"
                                variant="ghost"
                            >
                                <WrenchIcon
                                    color="var(--color-primary)"
                                    size={20}
                                />
                                <p className="text-sm font-medium">
                                    Laporan Maintenance
                                </p>
                            </Button>
                            <Button
                                className="flex gap-2 items-center justify-start"
                                variant="ghost"
                            >
                                <MessageCircleMoreIcon
                                    color="var(--color-primary)"
                                    size={20}
                                />
                                <p className="text-sm font-medium">
                                    Chat dengan Admin
                                </p>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="flex-1 flex flex-col gap-4">
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
                                    <PencilIcon />{" "}
                                    {isEditing ? "Batal" : "Edit"}
                                </Button>
                            </CardTitle>
                            <CardContent className="p-0">
                                <FieldGroup className="grid grid-cols-1 md:grid-cols-2">
                                    <Field>
                                        <FieldLabel htmlFor="fullname">
                                            Nama Lengkap
                                        </FieldLabel>
                                        <InputGroup
                                            className={
                                                isEditing
                                                    ? ""
                                                    : "border-transparent shadow-none"
                                            }
                                        >
                                            <InputGroupInput
                                                id="fullname"
                                                type="text"
                                                defaultValue="John Doe"
                                                readOnly={!isEditing}
                                                className={
                                                    !isEditing
                                                        ? "pointer-events-none"
                                                        : ""
                                                }
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
                                        <InputGroup
                                            className={
                                                isEditing
                                                    ? ""
                                                    : "border-transparent shadow-none"
                                            }
                                        >
                                            <InputGroupInput
                                                id="email"
                                                type="email"
                                                defaultValue="john.doe@mail.com"
                                                readOnly={!isEditing}
                                                className={
                                                    !isEditing
                                                        ? "pointer-events-none"
                                                        : ""
                                                }
                                            />
                                            <InputGroupAddon>
                                                <MailIcon />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="whatsappnumber">
                                            Nomor Whatsapp
                                        </FieldLabel>
                                        <InputGroup
                                            className={
                                                isEditing
                                                    ? ""
                                                    : "border-transparent shadow-none"
                                            }
                                        >
                                            <InputGroupInput
                                                id="whatsappnumber"
                                                type="number"
                                                defaultValue="08123456789"
                                                readOnly={!isEditing}
                                                className={
                                                    !isEditing
                                                        ? "pointer-events-none"
                                                        : ""
                                                }
                                            />
                                            <InputGroupAddon>
                                                <PhoneIcon />
                                            </InputGroupAddon>
                                        </InputGroup>
                                    </Field>
                                    <Field>
                                        <FieldLabel htmlFor="maritalstatus">
                                            Status Kawin
                                        </FieldLabel>
                                        <Select
                                            value={maritalStatus}
                                            onValueChange={(v) =>
                                                setMaritalStatus(
                                                    v as "single" | "married",
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                disabled={!isEditing}
                                                className={
                                                    isEditing
                                                        ? ""
                                                        : "border-transparent shadow-none"
                                                }
                                            >
                                                <SelectValue placeholder="Select Marital Status" />
                                                <SelectContent>
                                                    <SelectItem value="married">
                                                        Married
                                                    </SelectItem>
                                                    <SelectItem value="single">
                                                        Single
                                                    </SelectItem>
                                                </SelectContent>
                                            </SelectTrigger>
                                        </Select>
                                    </Field>
                                    <Field className="col-span-1 md:col-span-2">
                                        <FieldLabel htmlFor="address">
                                            Alamat
                                        </FieldLabel>
                                        <Textarea
                                            id="address"
                                            defaultValue="Jl. Pendidikan No. 123, Sleman, Yogyakarta"
                                            readOnly={!isEditing}
                                            className={
                                                !isEditing
                                                    ? "border-transparent shadow-none pointer-events-none"
                                                    : ""
                                            }
                                        />
                                    </Field>
                                </FieldGroup>
                            </CardContent>
                        </CardHeader>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="flex gap-2">
                                <IconSurface
                                    bgClass="bg-accent"
                                    className="w-min self-center"
                                >
                                    <CreditCardIcon
                                        size={16}
                                        color="var(--color-primary)"
                                    />
                                </IconSurface>
                                <div className="flex flex-col">
                                    <h2 className="text-base font-semibold">
                                        Dokumen
                                    </h2>
                                    <p className="text-xs text-muted-foreground font-normal">
                                        Unggah dokumen identitas Anda
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-3">
                            <Field>
                                <FieldLabel>
                                    KTP{" "}
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    type="file"
                                    disabled={!isEditing}
                                    className={
                                        !isEditing
                                            ? "border-transparent shadow-none pointer-events-none"
                                            : ""
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    File saat ini: ktp_john_doe.pdf
                                </p>
                            </Field>
                            <Field>
                                <FieldLabel>
                                    Buku Nikah{" "}
                                    {maritalStatus === "married" && (
                                        <span className="text-destructive">
                                            *
                                        </span>
                                    )}
                                </FieldLabel>
                                <Input
                                    type="file"
                                    disabled={!isEditing}
                                    className={
                                        !isEditing
                                            ? "border-transparent shadow-none pointer-events-none"
                                            : ""
                                    }
                                />
                                <p className="text-xs text-muted-foreground">
                                    {maritalStatus === "married"
                                        ? "Wajib diunggah untuk status kawin Married"
                                        : "Opsional"}
                                </p>
                            </Field>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="flex gap-2">
                                <IconSurface
                                    bgClass="bg-accent"
                                    className="w-min self-center"
                                >
                                    <BellIcon
                                        size={16}
                                        color="var(--color-primary)"
                                    />
                                </IconSurface>
                                <div className="flex flex-col">
                                    <h2 className="text-base font-semibold">
                                        Pengaturan Notifikasi
                                    </h2>
                                    <p className="text-xs text-muted-foreground font-normal">
                                        Kelola prefensi notifikasi Anda
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4">
                            <div className="pb-2 border-b flex justify-between items-center">
                                <div>
                                    <p className="font-medium">
                                        Email Notifications
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Terima notifikasi via email
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="pb-2 border-b flex justify-between items-center">
                                <div>
                                    <p className="font-medium">
                                        WhatsApp Notifications
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Terima notifikasi via WhatsApp
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="pb-2 border-b flex justify-between items-center">
                                <div>
                                    <p className="font-medium">
                                        Payment Reminders
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Pengingat jatuh tempo pembayaran (H-3)
                                    </p>
                                </div>
                                <Switch />
                            </div>
                            <div className="pb-2 border-b flex justify-between items-center">
                                <div>
                                    <p className="font-medium">
                                        Maintenance Updates
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        Update status maintenance request
                                    </p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-none">
                        <CardHeader>
                            <CardTitle className="flex gap-2">
                                <IconSurface
                                    bgClass="bg-amber-100"
                                    className="w-min self-center"
                                >
                                    <LockIcon
                                        size={16}
                                        color="oklch(76.9% 0.188 70.08)"
                                    />
                                </IconSurface>
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-base font-semibold">
                                        Keamanan
                                    </h2>
                                    <p className="text-xs text-muted-foreground font-normal">
                                        Ubah password dan pengaturan keamanan
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" variant="outline">
                                <LockIcon />
                                Ubah Password
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default Page;
