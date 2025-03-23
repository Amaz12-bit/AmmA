import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/i18n";
import { Investment } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { LineChart, PlusCircle, Search, SlidersHorizontal, ArrowUpRight, ArrowDownRight, Filter } from "lucide-react";
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
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const Investments = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState("cards");
  
  // Fetch investments
  const { data: investmentsData, isLoading } = useQuery<{ investments: Investment[] }>({
    queryKey: ["/api/investments"],
  });

  // Filter investments based on filters
  const filteredInvestments = investmentsData?.investments.filter(investment => {
    // Search term filter
    const searchMatch = 
      investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.chamaName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const typeMatch = typeFilter === "all" || investment.type === typeFilter;
    
    // Status filter
    const statusMatch = statusFilter === "all" || investment.status === statusFilter;
    
    return searchMatch && typeMatch && statusMatch;
  });

  // Calculate investment summary
  const investmentSummary = {
    total: filteredInvestments?.reduce((sum, inv) => sum + inv.currentValue, 0) || 0,
    totalInitial: filteredInvestments?.reduce((sum, inv) => sum + inv.amount, 0) || 0,
    byType: filteredInvestments?.reduce((acc, inv) => {
      const type = inv.type;
      if (!acc[type]) acc[type] = 0;
      acc[type] += inv.currentValue;
      return acc;
    }, {} as Record<string, number>) || {},
    byStatus: filteredInvestments?.reduce((acc, inv) => {
      const status = inv.status;
      if (!acc[status]) acc[status] = 0;
      acc[status] += inv.currentValue;
      return acc;
    }, {} as Record<string, number>) || {},
  };

  // Prepare data for the pie chart
  const chartData = Object.entries(investmentSummary.byType).map(([name, value]) => ({
    name: t(`investments.${name.toLowerCase().replace(' ', '')}`),
    value
  }));

  // Colors for the chart
  const COLORS = ['#1F4D7A', '#3A8E7C', '#F5A623', '#6C757D'];

  // Calculate total return
  const totalReturn = investmentSummary.total - investmentSummary.totalInitial;
  const returnPercentage = investmentSummary.totalInitial ? 
    ((totalReturn / investmentSummary.totalInitial) * 100).toFixed(2) : 
    "0.00";

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold font-heading text-neutral-800 leading-7 sm:truncate">
            {t("navigation.investments")}
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("investments.addInvestment")}
          </Button>
        </div>
      </div>

      {/* Investment Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              {t("investments.totalInvestments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="text-2xl font-bold text-neutral-800">
                {formatCurrency(investmentSummary.total)}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              {t("investments.initialInvestment")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="text-2xl font-bold text-neutral-800">
                {formatCurrency(investmentSummary.totalInitial)}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              {t("investments.totalReturn")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="flex items-center">
                <div className={`text-2xl font-bold ${totalReturn >= 0 ? 'text-success' : 'text-error'}`}>
                  {formatCurrency(totalReturn)}
                </div>
                <div className={`ml-2 flex items-center ${totalReturn >= 0 ? 'text-success' : 'text-error'}`}>
                  {totalReturn >= 0 ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(parseFloat(returnPercentage))}%
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              {t("investments.activeInvestments")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="text-2xl font-bold text-neutral-800">
                {filteredInvestments?.filter(i => i.status === "active").length || 0}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Visualization */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t("investments.portfolioBreakdown")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="col-span-1 md:col-span-2">
              <div style={{ height: "300px" }}>
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Skeleton className="h-40 w-40 rounded-full" />
                  </div>
                ) : chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {chartData.map((_, index) => (
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
            </div>
            <div className="space-y-4">
              <h3 className="text-base font-medium">{t("investments.breakdown")}</h3>
              
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-2">{t("investments.byType")}</h4>
                <div className="space-y-2">
                  {isLoading ? (
                    <>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </>
                  ) : Object.entries(investmentSummary.byType).length > 0 ? (
                    Object.entries(investmentSummary.byType).map(([type, value]) => (
                      <div key={type} className="flex justify-between">
                        <span className="text-sm">{t(`investments.${type.toLowerCase().replace(' ', '')}`)}</span>
                        <span className="text-sm font-medium">{formatCurrency(value)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">{t("common.noData")}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-neutral-500 mb-2">{t("investments.byStatus")}</h4>
                <div className="space-y-2">
                  {isLoading ? (
                    <>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      ))}
                    </>
                  ) : Object.entries(investmentSummary.byStatus).length > 0 ? (
                    Object.entries(investmentSummary.byStatus).map(([status, value]) => (
                      <div key={status} className="flex justify-between">
                        <span className="text-sm">{t(`investments.${status.toLowerCase()}`)}</span>
                        <span className="text-sm font-medium">{formatCurrency(value)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-neutral-500">{t("common.noData")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            className="pl-9"
            placeholder={t("common.searchInvestments")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("investments.filterByType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="real estate">{t("investments.realEstate")}</SelectItem>
              <SelectItem value="stocks">{t("investments.stocks")}</SelectItem>
              <SelectItem value="bonds">{t("investments.bonds")}</SelectItem>
              <SelectItem value="mutual funds">{t("investments.mutualFunds")}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("investments.filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="active">{t("investments.active")}</SelectItem>
              <SelectItem value="matured">{t("investments.matured")}</SelectItem>
              <SelectItem value="sold">{t("investments.sold")}</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex border rounded-md overflow-hidden">
            <Button 
              variant={view === "cards" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-none"
              onClick={() => setView("cards")}
            >
              <i className="ri-layout-grid-fill text-base mr-1"></i>
              {t("common.cards")}
            </Button>
            <Button 
              variant={view === "table" ? "default" : "ghost"} 
              size="sm" 
              className="rounded-none"
              onClick={() => setView("table")}
            >
              <i className="ri-table-line text-base mr-1"></i>
              {t("common.table")}
            </Button>
          </div>
        </div>
      </div>

      {/* Investments Grid or Table */}
      <Tabs value={view} className="w-full">
        <TabsContent value="cards" className="mt-0">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-5 w-40 mb-2" />
                    <div className="flex">
                      <Skeleton className="h-5 w-16 mr-2" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between mb-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-5 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredInvestments && filteredInvestments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredInvestments.map((investment) => {
                const returnValue = investment.currentValue - investment.amount;
                const returnPercentage = ((returnValue / investment.amount) * 100).toFixed(1);
                const isPositive = returnValue >= 0;
                
                return (
                  <Card key={investment.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{investment.name}</CardTitle>
                        <Badge variant={investment.status === "active" ? "success" : "secondary"}>
                          {t(`investments.${investment.status.toLowerCase()}`)}
                        </Badge>
                      </div>
                      <div className="flex space-x-2 mt-1">
                        <Badge variant="outline">
                          {t(`investments.${investment.type.toLowerCase().replace(' ', '')}`)}
                        </Badge>
                        <Badge variant="outline">
                          {investment.chamaName}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-neutral-500">{t("investments.currentValue")}</p>
                          <p className="text-xl font-semibold">{formatCurrency(investment.currentValue)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-neutral-500">{t("investments.return")}</p>
                          <div className="flex items-center">
                            <span className={`text-lg font-semibold ${isPositive ? 'text-success' : 'text-error'}`}>
                              {isPositive ? '+' : ''}{formatCurrency(returnValue)}
                            </span>
                            <span className={`ml-1 text-sm ${isPositive ? 'text-success' : 'text-error'}`}>
                              ({isPositive ? '+' : ''}{returnPercentage}%)
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {investment.description && (
                        <p className="text-sm text-neutral-600 mt-3">{investment.description}</p>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                        <div>
                          <p className="text-neutral-500">{t("investments.initialInvestment")}</p>
                          <p className="font-medium">{formatCurrency(investment.amount)}</p>
                        </div>
                        <div>
                          <p className="text-neutral-500">{t("investments.startDate")}</p>
                          <p className="font-medium">{formatDate(investment.startDate, true)}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <div className="mx-auto h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-neutral-500" />
              </div>
              <h3 className="text-lg font-medium text-neutral-800">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all" ? 
                  t("common.noSearchResults") : t("common.noInvestments")}
              </h3>
              <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
                {searchTerm || typeFilter !== "all" || statusFilter !== "all" ? 
                  t("common.noSearchResultsDescription") : 
                  t("common.noInvestmentsDescription")}
              </p>
              <div className="mt-6">
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {t("investments.addInvestment")}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="table" className="mt-0">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4">
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : filteredInvestments && filteredInvestments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium text-neutral-500">{t("investments.name")}</th>
                        <th className="text-left p-4 font-medium text-neutral-500">{t("investments.type")}</th>
                        <th className="text-left p-4 font-medium text-neutral-500">{t("investments.chama")}</th>
                        <th className="text-left p-4 font-medium text-neutral-500">{t("investments.initialInvestment")}</th>
                        <th className="text-left p-4 font-medium text-neutral-500">{t("investments.currentValue")}</th>
                        <th className="text-left p-4 font-medium text-neutral-500">{t("investments.return")}</th>
                        <th className="text-left p-4 font-medium text-neutral-500">{t("investments.startDate")}</th>
                        <th className="text-left p-4 font-medium text-neutral-500">{t("investments.status")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInvestments.map((investment) => {
                        const returnValue = investment.currentValue - investment.amount;
                        const returnPercentage = ((returnValue / investment.amount) * 100).toFixed(1);
                        const isPositive = returnValue >= 0;
                        
                        return (
                          <tr key={investment.id} className="border-b hover:bg-neutral-50">
                            <td className="p-4 font-medium">{investment.name}</td>
                            <td className="p-4">
                              {t(`investments.${investment.type.toLowerCase().replace(' ', '')}`)}
                            </td>
                            <td className="p-4">{investment.chamaName}</td>
                            <td className="p-4">{formatCurrency(investment.amount)}</td>
                            <td className="p-4 font-medium">{formatCurrency(investment.currentValue)}</td>
                            <td className="p-4">
                              <div className={`flex items-center ${isPositive ? 'text-success' : 'text-error'}`}>
                                {isPositive ? (
                                  <ArrowUpRight className="h-4 w-4 mr-1" />
                                ) : (
                                  <ArrowDownRight className="h-4 w-4 mr-1" />
                                )}
                                {formatCurrency(Math.abs(returnValue))} ({isPositive ? '+' : ''}{returnPercentage}%)
                              </div>
                            </td>
                            <td className="p-4">{formatDate(investment.startDate, true)}</td>
                            <td className="p-4">
                              <Badge variant={investment.status === "active" ? "success" : investment.status === "matured" ? "secondary" : "outline"}>
                                {t(`investments.${investment.status.toLowerCase()}`)}
                              </Badge>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                    <LineChart className="h-6 w-6 text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-800">
                    {searchTerm || typeFilter !== "all" || statusFilter !== "all" ? 
                      t("common.noSearchResults") : t("common.noInvestments")}
                  </h3>
                  <p className="mt-2 text-sm text-neutral-500 max-w-md mx-auto">
                    {searchTerm || typeFilter !== "all" || statusFilter !== "all" ? 
                      t("common.noSearchResultsDescription") : 
                      t("common.noInvestmentsDescription")}
                  </p>
                  <div className="mt-6">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      {t("investments.addInvestment")}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Investments;
