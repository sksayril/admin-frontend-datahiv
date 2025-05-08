import React from 'react';
import { Payment } from '../../types';
import { CreditCard } from 'lucide-react';

interface PaymentHistoryProps {
  payments: Payment[];
}

const PaymentHistory: React.FC<PaymentHistoryProps> = ({ payments }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Payments</h2>
      <div className="overflow-y-auto max-h-96">
        {payments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No payments found</div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment, index) => (
              <div key={index} className="flex items-start p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="bg-indigo-100 p-3 rounded-lg mr-4">
                  <CreditCard size={18} className="text-indigo-600" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-800">{payment.userName}</p>
                      <p className="text-sm text-gray-500">{payment.userEmail}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">
                        {payment.currency} {payment.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">{payment.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory; 