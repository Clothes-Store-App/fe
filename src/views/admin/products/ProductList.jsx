import { Link } from 'react-router-dom';
import { useGetProductsByAdminQuery, useDeleteProductMutation } from '../../../services/products.service';
import { useGetCategoriesQuery } from '../../../services/category.service';
import { useState, useCallback, useMemo } from 'react';
import Pagination from '../../../components/common/Pagination';

const ProductList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: productsData, isLoading, error } = useGetProductsByAdminQuery({
    page: currentPage,
    limit: perPage,
    search: searchQuery,
    category_id: selectedCategory
  });

  const { data: categories } = useGetCategoriesQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const productList = useMemo(() => productsData?.data?.products || [], [productsData?.data?.products]);
  const categoryList = useMemo(() => categories?.data || [], [categories?.data]);
  const totalItems = useMemo(() => productsData?.data?.totalItems || 0, [productsData?.data?.totalItems]);
  const totalPages = useMemo(() => {
    if (!totalItems || !perPage) return 1;
    return Math.max(1, Math.ceil(totalItems / perPage));
  }, [totalItems, perPage]);

  // Hàm format giá tiền
  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }, []);

  // Hàm để lấy tên danh mục
  const getCategoryName = useCallback((categoryId) => {
    const category = categoryList.find(cat => cat.id === Number(categoryId));
    return category ? category.name : 'N/A';
  }, [categoryList]);

  // Hàm xử lý xóa sản phẩm
  const handleDelete = useCallback((product) => {
    setCurrentProduct(product);
    setIsDeleteModalOpen(true);
  }, []);

  const submitDeleteProduct = async () => {
    try {
      setIsSubmitting(true);
      await deleteProduct(currentProduct.id).unwrap();
      setIsDeleteModalOpen(false);
      setCurrentProduct(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Có lỗi xảy ra khi xóa sản phẩm!');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handlePerPageChange = useCallback((newPerPage) => {
    setPerPage(newPerPage);
    setCurrentPage(1); // Reset về trang 1 khi đổi số lượng item/trang
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  }, [searchTerm]);

  const handleCategoryChange = useCallback((e) => {
    const value = e.target.value === '' ? null : Number(e.target.value);
    setSelectedCategory(value);
    setCurrentPage(1);
  }, []);

  // Tối ưu render cho phần table body
  const renderTableBody = useMemo(() => {
    if (productList.length === 0) {
      return (
        <tr>
          <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
            Không có sản phẩm nào
          </td>
        </tr>
      );
    }

    return productList.map((product) => (
      <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">{product.name}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 text-xs font-medium text-pink-700 bg-pink-100 rounded-full">
            {getCategoryName(product.category_id)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <Link
            to={`/admin/products/edit/${product.id}`}
            className="inline-flex items-center justify-center w-8 h-8 mr-2 text-pink-500 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 hover:text-pink-600 hover:border-pink-300 transition-colors duration-150"
            title="Sửa sản phẩm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </Link>
          <button
            onClick={() => handleDelete(product)}
            className="inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-colors duration-150"
            title="Xóa sản phẩm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </td>
      </tr>
    ));
  }, [productList, formatPrice, getCategoryName, handleDelete]);

  return (
    <div className="w-full bg-pink-50/30 min-h-screen -mt-4 -mx-4 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-pink-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Quản lý tất cả sản phẩm của bạn</p>
            </div>
            <Link
              to="/admin/products/add"
              className="inline-flex items-center justify-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out w-full sm:w-auto"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Thêm sản phẩm
            </Link>
          </div>

          {/* Search and Filter Section */}
          <form onSubmit={handleSearch} className="mt-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors duration-150 text-sm w-full sm:w-auto"
              >
                Tìm kiếm
              </button>
            </div>
            <div className="w-full sm:w-64">
              <select
                value={selectedCategory || ''}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500 text-sm"
              >
                <option value="">Tất cả danh mục</option>
                {categoryList.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </form>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-xl shadow-sm border border-pink-100 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Lỗi tải dữ liệu</h3>
                <p className="mt-1 text-sm text-gray-500">Không thể tải danh sách sản phẩm.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình ảnh</th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Giá</th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Danh mục</th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500">
                          Không có sản phẩm nào
                        </td>
                      </tr>
                    ) : (
                      productList.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                              {product.image ? (
                                <img 
                                  src={product.image} 
                                  alt={product.name}
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            {/* Hiển thị giá và danh mục trên mobile */}
                            <div className="sm:hidden mt-1">
                              <div className="text-sm text-gray-500">{formatPrice(product.price)}</div>
                              <span className="inline-flex mt-1 px-2 py-1 text-xs font-medium text-pink-700 bg-pink-100 rounded-full">
                                {getCategoryName(product.category_id)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                            <span className="px-2 py-1 text-xs font-medium text-pink-700 bg-pink-100 rounded-full">
                              {getCategoryName(product.category_id)}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="inline-flex items-center justify-center w-8 h-8 mr-2 text-pink-500 bg-pink-50 rounded-lg border border-pink-200 hover:bg-pink-100 hover:text-pink-600 hover:border-pink-300 transition-colors duration-150"
                              title="Sửa sản phẩm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDelete(product)}
                              className="inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 hover:text-red-600 hover:border-red-300 transition-colors duration-150"
                              title="Xóa sản phẩm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-700 w-full sm:w-auto text-center sm:text-left">
                    Hiển thị {Math.min((currentPage - 1) * perPage + productList.length, totalItems)} trên tổng số {totalItems} sản phẩm
                  </div>
                  <div className="w-full sm:w-auto">
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
                          Bạn có chắc chắn muốn xóa sản phẩm <span className="font-semibold">{currentProduct?.name}</span>?
                          Hành động này không thể hoàn tác.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    onClick={submitDeleteProduct}
                    disabled={isSubmitting}
                    className={`w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:text-sm ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Đang xử lý...' : 'Xóa'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleteModalOpen(false)}
                    className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 sm:ml-3 sm:text-sm"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList; 