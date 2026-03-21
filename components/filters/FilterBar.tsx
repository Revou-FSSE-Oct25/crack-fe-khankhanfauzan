 "use client";
 
 import * as React from "react";
 import { DateRange } from "react-day-picker";
 import { cn } from "@/lib/utils";
 import {
     InputGroup,
     InputGroupAddon,
     InputGroupInput,
 } from "@/components/ui/input-group";
 import { DateRangePicker } from "@/components/ui/date-range-picker";
 import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
 } from "@/components/ui/select";
 import { SearchIcon } from "lucide-react";
 
 type SelectOption = {
     value: string;
     label: string;
 };
 
 export function FilterBar({
     className,
     search,
     dateRange,
     select,
 }: {
     className?: string;
     search?: {
         value: string;
         onChange: (v: string) => void;
         placeholder?: string;
         iconColor?: string;
     };
     dateRange?: {
         value?: DateRange;
         onChange: (v: DateRange | undefined) => void;
     };
     select?: {
         value: string;
         onChange: (v: string) => void;
         placeholder?: string;
         options: SelectOption[];
         triggerClassName?: string;
     };
 }) {
     const currentLabel =
         select?.options?.find((o) => o.value === select.value)?.label ??
         select?.value;
 
     return (
         <div className={cn("flex gap-4", className)}>
             {search && (
                 <InputGroup className="bg-card">
                     <InputGroupInput
                         placeholder={search.placeholder}
                         value={search.value}
                         onChange={(e) => search.onChange(e.target.value)}
                     />
                     <InputGroupAddon>
                         <SearchIcon color={search.iconColor} />
                     </InputGroupAddon>
                 </InputGroup>
             )}
             {dateRange && (
                 <DateRangePicker value={dateRange.value} onChange={dateRange.onChange} />
             )}
             {select && (
                 <Select value={select.value} onValueChange={select.onChange}>
                     <SelectTrigger className={cn("bg-card", select.triggerClassName)}>
                         <SelectValue placeholder={select.placeholder}>
                             {currentLabel || select.placeholder}
                         </SelectValue>
                     </SelectTrigger>
                     <SelectContent>
                         {select.options.map((opt) => (
                             <SelectItem key={opt.value} value={opt.value}>
                                 {opt.label}
                             </SelectItem>
                         ))}
                     </SelectContent>
                 </Select>
             )}
         </div>
     );
 }
