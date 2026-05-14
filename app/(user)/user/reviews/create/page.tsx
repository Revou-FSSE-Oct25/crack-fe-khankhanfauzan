"use client";

import { getSession } from "@/actions/auth";
import { createReview } from "@/services/reviews";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
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
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ReviewFormInputs = {
    rating: number;
    comment?: string | null;
};

function ReviewForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get("bookingId");

    const [loading, setLoading] = useState<boolean>(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [alertOpen, setAlertOpen] = useState<boolean>(false);
    const [alertConfig, setAlertConfig] = useState<{
        title: string;
        description: string;
        type: "error" | "confirm";
        onConfirm?: () => void;
    } | null>(null);

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<ReviewFormInputs>({
        defaultValues: {
            rating: 5,
            comment: null,
        },
    });

    useEffect(() => {
        const session = getSession();
        const token = session?.accessToken;

        if (!bookingId) {
            setErrorMsg("Booking ID tidak valid atau tidak ditemukan");
        }

        setLoading(false);
    }, [bookingId]);

    const onSubmit = async (data: ReviewFormInputs) => {
        if (!bookingId) return;

        setAlertConfig({
            title: "Konfirmasi Ulasan",
            description:
                "Apakah anda sudah yakin dengan ulasan yang diberikan?",
            type: "confirm",
            onConfirm: () => proceedReview(data),
        });
        setAlertOpen(true);
    };

    const proceedReview = async (data: ReviewFormInputs) => {
        setIsSubmitting(true);
        setErrorMsg(null);

        try {
            const session = getSession();
            await createReview(
                {
                    bookingId: bookingId as string,
                    rating: data.rating,
                    comment: data.comment || undefined,
                },
                { token: session?.accessToken },
            );

            toast.success("Terima kasih! Ulasan Anda berhasil dikirim.");
            router.push(`/user/bookings/${bookingId}`);
        } catch (error: any) {
            console.error("Review error:", error);
            const msg =
                error?.response?.data?.message ||
                error.message ||
                "Gagal melakukan ulasan";
            setErrorMsg(msg);
            setAlertConfig({
                title: "Gagal Mengirim Ulasan",
                description: msg,
                type: "error",
            });
            setAlertOpen(true);
            toast.error(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-full min-h-[50vh] items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (errorMsg && !bookingId) {
        return (
            <div className="p-4 max-w-2xl mx-auto text-center mt-10">
                <p className="text-red-500 mb-4">{errorMsg}</p>
                <Button variant="outline" onClick={() => router.back()}>
                    Kembali
                </Button>
            </div>
        );
    }

    const currentRating = watch("rating");

    return (
        <div className="p-4 max-w-2xl mx-auto">
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
                            <AlertDialogCancel disabled={isSubmitting}>
                                Batal
                            </AlertDialogCancel>
                        )}
                        <AlertDialogAction
                            onClick={() => {
                                if (
                                    alertConfig?.type === "confirm" &&
                                    alertConfig.onConfirm
                                ) {
                                    alertConfig.onConfirm();
                                } else {
                                    setAlertOpen(false);
                                }
                            }}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Spinner className="w-4 h-4 mr-2" />
                            ) : null}
                            {alertConfig?.type === "confirm"
                                ? "Ya, Kirim"
                                : "Tutup"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Card className="shadow-none">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>Beri Ulasan Kamar</CardTitle>
                        <CardDescription>
                            Bagaimana pengalaman Anda menyewa kamar ini? Ulasan
                            Anda sangat berarti bagi kami.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {errorMsg && (
                            <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                                {errorMsg}
                            </div>
                        )}

                        <div className="flex flex-col items-center gap-4">
                            <label className="text-sm font-medium">
                                Beri Penilaian
                            </label>
                            <Controller
                                name="rating"
                                control={control}
                                render={({ field }) => (
                                    <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() =>
                                                    field.onChange(star)
                                                }
                                                className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1 transition-colors hover:scale-110"
                                            >
                                                <StarIcon
                                                    className={cn(
                                                        "w-10 h-10 transition-colors",
                                                        star <= field.value
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "fill-gray-100 text-gray-300",
                                                    )}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                Ulasan (Opsional)
                            </label>
                            <Controller
                                name="comment"
                                control={control}
                                render={({ field }) => (
                                    <Textarea
                                        placeholder="Ceritakan pengalaman Anda di sini..."
                                        rows={5}
                                        {...field}
                                        value={field.value || ""}
                                        className="resize-none"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={isSubmitting}
                            >
                                Batal
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <Spinner className="w-4 h-4 mr-2" />
                                ) : null}
                                Kirim Ulasan
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}

export default function Page() {
    return (
        <Suspense
            fallback={
                <Spinner className="flex h-full mx-auto justify-center min-h-[50vh]" />
            }
        >
            <ReviewForm />
        </Suspense>
    );
}
