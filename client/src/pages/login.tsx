import { useState } from "react";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";
import { SiApple } from "react-icons/si";
import { FaFacebookF } from "react-icons/fa";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);
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
        duration: 800,
      });
      navigate("/");
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-8">Sign In</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <User size={20} />
            </div>
            <input
              {...form.register("username")}
              type="text"
              placeholder="Enter your username"
              className="w-full p-3 pl-10 rounded-lg bg-[#f5f5f2] border-0"
              disabled={isSubmitting}
            />
          </div>

          <div className="relative">
            <div className="absolute left-3 top-3 text-gray-400">
              <Lock size={20} />
            </div>
            <input
              {...form.register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-3 pl-10 pr-10 rounded-lg bg-[#f5f5f2] border-0"
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
        </div>

        <div className="text-right">
          <Link href="/forgot-password" className="text-blue-500 text-sm">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-3 rounded-full bg-[##1D6F76] hover:bg-[#0D9668] transition-colors duration-200 transform hover:scale-[1.02] text-white font-medium"
        >
          Sign In
        </button>

        {error && (
          <div className="text-sm text-red-500 text-center">
            {error}
          </div>
        )}

        <div className="text-center space-y-4">
          <div className="text-sm">
            Don't have an account? <Link href="/register" className="text-blue-500">Sign up</Link>
          </div>

          <div className="text-sm text-gray-500">Or</div>

          <div className="flex justify-center space-x-4">
            <button type="button" className="w-14 h-14 rounded-md flex items-center justify-center border border-gray-200 bg-white">
              <FcGoogle size={24} />
            </button>
            <button type="button" className="w-14 h-14 rounded-md flex items-center justify-center border border-gray-200 bg-white">
              <SiApple size={24} />
            </button>
            <button type="button" className="w-14 h-14 rounded-md flex items-center justify-center border border-gray-200 bg-white">
              <FaFacebookF size={24} className="text-blue-600" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;