import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGetCategoriesQuery } from '../../../services/category.service';
import { useCreateProductMutation, useUpdateProductMutation } from '../../../services/products.service';
import { useGetProductSizesQuery } from '../../../services/product-size.service';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const { data: categories } = useGetCategoriesQuery();
  const { data: sizesData, isLoading: sizesLoading } = useGetProductSizesQuery();
  
  // Log dữ liệu sizes khi có
  useEffect(() => {
    if (sizesData) {
      console.log('Dữ liệu size từ API:', sizesData);
    }
  }, [sizesData]);

  const categoryList = categories?.data || [];
  
  const [addProduct, {isLoading: isAdding}] = useCreateProductMutation();
  const [updateProduct, {isLoading: isUpdating}] = useUpdateProductMutation();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category_id: '',
    images: [],
    colors: [
      {
        color_name: '',
        color_code: '#000000', // Default color code
        sizes: []
      }
    ],
    status: false
  });

  const [imagePreview, setImagePreview] = useState([]);
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
            console.log('Dữ liệu sản phẩm từ API:', product);
            console.log('Chi tiết sizes của sản phẩm:', product.colors?.map(color => ({
              color_name: color.color_name,
              sizes: color.colorSizes?.map(cs => ({
                size_id: cs.size.id,
                size_name: cs.size.size_name
              }))
            })));
            
            setFormData({
              name: product.name || '',
              price: product.price?.toString() || '',
              description: product.description || '',
              category_id: product.category_id?.toString() || '',
              images: [], // Reset images since we'll handle existing images differently
              colors: product.colors?.map(color => ({
                color_name: color.color_name || '',
                color_code: color.color_code || '#000000',
                sizes: color.colorSizes?.map(cs => cs.size.id) || [],
                image: color.image || null // Store existing image URL
              })) || [{
                color_name: '',
                color_code: '#000000',
                sizes: []
              }],
              status: product.status || false
            });
            // Set image preview for existing product
            setImagePreview(product.colors?.map(color => color.image).filter(Boolean) || []);
          }
        } catch (error) {
          console.error('Failed to fetch product:', error);
          setFormError('Không thể tải thông tin sản phẩm');
        }
      }
    };

    loadProduct();
  }, [id]);

  // Log khi formData thay đổi để debug
  useEffect(() => {
    if (id && formData.colors.length > 0) {
      console.log('Form data sau khi load:', formData);
      console.log('Sizes đã chọn theo màu:', formData.colors.map(color => ({
        color_name: color.color_name,
        selected_sizes: color.sizes
      })));
    }
  }, [formData, id]);
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle color changes
  const handleColorChange = (index, field, value) => {
    // Validate color code format
    if (field === 'color_code') {
      if (!value.startsWith('#')) {
        value = '#' + value;
      }
      // Ensure 6 digits after #
      if (value.length < 7) {
        value = value.padEnd(7, '0');
      }
      // Only allow valid hex characters
      value = value.replace(/[^#0-9a-fA-F]/g, '0');
    }

    setFormData(prev => {
      const newColors = [...prev.colors];
      newColors[index] = {
        ...newColors[index],
        [field]: value
      };
      return {
        ...prev,
        colors: newColors
      };
    });
  };

  // Handle size changes
  const handleSizeChange = (colorIndex, sizes) => {
    setFormData(prev => {
      const newColors = [...prev.colors];
      newColors[colorIndex] = {
        ...newColors[colorIndex],
        sizes: sizes.map(size => parseInt(size))
      };
      return {
        ...prev,
        colors: newColors
      };
    });
  };

  // Add new color
  const handleAddColor = () => {
    setFormData(prev => ({
      ...prev,
      colors: [...prev.colors, {
        color_name: '',
        color_code: '',
        sizes: []
      }]
    }));
  };

  // Remove color
  const handleRemoveColor = (index) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
      // Create preview URLs
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreview(prev => [...prev, ...newPreviews]);
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreview.forEach(url => {
        if (url && !url.includes('http')) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreview]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validation
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
    if (formData.colors.length === 0) {
      setFormError('Vui lòng thêm ít nhất một màu sắc');
      return;
    }

    // Kiểm tra ảnh: Chỉ yêu cầu ảnh mới nếu không có ảnh cũ
    const hasNewImages = formData.images.length > 0;
    const hasExistingImages = formData.colors.some(color => color.image);
    if (!hasNewImages && !hasExistingImages) {
      setFormError('Vui lòng thêm ít nhất một hình ảnh');
      return;
    }

    // Validate color data
    for (const color of formData.colors) {
      if (!color.color_name) {
        setFormError('Vui lòng nhập tên cho tất cả các màu');
        return;
      }
      if (!color.color_code || !color.color_code.match(/^#[0-9A-Fa-f]{6}$/)) {
        setFormError('Mã màu không hợp lệ. Vui lòng sử dụng định dạng #RRGGBB');
        return;
      }
      if (color.sizes.length === 0) {
        setFormError('Vui lòng chọn ít nhất một size cho mỗi màu');
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('price', Number(formData.price));
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('category_id', Number(formData.category_id));
      formDataToSend.append('status', formData.status);

      // Prepare colors data with existing images
      const colorsData = formData.colors.map((color) => ({
        color_name: color.color_name,
        color_code: color.color_code,
        sizes: color.sizes,
        image: color.image || null // Giữ lại ảnh cũ nếu có
      }));
      
      formDataToSend.append('colors', JSON.stringify(colorsData));
      
      // Chỉ append ảnh mới nếu có
      if (hasNewImages) {
        formData.images.forEach((image) => {
          if (image instanceof File) {
            formDataToSend.append('images', image);
          }
        });
      }

      // Log chi tiết dữ liệu gửi đi
      console.log('=== DEBUG DỮ LIỆU GỬI ĐI ===');
      console.log('FormData entries:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }
      console.log('Colors Data:', colorsData);
      console.log('Form Data gốc:', formData);
      console.log('Có ảnh mới:', hasNewImages);
      console.log('Có ảnh cũ:', hasExistingImages);
      console.log('=== END DEBUG ===');

      if (id) {
        try {
          const result = await updateProduct({
            id,
            data: formDataToSend
          }).unwrap();
          
          console.log('Kết quả từ API:', result);
          
          if (!result.success) {
            throw new Error(result.message || 'Có lỗi xảy ra khi cập nhật sản phẩm');
          }
        } catch (updateError) {
          console.error('Chi tiết lỗi khi cập nhật:', {
            error: updateError,
            status: updateError.status,
            data: updateError.data,
            message: updateError.message
          });
          throw updateError;
        }
      } else {
        const result = await addProduct(formDataToSend).unwrap();
        
        if (!result.success) {
          throw new Error(result.message || 'Có lỗi xảy ra khi thêm sản phẩm');
        }
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Chi tiết lỗi:', {
        error: error,
        name: error.name,
        message: error.message,
        stack: error.stack,
        data: error.data,
        status: error.status
      });
      setFormError(error.message || 'Có lỗi xảy ra khi lưu sản phẩm');
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
          <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:w-full max-w-4xl">
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
              {/* Left Column - Basic Info */}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục
                  </label>
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="">Chọn danh mục</option>
                    {categoryList.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
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
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Trạng thái */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="status"
                    checked={formData.status}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Hiển thị sản phẩm
                  </label>
                </div>

                {/* Hình ảnh */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh sản phẩm
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="images"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                        >
                          <span>Tải ảnh lên</span>
                          <input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            accept="image/*"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">hoặc kéo thả</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                    </div>
                  </div>
                  {/* Image previews */}
                  {imagePreview.length > 0 && (
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {imagePreview.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-24 object-cover rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Colors and Sizes */}
              <div className="w-full sm:w-1/2 p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-medium text-gray-900">Màu sắc và kích thước</h4>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Thêm màu
                  </button>
                </div>

                {formData.colors.map((color, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-medium text-gray-700">Màu {index + 1}</h5>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Color name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tên màu
                      </label>
                      <input
                        type="text"
                        value={color.color_name}
                        onChange={(e) => handleColorChange(index, 'color_name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                        placeholder="VD: Đen, Trắng, ..."
                      />
                    </div>

                    {/* Color code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mã màu
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="color"
                          value={color.color_code}
                          onChange={(e) => handleColorChange(index, 'color_code', e.target.value)}
                          className="h-8 w-8 border border-gray-300 rounded"
                        />
                        <input
                          type="text"
                          value={color.color_code}
                          onChange={(e) => handleColorChange(index, 'color_code', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="#000000"
                          pattern="^#[0-9A-Fa-f]{6}$"
                        />
                      </div>
                    </div>

                    {/* Sizes */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Kích thước
                      </label>
                      <div className="mt-2 space-y-2">
                        {sizesLoading ? (
                          <div>Đang tải kích thước...</div>
                        ) : sizesData?.data ? (
                          sizesData.data.map((size) => (
                            <label key={size.id} className="inline-flex items-center mr-4">
                              <input
                                type="checkbox"
                                className="form-checkbox h-4 w-4 text-indigo-600"
                                checked={color.sizes.includes(size.id)}
                                onChange={(e) => {
                                  const newSizes = e.target.checked
                                    ? [...color.sizes, size.id]
                                    : color.sizes.filter(s => s !== size.id);
                                  handleSizeChange(index, newSizes);
                                }}
                              />
                              <span className="ml-2">{size.size_name}</span>
                            </label>
                          ))
                        ) : (
                          <div>Không thể tải dữ liệu kích thước</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </form>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Đang lưu...' : id ? 'Cập nhật' : 'Thêm mới'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductForm; 