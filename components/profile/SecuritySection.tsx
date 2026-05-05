 "use client";
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { IconSurface } from "@/components/ui/icon-surface";
 import { LockIcon } from "lucide-react";
 import { Button } from "@/components/ui/button";
 
 export function SecuritySection() {
   return (
     <Card className="shadow-none">
       <CardHeader>
         <CardTitle className="flex gap-2">
           <IconSurface bgClass="bg-amber-100" className="w-min self-center">
             <LockIcon size={16} color="oklch(76.9% 0.188 70.08)" />
           </IconSurface>
           <div className="flex flex-col gap-1">
             <h2 className="text-base font-semibold">Keamanan</h2>
             <p className="text-xs text-muted-foreground font-normal">Ubah password dan pengaturan keamanan</p>
           </div>
         </CardTitle>
       </CardHeader>
       <CardContent>
         <Button className="w-full" variant="outline">
           <LockIcon />
           Ubah Password
         </Button>
       </CardContent>
     </Card>
   );
 }
