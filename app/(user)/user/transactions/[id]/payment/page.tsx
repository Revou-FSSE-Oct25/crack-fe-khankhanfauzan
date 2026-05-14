"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useParams } from "next/navigation";
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
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    CreditCardIcon,
    InfoIcon,
    Loader2Icon,
    UploadIcon,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getSession } from "@/actions/auth";
import { getInvoiceById, uploadPaymentProof } from "@/services/transactions";
import { Invoice } from "@/types/invoices";
import { Spinner } from "@/components/ui/spinner";
import { formatRupiah } from "@/utils/format";
import Image from "next/image";
import { ApiResponse } from "@/types/types";
import { toast } from "sonner";

const BANK_DETAILS = {
    bankName: "Bank Mandiri",
    accountNumber: "8732 1122 33",
    accountName: "Emerald House",
    logoUrl:
        "https://res.cloudinary.com/dvr6ibd7e/image/upload/v1778152375/logo_bank_mandiri_nd9xcw.png",
};

function BookingPaymentPage() {
    const params = useParams();
    const router = useRouter();

    const invoiceId = String(params?.id ?? "");

    const [invoice, setInvoice] = useState<ApiResponse<Invoice>["data"] | null>(
        null,
    );
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // form state
    const [payType, setPayType] = useState<"dp" | "lunas">("lunas");
    const [method, setMethod] = useState<"transfer" | "cash">("transfer");
    const [dpAmount, setDpAmount] = useState<number>(0);
    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Alert dialog state
    const [alertOpen, setAlertOpen] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        title: string;
        description: string;
        type: "error" | "confirm" | "success";
        onConfirm?: () => void;
    } | null>(null);

    useEffect(() => {
        if (!invoiceId) return;
        const session = getSession();
        getInvoiceById(invoiceId, { token: session?.accessToken })
            .then((res) => {
                setInvoice(res.data);

                const remainingAmount =
                    res.data.paymentDetails?.remainingAmount ?? 0;
                setDpAmount(remainingAmount); // default dp to remaining amount
            })
            .catch((e: any) => setErrorMsg(e.message))
            .finally(() => setLoading(false));
    }, [invoiceId]);

    const totalPaid = invoice?.paymentDetails?.totalPaid ?? 0;
    const penaltyAmount = Number(invoice?.penaltyAmount || 0);
    const total = invoice?.paymentDetails?.remainingAmount ?? 0;
    const booking = invoice?.booking;

    const dueNow = useMemo(
        () => (payType === "lunas" ? total : Math.min(dpAmount || 0, total)),
        [payType, total, dpAmount],
    );
    const dueLater = useMemo(() => total - dueNow, [total, dueNow]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
        }
    };

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!invoice) return;

        if (!file) {
            toast.error("Silakan upload bukti pembayaran terlebih dahulu.");
            setAlertConfig({
                title: "File Diperlukan",
                description: "Silakan upload bukti pembayaran terlebih dahulu.",
                type: "error",
            });
            setAlertOpen(true);
            return;
        }

        setAlertConfig({
            title: "Konfirmasi",
            description:
                "Apakah anda yakin ingin mengirim bukti pembayaran ini?",
            type: "confirm",
            onConfirm: () => proceedPayment(invoiceId),
        });
        setAlertOpen(true);
    };

    const proceedPayment = async (invoiceId: string) => {
        setIsSubmitting(true);
        try {
            const session = getSession();
            const formData = new FormData();
            formData.append("invoiceId", invoiceId);
            formData.append("amount", String(dueNow));
            formData.append("paymentMethod", method);
            formData.append("file", file!);

            await uploadPaymentProof(formData, { token: session?.accessToken });
            toast.success("Bukti pembayaran berhasil diunggah!");
            setAlertConfig({
                title: "Berhasil",
                description: "Bukti pembayaran berhasil diunggah!",
                type: "success",
                onConfirm: () => router.push("/user/transactions"),
            });
            setAlertOpen(true);
        } catch (error: any) {
            console.error("Upload payment error:", error);
            const msg =
                error?.response?.data?.message ||
                error.message ||
                "Gagal mengunggah bukti pembayaran";
            toast.error(msg);
            setAlertConfig({
                title: "Gagal",
                description: msg,
                type: "error",
            });
            setAlertOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Spinner className="items-center" />;

    if (errorMsg || !invoice || !booking) {
        return (
            <div className="p-4 max-w-6xl mx-auto space-y-4">
                <p className="text-red-500">
                    Error: {errorMsg || "Tagihan tidak ditemukan"}
                </p>
            </div>
        );
    }

    return (
        <div className="px-4 py-4 max-w-7xl mx-auto space-y-4">
            <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {alertConfig?.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {alertConfig?.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        {alertConfig?.type === "confirm" && (
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                        )}
                        <AlertDialogAction
                            onClick={() => {
                                if (
                                    (alertConfig?.type === "confirm" ||
                                        alertConfig?.type === "success") &&
                                    alertConfig.onConfirm
                                ) {
                                    alertConfig.onConfirm();
                                } else {
                                    setAlertOpen(false);
                                }
                            }}
                        >
                            {alertConfig?.type === "confirm"
                                ? "Ya, Kirim"
                                : "Tutup"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="flex items-center justify-between">
                <h1 className="text-lg sm:text-xl font-semibold">
                    Pembayaran Booking
                </h1>
                <Badge className="bg-emerald-50 text-emerald-900">
                    ID {invoiceId.slice(0, 8).toUpperCase()}
                </Badge>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
                <Card>
                    <form onSubmit={onSubmit}>
                        <CardHeader>
                            <CardTitle>Form Pembayaran</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <FieldSet>
                                <FieldGroup>
                                    <Field orientation="responsive">
                                        <FieldLabel className="flex flex-col items-start">
                                            <FieldTitle>
                                                Tipe Pembayaran
                                            </FieldTitle>
                                            <FieldDescription>
                                                Pilih DP dulu atau Bayar Lunas
                                            </FieldDescription>
                                        </FieldLabel>
                                        <FieldContent>
                                            <Select
                                                value={payType}
                                                onValueChange={(v) => {
                                                    setPayType(
                                                        v as "dp" | "lunas",
                                                    );
                                                    if (v === "lunas")
                                                        setDpAmount(total);
                                                }}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="lunas">
                                                        Bayar Lunas
                                                    </SelectItem>
                                                    <SelectItem value="dp">
                                                        DP
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FieldContent>
                                    </Field>

                                    {payType === "dp" && (
                                        <Field orientation="responsive">
                                            <FieldLabel className="flex flex-col items-start">
                                                <FieldTitle>
                                                    Nominal DP
                                                </FieldTitle>
                                                <FieldDescription>
                                                    Masukkan jumlah DP yang
                                                    dibayarkan
                                                </FieldDescription>
                                            </FieldLabel>
                                            <FieldContent>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    max={total}
                                                    value={
                                                        dpAmount
                                                            ? String(dpAmount)
                                                            : ""
                                                    }
                                                    onChange={(e) =>
                                                        setDpAmount(
                                                            Number(
                                                                e.target
                                                                    .value || 0,
                                                            ),
                                                        )
                                                    }
                                                    placeholder="Contoh: 500000"
                                                />
                                            </FieldContent>
                                        </Field>
                                    )}

                                    <FieldSeparator />

                                    <Field orientation="responsive">
                                        <FieldLabel className="flex flex-col items-start">
                                            <FieldTitle>
                                                Metode Pembayaran
                                            </FieldTitle>
                                            <FieldDescription>
                                                Transfer atau Cash
                                            </FieldDescription>
                                        </FieldLabel>
                                        <FieldContent>
                                            <Select
                                                value={method}
                                                onValueChange={(v) =>
                                                    setMethod(
                                                        v as
                                                            | "transfer"
                                                            | "cash",
                                                    )
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="transfer">
                                                        Transfer Bank
                                                    </SelectItem>
                                                    <SelectItem value="cash">
                                                        Tunai (Cash)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FieldContent>
                                    </Field>

                                    {method === "transfer" && (
                                        <div className="bg-muted p-4 rounded-md flex items-start gap-4">
                                            <div className="bg-white p-2 rounded-md shrink-0">
                                                <Image
                                                    src={BANK_DETAILS.logoUrl}
                                                    alt="BCA Logo"
                                                    width={60}
                                                    height={30}
                                                    className="object-contain h-8 w-auto"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-sm font-semibold">
                                                    {BANK_DETAILS.bankName}
                                                </p>
                                                <p className="text-lg font-bold tracking-widest">
                                                    {BANK_DETAILS.accountNumber}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    a.n.{" "}
                                                    {BANK_DETAILS.accountName}
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <Field orientation="responsive">
                                        <FieldLabel className="flex flex-col items-start">
                                            <FieldTitle>
                                                Bukti Pembayaran
                                            </FieldTitle>
                                            <FieldDescription>
                                                Unggah foto struk/bukti transfer
                                                (JPG, PNG)
                                            </FieldDescription>
                                        </FieldLabel>
                                        <FieldContent>
                                            <div className="flex flex-col gap-2">
                                                <Input
                                                    type="file"
                                                    accept="image/png, image/jpeg, image/jpg"
                                                    onChange={handleFileChange}
                                                    required
                                                />
                                                {file && (
                                                    <p className="text-xs text-muted-foreground">
                                                        File: {file.name}
                                                    </p>
                                                )}
                                            </div>
                                        </FieldContent>
                                    </Field>
                                </FieldGroup>
                            </FieldSet>

                            <div className="grid sm:grid-cols-2 gap-3">
                                <Card className="shadow-none">
                                    <CardContent className="py-3">
                                        <div className="flex items-center gap-2">
                                            <InfoIcon
                                                className="text-emerald-700"
                                                size={16}
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                {totalPaid > 0
                                                    ? "Sisa Tagihan"
                                                    : "Total Biaya"}
                                            </p>
                                        </div>
                                        <p className="text-xl font-bold">
                                            {formatRupiah(total)}
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="shadow-none">
                                    <CardContent className="py-3">
                                        <div className="flex items-center gap-2">
                                            <CreditCardIcon
                                                className="text-primary"
                                                size={16}
                                            />
                                            <p className="text-sm text-muted-foreground">
                                                Dibayar Sekarang
                                            </p>
                                        </div>
                                        <p className="text-xl font-bold">
                                            {formatRupiah(dueNow)}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button
                                    type="submit"
                                    disabled={!file || isSubmitting}
                                    className="w-full rounded-full"
                                >
                                    {isSubmitting ? (
                                        <Loader2Icon className="mr-2 animate-spin" />
                                    ) : (
                                        <UploadIcon className="mr-2" />
                                    )}
                                    Kirim Bukti Pembayaran
                                </Button>
                            </div>
                        </CardContent>
                    </form>
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
                                <p className="font-medium">
                                    {booking.room?.roomNumber || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Lantai
                                </p>
                                <p className="font-medium">
                                    {booking.room?.floor || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Durasi
                                </p>
                                <p className="font-medium">
                                    {booking.duration} {booking.rentType}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status
                                </p>
                                <p className="font-medium capitalize">
                                    {booking.status.replace("_", " ")}
                                </p>
                            </div>
                        </div>
                        <div className="rounded-md bg-muted px-3 py-2">
                            <div className="flex items-center justify-between">
                                <p className="text-sm">
                                    {totalPaid > 0 ? "Sisa Tagihan" : "Total"}
                                </p>
                                <p className="text-lg font-semibold">
                                    {formatRupiah(total)}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Bayar Sekarang</p>
                                <p className="text-lg font-semibold">
                                    {formatRupiah(dueNow)}
                                </p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p className="text-sm">Sisa</p>
                                <p className="text-lg font-semibold text-muted-foreground">
                                    {formatRupiah(dueLater)}
                                </p>
                            </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            Invoice ID:{" "}
                            {invoice?.id.slice(0, 8).toUpperCase() || "-"}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default BookingPaymentPage;
