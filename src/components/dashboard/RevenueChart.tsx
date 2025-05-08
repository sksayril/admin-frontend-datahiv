import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { RevenueDataPoint, MonthlyRevenueDataPoint } from '../../types';

interface RevenueChartProps {
  data: RevenueDataPoint[] | MonthlyRevenueDataPoint[];
  title: string;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data, title }) => {
  // Format the data based on whether it's daily or monthly
  const formattedData = data.map(item => {
    if ('month' in item) {
      // Monthly data
      return {
        ...item,
        formattedDate: item.monthName
      };
    } else {
      // Daily data
      return {
        ...item,
        formattedDate: new Date(item.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      };
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }} 
              interval="preserveStartEnd"
            />
            <YAxis
              tickFormatter={(value) => `₹${value}`}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`₹${value}`, 'Revenue']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChart; 