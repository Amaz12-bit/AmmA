import { useState } from "react";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { insertUserSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";
import { FaFacebookF } from "react-icons/fa";

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

  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="min-h-screen px-4 py-6 bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
        <div className="mb-8 mt-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <User size={20} />
                      </div>
                      <Input 
                        className="pl-10 h-12 bg-muted rounded-md"
                        placeholder="Enter your username" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Mail size={20} />
                      </div>
                      <Input 
                        className="pl-10 h-12 bg-muted rounded-md"
                        type="email" 
                        placeholder="Enter your email address" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                    </div>
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
                  <FormControl>
                    <div className="relative">
                      <div className="absolute left-3 top-3 text-gray-400">
                        <Lock size={20} />
                      </div>
                      <Input 
                        className="pl-10 pr-10 h-12 bg-muted rounded-md"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password" 
                        {...field} 
                        disabled={isSubmitting}
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-3 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="hidden">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="password"
                        {...field} 
                        value={field.value || form.getValues().password}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} value={field.value || "First"} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} value={field.value || "Last"} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} value={field.value || "+254700000000"} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="preferredLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} value={field.value || "en"} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            {error && (
              <div className="text-sm text-error bg-error/10 p-3 rounded-md">
                {error}
              </div>
            )}
            
            <div className="flex items-center justify-center text-sm text-gray-500">
              <span className="relative flex-grow h-px bg-muted"></span>
              <span className="mx-2">Or</span>
              <span className="relative flex-grow h-px bg-muted"></span>
            </div>
            
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className="w-14 h-14 rounded-md flex items-center justify-center border border-muted"
                onClick={() => {
                  toast({
                    title: "Social Login",
                    description: "Google login is not available yet",
                  });
                }}
              >
                <FcGoogle size={24} />
              </button>
              <button
                type="button"
                className="w-14 h-14 rounded-md flex items-center justify-center border border-muted"
                onClick={() => {
                  toast({
                    title: "Social Login",
                    description: "Apple login is not available yet",
                  });
                }}
              >
                <SiApple size={24} />
              </button>
              <button
                type="button"
                className="w-14 h-14 rounded-md flex items-center justify-center border border-muted"
                onClick={() => {
                  toast({
                    title: "Social Login",
                    description: "Facebook login is not available yet",
                  });
                }}
              >
                <FaFacebookF size={24} className="text-blue-600" />
              </button>
            </div>
            
            <p className="text-xs text-center text-gray-500">
              By signing up, you agree to our{" "}
              <Link href="/terms" className="text-primary">
                Terms of Service and Privacy Policy.
              </Link>
            </p>
            
            <Button 
              type="submit" 
              className="w-full h-14 text-white rounded-full bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("common.loading") : "Sign Up"}
            </Button>
            
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium">
                Sign In
              </Link>
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Register;
