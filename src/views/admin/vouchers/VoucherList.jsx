import { useMemo, useState, useCallback } from 'react';
import { useGetVouchersByAdminQuery, useDeleteVoucherMutation } from '../../../services/voucher.service';
import Pagination from '../../../components/common/Pagination';
import { toast } from 'react-hot-toast';
import FormVoucher from './FormVoucher';

const VoucherList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, isLoading, isError, refetch } = useGetVouchersByAdminQuery({
    page: currentPage,
    limit: perPage,
    search: searchQuery
  });  
  const [deleteVoucher] = useDeleteVoucherMutation();

  const vouchers = useMemo(() => data?.data.data || [], [data?.data.data]);
  const totalItems = useMemo(() => data?.data?.totalItems || 0, [data?.data?.totalItems]);
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

  const handleAdd = () => {
    setCurrentVoucher(null);
    setIsAddModalOpen(true);
  };

  const handleEdit = (voucher) => {
    setCurrentVoucher(voucher);
    setIsEditModalOpen(true);
  };

  const handleDelete = (voucher) => {
    setCurrentVoucher(voucher);
    setIsDeleteModalOpen(true);
  };

  const submitDeleteVoucher = async () => {
    try {
      setIsSubmitting(true);
      await deleteVoucher(currentVoucher.id).unwrap();
      toast.success('Xóa voucher thành công');
      setIsDeleteModalOpen(false);
      setCurrentVoucher(null);
      refetch();
    } catch (error) {
      toast.error(error.data?.message || 'Có lỗi xảy ra khi xóa voucher');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTableBody = useMemo(() => {
    if (vouchers.length === 0) {
      return (
        <tr>
          <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
            Không tìm thấy voucher nào
          </td>
        </tr>
      );
    }
    return vouchers.map((voucher) => (
      <tr key={voucher.id} className="hover:bg-gray-50 transition-colors duration-150">
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.id}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{voucher.code}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.usage_limit}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.used_count}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{voucher.is_free_shipping ? 'Có' : 'Không'}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(voucher.start_date).toLocaleDateString('vi-VN')}</td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(voucher.end_date).toLocaleDateString('vi-VN')}</td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <button
            onClick={() => handleEdit(voucher)}
            className="inline-flex items-center justify-center w-8 h-8 mr-2 text-green-500 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 hover:text-green-600 hover:border-green-300 transition-colors duration-150"
            title="Sửa voucher"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => handleDelete(voucher)}
            className="inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-colors duration-150"
            title="Xóa voucher"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      </tr>
    ));
  }, [vouchers, handleEdit, handleDelete]);

  return (
    <div className="w-full bg-green-50/30 min-h-screen -mt-4 -mx-4 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý voucher</h1>
              <p className="text-gray-600 mt-1">Quản lý tất cả voucher khuyến mãi, miễn phí vận chuyển</p>
            </div>
            <button 
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm voucher
            </button>
          </div>

          {/* Search Section */}
          <form onSubmit={handleSearch} className="mt-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm voucher theo mã..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-150"
              >
                Tìm kiếm
              </button>
            </div>
          </form>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Lỗi tải dữ liệu</h3>
                <p className="mt-1 text-sm text-gray-500">Không thể tải danh sách voucher.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã voucher</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới hạn lượt</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Đã dùng</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miễn phí ship</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bắt đầu</th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kết thúc</th>
                      <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {renderTableBody}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Hiển thị {Math.min((currentPage - 1) * perPage + vouchers.length, totalItems)} trên tổng số {totalItems} voucher
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

      {/* Add Voucher Modal */}
      {isAddModalOpen && (
        <FormVoucher
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setIsAddModalOpen(false);
            refetch();
          }}
        />
      )}

      {/* Edit Voucher Modal */}
      {isEditModalOpen && (
        <FormVoucher
          open={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          voucher={currentVoucher}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setCurrentVoucher(null);
            refetch();
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
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
                        Bạn có chắc chắn muốn xóa voucher <span className="font-semibold">{currentVoucher?.code}</span>?
                        Hành động này không thể hoàn tác.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={submitDeleteVoucher}
                  disabled={isSubmitting}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Đang xử lý...' : 'Xóa'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
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

export default VoucherList; 