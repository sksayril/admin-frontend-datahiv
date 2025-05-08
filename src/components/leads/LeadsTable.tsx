import React from 'react';
import { Lead } from '../../types';
import { ExternalLink, Check, X } from 'lucide-react';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-r-transparent"></div>
        <p className="mt-2 text-gray-500">Loading leads...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <p className="text-gray-500">No leads found</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created At
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{lead.customerName}</div>
                    <div className="text-sm text-gray-500">{lead.customerEmail}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{lead.customerContact}</div>
                  <div className="text-sm text-gray-500 truncate max-w-xs">{lead.customerAddress}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-sky-100 text-sky-800">
                    {lead.category.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.website && (
                    <a
                      href={lead.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:text-sky-800 inline-flex items-center"
                    >
                      <span className="text-sm">Visit</span>
                      <ExternalLink size={14} className="ml-1" />
                    </a>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {lead.isPurchased ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      <Check size={14} className="mr-1" />
                      Purchased
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                      <X size={14} className="mr-1" />
                      Available
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(lead.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTable;