 import * as React from "react";
 import { cva, type VariantProps } from "class-variance-authority";
 import { AlertDescription, AlertTitle } from "./alert";
 import { cn } from "@/lib/utils";
 import {
   InfoIcon,
   AlertTriangleIcon,
   CircleXIcon,
   CircleCheckIcon,
 } from "lucide-react";
 
 const bannerVariants = cva(
   "flex w-full items-center justify-between gap-4 rounded-lg border px-4 py-3",
   {
     variants: {
       variant: {
         default:
           "bg-gray-50 text-gray-900 border-gray-200 [&_.ab-icon]:text-gray-600",
         info:
           "bg-blue-50 text-blue-900 border-blue-200 [&_.ab-icon]:text-blue-600",
         warning:
           "bg-amber-50 text-amber-900 border-amber-200 [&_.ab-icon]:text-amber-600",
         error:
           "bg-destructive/10 text-destructive border-destructive/30 [&_.ab-icon]:text-destructive",
         success:
           "bg-green-50 text-green-900 border-green-200 [&_.ab-icon]:text-green-600",
       },
     },
     defaultVariants: {
       variant: "default",
     },
   }
 );
 
 type BannerVariant = VariantProps<typeof bannerVariants>["variant"];
 
 function defaultIconFor(variant?: BannerVariant) {
   switch (variant) {
     case "info":
       return <InfoIcon />;
     case "warning":
       return <AlertTriangleIcon />;
     case "error":
       return <CircleXIcon />;
     case "success":
       return <CircleCheckIcon />;
     default:
       return <InfoIcon />;
   }
 }
 
 export type AlertBannerProps = React.HTMLAttributes<HTMLDivElement> & {
   variant?: BannerVariant;
   icon?: React.ReactNode;
   title?: React.ReactNode;
   description?: React.ReactNode;
   action?: React.ReactNode;
 };
 
 export function AlertBanner({
   className,
   variant = "default",
   icon,
   title,
   description,
   action,
   ...props
 }: AlertBannerProps) {
   return (
     <div
       role="alert"
       className={cn(bannerVariants({ variant }), className)}
       {...props}
     >
       <div className="flex items-start gap-3">
         <span className="ab-icon [&>svg]:size-4">{icon ?? defaultIconFor(variant)}</span>
         <div className="flex flex-col">
           {title ? <AlertTitle>{title}</AlertTitle> : null}
           {description ? (
             <AlertDescription>{description}</AlertDescription>
           ) : null}
         </div>
       </div>
       {action ? <div className="shrink-0">{action}</div> : null}
     </div>
   );
 }
