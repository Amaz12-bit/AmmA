import { Transaction } from "@/types";
import { formatCurrency, formatDateTime, getStatusColor, getTransactionIcon } from "@/lib/utils";
import { useTranslation } from "@/i18n";

interface ActivityListProps {
  activities: Transaction[];
  isLoading?: boolean;
  limit?: number;
  onViewMore?: () => void;
}

const ActivityList = ({ activities, isLoading, limit, onViewMore }: ActivityListProps) => {
  const { t } = useTranslation();
  
  // Display a limited number of activities if limit is provided
  const displayActivities = limit ? activities.slice(0, limit) : activities;
  
  // Loading skeleton
  if (isLoading) {
    return (
      <div className="overflow-hidden overflow-y-auto" style={{ maxHeight: "370px" }}>
        <ul className="divide-y divide-neutral-200">
          {[...Array(5)].map((_, index) => (
            <li key={index} className="px-5 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-neutral-200 animate-pulse"></div>
                <div className="min-w-0 flex-1">
                  <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded animate-pulse w-1/2"></div>
                </div>
                <div className="text-right">
                  <div className="h-4 bg-neutral-200 rounded animate-pulse w-16 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded animate-pulse w-12"></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  // Empty state
  if (!activities || activities.length === 0) {
    return (
      <div className="overflow-hidden overflow-y-auto" style={{ maxHeight: "370px" }}>
        <div className="py-12 text-center">
          <p className="text-neutral-500">{t("common.noActivities")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden overflow-y-auto" style={{ maxHeight: "370px" }}>
      <ul className="divide-y divide-neutral-200">
        {displayActivities.map((activity) => {
          const statusColor = getStatusColor(activity.status);
          const icon = getTransactionIcon(activity.type);
          const isIncome = ["contribution", "dividend"].includes(activity.type.toLowerCase());
          
          return (
            <li key={activity.id} className="px-5 py-4 hover:bg-neutral-50">
              <div className="flex items-center space-x-4">
                <div className={`flex-shrink-0 h-8 w-8 rounded-full bg-${statusColor} bg-opacity-10 flex items-center justify-center text-${statusColor}`}>
                  <i className={`ri-${icon} text-lg`}></i>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-800 truncate">
                    {activity.type === "contribution" 
                      ? t("transactions.contribution") + (activity.chamaName ? ` to ${activity.chamaName}` : "")
                      : activity.type === "loan"
                      ? t("transactions.loan") + (activity.chamaName ? ` from ${activity.chamaName}` : "")
                      : activity.type === "investment"
                      ? t("transactions.investment") + (activity.chamaName ? ` for ${activity.chamaName}` : "")
                      : activity.type === "dividend"
                      ? t("transactions.dividend") + (activity.chamaName ? ` from ${activity.chamaName}` : "")
                      : activity.type}
                  </p>
                  <p className="text-sm text-neutral-500">{formatDateTime(activity.date)}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${isIncome ? "text-success" : "text-error"}`}>
                    {isIncome ? "+" : "-"}{formatCurrency(activity.amount)}
                  </p>
                  <p className="text-xs text-neutral-500">
                      {activity.paymentMethod ? t(`transactions.${activity.paymentMethod.toLowerCase()}`) : t('transactions.unknown')}
                    </p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      
      {limit && activities.length > limit && onViewMore && (
        <div className="bg-neutral-50 px-5 py-3">
          <div className="text-sm">
            <button
              onClick={onViewMore}
              className="font-medium text-primary hover:text-primary-800"
            >
              {t("common.viewAll")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityList;
