import { createContext, useState, useEffect, ReactNode } from "react";
import { User } from "@/types";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => Promise<boolean>;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: false,
  error: null,
  login: async () => false,
  register: async () => false,
  logout: async () => false,
  updateUser: async () => false,
  clearError: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if user is already authenticated on load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Auth check error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiRequest("POST", "/api/auth/login", { username, password });
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        return true;
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
      toast({
        title: "Login Error",
        description: err.message || "Login failed. Please check your credentials.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiRequest("POST", "/api/auth/register", userData);
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        return true;
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
      toast({
        title: "Registration Error",
        description: err.message || "Registration failed. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<boolean> => {
    try {
      setLoading(true);
      const res = await apiRequest("POST", "/api/auth/logout", {});

      if (res.ok) {
        setUser(null);
        return true;
      } else {
        const data = await res.json();
        throw new Error(data.message || "Logout failed");
      }
    } catch (err: any) {
      setError(err.message || "Logout failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const res = await apiRequest("PUT", "/api/users/me", userData);
      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        return true;
      } else {
        throw new Error(data.message || "Update failed");
      }
    } catch (err: any) {
      setError(err.message || "Profile update failed");
      toast({
        title: "Update Error",
        description: err.message || "Profile update failed. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
