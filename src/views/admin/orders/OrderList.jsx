import React, { useState, useMemo, useCallback } from 'react';
import OrderDetailModal from './OrderDetailModal';
import UpdateStatusModal from './UpdateStatusModal';
import { ORDER_STATUS } from '../../../constants';
import { useGetOrdersByAdminQuery, useUpdateOrderMutation } from '../../../services/order.sevice';
import Pagination from '../../../components/common/Pagination';

const OrderList = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('DESC');

  const { data: ordersData, isLoading, error } = useGetOrdersByAdminQuery({
    page: currentPage,
    limit: perPage,
    search: searchQuery,
    status: selectedStatus,
    sort: sortOrder
  });


  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  
  // Đảm bảo orders là một mảng
  const orders = useMemo(() => ordersData?.data?.orders || [], [ordersData?.data?.orders]);

  const totalItems = useMemo(() => ordersData?.data?.totalItems || 0, [ordersData?.data?.totalItems]);
  const totalPages = useMemo(() => {
    if (!totalItems || !perPage) return 1;
    return Math.max(1, Math.ceil(totalItems / perPage));
  }, [totalItems, perPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePerPageChange = useCallback((newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleStatusChange = useCallback((e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleSortChange = useCallback((e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Sử dụng useMemo cho hàm getStatusBadge để tránh tạo lại object trong mỗi lần render
  const statusConfig = useMemo(() => ({
    classes: {
      [ORDER_STATUS.PENDING]: "bg-yellow-100 text-yellow-800",
      [ORDER_STATUS.PROCESSING]: "bg-blue-100 text-blue-800",
      [ORDER_STATUS.SHIPPED]: "bg-indigo-100 text-indigo-800",
      [ORDER_STATUS.DELIVERED]: "bg-green-100 text-green-800",
      [ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-800",
      'completed': "bg-green-100 text-green-800"
    },
    names: {
      [ORDER_STATUS.PENDING]: "Chờ xác nhận",
      [ORDER_STATUS.PROCESSING]: "Đang xử lý",
      [ORDER_STATUS.SHIPPED]: "Đang giao hàng",
      [ORDER_STATUS.DELIVERED]: "Đã giao hàng",
      [ORDER_STATUS.CANCELLED]: "Đã hủy",
      'completed': "Đã hoàn thành"
    }
  }), []);

  const getStatusBadge = (status) => {
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusConfig.classes[status] || "bg-gray-100"}`}>
        {statusConfig.names[status] || status}
      </span>
    );
  };

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleOpenUpdateStatus = (order) => {
    setSelectedOrder(order);
    setIsUpdateModalOpen(true);
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateOrder({ 
        id: selectedOrder.id, 
        status: newStatus 
      }).unwrap();
      
      setIsUpdateModalOpen(false);
      alert('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-pink-50/30">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-pink-50/30">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded">
            <p className="text-sm">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-pink-50/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
              <p className="text-gray-600 mt-1">Quản lý tất cả đơn hàng của bạn</p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="mt-4 space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-150"
              >
                Tìm kiếm
              </button>
            </form>

            <div className="flex gap-4">
              <div className="w-48">
                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value={ORDER_STATUS.PENDING}>Chờ xác nhận</option>
                  <option value={ORDER_STATUS.PROCESSING}>Đang xử lý</option>
                  <option value={ORDER_STATUS.SHIPPED}>Đang giao hàng</option>
                  <option value={ORDER_STATUS.DELIVERED}>Đã giao hàng</option>
                  <option value={ORDER_STATUS.CANCELLED}>Đã hủy</option>
                </select>
              </div>
              <div className="w-48">
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="DESC">Mới nhất</option>
                  <option value="ASC">Cũ nhất</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden">
          {!Array.isArray(orders) || orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-3">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500 text-sm">Không có đơn hàng nào</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Mã đơn
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Họ và tên
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Số điện thoại
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Tổng tiền
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Trạng thái
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                        Ngày đặt
                      </th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{order.phone}</div>
                        </td>
                        
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatPrice(order.total)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{formatDate(order.createdAt)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleViewDetail(order)}
                            className="inline-flex items-center justify-center w-8 h-8 mr-2 text-pink-500 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 hover:text-pink-600 hover:border-pink-300 transition-colors duration-150"
                            title="Xem chi tiết"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleOpenUpdateStatus(order)}
                            className="inline-flex items-center justify-center w-8 h-8 text-pink-500 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 hover:text-pink-600 hover:border-pink-300 transition-colors duration-150"
                            title="Cập nhật trạng thái"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Hiển thị {Math.min((currentPage - 1) * perPage + orders.length, totalItems)} trên tổng số {totalItems} đơn hàng
                  </div>
                  <div>
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      perPage={perPage}
                      onPageChange={handlePageChange}
                      onPerPageChange={handlePerPageChange}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      <OrderDetailModal
        order={selectedOrder}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdateStatus={() => {
          setIsDetailModalOpen(false);
          setIsUpdateModalOpen(true);
        }}
        formatPrice={formatPrice}
        formatDate={formatDate}
      />

      <UpdateStatusModal
        order={selectedOrder}
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onUpdate={handleStatusUpdate}
        isUpdating={isUpdating}
        currentStatus={selectedOrder?.status}
      />
    </div>
  );
};

export default OrderList; 