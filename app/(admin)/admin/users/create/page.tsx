 "use client";
 
 import React from "react";
 import { useRouter } from "next/navigation";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Textarea } from "@/components/ui/textarea";
 import { Label } from "@/components/ui/label";
 import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
 import { createUser } from "@/services/users";
 import type { CreateUserPayload, User } from "@/types/users";
 import Link from "next/link";
 
 export default function Page() {
     const router = useRouter();
     const [saving, setSaving] = React.useState(false);
     const [error, setError] = React.useState<string | null>(null);
     const [form, setForm] = React.useState({
         full_name: "",
         email: "",
         whatsapp_no: "",
         role: "",
         marital_status: "",
         bio: "",
     });
 
     function initials(name: string) {
         const parts = name.trim().split(" ").filter(Boolean);
         if (parts.length === 0) return "?";
         const first = parts[0]?.[0] ?? "";
         const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
         return (first + last).toUpperCase();
     }
 
     async function onSave() {
         setSaving(true);
         setError(null);
         const payload: CreateUserPayload = {
             full_name: form.full_name,
             email: form.email,
             whatsapp_no: form.whatsapp_no || undefined,
             role: form.role || "tenant",
             marital_status: form.marital_status || undefined,
             profile: {
                 bio: form.bio || "",
             },
         };
         try {
             const created = await createUser(payload);
             const u = created as User;
             router.push(`/admin/users/${u.user_id}`);
         } catch {
             setError("Gagal membuat pengguna");
         }
         setSaving(false);
     }
 
     function onCancel() {
         setForm({
             full_name: "",
             email: "",
             whatsapp_no: "",
             role: "",
             marital_status: "",
             bio: "",
         });
         setError(null);
     }
 
     return (
         <div className="bg-muted h-full">
             <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                 <div className="flex items-center justify-between">
                     <h1 className="text-xl font-semibold">Buat Pengguna</h1>
                     <div className="flex gap-2">
                         <Link href="/admin/users">
                             <Button variant="outline">Kembali</Button>
                         </Link>
                         <Button variant="outline" onClick={onCancel} disabled={saving}>
                             Reset
                         </Button>
                         <Button onClick={onSave} disabled={saving}>
                             Simpan
                         </Button>
                     </div>
                 </div>
 
                 <Card className="shadow-none">
                     <CardHeader>
                         <CardTitle>Informasi Pengguna</CardTitle>
                     </CardHeader>
                     <CardContent>
                         {error && <div className="text-sm">{error}</div>}
                         <div className="flex flex-col gap-6">
                             <div className="flex items-center gap-3">
                                 <Avatar size="lg">
                                     <AvatarImage src={undefined} alt={form.full_name || "User"} />
                                     <AvatarFallback>{initials(form.full_name)}</AvatarFallback>
                                 </Avatar>
                                 <div>
                                     <div className="font-semibold">{form.full_name || "-"}</div>
                                     <div className="text-muted-foreground text-sm">{form.email || "-"}</div>
                                 </div>
                             </div>
                             <div className="grid grid-cols-1 gap-4">
                                 <div className="flex flex-col gap-2">
                                     <Label htmlFor="user_id">User ID</Label>
                                     <Input id="user_id" value="" disabled />
                                 </div>
                                 <div className="flex flex-col gap-2">
                                     <Label htmlFor="full_name">Nama Lengkap</Label>
                                     <Input
                                         id="full_name"
                                         value={form.full_name}
                                         onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
                                     />
                                 </div>
                                 <div className="flex flex-col gap-2">
                                     <Label htmlFor="email">Email</Label>
                                     <Input
                                         id="email"
                                         type="email"
                                         value={form.email}
                                         onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                                     />
                                 </div>
                                 <div className="flex flex-col gap-2">
                                     <Label htmlFor="whatsapp_no">No. WhatsApp</Label>
                                     <Input
                                         id="whatsapp_no"
                                         value={form.whatsapp_no}
                                         onChange={(e) => setForm((f) => ({ ...f, whatsapp_no: e.target.value }))}
                                     />
                                 </div>
                                 <div className="flex flex-col gap-2">
                                     <Label htmlFor="role">Role</Label>
                                     <Input
                                         id="role"
                                         value={form.role}
                                         onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                                     />
                                 </div>
                                 <div className="flex flex-col gap-2">
                                     <Label htmlFor="marital_status">Status Pernikahan</Label>
                                     <Input
                                         id="marital_status"
                                         value={form.marital_status}
                                         onChange={(e) => setForm((f) => ({ ...f, marital_status: e.target.value }))}
                                     />
                                 </div>
                                 <div className="flex flex-col gap-2">
                                     <Label htmlFor="bio">Bio</Label>
                                     <Textarea
                                         id="bio"
                                         value={form.bio}
                                         onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                                     />
                                 </div>
                                 <div className="flex flex-col gap-2">
                                     <Label htmlFor="joined_at">Bergabung Pada</Label>
                                     <Input id="joined_at" value="" disabled />
                                 </div>
                                 <div className="flex flex-col gap-1">
                                     <div className="text-sm font-medium">Dokumen</div>
                                     <div className="text-sm">KTP: -</div>
                                     <div className="text-sm">Buku Nikah: -</div>
                                     <div className="text-sm">Status Verifikasi: -</div>
                                 </div>
                                 <div className="flex flex-col gap-1">
                                     <div className="text-sm font-medium">Hunian Saat Ini</div>
                                     <div className="text-sm">Kamar: -</div>
                                     <div className="text-sm">Properti: -</div>
                                     <div className="text-sm">Status: -</div>
                                 </div>
                             </div>
                         </div>
                     </CardContent>
                 </Card>
             </div>
         </div>
     );
 }
