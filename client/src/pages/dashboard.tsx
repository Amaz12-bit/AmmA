import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { DashboardData } from "@/types";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import StatCard from "@/components/ui/stat-card";
import ChamaCard from "@/components/ui/chama-card";
import ActivityList from "@/components/ui/activity-list";
import ScheduleList from "@/components/ui/schedule-list";
import InvestmentChart from "@/components/ui/investment-chart";
import ActionCard from "@/components/ui/action-card";
import {
  Download,
  PlusCircle,
  Users,
  DollarSign,
  LineChart,
  Calendar
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  // Demo data
  const demoData = {
    stats: {
      activeChamasCount: 3,
      totalContributions: 150000,
      activeInvestmentsCount: 5,
      upcomingMeetingsCount: 2
    },
    chamas: [
      { id: 1, name: "Umoja Investment Group", description: "Community investment group", memberCount: 15 },
      { id: 2, name: "Maendeleo Savings Club", description: "Savings and loans group", memberCount: 20 },
      { id: 3, name: "Pamoja Real Estate Group", description: "Real estate investment group", memberCount: 25 }
    ],
    recentActivities: [
      { id: 1, type: "contribution", amount: 5000, status: "completed", date: new Date().toISOString(), chamaName: "Umoja Investment Group" },
      { id: 2, type: "investment", amount: 50000, status: "pending", date: new Date().toISOString(), chamaName: "Pamoja Real Estate Group" }
    ],
    upcomingSchedule: {
      today: [
        { type: "meeting", chamaName: "Umoja Investment Group", title: "Monthly Planning", date: new Date().toISOString() }
      ],
      thisWeek: [
        { type: "contribution", chamaName: "Maendeleo Savings Club", title: "Weekly Contribution", date: new Date(Date.now() + 86400000).toISOString() }
      ],
      nextWeek: []
    },
    investmentSummary: {
      total: 750000,
      breakdown: {
        "real estate": 400000,
        "bonds": 150000,
        "stocks": 100000,
        "mutual funds": 75000,
        "others": 25000
      }
    }
  };

  // Fetch dashboard data.  Uses demoData if isLoading is true
  const { data: dashboardData = demoData, isLoading } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between md:space-x-5 mb-6">
        <div className="flex items-start space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              <Avatar className="w-12 h-12 bg-primary-700">
                <AvatarFallback className="text-white font-medium">
                  {user ? getInitials(user.firstName, user.lastName) : ""}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 bg-success rounded-full h-3 w-3 border-2 border-white"></span>
            </div>
          </div>
          <div className="pt-1.5">
            <h1 className="text-2xl font-heading font-bold text-neutral-800">
              {t("common.welcome", { name: user?.firstName || "Guest" })}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Last login: {new Date(Date.now() - 86400000).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse md:mt-0 md:flex-row">
          <Button variant="outline" className="mt-3 md:mt-0 md:ml-3" disabled={isLoading}>
            <Download className="mr-2 h-4 w-4" />
            {t("common.downloadReport")}
          </Button>
          <Link href="/chamas/create">
            <Button className="md:ml-3" disabled={isLoading}>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("common.createNewChama")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick stats cards */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 p-3 rounded-md bg-neutral-100">
                      <Skeleton className="h-5 w-5" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-50 px-5 py-3">
                  <Skeleton className="h-4 w-20" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard
              icon={<Users className="h-5 w-5" />}
              iconBgColor="bg-primary-50"
              iconColor="text-primary-700"
              title={t("dashboard.quickStats.activeChamas")}
              value={dashboardData?.stats.activeChamasCount || 0}
              linkLabel={t("common.viewAll")}
              linkHref="/chamas"
            />
            <StatCard
              icon={<DollarSign className="h-5 w-5" />}
              iconBgColor="bg-secondary-50"
              iconColor="text-secondary-700"
              title={t("dashboard.quickStats.totalContributions")}
              value={dashboardData?.stats.totalContributions || 0}
              linkLabel={t("common.viewDetails")}
              linkHref="/transactions"
            />
            <StatCard
              icon={<LineChart className="h-5 w-5" />}
              iconBgColor="bg-accent-50"
              iconColor="text-accent-500"
              title={t("dashboard.quickStats.activeInvestments")}
              value={dashboardData?.stats.activeInvestmentsCount || 0}
              linkLabel={t("common.viewAll")}
              linkHref="/investments"
            />
            <StatCard
              icon={<Calendar className="h-5 w-5" />}
              iconBgColor="bg-info-50"
              iconColor="text-info"
              title={t("dashboard.quickStats.upcomingMeetings")}
              value={dashboardData?.stats.upcomingMeetingsCount || 0}
              linkLabel={t("common.viewSchedule")}
              linkHref="/meetings"
            />
          </>
        )}
      </div>

      {/* Active Chamas */}
      <h2 className="text-xl font-heading font-bold text-neutral-800 mt-8 mb-4">
        {t("dashboard.yourActiveChamas")}
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex justify-between items-center mb-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-48 mb-4" />
                  <div className="grid grid-cols-2 gap-4 border-t border-b border-neutral-100 py-4">
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <div className="bg-neutral-50 px-5 py-3 flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-6 rounded-full" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {dashboardData?.chamas.map((chama) => (
              <ChamaCard
                key={chama.id}
                chama={chama}
                // Find member info for this user in this chama
                memberInfo={dashboardData?.chamas.find(c => c.id === chama.id)?.members?.find(m => m.userId === user?.id)}
                // Get next contribution (placeholder for now)
                nextContribution={{
                  date: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                  amount: chama.regularContributionAmount
                }}
                // Get next meeting (placeholder for now)
                nextMeeting={{
                  date: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                  isVirtual: true
                }}
              />
            ))}

            {/* Create new chama card */}
            <Link href="/chamas/create">
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary-400 transition-colors duration-300 cursor-pointer bg-white h-full">
                <div className="h-12 w-12 rounded-full bg-primary-50 flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-primary-700" />
                </div>
                <h3 className="text-lg font-medium text-neutral-800">
                  {t("dashboard.createNewChama")}
                </h3>
                <p className="mt-2 text-sm text-neutral-500">
                  {t("dashboard.createNewChamaSubtitle")}
                </p>
              </div>
            </Link>
          </>
        )}
      </div>

      {/* Recent Activity and Upcoming */}
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-neutral-200">
          <div className="p-5 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-neutral-800">
                {t("dashboard.recentActivity")}
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                {dashboardData?.recentActivities?.[0]?.date ? (
                  `Last login: ${new Date(dashboardData.recentActivities[0].date).toLocaleString()}`
                ) : 'First login'}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <RefreshIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ActivityList
            activities={dashboardData?.recentActivities || []}
            isLoading={isLoading}
          />
          <div className="bg-neutral-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/transactions">
                <a className="font-medium text-primary-700 hover:text-primary-800">
                  {t("common.viewAll")}
                </a>
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Schedule */}
        <div className="bg-white overflow-hidden shadow rounded-lg border border-neutral-200">
          <div className="p-5 flex justify-between items-center">
            <h2 className="text-base font-bold text-neutral-800">
              {t("dashboard.upcomingSchedule")}
            </h2>
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <CalendarIcon className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <FilterIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <ScheduleList
            schedule={dashboardData?.upcomingSchedule || { today: [], thisWeek: [], nextWeek: [] }}
            isLoading={isLoading}
          />
          <div className="bg-neutral-50 px-5 py-3">
            <div className="text-sm">
              <Link href="/meetings">
                <a className="font-medium text-primary-700 hover:text-primary-800">
                  {t("common.viewFullCalendar")}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Performance */}
      <h2 className="text-xl font-heading font-bold text-neutral-800 mt-8 mb-4">
        {t("dashboard.investmentPerformance")}
      </h2>
      <InvestmentChart
        summary={dashboardData?.investmentSummary || {
          total: 0,
          breakdown: {
            'real estate': 0,
            bonds: 0,
            stocks: 0,
            'mutual funds': 0,
            others: 0
          }
        }}
        isLoading={isLoading}
      />

      {/* Action cards */}
      <h2 className="text-xl font-heading font-bold text-neutral-800 mt-8 mb-4">
        {t("dashboard.quickActions")}
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ActionCard
          icon={<DollarSign className="h-5 w-5" />}
          iconBgColor="bg-primary-50"
          iconColor="text-primary-700"
          title={t("quickActions.makeContribution.title")}
          description={t("quickActions.makeContribution.description")}
          link="/transactions/create"
          linkText={t("quickActions.makeContribution.cta")}
        />
        <ActionCard
          icon={<Users className="h-5 w-5" />}
          iconBgColor="bg-secondary-50"
          iconColor="text-secondary-700"
          title={t("quickActions.inviteMembers.title")}
          description={t("quickActions.inviteMembers.description")}
          link="/chamas"
          linkText={t("quickActions.inviteMembers.cta")}
        />
        <ActionCard
          icon={<LineChart className="h-5 w-5" />}
          iconBgColor="bg-accent-50"
          iconColor="text-accent-500"
          title={t("quickActions.exploreInvestments.title")}
          description={t("quickActions.exploreInvestments.description")}
          link="/investments"
          linkText={t("quickActions.exploreInvestments.cta")}
        />
      </div>
    </div>
  );
};

// Small utility icons
const RefreshIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 2v6h-6"></path>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
    <path d="M3 22v-6h6"></path>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
  </svg>
);

const FilterIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const CalendarIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

export default Dashboard;