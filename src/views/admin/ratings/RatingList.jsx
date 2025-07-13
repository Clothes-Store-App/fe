import React, { useState } from 'react';
import { useGetAllRatingsQuery, useDeleteRatingMutation } from '../../../services/rating.service';
import { Rate, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';

const RatingList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [deleteRating] = useDeleteRatingMutation();

  const { data: ratingsData, error, isLoading } = useGetAllRatingsQuery({
    page: currentPage,
    limit: perPage
  });

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle view rating detail
  const handleViewDetail = (rating) => {
    setSelectedRating(rating);
    setIsModalVisible(true);
  };

  // Handle delete rating
  const handleDeleteClick = (rating, e) => {
    e.stopPropagation();
    setSelectedRating(rating);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteRating(selectedRating.id).unwrap();
      setIsDeleteModalVisible(false);
      setSelectedRating(null);
    } catch (error) {
      console.error('Failed to delete rating:', error);
    }
  };

  return (
    <div className="w-full bg-green-50/30 min-h-screen -mt-4 -mx-4 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Quản lý đánh giá</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">Quản lý tất cả đánh giá sản phẩm</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Lỗi tải dữ liệu</h3>
                <p className="mt-1 text-sm text-gray-500">Không thể tải danh sách đánh giá.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người đánh giá</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đánh giá</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ratingsData?.data?.ratings.map((rating) => (
                    <tr key={rating.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{rating.user.name}</div>
                        <div className="text-sm text-gray-500">{rating.user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{rating.product.name}</div>
                        <div className="text-sm text-gray-500">Giá: {rating.product.price?.toLocaleString('vi-VN')}đ</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Rate disabled defaultValue={rating.star} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(rating.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleViewDetail(rating)}
                            className="inline-flex items-center justify-center w-8 h-8 text-blue-500 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 hover:text-blue-600 hover:border-blue-300 transition-colors duration-150"
                            title="Xem chi tiết"
                          >
                            <EyeOutlined />
                          </button>
                          <button
                            onClick={(e) => handleDeleteClick(rating, e)}
                            className="inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-colors duration-150"
                            title="Xóa đánh giá"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Rating Detail Modal */}
        <Modal
          title="Chi tiết đánh giá"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={600}
        >
          {selectedRating && (
            <div className="p-4">
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Thông tin người đánh giá</h3>
                <p className="text-sm text-gray-500">Tên: {selectedRating.user.name}</p>
                <p className="text-sm text-gray-500">Email: {selectedRating.user.email}</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Thông tin sản phẩm</h3>
                <p className="text-sm text-gray-500">Tên sản phẩm: {selectedRating.product.name}</p>
                <p className="text-sm text-gray-500">Giá sản phẩm: {selectedRating.product.price?.toLocaleString('vi-VN')}đ</p>
              </div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900">Đánh giá</h3>
                <Rate disabled defaultValue={selectedRating.star} className="block mb-2" />
                <p className="text-sm text-gray-500">
                  Nội dung: {selectedRating.text || 'Không có nội dung đánh giá'}
                </p>
                <p className="text-sm text-gray-500">
                  Thời gian: {formatDate(selectedRating.createdAt)}
                </p>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          title="Xác nhận xóa"
          open={isDeleteModalVisible}
          onOk={handleDeleteConfirm}
          onCancel={() => setIsDeleteModalVisible(false)}
          okText="Xóa"
          cancelText="Hủy"
          okButtonProps={{ 
            className: 'bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600',
            danger: true 
          }}
        >
          <p>Bạn có chắc chắn muốn xóa đánh giá này không?</p>
          {selectedRating && (
            <div className="mt-2 text-sm text-gray-500">
              <p>Sản phẩm: {selectedRating.product.name}</p>
              <p>Người đánh giá: {selectedRating.user.name}</p>
              <div className="mt-1">
                <Rate disabled defaultValue={selectedRating.star} />
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default RatingList; 