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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const loginFormSchema = z.object({
  username: z.string().min(1, {
    message: "Username is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const Login = () => {
  const { t } = useTranslation();
  const { login, error, clearError } = useAuth();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    clearError();
    
    const success = await login(data.username, data.password);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome back to AssetAlign!",
      });
      navigate("/");
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-neutral-50">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center items-center mb-2">
            <LineChart className="h-8 w-8 text-primary-700" />
          </div>
          <h2 className="mt-2 text-3xl font-bold font-heading text-neutral-800">
            {t("auth.login")}
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            {t("auth.noAccount")}{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary-dark">
              {t("auth.registerNow")}
            </Link>
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>{t("auth.login")}</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.username")}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your username" 
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("auth.password")}</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          {...field} 
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && (
                  <div className="text-sm text-error bg-error bg-opacity-10 p-3 rounded-md">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? t("common.loading") : t("auth.login")}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/forgot-password" className="text-sm text-neutral-600 hover:text-primary">
              {t("auth.forgotPassword")}
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
