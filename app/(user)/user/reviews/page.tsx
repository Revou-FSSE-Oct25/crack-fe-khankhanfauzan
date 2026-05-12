"use client";
import React from "react";
import { MessageSquareIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

function Page() {
    return (
        <div className="p-4 flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold">Review</h1>
            </div>

            <div className="flex flex-col gap-4">
                <EmptyState
                    icon={MessageSquareIcon}
                    title="Belum Ada Review"
                    description="Anda belum memiliki riwayat review apa pun saat ini."
                    className="p-4"
                />
            </div>
        </div>
    );
}

export default Page;
