import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/i18n";
import { Chama } from "@/types";
import { Link } from "wouter";
import ChamaCard from "@/components/ui/chama-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const Chamas = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fetch all chamas
  const { data: chamasData, isLoading } = useQuery<{ chamas: Chama[] }>({
    queryKey: ["/api/chamas"],
  });

  // Filter chamas based on search term
  const filteredChamas = chamasData?.chamas.filter(chama => 
    chama.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    chama.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold font-heading text-neutral-800 leading-7 sm:truncate">
            {t("navigation.myChamas")}
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link href="/chamas/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("common.createNewChama")}
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            className="pl-9 w-full"
            placeholder={t("common.search")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="sm:w-auto">
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {t("common.filter")}
        </Button>
      </div>

      {/* Chamas grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        </div>
      ) : filteredChamas && filteredChamas.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChamas.map((chama) => (
            <ChamaCard
              key={chama.id}
              chama={chama}
              // Placeholder for next contribution and meeting
              nextContribution={{
                date: new Date(new Date().getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(),
                amount: chama.regularContributionAmount
              }}
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
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <div className="mx-auto h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-neutral-500" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800">
            {searchTerm ? t("common.noSearchResults") : t("common.noChamas")}
          </h3>
          <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
            {searchTerm 
              ? t("common.noSearchResultsDescription") 
              : t("common.noChamasDescription")}
          </p>
          <div className="mt-6">
            <Link href="/chamas/create">
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                {t("common.createNewChama")}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chamas;
