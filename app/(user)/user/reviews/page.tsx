"use client";
import React, { useEffect, useState } from "react";
import { MessageSquareIcon, StarIcon, MapPinIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchReviews } from "@/services/reviews";
import { getSession } from "@/actions/auth";
import { Review } from "@/types/reviews";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/utils/format";
import Image from "next/image";

function Page() {
    const [reviews, setReviews] = useState<Review[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const session = getSession();
        fetchReviews({}, { token: session?.accessToken })
            .then((res) => {
                setReviews(res.data);
            })
            .catch((err) => {
                setErrorMsg(err.message || "Gagal memuat ulasan");
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Review</h1>
            </div>

            {loading ? (
                <div className="flex h-[50vh] items-center justify-center">
                    <Spinner />
                </div>
            ) : errorMsg ? (
                <div className="p-4 text-center text-red-500">
                    <p>{errorMsg}</p>
                </div>
            ) : reviews && reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.map((review) => (
                        <Card key={review.id} className="shadow-none">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {review.booking?.room?.images?.[0] ? (
                                            <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                                <Image
                                                    src={
                                                        typeof review.booking
                                                            .room.images[0] ===
                                                        "string"
                                                            ? review.booking.room.images[0]
                                                                  .replace(
                                                                      /[`"]/g,
                                                                      "",
                                                                  )
                                                                  .trim()
                                                            : (
                                                                  review.booking
                                                                      .room
                                                                      .images[0] as any
                                                              ).imageUrl
                                                    }
                                                    alt="Room"
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                                                <MapPinIcon className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-sm">
                                                Kamar{" "}
                                                {
                                                    review.booking?.room
                                                        ?.roomNumber
                                                }
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDate(review.createdAt, {
                                                    day: "numeric",
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarIcon
                                                key={star}
                                                className={`w-4 h-4 ${
                                                    star <= review.rating
                                                        ? "fill-yellow-400 text-yellow-400"
                                                        : "fill-gray-100 text-gray-200"
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-muted/50 p-3 rounded-md text-sm text-foreground/80 min-h-[60px]">
                                    {review.comment ? (
                                        <p>{review.comment}</p>
                                    ) : (
                                        <p className="italic text-muted-foreground">
                                            Tidak ada komentar tertulis
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <EmptyState
                        icon={MessageSquareIcon}
                        title="Belum Ada Review"
                        description="Anda belum memiliki riwayat review apa pun saat ini."
                        className="p-4"
                    />
                </div>
            )}
        </div>
    );
}

export default Page;
