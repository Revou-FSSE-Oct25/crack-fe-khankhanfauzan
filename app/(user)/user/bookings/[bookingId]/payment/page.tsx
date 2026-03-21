"use client";
import { useMemo, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
    FieldSeparator,
    FieldTitle,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { AlertTriangleIcon, CreditCardIcon, InfoIcon } from "lucide-react";

function formatIDR(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function BookingPaymentPage() {
    const params = useParams();
    const search = useSearchParams();
    useRouter();

    const bookingId = String(params?.bookingId ?? "");
    const roomId = search.get("roomId") ?? "";
    const price = Number(search.get("price") ?? 0);
    const floor = Number(search.get("floor") ?? 0);
    const size = Number(search.get("size") ?? 0);

    const [payType, setPayType] = useState<"dp" | "lunas">("dp");
    const [months, setMonths] = useState<number>(6);
    const [planDate, setPlanDate] = useState<string>("");
    const [method, setMethod] = useState<"transfer" | "cash">("transfer");
    const [dpAmount, setDpAmount] = useState<number>(0);

    const total = useMemo(() => price * months, [price, months]);
    const dueNow = useMemo(
        () => (payType === "lunas" ? total : Math.min(dpAmount || 0, total)),
        [payType, total, dpAmount],
    );
    const dueLater = useMemo(() => total - dueNow, [total, dueNow]);

    const userProfile = useMemo(() => {
        return {
            maritalStatus: undefined as undefined | "single" | "married",
            ktpUploaded: false,
            marriageBookUploaded: false,
        };
    }, []);

    const profileValid = useMemo(() => {
        const statusOk = !!userProfile.maritalStatus;
        const docsOk =
            userProfile.ktpUploaded &&
            (userProfile.maritalStatus !== "married" ||
                userProfile.marriageBookUploaded);
        return statusOk && docsOk;
    }, [userProfile]);

    return (
        <div className="px-4 py-4 max-w-6xl mx-auto space-y-4">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/user">Dashboard</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/user/bookings">
                            Booking
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbPage>Pembayaran</BreadcrumbPage>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between">
                <h1 className="text-lg sm:text-xl font-semibold">
                    Pembayaran Booking
                </h1>
                <Badge className="bg-emerald-50 text-emerald-900">
                    ID {bookingId}
                </Badge>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Form Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!profileValid && (
                            <Alert variant="destructive">
                                <AlertTriangleIcon />
                                <AlertTitle>Lengkapi Data Profil</AlertTitle>
                                <AlertDescription>
                                    Lengkapi status kawin dan unggah dokumen:
                                    Foto KTP serta Buku Nikah (jika status kawin
                                    = menikah). Setelah lengkap, Anda dapat
                                    melanjutkan proses pembayaran.
                                </AlertDescription>
                            </Alert>
                        )}

                        <FieldSet>
                            <FieldGroup>
                                <Field orientation="responsive">
                                    <FieldLabel>
                                        <FieldTitle>Tipe Pembayaran</FieldTitle>
                                        <FieldDescription>
                                            Pilih DP dulu atau Bayar Lunas
                                        </FieldDescription>
                                    </FieldLabel>
                                    <FieldContent>
                                        <Select
                                            value={payType}
                                            onValueChange={(v) =>
                                                setPayType(v as "dp" | "lunas")
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="dp">
                                                    DP
                                                </SelectItem>
                                                <SelectItem value="lunas">
                                                    Bayar Lunas
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>

                                <Field orientation="responsive">
                                    <FieldLabel>
                                        <FieldTitle>Durasi Sewa</FieldTitle>
                                        <FieldDescription>
                                            Berapa lama menyewa kamar
                                        </FieldDescription>
                                    </FieldLabel>
                                    <FieldContent>
                                        <Select
                                            value={String(months)}
                                            onValueChange={(v) =>
                                                setMonths(Number(v))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Array.from({ length: 12 }).map(
                                                    (_, i) => (
                                                        <SelectItem
                                                            key={i + 1}
                                                            value={`${i + 1}`}
                                                        >
                                                            {i + 1} Bulan
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>

                                <Field orientation="responsive">
                                    <FieldLabel>
                                        <FieldTitle>Rencana Masuk</FieldTitle>
                                        <FieldDescription>
                                            Tanggal mulai menempati kamar
                                        </FieldDescription>
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            type="date"
                                            value={planDate}
                                            onChange={(e) =>
                                                setPlanDate(e.target.value)
                                            }
                                        />
                                    </FieldContent>
                                </Field>

                                <FieldSeparator />

                                <Field orientation="responsive">
                                    <FieldLabel>
                                        <FieldTitle>
                                            Metode Pembayaran
                                        </FieldTitle>
                                        <FieldDescription>
                                            Manual transfer atau cash
                                        </FieldDescription>
                                    </FieldLabel>
                                    <FieldContent>
                                        <Select
                                            value={method}
                                            onValueChange={(v) =>
                                                setMethod(
                                                    v as "transfer" | "cash",
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="transfer">
                                                    Manual Transfer
                                                </SelectItem>
                                                <SelectItem value="cash">
                                                    Cash
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>

                                <Field orientation="responsive">
                                    <FieldLabel>
                                        <FieldTitle>Nominal DP</FieldTitle>
                                        <FieldDescription>
                                            Isi jika memilih DP
                                        </FieldDescription>
                                    </FieldLabel>
                                    <FieldContent>
                                        <Input
                                            type="number"
                                            min={0}
                                            max={total}
                                            value={
                                                dpAmount ? String(dpAmount) : ""
                                            }
                                            onChange={(e) =>
                                                setDpAmount(
                                                    Number(e.target.value || 0),
                                                )
                                            }
                                            placeholder="Contoh: 500000"
                                        />
                                    </FieldContent>
                                </Field>
                            </FieldGroup>
                        </FieldSet>

                        <div className="grid sm:grid-cols-2 gap-3">
                            <Card className="shadow-none">
                                <CardContent className="py-3">
                                    <div className="flex items-center gap-2">
                                        <InfoIcon className="text-emerald-700" />
                                        <p className="text-sm text-muted-foreground">
                                            Total {months} bulan
                                        </p>
                                    </div>
                                    <p className="text-xl font-bold">
                                        {formatIDR(total)}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="shadow-none">
                                <CardContent className="py-3">
                                    <div className="flex items-center gap-2">
                                        <CreditCardIcon className="text-primary" />
                                        <p className="text-sm text-muted-foreground">
                                            Dibayar Sekarang
                                        </p>
                                    </div>
                                    <p className="text-xl font-bold">
                                        {formatIDR(dueNow)}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Button
                                disabled={!profileValid || !planDate}
                                className="w-full rounded-full"
                            >
                                <CreditCardIcon className="mr-2" /> Konfirmasi &
                                Bayar
                            </Button>
                            {!profileValid && (
                                <p className="text-xs text-muted-foreground text-center">
                                    Lengkapi profil terlebih dahulu untuk
                                    melanjutkan. Buka halaman Profil.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan Booking</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Kamar
                                </p>
                                <p className="font-medium">{roomId || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Lantai
                                </p>
                                <p className="font-medium">{floor || "-"}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Ukuran
                                </p>
                                <p className="font-medium">
                                    {size ? `${size}m²` : "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Harga/Bulan
                                </p>
                                <p className="font-medium">
                                    {price ? formatIDR(price) : "-"}
                                </p>
                            </div>
                        </div>
                        <div className="rounded-md bg-muted px-3 py-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Total</p>
                                <p className="text-lg font-semibold">
                                    {formatIDR(total)}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Bayar Sekarang</p>
                                <p className="text-lg font-semibold">
                                    {formatIDR(dueNow)}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Sisa</p>
                                <p className="text-lg font-semibold">
                                    {formatIDR(dueLater)}
                                </p>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Dengan melanjutkan, Anda menyetujui syarat dan
                            ketentuan yang berlaku.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default BookingPaymentPage;
