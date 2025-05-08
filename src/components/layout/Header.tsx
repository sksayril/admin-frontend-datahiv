import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Search } from 'lucide-react';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 sticky top-0 z-30">
      <div className="flex items-center justify-between w-full">
        {/* Search */}
        <div className="relative max-w-md w-full hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="search"
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
            placeholder="Search..."
          />
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center ml-auto space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">
              3
            </span>
          </button>
          
          {/* User profile */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
              {user?.name.charAt(0)}
            </div>
            <div className="ml-3 hidden md:block">
              <p className="text-sm font-medium text-gray-700">{user?.name}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;