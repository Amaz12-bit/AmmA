import { ReactNode } from "react";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";
import OfflineIndicator from "@/components/ui/offline-indicator";
import { AuthProvider } from "@/contexts/AuthContext";
import { I18nProvider } from "@/i18n";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-client-only";

interface AppLayoutProps {
  children: ReactNode;
}

// This component handles the layout structure
const AppLayoutContent = ({ children }: AppLayoutProps) => {
  const { loading } = useAuth();
  const [location] = useLocation();
  const isMobile = useIsMobile();
  
  // Check if the current page is login or register
  const isAuthPage = location === "/login" || location === "/register";
  // Only hide header/footer on mobile for auth pages
  const showHeaderFooter = !isAuthPage || (isAuthPage && !isMobile);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        {showHeaderFooter && <AppHeader />}
        <main className="flex-1 bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
            <p className="mt-4 text-lg font-medium text-neutral-600">Loading...</p>
          </div>
        </main>
        {showHeaderFooter && <AppFooter />}
        <OfflineIndicator />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {showHeaderFooter && <AppHeader />}
      <main className="flex-1 bg-neutral-50">
        {children}
      </main>
      {showHeaderFooter && <AppFooter />}
      <OfflineIndicator />
    </div>
  );
};

// This wrapper provides authentication and internationalization context
const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <I18nProvider>
      <AuthProvider>
        <AppLayoutContent>{children}</AppLayoutContent>
      </AuthProvider>
    </I18nProvider>
  );
};

export default AppLayout;
