 "use client";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { IconSurface } from "@/components/ui/icon-surface";
 import { BellIcon, SwitchCameraIcon } from "lucide-react";
 import { Switch } from "@/components/ui/switch";
 
 export function NotificationSettingsSection() {
   return (
     <Card className="shadow-none">
       <CardHeader>
         <CardTitle className="flex gap-2">
           <IconSurface bgClass="bg-accent" className="w-min self-center">
             <BellIcon size={16} color="var(--color-primary)" />
           </IconSurface>
           <div className="flex flex-col">
             <h2 className="text-base font-semibold">Pengaturan Notifikasi</h2>
             <p className="text-xs text-muted-foreground font-normal">Kelola prefensi notifikasi Anda</p>
           </div>
         </CardTitle>
       </CardHeader>
       <CardContent className="flex flex-col gap-4">
         <div className="pb-2 border-b flex justify-between items-center">
           <div>
             <p className="font-medium">Email Notifications</p>
             <p className="text-muted-foreground text-xs">Terima notifikasi via email</p>
           </div>
           <Switch />
         </div>
         <div className="pb-2 border-b flex justify-between items-center">
           <div>
             <p className="font-medium">WhatsApp Notifications</p>
             <p className="text-muted-foreground text-xs">Terima notifikasi via WhatsApp</p>
           </div>
           <Switch />
         </div>
         <div className="pb-2 border-b flex justify-between items-center">
           <div>
             <p className="font-medium">Payment Reminders</p>
             <p className="text-muted-foreground text-xs">Pengingat jatuh tempo pembayaran (H-3)</p>
           </div>
           <Switch />
         </div>
         <div className="pb-2 border-b flex justify-between items-center">
           <div>
             <p className="font-medium">Maintenance Updates</p>
             <p className="text-muted-foreground text-xs">Update status maintenance request</p>
           </div>
           <Switch />
         </div>
       </CardContent>
     </Card>
   );
 }
