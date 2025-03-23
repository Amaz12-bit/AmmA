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
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-white">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-neutral-900 mb-6">
            Sign In
          </h2>
        </div>
        
        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-4">
                <div className="rounded-lg bg-gray-50 p-3 flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <Input 
                    placeholder="Enter your username"
                    {...form.register("username")}
                    className="border-0 bg-transparent focus:ring-0 p-0 placeholder-gray-400"
                  />
                </div>
                
                <div className="rounded-lg bg-gray-50 p-3 flex items-center">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  <Input 
                    type="password"
                    placeholder="Enter your password"
                    {...form.register("password")}
                    className="border-0 bg-transparent focus:ring-0 p-0 placeholder-gray-400"
                  />
                  <Eye className="h-5 w-5 text-gray-400 ml-2 cursor-pointer" />
                </div>
              </div>
              
              <div className="text-right">
                <Link href="/forgot-password" className="text-sm text-blue-500">
                  Forgot password?
                </Link>
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
                disabled={isSubmitting}
              >
                Sign In
              </Button>
              
              <div className="text-center space-y-4">
                <div className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link href="/register" className="text-blue-500">
                    Sign up
                  </Link>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <button className="p-2 border rounded-lg">
                    <img src="/images/google.svg" alt="Google" className="h-6 w-6" />
                  </button>
                  <button className="p-2 border rounded-lg">
                    <img src="/images/apple.svg" alt="Apple" className="h-6 w-6" />
                  </button>
                  <button className="p-2 border rounded-lg">
                    <img src="/images/facebook.svg" alt="Facebook" className="h-6 w-6" />
                  </button>
                </div>
              </div> 
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
