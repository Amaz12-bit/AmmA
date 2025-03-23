import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/i18n";
import { Chama, ChamaMember, Transaction, Meeting, Investment } from "@/types";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { 
  Calendar, 
  DollarSign, 
  Download, 
  LineChart, 
  PlusCircle, 
  Settings, 
  Users,
  Banknote, 
  ArrowLeftRight 
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import ActivityList from "@/components/ui/activity-list";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface ChamaDetailParams {
  id: string;
}

const ChamaDetail = () => {
  const { t } = useTranslation();
  const params = useParams<ChamaDetailParams>();
  const chamaId = parseInt(params.id);
  
  // Fetch chama details
  const { data: chamaData, isLoading: isLoadingChama } = useQuery<{ chama: Chama, members: ChamaMember[] }>({
    queryKey: [`/api/chamas/${chamaId}`],
  });
  
  // Fetch chama transactions
  const { data: transactionsData, isLoading: isLoadingTransactions } = useQuery<{ transactions: Transaction[] }>({
    queryKey: [`/api/chamas/${chamaId}/transactions`],
  });
  
  // Fetch chama meetings
  const { data: meetingsData, isLoading: isLoadingMeetings } = useQuery<{ meetings: Meeting[] }>({
    queryKey: [`/api/meetings`],
    select: (data) => ({
      meetings: data.meetings.filter(meeting => meeting.chamaId === chamaId)
    })
  });
  
  // Fetch chama investments
  const { data: investmentsData, isLoading: isLoadingInvestments } = useQuery<{ investments: Investment[] }>({
    queryKey: [`/api/investments`],
    select: (data) => ({
      investments: data.investments.filter(investment => investment.chamaId === chamaId)
    })
  });
  
  const isLoading = isLoadingChama || isLoadingTransactions || isLoadingMeetings || isLoadingInvestments;
  
  if (isLoadingChama) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-28" />
        </div>
        
        <div className="grid grid-cols-1 gap-5 md:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
        
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }
  
  if (!chamaData?.chama) {
    return (
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl font-bold text-neutral-800 mb-4">
          {t("common.chamaNotFound")}
        </h1>
        <p className="text-neutral-600 mb-6">
          {t("common.chamaNotFoundDescription")}
        </p>
        <Link href="/chamas">
          <Button>
            {t("common.backToChamas")}
          </Button>
        </Link>
      </div>
    );
  }
  
  const { chama, members } = chamaData;

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <div className="flex items-center">
            <h1 className="text-2xl font-bold font-heading text-neutral-800 mr-3">
              {chama.name}
            </h1>
            <Badge variant="success">{t("chamas.active")}</Badge>
          </div>
          <p className="text-neutral-500 mt-1">
            {t("dashboard.founded", { date: formatDate(chama.foundedDate) })} • {members.length} {t("chamas.members")}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("common.downloadReport")}
          </Button>
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            {t("common.settings")}
          </Button>
        </div>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-neutral-500">{t("chamas.totalValue")}</p>
            <p className="text-xl font-bold text-neutral-800 mt-1">{formatCurrency(chama.totalValue)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-neutral-500">{t("chamas.members")}</p>
            <p className="text-xl font-bold text-neutral-800 mt-1">{members.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-neutral-500">{t("chamas.regularContribution")}</p>
            <p className="text-xl font-bold text-neutral-800 mt-1">
              {formatCurrency(chama.regularContributionAmount)} / {t(`chamas.${chama.contributionFrequency}`)}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-medium text-neutral-500">{t("chamas.investmentsCount")}</p>
            <p className="text-xl font-bold text-neutral-800 mt-1">
              {investmentsData?.investments.length || 0}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">{t("chamas.overview")}</TabsTrigger>
          <TabsTrigger value="members">{t("chamas.members")}</TabsTrigger>
          <TabsTrigger value="transactions">{t("chamas.transactions")}</TabsTrigger>
          <TabsTrigger value="meetings">{t("chamas.meetings")}</TabsTrigger>
          <TabsTrigger value="investments">{t("chamas.investments")}</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t("chamas.description")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-neutral-700">{chama.description}</p>
                  
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">{t("chamas.foundedDate")}</h4>
                      <p className="text-neutral-800">{formatDate(chama.foundedDate)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">{t("chamas.contributionFrequency")}</h4>
                      <p className="text-neutral-800">{t(`chamas.${chama.contributionFrequency}`)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">{t("chamas.regularContribution")}</h4>
                      <p className="text-neutral-800">{formatCurrency(chama.regularContributionAmount)}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-neutral-500">{t("chamas.totalValue")}</h4>
                      <p className="text-neutral-800">{formatCurrency(chama.totalValue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>{t("chamas.recentTransactions")}</CardTitle>
                  <Link href="/transactions">
                    <Button variant="ghost" size="sm">
                      {t("common.viewAll")}
                    </Button>
                  </Link>
                </CardHeader>
                <ActivityList 
                  activities={transactionsData?.transactions.slice(0, 5) || []} 
                  isLoading={isLoadingTransactions}
                />
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>{t("chamas.quickActions")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" size="lg">
                    <DollarSign className="mr-2 h-4 w-4" />
                    {t("transactions.makeContribution")}
                  </Button>
                  <Button className="w-full justify-start" size="lg" variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    {t("chamas.inviteMembers")}
                  </Button>
                  <Button className="w-full justify-start" size="lg" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    {t("meetings.scheduleMeeting")}
                  </Button>
                  <Button className="w-full justify-start" size="lg" variant="outline">
                    <LineChart className="mr-2 h-4 w-4" />
                    {t("investments.addInvestment")}
                  </Button>
                  <Button className="w-full justify-start" size="lg" variant="outline">
                    <Banknote className="mr-2 h-4 w-4" />
                    {t("transactions.requestLoan")}
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t("chamas.upcomingMeetings")}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoadingMeetings ? (
                    <>
                      {[1, 2].map((i) => (
                        <div key={i} className="p-3 border rounded-md">
                          <Skeleton className="h-5 w-40 mb-2" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      ))}
                    </>
                  ) : meetingsData?.meetings && meetingsData.meetings.length > 0 ? (
                    meetingsData.meetings
                      .filter(meeting => new Date(meeting.date) > new Date())
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .slice(0, 3)
                      .map((meeting) => (
                        <div key={meeting.id} className="p-3 border rounded-md hover:bg-neutral-50">
                          <p className="font-medium text-neutral-800">{meeting.title}</p>
                          <p className="text-sm text-neutral-500">
                            {formatDate(meeting.date)} • {meeting.isVirtual ? t("chamas.virtual") : t("chamas.inPerson")}
                          </p>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-neutral-500">{t("common.noUpcomingMeetings")}</p>
                    </div>
                  )}
                  <Link href="/meetings">
                    <Button variant="outline" className="w-full mt-2">
                      {t("common.viewAllMeetings")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Members Tab */}
        <TabsContent value="members">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{t("chamas.members")}</CardTitle>
              <Button size="sm">
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("chamas.addMember")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-md hover:bg-neutral-50">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary-100 text-primary-700">
                          {getInitials(member.user?.firstName, member.user?.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-neutral-800">
                          {member.user?.firstName} {member.user?.lastName}
                        </p>
                        <p className="text-sm text-neutral-500">
                          {t(`chamas.role.${member.role}`)} • {t("chamas.joined")} {formatDate(member.joinedDate, true)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-neutral-800">
                        {formatCurrency(member.totalContributed)}
                      </p>
                      <p className="text-sm text-neutral-500">
                        {t("chamas.totalContributed")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Transactions Tab */}
        <TabsContent value="transactions">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{t("chamas.transactions")}</CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                  {t("transactions.recordTransaction")}
                </Button>
                <Button size="sm">
                  <DollarSign className="mr-2 h-4 w-4" />
                  {t("transactions.makeContribution")}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ActivityList 
                activities={transactionsData?.transactions || []} 
                isLoading={isLoadingTransactions}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Meetings Tab */}
        <TabsContent value="meetings">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{t("chamas.meetings")}</CardTitle>
              <Button size="sm">
                <Calendar className="mr-2 h-4 w-4" />
                {t("meetings.scheduleMeeting")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingMeetings ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border rounded-md">
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-4 w-56" />
                      </div>
                    ))}
                  </>
                ) : meetingsData?.meetings && meetingsData.meetings.length > 0 ? (
                  meetingsData.meetings
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((meeting) => (
                      <div key={meeting.id} className="p-4 border rounded-md hover:bg-neutral-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-neutral-800">{meeting.title}</h3>
                            <p className="text-sm text-neutral-500 mt-1">
                              {formatDate(meeting.date)} • {new Date(meeting.date).toLocaleTimeString()}
                              {meeting.location && ` • ${meeting.location}`}
                            </p>
                            {meeting.description && (
                              <p className="text-sm text-neutral-600 mt-2">{meeting.description}</p>
                            )}
                          </div>
                          <Badge variant={meeting.isVirtual ? "info" : "secondary"}>
                            {meeting.isVirtual ? t("chamas.virtual") : t("chamas.inPerson")}
                          </Badge>
                        </div>
                        {meeting.isVirtual && meeting.meetingLink && (
                          <div className="mt-3">
                            <Button variant="outline" size="sm" asChild>
                              <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer">
                                {t("meetings.joinMeeting")}
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-neutral-500">{t("common.noMeetings")}</p>
                    <Button className="mt-4">
                      <Calendar className="mr-2 h-4 w-4" />
                      {t("meetings.scheduleMeeting")}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Investments Tab */}
        <TabsContent value="investments">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>{t("chamas.investments")}</CardTitle>
              <Button size="sm">
                <LineChart className="mr-2 h-4 w-4" />
                {t("investments.addInvestment")}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingInvestments ? (
                  <>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 border rounded-md">
                        <Skeleton className="h-5 w-40 mb-2" />
                        <div className="flex justify-between mb-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </>
                ) : investmentsData?.investments && investmentsData.investments.length > 0 ? (
                  investmentsData.investments.map((investment) => (
                    <div key={investment.id} className="p-4 border rounded-md hover:bg-neutral-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-neutral-800">{investment.name}</h3>
                          <div className="flex items-center mt-1">
                            <Badge variant="outline">
                              {t(`investments.${investment.type.toLowerCase().replace(' ', '')}`)}
                            </Badge>
                            <Badge variant="outline" className="ml-2">
                              {t(`investments.${investment.status.toLowerCase()}`)}
                            </Badge>
                          </div>
                          {investment.description && (
                            <p className="text-sm text-neutral-600 mt-2">{investment.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-neutral-800">{formatCurrency(investment.currentValue)}</p>
                          <p className="text-sm text-neutral-500">{t("investments.currentValue")}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between text-sm">
                        <div>
                          <span className="text-neutral-500">{t("investments.initialInvestment")}: </span>
                          <span className="font-medium">{formatCurrency(investment.amount)}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">{t("investments.startDate")}: </span>
                          <span className="font-medium">{formatDate(investment.startDate, true)}</span>
                        </div>
                        {investment.expectedReturnRate && (
                          <div>
                            <span className="text-neutral-500">{t("investments.expectedReturn")}: </span>
                            <span className="font-medium">{investment.expectedReturnRate}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <p className="text-neutral-500">{t("common.noInvestments")}</p>
                    <Button className="mt-4">
                      <LineChart className="mr-2 h-4 w-4" />
                      {t("investments.addInvestment")}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChamaDetail;
