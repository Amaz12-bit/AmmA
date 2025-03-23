import { useState } from "react";
import { useTranslation } from "@/i18n";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { insertChamaSchema } from "@shared/schema";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Extend the schema for form validation
const createChamaSchema = insertChamaSchema.extend({
  foundedDate: z.date({
    required_error: "Founded date is required",
  }),
});

type CreateChamaFormValues = z.infer<typeof createChamaSchema>;

const CreateChama = () => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<CreateChamaFormValues>({
    resolver: zodResolver(createChamaSchema),
    defaultValues: {
      name: "",
      description: "",
      foundedDate: new Date(),
      regularContributionAmount: 5000,
      contributionFrequency: "monthly",
      totalValue: 0,
    },
  });

  const onSubmit = async (data: CreateChamaFormValues) => {
    setIsSubmitting(true);
    
    try {
      const res = await apiRequest("POST", "/api/chamas", data);
      const response = await res.json();
      
      queryClient.invalidateQueries({ queryKey: ["/api/chamas"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
      
      toast({
        title: "Chama Created",
        description: `${data.name} has been created successfully!`,
      });
      
      navigate(`/chamas/${response.chama.id}`);
    } catch (error) {
      console.error("Error creating chama:", error);
      toast({
        title: "Error",
        description: "Failed to create chama. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/chamas")} 
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {t("common.backToChamas")}
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("common.createNewChama")}</CardTitle>
          <CardDescription>
            {t("common.createNewChamaDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("chamas.name")}</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder={t("chamas.namePlaceholder")} 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("chamas.nameDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("chamas.description")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("chamas.descriptionPlaceholder")} 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("chamas.descriptionHelp")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="foundedDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("chamas.foundedDate")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isSubmitting}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>{t("common.pickDate")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      {t("chamas.foundedDateDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="regularContributionAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("chamas.regularContribution")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1}
                          placeholder="5000" 
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormDescription>
                        {t("chamas.amountInKES")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contributionFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("chamas.contributionFrequency")}</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={isSubmitting}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("chamas.selectFrequency")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="weekly">{t("chamas.weekly")}</SelectItem>
                          <SelectItem value="biweekly">{t("chamas.biweekly")}</SelectItem>
                          <SelectItem value="monthly">{t("chamas.monthly")}</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        {t("chamas.frequencyDescription")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end space-x-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate("/chamas")}
                  disabled={isSubmitting}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("common.creating") : t("common.createChama")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateChama;
