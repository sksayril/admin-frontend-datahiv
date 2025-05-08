import React, { useState, useEffect } from 'react';
import { getCategories } from '../../services/api';
import { Category } from '../../types';
import { Plus, Tag, ArrowUpDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Category>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (field: keyof Category) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCategories = [...categories].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredCategories = sortedCategories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
          <p className="text-gray-500">Manage your business categories</p>
        </div>
        <Link
          to="/add-category"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add Category
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="search"
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-sky-500 border-r-transparent"></div>
            <p className="mt-2 text-gray-500">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-8 text-center">
            <Tag size={40} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center space-x-1"
                      onClick={() => handleSort('name')}
                    >
                      <span>Name</span>
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <button
                      className="flex items-center space-x-1"
                      onClick={() => handleSort('createdAt')}
                    >
                      <span>Created At</span>
                      <ArrowUpDown size={14} />
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr key={category._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full flex items-center justify-center text-white">
                          {category.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {category.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;