import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCategory, getCategories } from '../../services/api';
import { ArrowLeft, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Category } from '../../types';

const AddCategory: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [existingCategories, setExistingCategories] = useState<Category[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch existing categories to check for duplicates
    const fetchCategories = async () => {
      try {
        const response = await getCategories();
        setExistingCategories(response.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !description.trim()) {
      toast.error('Please fill out all required fields');
      return;
    }

    // Check for duplicate category name
    const isDuplicate = existingCategories.some(
      category => category.name.toLowerCase() === name.trim().toLowerCase()
    );

    if (isDuplicate) {
      toast.error('A category with this name already exists');
      return;
    }

    setIsLoading(true);
    setIsValidating(true);
    
    try {
      await addCategory({ name, description });
      toast.success('Category added successfully!');
      navigate('/categories');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Add New Category</h1>
          <p className="text-gray-500">Create a new business category</p>
        </div>
        <button
          onClick={() => navigate('/categories')}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Categories
        </button>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="e.g., Health Insurance"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  placeholder="Describe this category"
                  required
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 shadow-md ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 mr-2 rounded-full border-2 border-white border-r-transparent animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={18} className="mr-2" />
                    Create Category
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;