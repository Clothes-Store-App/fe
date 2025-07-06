import React, { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { 
  useGetBannersByAdminQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation 
} from '../../../services/banner.service';

const BannerList = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentBanner, setCurrentBanner] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: true
  });
  const fileInputRef = useRef(null);

  // RTK Query hooks
  const { data: bannerResponse, isLoading } = useGetBannersByAdminQuery();
  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  // Safely get banners array from response
  const banners = bannerResponse?.data?.Banners || [];

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: true
    });
    setSelectedImage(null);
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEdit = (banner) => {
    setCurrentBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description,
      status: banner.status
    });
    setImagePreview(banner.image);
    setIsEditModalOpen(true);
  };

  const handleDelete = (banner) => {
    setCurrentBanner(banner);
    setIsDeleteModalOpen(true);
  };

  const submitAdd = async () => {
    if (!formData.title) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }

    try {
      await createBanner({ 
        image: selectedImage,
        ...formData
      }).unwrap();
      toast.success('Thêm banner thành công');
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.data?.message || 'Có lỗi xảy ra khi thêm banner');
    }
  };

  const submitEdit = async () => {
    if (!formData.title) {
      toast.error('Vui lòng nhập tiêu đề');
      return;
    }
    
    try {
      await updateBanner({ 
        id: currentBanner.id, 
        image: selectedImage,
        ...formData
      }).unwrap();
      toast.success('Cập nhật banner thành công');
      setIsEditModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.data?.message || 'Có lỗi xảy ra khi cập nhật banner');
    }
  };

  const submitDelete = async () => {
    try {
      await deleteBanner(currentBanner.id).unwrap();
      toast.success('Xóa banner thành công');
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(error.data?.message || 'Có lỗi xảy ra khi xóa banner');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="container p-6 mx-auto">
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-semibold text-gray-800">Quản lý Banner</h1>
            <p className="mt-2 text-sm text-gray-600">Quản lý tất cả banner hiển thị trên website</p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm Banner
            </button>
          </div>
        </div>
      </div>

      {/* Banner List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners && banners.length > 0 ? (
          banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">{banner.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    banner.status 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {banner.status ? 'Đang hiển thị' : 'Đã ẩn'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{banner.description}</p>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(banner)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-lg font-medium text-gray-600">Chưa có banner nào</p>
            <p className="mt-2 text-sm text-gray-500">Hãy thêm banner mới để hiển thị trên website</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                {isAddModalOpen ? 'Thêm Banner Mới' : 'Chỉnh Sửa Banner'}
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="grid gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiêu đề <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    placeholder="Nhập tiêu đề banner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                    rows="2"
                    placeholder="Nhập mô tả banner"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trạng thái
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.checked})}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-600">Hiển thị banner</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh {!imagePreview && <span className="text-red-500">*</span>}
                  </label>
                  <div className="mt-1 flex justify-center px-4 py-3 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="h-24 mx-auto object-contain"
                          />
                          <button
                            onClick={() => {
                              setImagePreview('');
                              setSelectedImage(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <>
                          <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500">
                              <span>Tải ảnh lên</span>
                              <input
                                id="file-upload"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="sr-only"
                                accept="image/*"
                              />
                            </label>
                            <p className="pl-1">hoặc kéo thả vào đây</p>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false);
                  resetForm();
                }}
                className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                Hủy
              </button>
              <button
                onClick={isAddModalOpen ? submitAdd : submitEdit}
                className="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
              >
                {isAddModalOpen ? 'Thêm' : 'Cập nhật'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Xác nhận xóa</h2>
            </div>
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Bạn có chắc chắn muốn xóa banner này?
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Hành động này không thể hoàn tác. Banner sẽ bị xóa vĩnh viễn khỏi hệ thống.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Hủy
              </button>
              <button
                onClick={submitDelete}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BannerList; 