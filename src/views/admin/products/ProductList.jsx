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
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: productsData, isLoading, error } = useGetProductsByAdminQuery({
    page: currentPage,
    limit: perPage,
    search: searchQuery,
    category_id: selectedCategory,
    status: selectedStatus
  });

  const { data: categories } = useGetCategoriesQuery();
  const [deleteProduct] = useDeleteProductMutation();

  const productList = useMemo(() => productsData?.data?.products || [], [productsData?.data?.products]);
  console.log(productList);
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
            {product.colors && product.colors[0]?.image ? (
              <img 
                src={product.colors[0].image} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/100x100?text=No+Image';
                }}
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
          <div className="text-xs text-gray-500 mt-1">
            {product.colors?.length || 0} màu sắc
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
            {getCategoryName(product.category_id)}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            product.status 
            ? 'text-green-700 bg-green-100' 
            : 'text-red-700 bg-red-100'
          }`}>
            {product.status ? 'Đang bán' : 'Ngừng bán'}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <Link
            to={`/admin/products/edit/${product.id}`}
            className="inline-flex items-center justify-center w-8 h-8 mr-2 text-green-500 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 hover:text-green-600 hover:border-green-300 transition-colors duration-150"
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
    <div className="w-full bg-green-50/30 min-h-screen -mt-4 -mx-4 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">Quản lý tất cả sản phẩm của bạn</p>
            </div>
            <Link
              to="/admin/products/add"
              className="inline-flex items-center justify-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out w-full sm:w-auto"
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
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-150 text-sm w-full sm:w-auto"
              >
                Tìm kiếm
              </button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={selectedCategory || ''}
                onChange={handleCategoryChange}
                className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
              >
                <option value="">Tất cả danh mục</option>
                {categoryList.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedStatus === null ? '' : selectedStatus.toString()}
                onChange={(e) => {
                  const value = e.target.value === '' ? null : e.target.value === 'true';
                  setSelectedStatus(value);
                  setCurrentPage(1);
                }}
                className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500 text-sm"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="true">Đang bán</option>
                <option value="false">Ngừng bán</option>
              </select>
            </div>
          </form>
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
                      <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Trạng thái</th>
                      <th scope="col" className="px-4 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {productList.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                          Không có sản phẩm nào
                        </td>
                      </tr>
                    ) : (
                      productList.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                              {product.colors && product.colors[0]?.image ? (
                                <img 
                                  src={product.colors[0].image} 
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://placehold.co/100x100?text=No+Image';
                                  }}
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
                            <div className="text-xs text-gray-500 mt-1">
                              {product.colors?.length || 0} màu sắc
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{formatPrice(product.price)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full">
                              {getCategoryName(product.category_id)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              product.status 
                                ? 'text-green-700 bg-green-100' 
                                : 'text-red-700 bg-red-100'
                            }`}>
                              {product.status ? 'Đang bán' : 'Ngừng bán'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="inline-flex items-center justify-center w-8 h-8 mr-2 text-green-500 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 hover:text-green-600 hover:border-green-300 transition-colors duration-150"
                              title="Sửa sản phẩm"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDelete(product)}
                              className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border transition-colors duration-150 ${
                                product.status
                                  ? 'text-red-500 bg-red-50 border-red-200 hover:bg-red-100 hover:text-red-600 hover:border-red-300'
                                  : 'text-green-500 bg-green-50 border-green-200 hover:bg-green-100 hover:text-green-600 hover:border-green-300'
                              }`}
                              title={product.status ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {product.status ? (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                ) : (
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                )}
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

        {/* Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentProduct?.status ? 'Ẩn sản phẩm' : 'Hiện sản phẩm'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Bạn có chắc chắn muốn {currentProduct?.status ? 'ẩn' : 'hiện'} sản phẩm "{currentProduct?.name}" không?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  onClick={submitDeleteProduct}
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    currentProduct?.status
                      ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                      : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                  }`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Đang xử lý...
                    </span>
                  ) : (
                    'Xác nhận'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList; 