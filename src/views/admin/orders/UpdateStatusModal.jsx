import React, { useState, useEffect } from 'react';

const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  CANCEL: 'cancel'
};

const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Chờ xử lý',
  [ORDER_STATUS.PROCESSING]: 'Đang xử lý',
  [ORDER_STATUS.COMPLETED]: 'Hoàn thành',
  [ORDER_STATUS.CANCEL]: 'Đã hủy'
};

const UpdateStatusModal = ({ order, isOpen, onClose, onUpdate, isUpdating, currentStatus }) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (currentStatus) {
      setSelectedStatus(currentStatus);
    }
  }, [currentStatus]);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(selectedStatus);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9999]" onClick={onClose}></div>

      {/* Modal */}
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg w-full">
            {/* Header */}
            <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Cập nhật trạng thái đơn hàng #{order.id}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  disabled={isUpdating}
                >
                  <span className="sr-only">Đóng</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-4">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-900">
                  Trạng thái mới
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full px-4 py-2 text-gray-900 bg-gray-50 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 focus:bg-white transition-colors sm:text-sm"
                  disabled={isUpdating}
                  required
                >
                  <option value="">Chọn trạng thái</option>
                  {Object.entries(ORDER_STATUS).map(([key, value]) => (
                    <option key={value} value={value}>
                      {STATUS_LABELS[value]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Footer */}
              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-semibold text-pink-600 hover:text-white hover:bg-pink-600 transition-colors"
                  disabled={isUpdating}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-lg bg-pink-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 disabled:opacity-50"
                  disabled={isUpdating || !selectedStatus}
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