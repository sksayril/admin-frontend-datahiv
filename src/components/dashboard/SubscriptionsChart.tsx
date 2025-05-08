import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { AnalyticsDataPoint, MonthlyDataPoint } from '../../types';

interface SubscriptionsChartProps {
  data: AnalyticsDataPoint[] | MonthlyDataPoint[];
  title: string;
  isMonthly?: boolean;
}

const SubscriptionsChart: React.FC<SubscriptionsChartProps> = ({ 
  data, 
  title, 
  isMonthly = false 
}) => {
  // Format the data based on whether it's daily or monthly
  const formattedData = data.map(item => {
    if (isMonthly && 'monthName' in item) {
      return {
        ...item,
        label: item.monthName
      };
    } else if ('date' in item) {
      return {
        ...item,
        label: new Date(item.date).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      };
    }
    return item;
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="label" 
              tick={{ fontSize: 12 }} 
              interval="preserveStartEnd"
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar 
              dataKey="count" 
              name="Subscriptions" 
              fill="#8884d8" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SubscriptionsChart; 