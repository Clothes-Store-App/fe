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

  const { data: ordersData, isLoading, error, refetch } = useGetOrdersByAdminQuery({
    page: currentPage,
    limit: perPage,
    search: searchQuery,
    status: selectedStatus,
    sort: sortOrder
  });

  console.log('🎯 Component Props:', {
    currentPage,
    perPage,
    searchQuery,
    selectedStatus,
    sortOrder
  });

  console.log('📊 Orders Data:', ordersData);
  
  if (error) {
    console.error('❌ Component Error:', {
      status: error.status,
      data: error.data,
      message: error.message
    });
  }

  // Đảm bảo orders là một mảng và xử lý dữ liệu đúng cách
  const orders = useMemo(() => {
    const result = ordersData?.data?.orders || [];
    console.log('🔍 Raw orders data:', ordersData);
    console.log('📦 Orders array:', result);
    console.log('📊 First order sample:', result[0]);
    return result;
  }, [ordersData?.data?.orders]);

  const totalItems = useMemo(() => {
    const total = ordersData?.data?.totalItems || 0;
    console.log('🔢 Total Items:', total);
    return total;
  }, [ordersData?.data?.totalItems]);

  const totalPages = useMemo(() => {
    const pages = ordersData?.data?.totalPages || 1;
    console.log('📄 Total Pages:', pages);
    return pages;
  }, [ordersData?.data?.totalPages]);

  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();
  
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
      refetch(); // Refresh the orders list after update
      alert('Cập nhật trạng thái thành công!');
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Có lỗi xảy ra khi cập nhật trạng thái!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 bg-green-50/30">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-green-50/30">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded">
            <p className="text-sm">Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-green-50/30">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
              <p className="text-gray-600 mt-1">Quản lý tất cả đơn hàng của bạn</p>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Tìm kiếm đơn hàng..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-150"
                >
                  Tìm kiếm
                </button>
              </form>
            </div>

            <div className="w-48">
              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="DESC">Mới nhất</option>
                <option value="ASC">Cũ nhất</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.name}</div>
                      <div className="text-sm text-gray-500">{order.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(order)}
                          className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:text-green-800 transition-colors"
                        >
                          Chi tiết
                        </button>
                        <button
                          onClick={() => handleOpenUpdateStatus(order)}
                          className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:text-green-800 transition-colors"
                        >
                          Cập nhật
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
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
        isLoading={isUpdating}
      />
    </div>
  );
};

export default OrderList; 