import { Link, useLocation } from "wouter";
import { useTranslation } from "@/i18n";
import { 
  BarChart3, 
  Users, 
  ArrowLeftRight, 
  BarChartHorizontal, 
  Calendar
} from "lucide-react";

const MobileTabNav = () => {
  const [location] = useLocation();
  const { t } = useTranslation();
  
  const navigationItems = [
    { 
      label: t("navigation.dashboard"), 
      href: "/dashboard", 
      icon: BarChart3,
      active: location === "/dashboard" 
    },
    { 
      label: t("navigation.myChamas"), 
      href: "/chamas", 
      icon: Users,
      active: location === "/chamas" || location.startsWith("/chamas/") 
    },
    { 
      label: t("navigation.transactions"), 
      href: "/transactions", 
      icon: ArrowLeftRight,
      active: location === "/transactions" 
    },
    { 
      label: t("navigation.investments"), 
      href: "/investments", 
      icon: BarChartHorizontal,
      active: location === "/investments" 
    },
    { 
      label: t("navigation.meetings"), 
      href: "/meetings", 
      icon: Calendar,
      active: location === "/meetings" 
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 lg:hidden z-40">
      <div className="grid grid-cols-5">
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center py-2 text-xs"
          >
            <div 
              className={`p-1.5 rounded-full mb-1 ${
                item.active ? "bg-primary text-white" : "text-neutral-500"
              }`}
            >
              <item.icon className="h-5 w-5" />
            </div>
            <span 
              className={item.active ? "text-primary font-medium" : "text-neutral-500"}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileTabNav;