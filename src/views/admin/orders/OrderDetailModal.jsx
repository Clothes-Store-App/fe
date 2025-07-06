import React from 'react';
import { ORDER_STATUS } from '../../../constants';

const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Chờ xử lý',
  [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
  [ORDER_STATUS.SHIPPED]: 'Đang giao hàng',
  [ORDER_STATUS.DELIVERED]: 'Đã giao hàng',
  [ORDER_STATUS.CANCELLED]: 'Đã hủy'
};

const OrderDetailModal = ({ order, isOpen, onClose, onUpdateStatus, formatPrice, formatDate }) => {
  if (!isOpen || !order) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999]" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:max-w-4xl w-full">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Chi tiết đơn hàng #{order.id}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <span className="sr-only">Đóng</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Thông tin đơn hàng */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Thông tin đơn hàng</h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{order.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày đặt</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className="text-sm font-medium text-gray-900 mt-1">{STATUS_LABELS[order.status] || order.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng tiền</p>
                    <p className="text-sm font-medium text-pink-600 mt-1">{formatPrice(order.total)}</p>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Chi tiết sản phẩm</h4>
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sản phẩm</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order.orderItems?.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {item.product.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name}
                              className="h-12 w-12 object-cover rounded-lg"
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatPrice(item.product.price)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-pink-600">
                            {formatPrice(item.product.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-pink-600 ring-1 ring-inset ring-pink-600 hover:bg-pink-50 transition-colors"
              >
                Đóng
              </button>
              <button
                onClick={onUpdateStatus}
                className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold bg-pink-600 text-white hover:bg-pink-500 transition-colors"
              >
                Cập nhật trạng thái
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetailModal; 