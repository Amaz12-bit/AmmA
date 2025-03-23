import { useState } from "react";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { LineChart } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { insertUserSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const registerFormSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, {
    message: "Confirm password is required",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerFormSchema>;

const Register = () => {
  const { t } = useTranslation();
  const { register, error, clearError } = useAuth();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      preferredLanguage: "en",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    clearError();
    
    // Remove confirmPassword as it's not in the database schema
    const { confirmPassword, ...userData } = data;
    
    const success = await register(userData);
    
    if (success) {
      toast({
        title: "Registration Successful",
        description: "Welcome to AssetAlign! Your account has been created.",
      });
      navigate("/dashboard");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="py-12 px-4 bg-neutral-50">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-2">
            <LineChart className="h-8 w-8 text-primary-700" />
          </div>
          <h2 className="mt-2 text-3xl font-bold font-heading text-neutral-800">
            {t("auth.register")}
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            {t("auth.haveAccount")}{" "}
            <Link href="/login">
              <a className="font-medium text-primary hover:text-primary-dark">
                {t("auth.loginNow")}
              </a>
            </Link>
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("auth.createAccount")}</CardTitle>
            <CardDescription>
              Fill in your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.firstName")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.lastName")}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Doe" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.email")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="john.doe@example.com" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.phoneNumber")}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="+254712345678" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.username")}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="johndoe" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.password")}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("auth.confirmPassword")}</FormLabel>
                        <FormControl>
                          <Input 
                            type="password" 
                            placeholder="••••••••" 
                            {...field} 
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {error && (
                  <div className="text-sm text-error bg-error bg-opacity-10 p-3 rounded-md">
                    {error}
                  </div>
                )}
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("common.loading") : t("auth.register")}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
