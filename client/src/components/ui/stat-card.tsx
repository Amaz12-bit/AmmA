import { formatCurrency } from "@/lib/utils";
import { ReactNode } from "react";
import { Link } from "wouter";

interface StatCardProps {
  icon: ReactNode;
  iconBgColor: string;
  iconColor: string;
  title: string;
  value: string | number;
  linkLabel?: string;
  linkHref?: string;
}

const StatCard = ({
  icon,
  iconBgColor,
  iconColor,
  title,
  value,
  linkLabel,
  linkHref,
}: StatCardProps) => {
  // Format the value if it's a number and looks like currency
  const formattedValue = typeof value === "number" 
    ? isNaN(value) ? value : formatCurrency(value)
    : value;

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-md ${iconBgColor} ${iconColor}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-neutral-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-bold text-neutral-800">{formattedValue}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {linkLabel && linkHref && (
        <div className="bg-neutral-50 px-5 py-3">
          <div className="text-sm">
            <Link href={linkHref}>
              <a className="font-medium text-primary hover:text-primary-800">
                {linkLabel}<span className="sr-only"> {title}</span>
              </a>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;
