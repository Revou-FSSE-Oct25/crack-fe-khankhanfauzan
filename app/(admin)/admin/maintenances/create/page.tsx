 "use client";
 
 import React from "react";
 import { useForm, Controller } from "react-hook-form";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
 } from "@/components/ui/select";
 import Link from "next/link";
 
 type FormValues = {
     user_id: string;
     room_id: string;
     category: "electrical" | "plumbing" | "hvac" | "general";
     description: string;
 };
 
 export default function Page() {
     const { register, handleSubmit, control, reset } = useForm<FormValues>({
         defaultValues: {
             user_id: "",
             room_id: "",
             category: "electrical",
             description: "",
         },
     });
 
     function onSubmit(values: FormValues) {
         void values;
         reset();
     }
 
     return (
         <div className="bg-muted h-full">
             <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                 <div className="flex items-center justify-between">
                     <h1 className="text-xl font-semibold">Buat Tiket</h1>
                     <div className="flex gap-2">
                         <Link href="/admin/maintenances">
                             <Button variant="outline">Kembali</Button>
                         </Link>
                         <Button
                             variant="outline"
                             onClick={() =>
                                 reset({
                                     user_id: "",
                                     room_id: "",
                                     category: "electrical",
                                     description: "",
                                 })
                             }
                         >
                             Reset
                         </Button>
                         <Button onClick={handleSubmit(onSubmit)}>Simpan</Button>
                     </div>
                 </div>
 
                 <Card className="shadow-none">
                     <CardHeader>
                         <CardTitle>Informasi Tiket</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <div className="grid grid-cols-1 gap-4">
                             <div className="flex flex-col gap-2">
                                 <Label htmlFor="user_id">User ID</Label>
                                 <Input id="user_id" {...register("user_id")} />
                             </div>
                             <div className="flex flex-col gap-2">
                                 <Label htmlFor="room_id">Room ID</Label>
                                 <Input id="room_id" {...register("room_id")} />
                             </div>
                             <div className="flex flex-col gap-2">
                                 <Label>Kategori</Label>
                                 <Controller
                                     name="category"
                                     control={control}
                                     render={({ field }) => (
                                         <Select
                                             value={field.value}
                                             onValueChange={field.onChange}
                                         >
                                             <SelectTrigger className="w-56 bg-card">
                                                 <SelectValue placeholder="Pilih Kategori" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                 <SelectItem value="electrical">
                                                     Electrical
                                                 </SelectItem>
                                                 <SelectItem value="plumbing">
                                                     Plumbing
                                                 </SelectItem>
                                                 <SelectItem value="hvac">
                                                     HVAC
                                                 </SelectItem>
                                                 <SelectItem value="general">
                                                     General
                                                 </SelectItem>
                                             </SelectContent>
                                         </Select>
                                     )}
                                 />
                             </div>
                             <div className="flex flex-col gap-2">
                                 <Label htmlFor="description">Deskripsi</Label>
                                 <Textarea
                                     id="description"
                                     rows={5}
                                     {...register("description")}
                                 />
                             </div>
                         </div>
                     </CardContent>
                 </Card>
             </div>
         </div>
     );
 }
