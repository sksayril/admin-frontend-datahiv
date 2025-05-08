import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Tag, 
  PhoneCall, 
  LogOut, 
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <div 
        className={`h-full bg-gradient-to-b from-sky-800 to-indigo-900 text-white 
        fixed lg:sticky top-0 left-0 z-40 transition-all duration-300
        ${collapsed ? 'w-20' : 'w-64'}`}
      >
        <div className="flex flex-col h-screen">
          {/* Header */}
          <div className={`p-4 flex items-center ${collapsed ? 'justify-center' : 'justify-between'} border-b border-sky-700`}>
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <LayoutDashboard size={24} className="text-sky-300" />
                <span className="text-xl font-bold">AdminPanel</span>
              </div>
            )}
            
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-sky-700/50 transition-colors"
            >
              {collapsed ? 
                <ChevronRight size={20} className="text-sky-300" /> : 
                <ChevronLeft size={20} className="text-sky-300" />
              }
            </button>
          </div>
          
          {/* User Info */}
          <div className={`p-4 border-b border-sky-700 ${collapsed ? 'text-center' : ''}`}>
            <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-sky-600/30 mb-2">
              <User size={18} className="text-sky-200" />
            </div>
            {!collapsed && (
              <>
                <h3 className="font-semibold truncate">{user?.name}</h3>
                <p className="text-sm text-sky-200 truncate">{user?.email}</p>
              </>
            )}
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-2 px-3">
              <li>
                <NavLink 
                  to="/dashboard" 
                  className={({ isActive }) => `
                    flex items-center ${collapsed ? 'justify-center' : 'justify-start px-4'} py-3 rounded-lg
                    transition-colors ${isActive 
                      ? 'bg-sky-600/40 text-white' 
                      : 'text-sky-100 hover:bg-sky-700/30'}
                  `}
                >
                  <LayoutDashboard size={collapsed ? 22 : 18} />
                  {!collapsed && <span className="ml-3">Dashboard</span>}
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/categories" 
                  className={({ isActive }) => `
                    flex items-center ${collapsed ? 'justify-center' : 'justify-start px-4'} py-3 rounded-lg
                    transition-colors ${isActive 
                      ? 'bg-sky-600/40 text-white' 
                      : 'text-sky-100 hover:bg-sky-700/30'}
                  `}
                >
                  <Tag size={collapsed ? 22 : 18} />
                  {!collapsed && <span className="ml-3">Categories</span>}
                </NavLink>
              </li>
              <li>
                <NavLink 
                  to="/leads" 
                  className={({ isActive }) => `
                    flex items-center ${collapsed ? 'justify-center' : 'justify-start px-4'} py-3 rounded-lg
                    transition-colors ${isActive 
                      ? 'bg-sky-600/40 text-white' 
                      : 'text-sky-100 hover:bg-sky-700/30'}
                  `}
                >
                  <PhoneCall size={collapsed ? 22 : 18} />
                  {!collapsed && <span className="ml-3">Leads</span>}
                </NavLink>
              </li>
            </ul>
          </nav>
          
          {/* Logout */}
          <div className="p-4 border-t border-sky-700">
            <button 
              onClick={logout}
              className={`flex items-center ${collapsed ? 'justify-center w-full' : 'justify-start px-4'} py-3 rounded-lg
                text-sky-100 hover:bg-red-500/30 hover:text-white transition-colors w-full`}
            >
              <LogOut size={collapsed ? 22 : 18} />
              {!collapsed && <span className="ml-3">Logout</span>}
            </button>
          </div>
        </div>
      </div>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity ${collapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        onClick={toggleSidebar}
      />
    </>
  );
};

export default Sidebar;