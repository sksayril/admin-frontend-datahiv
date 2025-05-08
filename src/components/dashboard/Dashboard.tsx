import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getDashboardData } from '../../services/api';
import { DashboardData } from '../../types';
import { Users, Tag, Calendar, Activity, IndianRupee, DollarSign } from 'lucide-react';
import RevenueChart from './RevenueChart';
import SubscriptionsChart from './SubscriptionsChart';
import PaymentHistory from './PaymentHistory';
import toast from 'react-hot-toast';

// Subscription price constant
const SUBSCRIPTION_PRICE = 399;

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const data = await getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Stats cards configuration
  const getStatsCards = () => {
    if (!dashboardData) return [];

    // Calculate total subscription revenue
    const totalSubscriptionRevenue = dashboardData.counts.activeSubscriptions * SUBSCRIPTION_PRICE;

    return [
      { 
        title: 'Total Users', 
        value: dashboardData.counts.totalUsers, 
        icon: <Users size={20} className="text-blue-500" />,
        bgColor: 'bg-blue-50',
        iconBg: 'bg-blue-100'
      },
      { 
        title: 'Total Categories', 
        value: dashboardData.counts.totalCategories, 
        icon: <Tag size={20} className="text-teal-500" />,
        bgColor: 'bg-teal-50',
        iconBg: 'bg-teal-100'
      },
      { 
        title: 'Total Leads', 
        value: dashboardData.counts.totalLeads, 
        icon: <Activity size={20} className="text-purple-500" />,
        bgColor: 'bg-purple-50',
        iconBg: 'bg-purple-100'
      },
      { 
        title: 'Active Subscriptions', 
        value: dashboardData.counts.activeSubscriptions, 
        icon: <Calendar size={20} className="text-amber-500" />,
        bgColor: 'bg-amber-50',
        iconBg: 'bg-amber-100'
      },
      { 
        title: 'Total Subscription Revenue', 
        value: formatCurrency(totalSubscriptionRevenue),
        subtitle: `${dashboardData.counts.activeSubscriptions} × ₹${SUBSCRIPTION_PRICE}`,
        icon: <IndianRupee size={20} className="text-green-500" />,
        bgColor: 'bg-green-50',
        iconBg: 'bg-green-100'
      }
    ];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-120px)]">
        <div className="h-12 w-12 rounded-full border-4 border-sky-500 border-r-transparent animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome section with monthly stats */}
      <div className="p-6 bg-gradient-to-r from-sky-600 to-indigo-700 rounded-2xl shadow-lg text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="mt-2 text-sky-100">Here's your admin dashboard overview.</p>
          </div>
          {dashboardData && (
            <div className="mt-4 md:mt-0 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm text-sky-100">Current Month</p>
                  <p className="text-lg font-semibold">{dashboardData.currentMonth.name}</p>
                </div>
                <div className="h-12 w-0.5 bg-sky-300/30"></div>
                <div>
                  <p className="text-sm text-sky-100">Revenue</p>
                  <div className="flex items-center">
                    <IndianRupee size={18} />
                    <p className="text-lg font-semibold">{dashboardData.currentMonth.revenue}</p>
                  </div>
                </div>
                <div className="h-12 w-0.5 bg-sky-300/30"></div>
                <div>
                  <p className="text-sm text-sky-100">Subscriptions</p>
                  <p className="text-lg font-semibold">{dashboardData.currentMonth.subscriptions}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getStatsCards().map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl shadow-md p-5`}>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">{stat.value}</h3>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                )}
              </div>
              <div className={`${stat.iconBg} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts - Revenue & Subscriptions */}
      {dashboardData && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart 
              data={dashboardData.analytics.dailyRevenue}
              title="Daily Revenue (Last 30 Days)"
            />
            <SubscriptionsChart 
              data={dashboardData.analytics.dailySubscriptions}
              title="Daily Subscriptions (Last 30 Days)"
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RevenueChart 
              data={dashboardData.analytics.monthlyRevenue}
              title="Monthly Revenue"
            />
            <SubscriptionsChart 
              data={dashboardData.analytics.monthlySubscriptions}
              title="Monthly Subscriptions"
              isMonthly={true}
            />
          </div>

          {/* Payment History */}
          <PaymentHistory payments={dashboardData.recentPayments} />
        </>
      )}
    </div>
  );
};

export default Dashboard;