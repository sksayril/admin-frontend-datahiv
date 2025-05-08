import React, { useState, useEffect } from 'react';
import { getCategories } from '../../services/api';
import { Category } from '../../types';
import { PhoneCall, Upload, Plus, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import AddLeadModal from './AddLeadModal';
import ImportCSVModal from './ImportCSVModal';
import AllLeads from './AllLeads';

const Leads: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllLeads, setShowAllLeads] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
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

  const handleAddLead = (category?: Category) => {
    setSelectedCategory(category);
    setShowAddModal(true);
  };

  const handleImportCSV = (category?: Category) => {
    setSelectedCategory(category);
    setShowImportModal(true);
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
          <p className="text-gray-500">View and manage your business leads</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => handleAddLead()}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 shadow-md"
          >
            <Plus size={18} className="mr-2" />
            Add Lead
          </button>
          <button
            onClick={() => handleImportCSV()}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-sm"
          >
            <Upload size={18} className="mr-2" />
            Import CSV
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-4">
        <button
          onClick={() => setShowAllLeads(false)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            !showAllLeads
              ? 'bg-sky-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          Categories View
        </button>
        <button
          onClick={() => setShowAllLeads(true)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            showAllLeads
              ? 'bg-sky-500 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          All Leads
        </button>
      </div>

      {showAllLeads ? (
        <AllLeads />
      ) : (
        <>
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

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="h-10 w-10 rounded-full border-4 border-sky-500 border-r-transparent animate-spin"></div>
              <p className="ml-3 text-gray-600">Loading categories...</p>
            </div>
          )}

          {/* Categories Grid */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <div key={category._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-lg flex items-center justify-center text-white">
                          <PhoneCall size={20} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
                          <p className="text-sm text-gray-500">0 leads</p>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{category.description}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAddLead(category)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all duration-200"
                      >
                        Add Lead
                      </button>
                      <button
                        onClick={() => handleImportCSV(category)}
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-all duration-200"
                      >
                        Import CSV
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && categories.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-10 text-center">
              <div className="w-20 h-20 mx-auto bg-sky-100 rounded-full flex items-center justify-center mb-4">
                <PhoneCall size={36} className="text-sky-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">No Categories Available</h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Please add categories first before managing leads.
              </p>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <AddLeadModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        selectedCategory={selectedCategory}
        categories={categories}
        onSuccess={fetchCategories}
      />

      <ImportCSVModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        selectedCategory={selectedCategory}
        categories={categories}
        onSuccess={fetchCategories}
      />
    </div>
  );
};

export default Leads;