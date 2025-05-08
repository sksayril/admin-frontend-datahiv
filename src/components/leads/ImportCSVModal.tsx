import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { uploadLeadsCSV } from '../../services/api';
import toast from 'react-hot-toast';
import { Category } from '../../types';

interface ImportCSVModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory?: Category;
  categories: Category[];
  onSuccess: () => void;
}

const ImportCSVModal: React.FC<ImportCSVModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  categories,
  onSuccess,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState(selectedCategory?._id || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'text/csv') {
        toast.error('Please upload a CSV file');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !categoryId) {
      toast.error('Please select both a file and category');
      return;
    }

    setIsLoading(true);
    try {
      const response = await uploadLeadsCSV(selectedFile, categoryId);
      toast.success(`Successfully imported ${response.count} leads`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading CSV:', error);
      toast.error('Failed to import leads');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose} />
        
        <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Import Leads from CSV</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                CSV File <span className="text-red-500">*</span>
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-sky-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-sky-600 focus-within:ring-offset-2 hover:text-sky-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept=".csv"
                        className="sr-only"
                        onChange={handleFileChange}
                        required
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">CSV file up to 10MB</p>
                </div>
                {selectedFile && (
                  <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                    <FileText size={16} className="mr-2" />
                    {selectedFile.name}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500">
                <p className="font-medium mb-1">CSV Format:</p>
                <p>customerName,customerContact,customerEmail,website,customerAddress</p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !selectedFile}
                className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white rounded-lg hover:from-sky-600 hover:to-indigo-700 transition-all duration-200 ${
                  (isLoading || !selectedFile) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block h-4 w-4 mr-2 rounded-full border-2 border-white border-r-transparent animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload size={18} className="mr-2" />
                    Import CSV
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

export default ImportCSVModal;