"use client";
import { useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { AlertTriangleIcon, CreditCardIcon } from "lucide-react";

function formatIDR(amount: number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function PaymentNewPage() {
    const params = useSearchParams();
    const router = useRouter();

    const roomId = params.get("roomId") ?? "";
    const price = Number(params.get("price") ?? 0);
    const floor = Number(params.get("floor") ?? 0);
    const size = Number(params.get("size") ?? 0);

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
        <div className="px-4 py-4 max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-lg sm:text-xl font-semibold">Pembayaran</h1>
                <Button variant="ghost" onClick={() => router.back()}>
                    Kembali
                </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan Kamar</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
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
                                    Harga
                                </p>
                                <p className="font-medium">
                                    {price ? formatIDR(price) : "-"}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

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
                                        <Select defaultValue="dp">
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
                                        <Select defaultValue="6">
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
                                        <Input type="date" />
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
                                        <Select defaultValue="transfer">
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
                                            max={price}
                                            placeholder="Contoh: 500000"
                                        />
                                    </FieldContent>
                                </Field>
                            </FieldGroup>
                        </FieldSet>

                        <div className="flex flex-col gap-2">
                            <Button disabled={!profileValid} className="w-full">
                                <CreditCardIcon className="mr-2" /> Lanjutkan
                                Pembayaran
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
            </div>
        </div>
    );
}

export default PaymentNewPage;
