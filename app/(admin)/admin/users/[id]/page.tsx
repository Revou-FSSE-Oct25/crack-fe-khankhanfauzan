"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchUserById, updateUser } from "@/services/users";
import type { User } from "@/types/users";
import Link from "next/link";

export default function Page() {
    const params = useParams();
    const id = String(params?.id ?? "");

    const [detail, setDetail] = React.useState<User | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [edit, setEdit] = React.useState(false);
    const [saving, setSaving] = React.useState(false);
    const [form, setForm] = React.useState({
        full_name: "",
        email: "",
        whatsapp_no: "",
        role: "",
        marital_status: "",
        bio: "",
    });

    React.useEffect(() => {
        let aborted = false;
        async function load() {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const d = await fetchUserById(id);
                if (!aborted) {
                    setDetail(d as User);
                    setForm({
                        full_name: d.full_name,
                        email: d.email,
                        whatsapp_no: d.whatsapp_no ?? "",
                        role: d.role ?? "",
                        marital_status: d.marital_status ?? "",
                        bio: d.profile?.bio ?? "",
                    });
                }
            } catch {
                if (!aborted) setError("Gagal memuat detail pengguna");
            } finally {
                if (!aborted) setLoading(false);
            }
        }
        load();
        return () => {
            aborted = true;
        };
    }, [id]);

    function initials(name: string) {
        const parts = name.trim().split(" ").filter(Boolean);
        if (parts.length === 0) return "?";
        const first = parts[0]?.[0] ?? "";
        const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
        return (first + last).toUpperCase();
    }

    async function onSave() {
        if (!detail) return;
        setSaving(true);
        const payload = {
            full_name: form.full_name,
            email: form.email,
            whatsapp_no: form.whatsapp_no || undefined,
            role: form.role || undefined,
            marital_status: form.marital_status || undefined,
            profile: {
                bio: form.bio || "",
            },
        };
        try {
            const updated = await updateUser(detail.user_id, payload);
            setDetail(updated as User);
            setEdit(false);
        } catch {}
        setSaving(false);
    }

    function onCancel() {
        if (!detail) return;
        setForm({
            full_name: detail.full_name,
            email: detail.email,
            whatsapp_no: detail.whatsapp_no ?? "",
            role: detail.role ?? "",
            marital_status: detail.marital_status ?? "",
            bio: detail.profile?.bio ?? "",
        });
        setEdit(false);
    }

    return (
        <div className="bg-muted h-full">
            <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Detail Pengguna</h1>
                    <div className="flex gap-2">
                        <Link href="/admin/users">
                            <Button variant="outline">Kembali</Button>
                        </Link>
                        {!edit ? (
                            <Button onClick={() => setEdit(true)} disabled={loading || !!error}>
                                Edit
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={onCancel} disabled={saving}>
                                    Batal
                                </Button>
                                <Button onClick={onSave} disabled={saving}>
                                    Simpan
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <Card className="shadow-none">
                    <CardHeader>
                        <CardTitle>Informasi Pengguna</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading && (
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-10 rounded-full" />
                                <div className="flex flex-col gap-2">
                                    <Skeleton className="h-4 w-48" />
                                    <Skeleton className="h-3 w-64" />
                                </div>
                            </div>
                        )}
                        {!loading && error && <div className="text-sm">{error}</div>}
                        {!loading && !error && detail && (
                            <div className="flex flex-col gap-6">
                                <div className="flex items-center gap-3">
                                    <Avatar size="lg">
                                        <AvatarImage src={detail.profile?.avatar_url ?? undefined} alt={detail.full_name} />
                                        <AvatarFallback>{initials(detail.full_name)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="font-semibold">{detail.full_name}</div>
                                        <div className="text-muted-foreground text-sm">{detail.email}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="user_id">User ID</Label>
                                        <Input id="user_id" value={detail.user_id} disabled />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="full_name">Nama Lengkap</Label>
                                        <Input
                                            id="full_name"
                                            value={form.full_name}
                                            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                                            disabled={!edit}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                            disabled={!edit}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="whatsapp_no">No. WhatsApp</Label>
                                        <Input
                                            id="whatsapp_no"
                                            value={form.whatsapp_no}
                                            onChange={(e) => setForm((f) => ({ ...f, whatsapp_no: e.target.value }))}
                                            disabled={!edit}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input
                                            id="role"
                                            value={form.role}
                                            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                                            disabled={!edit}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="marital_status">Status Pernikahan</Label>
                                        <Input
                                            id="marital_status"
                                            value={form.marital_status}
                                            onChange={(e) => setForm((f) => ({ ...f, marital_status: e.target.value }))}
                                            disabled={!edit}
                                        />
                                    </div>
                                    {/* <div className="flex flex-col gap-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            value={form.bio}
                                            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                                            disabled={!edit}
                                        />
                                    </div> */}
                                    {/* <div className="flex flex-col gap-2">
                                        <Label htmlFor="joined_at">Bergabung Pada</Label>
                                        <Input
                                            id="joined_at"
                                            value={detail.profile?.joined_at ? new Date(detail.profile.joined_at).toLocaleString() : ""}
                                            disabled
                                        />
                                    </div> */}
                                    <div className="flex flex-col gap-1">
                                        <div className="text-sm font-medium">Dokumen</div>
                                        <div className="text-sm">
                                            KTP:{" "}
                                            {detail.documents?.ktp_url ? (
                                                <a className="underline" href={detail.documents.ktp_url} target="_blank" rel="noreferrer">
                                                    Lihat
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </div>
                                        <div className="text-sm">
                                            Buku Nikah:{" "}
                                            {detail.documents?.marriage_url ? (
                                                <a className="underline" href={detail.documents.marriage_url} target="_blank" rel="noreferrer">
                                                    Lihat
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </div>
                                        <div className="text-sm">
                                            Status Verifikasi: {detail.documents?.is_verified ? "Terverifikasi" : "Belum Terverifikasi"}
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <div className="text-sm font-medium">Hunian Saat Ini</div>
                                        <div className="text-sm">Kamar: {detail.current_stay?.room_number || "-"}</div>
                                        <div className="text-sm">Properti: {detail.current_stay?.property_name || "-"}</div>
                                        <div className="text-sm">Status: {detail.current_stay?.status || "-"}</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
