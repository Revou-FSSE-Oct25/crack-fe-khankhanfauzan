"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";

function PageHeader({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    const pathname = usePathname();
    const segments = (pathname || "/")
        .split("/")
        .filter(Boolean)
        .map((seg) => seg.trim());

    const labelMap: Record<string, string> = {
        user: "User",
        bookings: "Booking",
        transactions: "Transaksi",
        complaints: "Komplain",
        reviews: "Review",
        profile: "Profile",
    };

    const toLabel = (seg: string) =>
        labelMap[seg] ??
        decodeURIComponent(seg)
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());

    const crumbs = [
        ...segments.map((_, i) => {
            const href = "/" + segments.slice(0, i + 1).join("/");
            return { href, label: toLabel(segments[i]) };
        }),
    ];

    return (
        <div className={cn("bg-card", className)}>
            <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between gap-3 sm:gap-0">
                <div className="flex gap-3 items-start sm:items-center">
                    <SidebarTrigger />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {crumbs.map((c, i) => {
                                const isLast = i === crumbs.length - 1;
                                return (
                                    <React.Fragment key={c.href}>
                                        <BreadcrumbItem>
                                            {isLast ? (
                                                <BreadcrumbPage>
                                                    {i === crumbs.length - 1 &&
                                                        c.label}
                                                </BreadcrumbPage>
                                            ) : (
                                                <BreadcrumbLink asChild>
                                                    <Link href={c.href}>
                                                        {c.label}
                                                    </Link>
                                                </BreadcrumbLink>
                                            )}
                                        </BreadcrumbItem>
                                        {!isLast && <BreadcrumbSeparator />}
                                    </React.Fragment>
                                );
                            })}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex gap-2">{children}</div>
            </div>
        </div>
    );
}

export { PageHeader };
