import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "@/i18n";
import { Transaction } from "@/types";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, ArrowDownLeft, DollarSign, Filter, Search, PlusCircle } from "lucide-react";
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
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Transactions = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Fetch transactions
  const { data: transactionsData, isLoading } = useQuery<{ transactions: Transaction[] }>({
    queryKey: ["/api/transactions"],
  });

  // Filter transactions based on filters
  const filteredTransactions = transactionsData?.transactions.filter(transaction => {
    // Search term filter
    const searchMatch = 
      transaction.chamaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type filter
    const typeMatch = typeFilter === "all" || transaction.type === typeFilter;
    
    // Status filter
    const statusMatch = statusFilter === "all" || transaction.status === statusFilter;
    
    return searchMatch && typeMatch && statusMatch;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="md:flex md:items-center md:justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold font-heading text-neutral-800 leading-7 sm:truncate">
            {t("navigation.transactions")}
          </h1>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            {t("transactions.recordTransaction")}
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <Input
            className="pl-9"
            placeholder={t("common.searchTransactions")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("transactions.filterByType")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="contribution">{t("transactions.contribution")}</SelectItem>
              <SelectItem value="loan">{t("transactions.loan")}</SelectItem>
              <SelectItem value="investment">{t("transactions.investment")}</SelectItem>
              <SelectItem value="dividend">{t("transactions.dividend")}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("transactions.filterByStatus")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("common.all")}</SelectItem>
              <SelectItem value="completed">{t("transactions.completed")}</SelectItem>
              <SelectItem value="pending">{t("transactions.pending")}</SelectItem>
              <SelectItem value="failed">{t("transactions.failed")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              {t("transactions.totalContributions")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="text-2xl font-bold text-neutral-800">
                {formatCurrency(
                  transactionsData?.transactions
                    .filter(t => t.type === "contribution" && t.status === "completed")
                    .reduce((sum, t) => sum + t.amount, 0) || 0
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              {t("transactions.totalLoans")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="text-2xl font-bold text-neutral-800">
                {formatCurrency(
                  transactionsData?.transactions
                    .filter(t => t.type === "loan" && t.status === "completed")
                    .reduce((sum, t) => sum + t.amount, 0) || 0
                )}
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-neutral-500">
              {t("transactions.totalDividends")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <div className="text-2xl font-bold text-neutral-800">
                {formatCurrency(
                  transactionsData?.transactions
                    .filter(t => t.type === "dividend" && t.status === "completed")
                    .reduce((sum, t) => sum + t.amount, 0) || 0
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Transactions table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("transactions.type")}</TableHead>
                  <TableHead>{t("transactions.chama")}</TableHead>
                  <TableHead>{t("transactions.amount")}</TableHead>
                  <TableHead>{t("transactions.date")}</TableHead>
                  <TableHead>{t("transactions.paymentMethod")}</TableHead>
                  <TableHead>{t("transactions.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : filteredTransactions && filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => {
                    const isIncome = ["contribution", "dividend"].includes(transaction.type.toLowerCase());
                    const statusColor = getStatusColor(transaction.status);
                    
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className={`mr-2 p-1 rounded-full bg-${isIncome ? 'success' : 'error'} bg-opacity-10`}>
                              {isIncome ? (
                                <ArrowUpRight className={`h-4 w-4 text-success`} />
                              ) : (
                                <ArrowDownLeft className={`h-4 w-4 text-error`} />
                              )}
                            </div>
                            {t(`transactions.${transaction.type.toLowerCase()}`)}
                          </div>
                        </TableCell>
                        <TableCell>{transaction.chamaName || "-"}</TableCell>
                        <TableCell className={`font-medium ${isIncome ? 'text-success' : 'text-error'}`}>
                          {isIncome ? "+" : "-"}{formatCurrency(transaction.amount)}
                        </TableCell>
                        <TableCell>{formatDate(transaction.date, true)}</TableCell>
                        <TableCell>{t(`transactions.${transaction.paymentMethod.toLowerCase()}`)}</TableCell>
                        <TableCell>
                          <Badge variant={statusColor === "success" 
                            ? "success" 
                            : statusColor === "warning" 
                            ? "warning" 
                            : "destructive"}>
                            {t(`transactions.${transaction.status.toLowerCase()}`)}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      <p className="text-neutral-500">{t("common.noTransactionsFound")}</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
