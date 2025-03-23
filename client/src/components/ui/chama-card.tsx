import { Chama, ChamaMember } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link } from "wouter";
import { useTranslation } from "@/i18n";

interface ChamaCardProps {
  chama: Chama;
  memberInfo?: ChamaMember;
  nextContribution?: {
    date: string;
    amount: number;
  };
  nextMeeting?: {
    date: string;
    isVirtual: boolean;
  };
}

const ChamaCard = ({
  chama,
  memberInfo,
  nextContribution,
  nextMeeting,
}: ChamaCardProps) => {
  const { t } = useTranslation();

  // Determine if payment is due today
  const isPaymentDueToday = nextContribution && 
    new Date(nextContribution.date).toDateString() === new Date().toDateString();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all duration-300">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-neutral-800">{chama.name}</h3>
          <Badge variant={isPaymentDueToday ? "destructive" : "success"} className="font-medium">
            {isPaymentDueToday ? t("chamas.paymentDue") : t("chamas.active")}
          </Badge>
        </div>
        <div className="mt-2 text-sm text-neutral-500">
          <p>
            {memberInfo ? t("dashboard.members", { count: memberInfo.totalContributed }) : ""}
          </p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 border-t border-b border-neutral-100 py-4">
          <div>
            <p className="text-sm text-neutral-500">{t("dashboard.yourContribution")}</p>
            <p className="text-base font-medium text-neutral-800">
              {memberInfo ? formatCurrency(memberInfo.totalContributed) : "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-neutral-500">{t("dashboard.groupTotal")}</p>
            <p className="text-base font-medium text-neutral-800">
              {formatCurrency(chama.totalValue)}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center">
            <span className="text-sm font-medium text-neutral-500">{t("dashboard.nextContribution")}:</span>
            <span className={`ml-2 text-sm ${isPaymentDueToday ? 'font-medium text-error' : 'text-neutral-800'}`}>
              {nextContribution 
                ? `${formatDate(nextContribution.date, true)} (${formatCurrency(nextContribution.amount)})`
                : "-"}
            </span>
          </div>
          <div className="flex items-center mt-1">
            <span className="text-sm font-medium text-neutral-500">{t("dashboard.nextMeeting")}:</span>
            <span className="ml-2 text-sm text-neutral-800">
              March 15, 2024 at 10:00 AM
            </span>
          </div>
        </div>
      </div>
      <div className="bg-neutral-50 px-5 py-3 flex items-center justify-between">
        <Link href={`/chamas/${chama.id}`}>
          <a className="text-sm font-medium text-primary hover:text-primary-800">
            {t("common.viewDetails")}
          </a>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 rounded text-neutral-700 hover:bg-neutral-200" title="Quick actions">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => console.log("Make contribution")}>
              Make Contribution
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => console.log("View members")}>
              View Members
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => console.log("View transactions")}>
              View Transactions
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChamaCard;