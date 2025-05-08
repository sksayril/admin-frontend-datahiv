import React, { useState, useEffect } from 'react';
import { getLeads, getCategories } from '../../services/api';
import { Lead, Category } from '../../types';
import { Search } from 'lucide-react';
import LeadsTable from './LeadsTable';
import toast from 'react-hot-toast';

const ITEMS_PER_PAGE = 20;

const AllLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [isLeadsLoading, setIsLeadsLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchLeads();
    fetchCategories();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [searchTerm, selectedCategory, leads]);

  const fetchLeads = async () => {
    try {
      setIsLeadsLoading(true);
      const response = await getLeads();
      setLeads(response.leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Failed to load leads');
    } finally {
      setIsLeadsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setIsCategoriesLoading(true);
      const response = await getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  const filterLeads = () => {
    let filtered = [...leads];

    if (searchTerm) {
      filtered = filtered.filter(
        (lead) =>
          lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          lead.phone.includes(searchTerm)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((lead) => lead.category._id === selectedCategory);
    }

    setFilteredLeads(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Use the explicitly loaded categories rather than extracting from leads
  const uniqueCategories = categories;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="search"
            className="w-full pl-10 pr-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          {isCategoriesLoading ? (
            <div className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg flex items-center justify-between">
              <span className="text-gray-500">Loading categories...</span>
              <div className="h-5 w-5 rounded-full border-2 border-sky-500 border-r-transparent animate-spin"></div>
            </div>
          ) : (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-sky-500 focus:border-sky-500"
            >
              <option value="">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table */}
      <LeadsTable leads={paginatedLeads} isLoading={isLeadsLoading} />

      {/* Pagination */}
      {!isLeadsLoading && totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? 'bg-sky-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllLeads;