import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/i18n";
import { Meeting } from "@/types";
import { formatDate, formatTime, isToday, isThisWeek, isNextWeek } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, PlusCircle, Search, Video, MapPin, ExternalLink, Clock, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

const Meetings = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [chamaFilter, setChamaFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("upcoming");
  
  // Fetch meetings
  const { data: meetingsData, isLoading } = useQuery<{ meetings: Meeting[] }>({
    queryKey: ["/api/meetings"],
  });

  // Filter meetings based on filters
  const filteredMeetings = meetingsData?.meetings.filter(meeting => {
    // Search term filter
    const searchMatch = 
      meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.chamaName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Chama filter
    const chamaMatch = chamaFilter === "all" || meeting.chamaId.toString() === chamaFilter;
    
    // Period filter (upcoming, past)
    const meetingDate = new Date(meeting.date);
    const now = new Date();
    const isPast = meetingDate < now;
    const isPeriodMatch = 
      (periodFilter === "upcoming" && !isPast) || 
      (periodFilter === "past" && isPast) ||
      periodFilter === "all";
    
    return searchMatch && chamaMatch && isPeriodMatch;
  });

  // Group meetings by date category
  const groupedMeetings = {
    today: filteredMeetings?.filter(meeting => isToday(meeting.date)) || [],
    thisWeek: filteredMeetings?.filter(meeting => !isToday(meeting.date) && isThisWeek(meeting.date)) || [],
    nextWeek: filteredMeetings?.filter(meeting => isNextWeek(meeting.date)) || [],
    future: filteredMeetings?.filter(
      meeting => {
        const date = new Date(meeting.date);
        return date > new Date() && !isToday(meeting.date) && !isThisWeek(meeting.date) && !isNextWeek(meeting.date);
      }
    ) || [],
    past: filteredMeetings?.filter(meeting => new Date(meeting.date) < new Date()) || [],
  };

  // Get unique chamas for filter
  const uniqueChamas = meetingsData?.meetings.reduce((acc: {id: number, name: string}[], meeting) => {
    if (meeting.chamaName && !acc.some(chama => chama.id === meeting.chamaId)) {
      acc.push({ id: meeting.chamaId, name: meeting.chamaName });
    }
    return acc;
  }, []) || [];

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold font-heading text-neutral-800 leading-7 sm:truncate">
            {t("navigation.meetings")}
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("meetings.scheduleMeeting")}
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            className="pl-9"
            placeholder={t("common.searchMeetings")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <Select value={chamaFilter} onValueChange={setChamaFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("meetings.filterByChama")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.allChamas")}</SelectItem>
              {uniqueChamas.map(chama => (
                <SelectItem key={chama.id} value={chama.id.toString()}>{chama.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("meetings.filterByPeriod")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.allMeetings")}</SelectItem>
              <SelectItem value="upcoming">{t("meetings.upcoming")}</SelectItem>
              <SelectItem value="past">{t("meetings.past")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="list" className="w-full mb-6">
        <TabsList>
          <TabsTrigger value="list">
            <i className="ri-list-check mr-1"></i>
            {t("meetings.listView")}
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <i className="ri-calendar-line mr-1"></i>
            {t("meetings.calendarView")}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-32 mb-2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[1, 2].map(j => (
                      <div key={j} className="border rounded-md p-4">
                        <Skeleton className="h-5 w-48 mb-2" />
                        <div className="flex items-center space-x-4 mb-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                        <Skeleton className="h-4 w-full" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredMeetings && filteredMeetings.length > 0 ? (
            <div className="space-y-6">
              {/* Today's meetings */}
              {periodFilter !== "past" && groupedMeetings.today.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>{t("common.today")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {groupedMeetings.today.map(meeting => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {/* This week's meetings */}
              {periodFilter !== "past" && groupedMeetings.thisWeek.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>{t("common.thisWeek")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {groupedMeetings.thisWeek.map(meeting => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {/* Next week's meetings */}
              {periodFilter !== "past" && groupedMeetings.nextWeek.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>{t("common.nextWeek")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {groupedMeetings.nextWeek.map(meeting => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {/* Future meetings */}
              {periodFilter !== "past" && groupedMeetings.future.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>{t("meetings.future")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {groupedMeetings.future.map(meeting => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </CardContent>
                </Card>
              )}
              
              {/* Past meetings */}
              {periodFilter !== "upcoming" && groupedMeetings.past.length > 0 && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>{t("meetings.past")}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {groupedMeetings.past.map(meeting => (
                      <MeetingCard key={meeting.id} meeting={meeting} />
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="mx-auto h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-neutral-500" />
              </div>
              <h3 className="text-lg font-medium text-neutral-800">
                {searchTerm || chamaFilter !== "all" ? 
                  t("common.noSearchResults") : 
                  periodFilter === "upcoming" ? 
                    t("common.noUpcomingMeetings") : 
                    t("common.noMeetings")}
              </h3>
              <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
                {searchTerm || chamaFilter !== "all" ? 
                  t("common.noSearchResultsDescription") : 
                  t("common.noMeetingsDescription")}
              </p>
              <div className="mt-6">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("meetings.scheduleMeeting")}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-neutral-500" />
                </div>
                <h3 className="text-lg font-medium text-neutral-800">
                  {t("meetings.calendarViewComingSoon")}
                </h3>
                <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
                  {t("meetings.calendarViewDescription")}
                </p>
                <div className="mt-6">
                  <Button variant="outline">
                    {t("common.viewAsList")}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Meeting card component
const MeetingCard = ({ meeting }: { meeting: Meeting }) => {
  const { t } = useTranslation();
  const meetingDate = new Date(meeting.date);
  const isPast = meetingDate < new Date();
  
  return (
    <div className="border rounded-md p-4 hover:bg-neutral-50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-lg text-neutral-800">{meeting.title}</h3>
        <Badge variant={meeting.isVirtual ? "info" : "secondary"}>
          {meeting.isVirtual ? t("chamas.virtual") : t("chamas.inPerson")}
        </Badge>
      </div>
      
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-neutral-500 mb-3">
        <div className="flex items-center">
          <Users className="h-4 w-4 mr-1" />
          {meeting.chamaName}
        </div>
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-1" />
          {formatDate(meeting.date)}
        </div>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {formatTime(meeting.date)}
        </div>
        {meeting.location && (
          <div className="flex items-center">
            {meeting.isVirtual ? (
              <Video className="h-4 w-4 mr-1" />
            ) : (
              <MapPin className="h-4 w-4 mr-1" />
            )}
            {meeting.location}
          </div>
        )}
      </div>
      
      {meeting.description && (
        <p className="text-sm text-neutral-600 mb-4">{meeting.description}</p>
      )}
      
      <div className="flex items-center space-x-3 mt-2">
        {meeting.isVirtual && meeting.meetingLink && !isPast && (
          <Button size="sm" asChild>
            <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className="flex items-center">
              <Video className="mr-2 h-4 w-4" />
              {t("meetings.joinMeeting")}
              <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </Button>
        )}
        
        {!isPast && (
          <Button size="sm" variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            {t("meetings.addToCalendar")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Meetings;
