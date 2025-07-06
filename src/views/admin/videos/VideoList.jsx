import { useState } from 'react';
import { useGetVideosByAdminQuery, useCreateVideoMutation, useUpdateVideoMutation, useDeleteVideoMutation } from '../../../services/video.service';
import { toast } from 'react-hot-toast';

const VideoList = () => {
  // States for video data
  const [selectedVideo, setSelectedVideo] = useState(null);

  // States for modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    status: true // Mặc định là true (hoạt động)
  });
  const [formError, setFormError] = useState('');

  // RTK Query hooks
  const { data, isLoading, isError } = useGetVideosByAdminQuery();
  const videos = data?.data || [];
  const [createVideo] = useCreateVideoMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const [deleteVideo] = useDeleteVideoMutation();

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'status' ? value === 'true' : value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      url: '',
      status: true
    });
    setFormError('');
  };

  // Handle add video
  const handleAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  // Handle edit video
  const handleEdit = (video) => {
    setSelectedVideo(video);
    setFormData({
      title: video.title,
      url: video.url,
      status: video.status
    });
    setFormError('');
    setIsEditModalOpen(true);
  };

  // Handle delete video
  const handleDelete = (video) => {
    setSelectedVideo(video);
    setIsDeleteModalOpen(true);
  };

  // Submit add video
  const submitAddVideo = async () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      setFormError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setIsSubmitting(true);
      await createVideo(formData).unwrap();
      toast.success('Thêm video thành công');
      setIsAddModalOpen(false);
      resetForm();
    } catch (error) {
      setFormError(error.data?.message || 'Có lỗi xảy ra khi thêm video');
      toast.error(error.data?.message || 'Có lỗi xảy ra khi thêm video');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit edit video
  const submitEditVideo = async () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      setFormError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      setIsSubmitting(true);
      await updateVideo({
        id: selectedVideo.id,
        ...formData
      }).unwrap();
      toast.success('Cập nhật video thành công');
      setIsEditModalOpen(false);
      resetForm();
      setSelectedVideo(null);
    } catch (error) {
      setFormError(error.data?.message || 'Có lỗi xảy ra khi cập nhật video');
      toast.error(error.data?.message || 'Có lỗi xảy ra khi cập nhật video');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit delete video
  const submitDeleteVideo = async () => {
    try {
      setIsSubmitting(true);
      await deleteVideo(selectedVideo.id).unwrap();
      toast.success('Xóa video thành công');
      setIsDeleteModalOpen(false);
      setSelectedVideo(null);
    } catch (error) {
      toast.error(error.data?.message || 'Có lỗi xảy ra khi xóa video');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-pink-50/30 min-h-screen -mt-4 -mx-4 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý video</h1>
              <p className="text-gray-600 mt-1">Quản lý tất cả video của bạn</p>
            </div>
            <button 
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm video
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Lỗi tải dữ liệu</h3>
                <p className="mt-1 text-sm text-gray-500">Không thể tải danh sách video.</p>
              </div>
            </div>
          ) : videos.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có video nào</h3>
                <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng việc thêm video mới.</p>
                <button
                  onClick={handleAdd}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Thêm video
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {videos.map((video) => (
                <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
                    <p className="text-sm text-gray-500 mb-4 truncate">{video.url}</p>
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        video.status
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {video.status ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(video)}
                          className="p-2 text-pink-500 hover:bg-pink-50 rounded-lg transition-colors duration-200"
                          title="Sửa video"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(video)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Xóa video"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Video Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Thêm video mới</h3>
                    {formError && (
                      <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-400 text-red-700">
                        <p className="text-sm">{formError}</p>
                      </div>
                    )}
                    <div className="mt-4">
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        placeholder="Nhập tiêu đề video"
                      />
                    </div>
                    <div className="mt-4">
                      <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL Video</label>
                      <input
                        type="text"
                        id="url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        placeholder="Nhập URL video (YouTube, Vimeo, ...)"
                      />
                    </div>
                    <div className="mt-4">
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700">Trạng thái</label>
                      <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      >
                        <option value="true">Hoạt động</option>
                        <option value="false">Không hoạt động</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={submitAddVideo}
                  disabled={isSubmitting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Thêm mới'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Video Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Chỉnh sửa video</h3>
                    {formError && (
                      <div className="mt-2 p-2 bg-red-50 border-l-4 border-red-400 text-red-700">
                        <p className="text-sm">{formError}</p>
                      </div>
                    )}
                    <div className="mt-4">
                      <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                      <input
                        type="text"
                        id="edit-title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        placeholder="Nhập tiêu đề video"
                      />
                    </div>
                    <div className="mt-4">
                      <label htmlFor="edit-url" className="block text-sm font-medium text-gray-700">URL Video</label>
                      <input
                        type="text"
                        id="edit-url"
                        name="url"
                        value={formData.url}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                        placeholder="Nhập URL video (YouTube, Vimeo, ...)"
                      />
                    </div>
                    <div className="mt-4">
                      <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">Trạng thái</label>
                      <select
                        id="edit-status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      >
                        <option value="true">Hoạt động</option>
                        <option value="false">Không hoạt động</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={submitEditVideo}
                  disabled={isSubmitting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-pink-600 text-base font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Cập nhật'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    resetForm();
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Xác nhận xóa</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bạn có chắc chắn muốn xóa video <span className="font-semibold">{selectedVideo?.title}</span>?
                        Hành động này không thể hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={submitDeleteVideo}
                  disabled={isSubmitting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Xóa'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoList; 