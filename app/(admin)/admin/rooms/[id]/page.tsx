 "use client";
 
 import React from "react";
 import { useParams } from "next/navigation";
 import { useForm, Controller } from "react-hook-form";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
 } from "@/components/ui/select";
 import { Checkbox } from "@/components/ui/checkbox";
 import Link from "next/link";
 
 type FormValues = {
     room_id: string;
     grid_position: number | undefined;
     room_type: string;
     price_monthly: number | undefined;
     status: "available" | "occupied" | "maintenance";
     facilities: string[];
 };
 
 function getDefaults(id: string): FormValues {
     if (id === "K-01") {
         return {
             room_id: "K-01",
             grid_position: 1,
             room_type: "Standard",
             price_monthly: 1000000,
             status: "occupied",
             facilities: ["AC", "WiFi"],
         };
     }
     if (id === "K-12") {
         return {
             room_id: "K-12",
             grid_position: 12,
             room_type: "Deluxe",
             price_monthly: 1300000,
             status: "available",
             facilities: ["AC"],
         };
     }
     if (id === "K-21") {
         return {
             room_id: "K-21",
             grid_position: 21,
             room_type: "Standard",
             price_monthly: 1000000,
             status: "maintenance",
             facilities: [],
         };
     }
     return {
         room_id: id,
         grid_position: undefined,
         room_type: "Standard",
         price_monthly: undefined,
         status: "available",
         facilities: [],
     };
 }
 
 export default function Page() {
     const params = useParams();
     const id = String(params?.id ?? "");
     const defaults = React.useMemo(() => getDefaults(id), [id]);
 
     const { register, handleSubmit, control, reset, setValue, watch } =
         useForm<FormValues>({
             defaultValues: defaults,
         });
 
     React.useEffect(() => {
         reset(defaults);
     }, [defaults, reset]);
 
     const facilities = watch("facilities");
 
     function onSubmit(values: FormValues) {
         void values;
     }
 
     function onReset() {
         reset(defaults);
     }
 
     function toggleFacility(val: string, checked: boolean) {
         const set = new Set(facilities);
         if (checked) set.add(val);
         else set.delete(val);
         setValue("facilities", Array.from(set));
     }
 
     return (
         <div className="bg-muted h-full">
             <div className="flex h-full flex-col gap-4 md:gap-6 p-4 md:p-6">
                 <div className="flex items-center justify-between">
                     <h1 className="text-xl font-semibold">Detail Kamar</h1>
                     <div className="flex gap-2">
                         <Link href="/admin/rooms">
                             <Button variant="outline">Kembali</Button>
                         </Link>
                         <Button variant="outline" onClick={onReset}>
                             Reset
                         </Button>
                         <Button onClick={handleSubmit(onSubmit)}>Simpan</Button>
                     </div>
                 </div>
 
                 <Card className="shadow-none">
                     <CardHeader>
                         <CardTitle>{id}</CardTitle>
                     </CardHeader>
                     <CardContent>
                         <div className="grid grid-cols-1 gap-4">
                             <div className="flex flex-col gap-2">
                                 <Label htmlFor="room_id">Room ID</Label>
                                 <Input id="room_id" {...register("room_id")} />
                             </div>
                             <div className="flex flex-col gap-2">
                                 <Label htmlFor="grid_position">Grid Position</Label>
                                 <Input
                                     id="grid_position"
                                     type="number"
                                     {...register("grid_position", { valueAsNumber: true })}
                                 />
                             </div>
                             <div className="flex flex-col gap-2">
                                 <Label>Room Type</Label>
                                 <Controller
                                     name="room_type"
                                     control={control}
                                     render={({ field }) => (
                                         <Select value={field.value} onValueChange={field.onChange}>
                                             <SelectTrigger className="w-56 bg-card">
                                                 <SelectValue placeholder="Pilih Tipe" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                 <SelectItem value="Standard">Standard</SelectItem>
                                                 <SelectItem value="Deluxe">Deluxe</SelectItem>
                                                 <SelectItem value="Superior">Superior</SelectItem>
                                             </SelectContent>
                                         </Select>
                                     )}
                                 />
                             </div>
                             <div className="flex flex-col gap-2">
                                 <Label htmlFor="price_monthly">Harga Bulanan</Label>
                                 <Input
                                     id="price_monthly"
                                     type="number"
                                     {...register("price_monthly", { valueAsNumber: true })}
                                 />
                             </div>
                             <div className="flex flex-col gap-2">
                                 <Label>Status</Label>
                                 <Controller
                                     name="status"
                                     control={control}
                                     render={({ field }) => (
                                         <Select value={field.value} onValueChange={field.onChange}>
                                             <SelectTrigger className="w-56 bg-card">
                                                 <SelectValue placeholder="Pilih Status" />
                                             </SelectTrigger>
                                             <SelectContent>
                                                 <SelectItem value="available">Available</SelectItem>
                                                 <SelectItem value="occupied">Occupied</SelectItem>
                                                 <SelectItem value="maintenance">Maintenance</SelectItem>
                                             </SelectContent>
                                         </Select>
                                     )}
                                 />
                             </div>
                             <div className="flex flex-col gap-2">
                                 <Label>Fasilitas</Label>
                                 <div className="flex items-center gap-6">
                                     <div className="flex items-center gap-2">
                                         <Checkbox
                                             id="fac-ac"
                                             checked={facilities.includes("AC")}
                                             onCheckedChange={(v) => toggleFacility("AC", Boolean(v))}
                                         />
                                         <Label htmlFor="fac-ac">AC</Label>
                                     </div>
                                     <div className="flex items-center gap-2">
                                         <Checkbox
                                             id="fac-wifi"
                                             checked={facilities.includes("WiFi")}
                                             onCheckedChange={(v) => toggleFacility("WiFi", Boolean(v))}
                                         />
                                         <Label htmlFor="fac-wifi">WiFi</Label>
                                     </div>
                                 </div>
                             </div>
                         </div>
                     </CardContent>
                 </Card>
             </div>
         </div>
     );
 }
