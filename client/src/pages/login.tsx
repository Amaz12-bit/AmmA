import { useState } from "react";
import { useTranslation } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-semibold mb-8">Sign In</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-sm space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <input
              {...form.register("username")}
              type="text"
              placeholder="Enter your username"
              className="w-full p-3 pl-10 rounded-lg bg-gray-50"
              disabled={isSubmitting}
            />
            <span className="absolute left-3 top-3.5">👤</span>
          </div>

          <div className="relative">
            <input
              {...form.register("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 pl-10 rounded-lg bg-gray-50"
              disabled={isSubmitting}
            />
            <span className="absolute left-3 top-3.5">🔒</span>
            <button type="button" className="absolute right-3 top-3.5">👁️</button>
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
          className="w-full p-3 rounded-full bg-emerald-500 text-white font-medium"
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
            <button type="button" className="p-2 rounded-lg border">
              <img src="/images/google.svg" alt="Google" className="h-6 w-6" />
            </button>
            <button type="button" className="p-2 rounded-lg border">
              <img src="/images/apple.svg" alt="Apple" className="h-6 w-6" />
            </button>
            <button type="button" className="p-2 rounded-lg border">
              <img src="/images/facebook.svg" alt="Facebook" className="h-6 w-6" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Login;