import { useOfflineDetection } from "@/hooks/use-offline-detection";
import { useTranslation } from "@/i18n";
import { cn } from "@/lib/utils";
import { WifiOff } from "lucide-react";

const OfflineIndicator = () => {
  const isOffline = useOfflineDetection();
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 z-50 bg-error text-white px-4 py-2 rounded-md shadow-lg items-center flex transition-opacity duration-300",
        {
          "opacity-100": isOffline,
          "opacity-0 pointer-events-none": !isOffline,
        }
      )}
    >
      <WifiOff className="h-5 w-5 mr-2" />
      <span>{t("offline.message")}</span>
    </div>
  );
};

export default OfflineIndicator;
