export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  categories: Category[];
}

export interface CategoryFormData {
  name: string;
  description: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: Category;
  status: 'new' | 'contacted' | 'qualified' | 'converted';
  source: 'manual' | 'csv';
  createdAt: string;
}

// Dashboard Types
export interface DashboardCounts {
  totalUsers: number;
  totalLeads: number;
  totalCategories: number;
  activeSubscriptions: number;
}

export interface CurrentMonth {
  revenue: number;
  subscriptions: number;
  name: string;
}

export interface AnalyticsDataPoint {
  date: string;
  count: number;
}

export interface RevenueDataPoint {
  date: string;
  revenue: number;
}

export interface MonthlyDataPoint {
  month: string;
  monthName: string;
  count: number;
}

export interface MonthlyRevenueDataPoint {
  month: string;
  monthName: string;
  revenue: number;
}

export interface Payment {
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  inrEquivalent?: number;
  date: string;
  description: string;
}

export interface DashboardAnalytics {
  dailySubscriptions: AnalyticsDataPoint[];
  monthlySubscriptions: MonthlyDataPoint[];
  dailyRevenue: RevenueDataPoint[];
  monthlyRevenue: MonthlyRevenueDataPoint[];
  dailyNewUsers: AnalyticsDataPoint[];
}

export interface DashboardData {
  success: boolean;
  counts: DashboardCounts;
  currentMonth: CurrentMonth;
  analytics: DashboardAnalytics;
  recentPayments: Payment[];
}