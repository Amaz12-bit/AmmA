import { useState } from "react";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { Eye, EyeOff, User, Mail, Lock, Shield, BarChartBig, Users, CreditCard } from "lucide-react";
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
  const { register, error } = useAuth();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      username: "AssetAlign", // Default username
      password: "123",       // Default password
      confirmPassword: "123",
      email: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      preferredLanguage: "en",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    // clearError(); // Removed for brevity; may need to be re-added

    // Remove confirmPassword as it's not in the database schema
    const { confirmPassword, ...userData } = data;

    const success = await register(userData);

    if (success) {
      toast({
        title: "Registration Successful",
        description: "Welcome to AssetAlign! Your account has been created.",
        duration: 800,
      });
      navigate("/");
    }

    setIsSubmitting(false);
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section (Form) */}
      <div className="flex-1 px-4 py-6 bg-[#f8f8f5] flex flex-col min-h-screen md:min-h-0">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col">
          <div className="mb-8 mt-8 md:mt-16 text-center">
            <div className="flex justify-center mb-4">
              <img src="/images/asset-align-logo.png" alt="AssetAlign Logo" className="h-16 md:h-20" />
            </div>
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
                          className="pl-10 h-12 bg-[#f5f5f2] rounded-md border-0" //Removed border
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
                          className="pl-10 h-12 bg-[#f5f5f2] rounded-md border-0" //Removed border
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
                          className="pl-10 pr-10 h-12 bg-[#f5f5f2] rounded-md border-0" //Removed border
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

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute left-3 top-3 text-gray-400">
                          <Lock size={20} />
                        </div>
                        <Input
                          className="pl-10 pr-10 h-12 bg-[#f5f5f2] rounded-md border-0" //Removed border
                          type={showPassword ? "text" : "password"}
                          placeholder="Confirm Password"
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


              <Button
                type="submit"
                className="w-full h-14 text-white rounded-full bg-[#10B981] hover:bg-[#0D9668] transition-colors duration-200 transform hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                {isSubmitting ? t("common.loading") : "Sign Up"}
              </Button>

              <div className="hidden"> {/* Keeping other fields hidden as per original code */}
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
                  className="w-14 h-14 rounded-md flex items-center justify-center border border-gray-200 bg-white"
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
                  className="w-14 h-14 rounded-md flex items-center justify-center border border-gray-200 bg-white"
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
                  className="w-14 h-14 rounded-md flex items-center justify-center border border-gray-200 bg-white"
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
                <Link href="/terms" className="text-blue-600 hover:text-blue-800">
                  Terms of Service and Privacy Policy.
                </Link>
              </p>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                  Sign In
                </Link>
              </p>
            </form>
          </Form>
        </div>
      </div>

      {/* Right Section (Hero) */}
      <div className="hidden md:block flex-1 bg-[#F9FAFB] relative overflow-hidden">
        <div className="flex flex-col items-center justify-center h-full text-gray-800 p-8 z-10 relative">
          <div className="absolute top-0 right-0 left-0 h-52 bg-gradient-to-b from-[#1D6F76]/10 to-transparent"></div>

          <div className="w-24 h-24 bg-[#1D6F76] rounded-full flex items-center justify-center mb-6">
            <CreditCard className="h-12 w-12 text-white" />
          </div>

          <h1 className="text-3xl font-bold mb-4 text-center">
            Simplify Your Chama Management
          </h1>

          <p className="text-center mb-8 text-gray-600 max-w-md">
            Join thousands of Chama groups using AssetAlign to manage their group savings, track investments, and grow together financially.
          </p>

          <div className="grid grid-cols-1 gap-6 w-full max-w-md">
            <div className="flex items-start space-x-4">
              <div className="bg-[#10B981] p-2 rounded-full">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure Transactions</h3>
                <p className="text-sm text-gray-600">Track all contributions and withdrawals with complete transparency and security.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#10B981] p-2 rounded-full">
                <BarChartBig className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Investment Tracking</h3>
                <p className="text-sm text-gray-600">Monitor your group's investments and growth with real-time analytics and reports.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-[#10B981] p-2 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Mobile Access</h3>
                <p className="text-sm text-gray-600">Manage your Chama anytime, anywhere with our mobile-friendly platform.</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-[#1D6F76]/10 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;