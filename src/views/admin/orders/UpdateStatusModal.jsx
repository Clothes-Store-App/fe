import React, { useState, useEffect } from 'react';
import { ORDER_STATUS } from '../../../constants';

const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Chờ xác nhận',
  [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
  [ORDER_STATUS.SHIPPED]: 'Đang giao hàng',
  [ORDER_STATUS.DELIVERED]: 'Đã giao hàng',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy'
};

const UpdateStatusModal = ({ order, isOpen, onClose, onUpdate, isUpdating }) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
    }
  }, [order]);

  if (!isOpen || !order) return null;

  // Kiểm tra nếu đơn hàng đã hoàn thành
  if (order.status === 'completed' || order.status === ORDER_STATUS.DELIVERED) {
    return (
      <>
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999]" onClick={onClose}></div>
        <div className="fixed inset-0 z-[10000] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Thông báo
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <span className="sr-only">Đóng</span>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-gray-600">
                  Đơn hàng đã hoàn thành, không thể thay đổi trạng thái.
                </p>
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(selectedStatus);
  };

  // Lọc ra các trạng thái hợp lệ tiếp theo
  const getValidNextStatuses = () => {
    switch (order.status) {
      case ORDER_STATUS.PENDING:
        return [ORDER_STATUS.PROCESSING, ORDER_STATUS.CANCELLED];
      case ORDER_STATUS.PROCESSING:
        return [ORDER_STATUS.SHIPPED, ORDER_STATUS.CANCELLED];
      case ORDER_STATUS.SHIPPED:
        return [ORDER_STATUS.DELIVERED, ORDER_STATUS.CANCELLED];
      case ORDER_STATUS.CANCELLED:
        return [];
      default:
        return Object.values(ORDER_STATUS);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999]" onClick={onClose}></div>
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cập nhật trạng thái đơn hàng #{order.id}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  disabled={isUpdating}
                >
                  <span className="sr-only">Đóng</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Trạng thái hiện tại
                  </label>
                  <div className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-sm font-medium ${
                    order.status === ORDER_STATUS.CANCELLED
                      ? 'bg-red-100 text-red-800'
                      : order.status === ORDER_STATUS.DELIVERED
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {STATUS_LABELS[order.status]}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Trạng thái mới
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="block w-full px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors sm:text-sm"
                    disabled={isUpdating}
                    required
                  >
                    <option value="">Chọn trạng thái</option>
                    {getValidNextStatuses().map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
                  disabled={isUpdating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 disabled:opacity-50 transition-colors"
                  disabled={isUpdating || !selectedStatus || selectedStatus === order.status}
                >
                  {isUpdating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Đang cập nhật...
                    </>
                  ) : (
                    'Cập nhật'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateStatusModal; 