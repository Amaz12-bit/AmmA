import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number as currency
export function formatCurrency(amount?: number | null, currency = "KES"): string {
  if (amount === undefined || amount === null) {
    return `${currency} 0`;
  }
  
  try {
    if (amount >= 1000000) {
      return `${currency} ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${currency} ${(amount / 1000).toFixed(1)}K`;
    } else {
      return `${currency} ${Math.abs(amount).toLocaleString()}`;
    }
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${currency} 0`;
  }
}

// Format date
export function formatDate(date: string | Date, short = false): string {
  const dateObj = new Date(date);
  
  if (short) {
    return dateObj.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
  
  return dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Format time
export function formatTime(date: string | Date): string {
  const dateObj = new Date(date);
  return dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Format date and time
export function formatDateTime(date: string | Date): string {
  const dateObj = new Date(date);
  return `${formatDate(dateObj, true)}, ${formatTime(dateObj)}`;
}

// Get status color
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    completed: "success",
    active: "success",
    pending: "warning",
    failed: "error",
    "payment due": "warning",
  };
  
  return statusColors[status.toLowerCase()] || "neutral";
}

// Get transaction icon
export function getTransactionIcon(type: string): string {
  const icons: Record<string, string> = {
    contribution: "arrow-right-up-line",
    loan: "arrow-left-down-line",
    investment: "line-chart-line",
    dividend: "money-dollar-circle-line",
    meeting: "calendar-event-fill",
    reminder: "notification-3-line",
  };
  
  return icons[type.toLowerCase()] || "file-list-3-line";
}

// Check if date is today
export function isToday(date: string | Date): boolean {
  const today = new Date();
  const checkDate = new Date(date);
  
  return (
    checkDate.getDate() === today.getDate() &&
    checkDate.getMonth() === today.getMonth() &&
    checkDate.getFullYear() === today.getFullYear()
  );
}

// Check if date is this week
export function isThisWeek(date: string | Date): boolean {
  const now = new Date();
  const checkDate = new Date(date);
  
  // Get the day of the week (0-6, where 0 is Sunday)
  const nowDay = now.getDay();
  
  // Get the start of the week (Sunday)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - nowDay);
  startOfWeek.setHours(0, 0, 0, 0);
  
  // Get the end of the week (Saturday)
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  
  return checkDate >= startOfWeek && checkDate <= endOfWeek;
}

// Check if date is next week
export function isNextWeek(date: string | Date): boolean {
  const now = new Date();
  const checkDate = new Date(date);
  
  // Get the day of the week (0-6, where 0 is Sunday)
  const nowDay = now.getDay();
  
  // Get the start of the next week (Sunday)
  const startOfNextWeek = new Date(now);
  startOfNextWeek.setDate(now.getDate() - nowDay + 7);
  startOfNextWeek.setHours(0, 0, 0, 0);
  
  // Get the end of the next week (Saturday)
  const endOfNextWeek = new Date(startOfNextWeek);
  endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
  endOfNextWeek.setHours(23, 59, 59, 999);
  
  return checkDate >= startOfNextWeek && checkDate <= endOfNextWeek;
}

// Generate initials from name
export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return "??";
  
  let initials = "";
  
  if (firstName) {
    initials += firstName.charAt(0).toUpperCase();
  }
  
  if (lastName) {
    initials += lastName.charAt(0).toUpperCase();
  }
  
  return initials;
}
