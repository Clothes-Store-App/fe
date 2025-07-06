import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetCategoriesQuery } from '../../../services/category.service';
import { useCreateProductMutation, useUpdateProductMutation } from '../../../services/products.service';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const { data: categories } = useGetCategoriesQuery();
  const categoryList = categories?.data || [];
  
  const [addProduct, {isLoading: isAdding}] = useCreateProductMutation();
  const [updateProduct, {isLoading: isUpdating}] = useUpdateProductMutation();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    image: null,
    status: false
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load product data when editing
  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          const response = await fetch(`http://localhost:8000/api/products/${id}`);
          const data = await response.json();
          if (data.success && data.data) {
            const product = data.data;
            setFormData({
              name: product.name || '',
              price: product.price?.toString() || '',
              description: product.description || '',
              category_id: product.category_id?.toString() || '',
              image: null,
              status: product.status || false
            });
            // Set image preview for existing product
            setImagePreview(product.image || null);
          }
        } catch (error) {
          console.error('Failed to fetch product:', error);
          setFormError('Không thể tải thông tin sản phẩm');
        }
      }
    };

    loadProduct();
  }, [id]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  // Cleanup preview URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview && !imagePreview.includes('http')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!formData.name.trim()) {
      setFormError('Vui lòng nhập tên sản phẩm');
      return;
    }
    if (!formData.price || Number(formData.price) <= 0) {
      setFormError('Vui lòng nhập giá hợp lệ');
      return;
    }
    if (!formData.category_id) {
      setFormError('Vui lòng chọn danh mục');
      return;
    }

    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('price', Number(formData.price));
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category_id', Number(formData.category_id));
      formDataToSend.append('status', formData.status);
      
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }

      if (id) {
        await updateProduct({ id, body: formDataToSend }).unwrap();
      } else {
        await addProduct(formDataToSend).unwrap();
      }
      handleClose();
    } catch (error) {
      console.error('Failed to save product:', error);
      setFormError(error.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    navigate('/admin/products');
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999]" 
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-2">
          <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:w-full max-w-2xl">
            {/* Header */}
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium text-gray-900">
                  {id ? "Sửa sản phẩm" : "Thêm sản phẩm mới"}
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  onClick={handleClose}
                >
                  <span className="sr-only">Đóng</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-gray-200">
              {/* Left Column - Form Fields */}
              <div className="w-full sm:w-1/2 p-4 space-y-3">
                {formError && (
                  <div className="p-2 bg-red-50 border-l-4 border-red-400 text-red-700 text-sm">
                    <p>{formError}</p>
                  </div>
                )}

                {/* Tên sản phẩm */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded focus:outline-none focus:ring-1 focus:ring-pink-500 focus:bg-white transition-colors"
                    placeholder="Nhập tên sản phẩm"
                  />
                </div>

                {/* Giá và Danh mục */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giá (VNĐ)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded focus:outline-none focus:ring-1 focus:ring-pink-500 focus:bg-white transition-colors"
                      placeholder="Nhập giá"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Danh mục
                    </label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                      required
                      className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded focus:outline-none focus:ring-1 focus:ring-pink-500 focus:bg-white transition-colors"
                    >
                      <option value="">Chọn danh mục</option>
                      {categoryList.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Mô tả */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-50 rounded focus:outline-none focus:ring-1 focus:ring-pink-500 focus:bg-white transition-colors"
                    placeholder="Nhập mô tả sản phẩm"
                  />
                </div>

                {/* Status Checkbox */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    id="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="status" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                    Sản phẩm hot
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2 pt-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded focus:outline-none"
                    onClick={handleClose}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 rounded focus:outline-none disabled:bg-pink-300 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Đang lưu...' : id ? 'Cập nhật' : 'Thêm mới'}
                  </button>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="w-full sm:w-1/2 p-4 bg-gray-50">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Hình ảnh
                  </label>

                  {/* Image preview */}
                  <div className="aspect-square w-full bg-white rounded overflow-hidden">
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: null }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">Chưa có ảnh</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Upload button */}
                  <div className="flex justify-center">
                    <label className="relative cursor-pointer">
                      <span className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50">
                        <svg className="mr-2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        {imagePreview ? 'Đổi ảnh' : 'Tải ảnh'}
                      </span>
                      <input
                        type="file"
                        name="image"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="sr-only"
                      />
                    </label>
                  </div>

                  <p className="text-sm text-center text-gray-500">
                    PNG, JPG, GIF (≤10MB)
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductForm; 