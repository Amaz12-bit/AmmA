import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/i18n";
import { getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, LineChart, LogOut, Menu, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Notification } from "@/types";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

const AppHeader = () => {
  const [location, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, language, changeLanguage } = useTranslation();
  const queryClient = useQueryClient();

  // Fetch notifications
  const { data: notificationsData } = useQuery<{ notifications: Notification[] }>({
    queryKey: ["/api/notifications"],
    enabled: !!user,
  });

  const unreadNotificationsCount = notificationsData?.notifications.filter(
    (notification) => !notification.isRead
  ).length || 0;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLanguageToggle = () => {
    changeLanguage(language === "en" ? "sw" : "en");
  };

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      navigate("/login");
    }
  };

  const markNotificationAsRead = async (id: number) => {
    try {
      await apiRequest("PUT", `/api/notifications/${id}/read`, {});
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const navigationItems = [
    { label: t("navigation.dashboard"), href: "/dashboard", active: location === "/dashboard" },
    { label: t("navigation.myChamas"), href: "/chamas", active: location === "/chamas" },
    { label: t("navigation.transactions"), href: "/transactions", active: location === "/transactions" },
    { label: t("navigation.investments"), href: "/investments", active: location === "/investments" },
    { label: t("navigation.meetings"), href: "/meetings", active: location === "/meetings" },
  ];

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm">
      <div className="px-4 md:px-6 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo and mobile menu button */}
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-neutral-500 hover:text-neutral-700 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center flex-shrink-0 pl-2 md:pl-0">
              <Link href={user ? "/dashboard" : "/"} className="flex items-center">
                <LineChart className="h-6 w-6 text-primary" />
                <span className="text-primary font-heading font-bold text-xl ml-2">
                  {t("common.appName")}
                </span>
              </Link>
              
            </div>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden lg:flex lg:items-center lg:space-x-2">
              {navigationItems.map((item) => (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    item.active
                      ? "bg-primary-50 text-primary"
                      : "text-neutral-600 hover:bg-neutral-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          {/* User menu and settings */}
          <div className="flex items-center space-x-3">
            {/* Language toggle */}
            <div className="hidden md:flex">
              <Button
                variant="outline"
                size="sm"
                className="px-3 py-1.5 text-sm"
                onClick={handleLanguageToggle}
              >
                <span>{language.toUpperCase()}</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </div>

            {user ? (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <Bell className="h-5 w-5" />
                      {unreadNotificationsCount > 0 && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-accent-500 rounded-full"></span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="px-4 py-2 font-medium border-b">
                      {t("common.notifications")}
                      {unreadNotificationsCount > 0 && (
                        <Badge variant="outline" className="ml-2">
                          {unreadNotificationsCount}
                        </Badge>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto">
                      {notificationsData?.notifications &&
                      notificationsData.notifications.length > 0 ? (
                        notificationsData.notifications.map((notification) => (
                          <DropdownMenuItem
                            key={notification.id}
                            className={`p-3 ${
                              !notification.isRead ? "bg-primary-50" : ""
                            }`}
                            onSelect={() => {
                              if (!notification.isRead) {
                                markNotificationAsRead(notification.id);
                              }
                              if (notification.linkUrl) {
                                navigate(notification.linkUrl);
                              }
                            }}
                          >
                            <div className="flex flex-col w-full">
                              <div className="font-medium">{notification.title}</div>
                              <div className="text-sm text-neutral-500">
                                {notification.message}
                              </div>
                              <div className="text-xs text-neutral-400 mt-1">
                                {new Date(notification.createdAt).toLocaleString()}
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))
                      ) : (
                        <div className="p-4 text-center text-neutral-500">
                          No notifications
                        </div>
                      )}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User profile */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                        <AvatarFallback className="bg-primary text-white">
                          {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden md:flex ml-2 items-center">
                        <span className="text-sm font-medium text-neutral-700">
                          {user.firstName} {user.lastName}
                        </span>
                        <ChevronDown className="ml-1 h-4 w-4 text-neutral-500" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2 border-b">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-neutral-500">{user.email}</p>
                    </div>
                    <DropdownMenuItem onSelect={() => navigate("/profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>{t("common.profile")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => navigate("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>{t("common.settings")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t("common.logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex space-x-2">
                <Link href="/login">
                  <Button variant="outline" size="sm">
                    {t("common.login")}
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">{t("common.register")}</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && user && (
        <div className="lg:hidden border-t border-neutral-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  item.active
                    ? "bg-primary-50 text-primary" 
                    : "text-neutral-600 hover:bg-neutral-100"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-neutral-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profilePicture} />
                  <AvatarFallback>
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-neutral-800">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm font-medium text-neutral-500">{user.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link 
                href="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:bg-neutral-100"
              >
                {t("common.profile")}
              </Link>
              <Link 
                href="/settings"
                className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:bg-neutral-100"
              >
                {t("common.settings")}
              </Link>
              <button
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:bg-neutral-100"
                onClick={handleLogout}
              >
                {t("common.logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
