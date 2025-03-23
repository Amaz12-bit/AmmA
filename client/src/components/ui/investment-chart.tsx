import { useState } from "react";
import { useTranslation } from "@/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvestmentSummary } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface InvestmentChartProps {
  summary: InvestmentSummary;
  isLoading?: boolean;
}

const InvestmentChart = ({ summary, isLoading }: InvestmentChartProps) => {
  const { t } = useTranslation();
  const [timeRange, setTimeRange] = useState("30");

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="h-6 bg-neutral-200 rounded animate-pulse w-40"></div>
            <div className="h-9 bg-neutral-200 rounded animate-pulse w-32"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] flex items-center justify-center">
            <div className="h-40 w-40 rounded-full bg-neutral-200 animate-pulse"></div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <div key={index} className="bg-neutral-50 rounded-lg p-4">
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-24 mb-2"></div>
                <div className="h-6 bg-neutral-200 rounded animate-pulse w-32 mb-2"></div>
                <div className="h-4 bg-neutral-200 rounded animate-pulse w-20"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prepare data for the pie chart
  const chartData = [
    { name: t("investments.realEstate"), value: summary.breakdown["real estate"] },
    { name: t("investments.bonds"), value: summary.breakdown.bonds },
    { name: t("investments.stocks"), value: summary.breakdown.stocks + summary.breakdown["mutual funds"] },
    { name: "Other", value: summary.breakdown.others }
  ].filter(item => item.value > 0);

  // Colors for the chart
  const COLORS = ['#1F4D7A', '#3A8E7C', '#F5A623', '#6C757D'];

  // Performance indicators with mock data
  const performanceData = [
    {
      name: t("investments.realEstate"),
      value: summary.breakdown["real estate"],
      change: 8.2,
      isPositive: true
    },
    {
      name: t("investments.bonds"),
      value: summary.breakdown.bonds,
      change: 3.5,
      isPositive: true
    },
    {
      name: t("investments.stocks"),
      value: summary.breakdown.stocks + summary.breakdown["mutual funds"],
      change: -2.1,
      isPositive: false
    }
  ].filter(item => item.value > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-medium text-neutral-800">
              {t("dashboard.portfolioOverview")}
            </CardTitle>
            <p className="mt-1 text-sm text-neutral-500">
              {t("dashboard.totalValue")}: {formatCurrency(summary.total)}
            </p>
          </div>
          <div className="mt-3 sm:mt-0 sm:ml-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">{t("common.last30Days")}</SelectItem>
                <SelectItem value="90">{t("common.last3Months")}</SelectItem>
                <SelectItem value="180">{t("common.last6Months")}</SelectItem>
                <SelectItem value="ytd">{t("common.yearToDate")}</SelectItem>
                <SelectItem value="all">{t("common.allTime")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="mt-6" style={{ height: "250px" }}>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any) => [formatCurrency(value), "Value"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-neutral-500">{t("common.noInvestmentData")}</p>
            </div>
          )}
        </div>

        {/* Investment allocation */}
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {performanceData.map((item, index) => (
            <div key={index} className="bg-neutral-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-neutral-500">{item.name}</h4>
              <p className="mt-1 text-lg font-semibold text-neutral-800">
                {formatCurrency(item.value)}
              </p>
              <div className="mt-1 flex items-center">
                <span className={`text-sm ${item.isPositive ? "text-success" : "text-error"} flex items-center`}>
                  {item.isPositive ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(item.change).toFixed(1)}%
                </span>
                <span className="text-xs text-neutral-500 ml-2">{t("investments.since")}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentChart;
