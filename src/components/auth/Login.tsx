import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginAdmin } from '../../services/api';
import { Lock, User, AtSign } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('adminpassword123');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page the user was trying to access
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await loginAdmin(email, password);
      login(response.user, response.token);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-800 to-indigo-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-8 pt-8 pb-6 text-center bg-gradient-to-r from-sky-500 to-indigo-600">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/90 mb-4">
              <User size={36} className="text-sky-600" />
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <p className="text-sky-100 mt-2">Sign in to access your dashboard</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AtSign size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-medium rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;