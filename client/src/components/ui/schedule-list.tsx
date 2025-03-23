import { ScheduleItem } from "@/types";
import { formatDate, formatTime, isToday, isThisWeek, isNextWeek } from "@/lib/utils";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, DollarSign } from "lucide-react";

interface ScheduleItem {
  id: number;
  date: string;
  title: string;
  type: 'meeting' | 'contribution';
  details?: {
    location?: string;
    amount?: number;
  };
}

interface ScheduleListProps {
  schedule: {
    today: ScheduleItem[];
    thisWeek: ScheduleItem[];
    nextWeek: ScheduleItem[];
  };
  isLoading?: boolean;
}

const ScheduleList = ({ schedule, isLoading }: ScheduleListProps) => {
  const { t } = useTranslation();

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="overflow-hidden overflow-y-auto" style={{ maxHeight: "370px" }}>
        <div className="px-5 py-3 bg-neutral-50">
          <div className="h-4 bg-neutral-200 rounded animate-pulse w-20"></div>
        </div>
        <ul className="divide-y divide-neutral-200">
          {[...Array(2)].map((_, index) => (
            <li key={index} className="px-5 py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-neutral-200 animate-pulse"></div>
                <div className="min-w-0 flex-1">
                  <div className="h-4 bg-neutral-200 rounded animate-pulse w-3/4 mb-2"></div>
                  <div className="h-3 bg-neutral-200 rounded animate-pulse w-1/2"></div>
                </div>
                <div>
                  <div className="h-8 bg-neutral-200 rounded animate-pulse w-20"></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Empty state for the entire schedule
  if ((!schedule.today || schedule.today.length === 0) && 
      (!schedule.thisWeek || schedule.thisWeek.length === 0) && 
      (!schedule.nextWeek || schedule.nextWeek.length === 0)) {
    return (
      <div className="overflow-hidden overflow-y-auto" style={{ maxHeight: "370px" }}>
        <div className="py-12 text-center">
          <p className="text-neutral-500">{t("common.noSchedule")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden overflow-y-auto" style={{ maxHeight: "370px" }}>
      {/* Today's schedule */}
      <div className="px-5 py-3 bg-neutral-50">
        <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t("common.today")}</h3>
      </div>
      {schedule.today && schedule.today.length > 0 ? (
        <ul className="divide-y divide-neutral-200">
          {schedule.today.map((item, index) => (
            <ScheduleItemComponent key={`today-${index}`} item={item} />
          ))}
        </ul>
      ) : (
        <div className="px-5 py-4 text-center text-sm text-neutral-500">
          {t("common.noScheduleToday")}
        </div>
      )}

      {/* This Week's schedule */}
      <div className="px-5 py-3 bg-neutral-50">
        <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t("common.thisWeek")}</h3>
      </div>
      {schedule.thisWeek && schedule.thisWeek.length > 0 ? (
        <ul className="divide-y divide-neutral-200">
          {schedule.thisWeek.map((item, index) => (
            <ScheduleItemComponent key={`thisWeek-${index}`} item={item} />
          ))}
        </ul>
      ) : (
        <div className="px-5 py-4 text-center text-sm text-neutral-500">
          {t("common.noScheduleThisWeek")}
        </div>
      )}

      {/* Next Week's schedule */}
      <div className="px-5 py-3 bg-neutral-50">
        <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500">{t("common.nextWeek")}</h3>
      </div>
      {schedule.nextWeek && schedule.nextWeek.length > 0 ? (
        <ul className="divide-y divide-neutral-200">
          {schedule.nextWeek.map((item, index) => (
            <ScheduleItemComponent key={`nextWeek-${index}`} item={item} />
          ))}
        </ul>
      ) : (
        <div className="px-5 py-4 text-center text-sm text-neutral-500">
          {t("common.noScheduleNextWeek")}
        </div>
      )}
    </div>
  );
};

// Individual schedule item component
const ScheduleItemComponent = ({ item }: { item: ScheduleItem }) => {
  const { t } = useTranslation();
  const itemDate = new Date(item.date);
  const isMeeting = item.type === "meeting";
  const isContribution = item.type === "contribution";

  const getActionButton = () => {
    if (isMeeting) {
      return (
        <Button variant="outline" size="sm">
          {t("meetings.addToCalendar")}
        </Button>
      );
    } else if (isContribution) {
      if (isToday(item.date)) {
        return (
          <Button size="sm" variant="default">
            {t("transactions.makeContribution")}
          </Button>
        );
      } else {
        return (
          <Button variant="outline" size="sm">
            {t("common.schedulePayment")}
          </Button>
        );
      }
    }
    return null;
  };

  return (
    <li className="px-5 py-4 hover:bg-neutral-50">
      <div className="flex items-center space-x-4">
        <div className={`flex-shrink-0 h-10 w-10 rounded-full ${isMeeting ? 'bg-info bg-opacity-10 text-info' : 'bg-warning bg-opacity-10 text-warning'} flex items-center justify-center`}>
          {isMeeting ? <Calendar className="h-5 w-5" /> : <DollarSign className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-800">{item.title}</p>
          <p className="mt-1 text-sm text-neutral-500">
            {formatDate(item.date)} • {formatTime(item.date)}
            {isMeeting && item.details?.location && ` • ${item.details.location}`}
            {isContribution && item.details?.amount && ` • ${t("common.amount")}: KES ${item.details.amount.toLocaleString()}`}
          </p>
        </div>
        <div>
          {getActionButton()}
        </div>
      </div>
    </li>
  );
};

export default ScheduleList;