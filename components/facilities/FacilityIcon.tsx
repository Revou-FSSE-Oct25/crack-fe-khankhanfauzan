import {
    AirVentIcon,
    BedDoubleIcon,
    Columns2Icon,
    CookingPotIcon,
    HelpCircleIcon,
    LampDeskIcon,
    ShowerHeadIcon,
    WifiIcon,
    ZapIcon,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
    WiFi: WifiIcon,
    AirVent: AirVentIcon,
    ShowerHead: ShowerHeadIcon,
    BedDouble: BedDoubleIcon,
    Columns2: Columns2Icon,
    LampDesk: LampDeskIcon,
    CookingPot: CookingPotIcon,
    Zap: ZapIcon,
};

const FacilityIcon = ({ iconName }: { iconName: string | null }) => {
    const IconComponent =
        iconName && iconMap[iconName] ? iconMap[iconName] : HelpCircleIcon;

    return <IconComponent className="w-5 h-5 text-primary" />;
};

export default FacilityIcon;
