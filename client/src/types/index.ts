// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  profilePicture?: string;
  preferredLanguage: string;
}

// Chama Types
export interface Chama {
  id: number;
  name: string;
  description: string;
  foundedDate: string;
  totalValue: number;
  regularContributionAmount: number;
  contributionFrequency: string;
  ownerId: number;
}

export interface ChamaMember {
  id: number;
  userId: number;
  chamaId: number;
  role: string;
  joinedDate: string;
  totalContributed: number;
  isActive: boolean;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
  };
}

// Transaction Types
export interface Transaction {
  id: number;
  chamaId: number;
  userId: number;
  amount: number;
  type: string;
  status: string;
  date: string;
  paymentMethod: string;
  description?: string;
  referenceNumber?: string;
  chamaName?: string;
}

// Meeting Types
export interface Meeting {
  id: number;
  chamaId: number;
  title: string;
  date: string;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  description?: string;
  createdBy: number;
  chamaName?: string;
}

// Investment Types
export interface Investment {
  id: number;
  chamaId: number;
  name: string;
  type: string;
  amount: number;
  description?: string;
  startDate: string;
  expectedReturnRate?: string;
  status: string;
  currentValue: number;
  chamaName?: string;
}

// Notification Types
export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

// Dashboard Types
export interface DashboardStats {
  activeChamasCount: number;
  totalContributions: number;
  activeInvestmentsCount: number;
  upcomingMeetingsCount: number;
}

export interface RecentActivity {
  id: number;
  type: string;
  amount: number;
  status: string;
  date: string;
  paymentMethod: string;
  chamaId: number;
  chamaName?: string;
}

export interface ScheduleItem {
  type: string;
  chamaId: number;
  chamaName?: string;
  title: string;
  date: string;
  details: any;
}

export interface UpcomingSchedule {
  today: ScheduleItem[];
  thisWeek: ScheduleItem[];
  nextWeek: ScheduleItem[];
}

export interface InvestmentSummary {
  total: number;
  breakdown: {
    'real estate': number;
    bonds: number;
    stocks: number;
    'mutual funds': number;
    others: number;
  };
}

export interface DashboardData {
  stats: DashboardStats;
  chamas: Chama[];
  recentActivities: RecentActivity[];
  upcomingSchedule: UpcomingSchedule;
  investmentSummary: InvestmentSummary;
}

// Form Types
export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  username: string;
  password: string;
  confirmPassword?: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

export interface CreateChamaForm {
  name: string;
  description: string;
  foundedDate: string;
  regularContributionAmount: number;
  contributionFrequency: string;
}

export interface CreateTransactionForm {
  chamaId: number;
  amount: number;
  type: string;
  paymentMethod: string;
  description?: string;
  referenceNumber?: string;
}

export interface CreateMeetingForm {
  chamaId: number;
  title: string;
  date: string;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  description?: string;
}

export interface CreateInvestmentForm {
  chamaId: number;
  name: string;
  type: string;
  amount: number;
  description?: string;
  startDate: string;
  expectedReturnRate?: string;
  currentValue: number;
}
