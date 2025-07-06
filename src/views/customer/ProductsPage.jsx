import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { formatCurrency } from '../../utils/helpers';
import { addToCart } from '../../utils/cartStorage';
import { useGetCategoriesQuery } from '../../services/category.service';
import { useGetProductsByAdminQuery } from '../../services/products.service';
import toast from 'react-hot-toast';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const { data: productsData, isLoading, error } = useGetProductsByAdminQuery({
    page,
    limit,
    search: searchQuery,
    category_id: category
  });

  const { data: categories } = useGetCategoriesQuery();
  const categoryList = categories?.data || [];

  // Memoize products list
  const products = useMemo(() => {
    if (!productsData?.data?.products) return [];
    return productsData.data.products;
  }, [productsData]);


  // Memoize total pages
  const totalPages = useMemo(() => {
    if (!productsData?.data?.totalPages) return 1;
    return productsData.data.totalPages;
  }, [productsData]);

  const handleAddToCart = useCallback((product) => {
    addToCart(product, 1);
    toast.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }, []);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    setSearchQuery(searchTerm);
    setPage(1);
  }, [searchTerm]);

  const handleCategoryChange = useCallback((catId) => {
    setPage(1); // Reset to first page on category change
    if (catId) {
      setSearchParams({ category: catId });
    } else {
      searchParams.delete('category');
      setSearchParams(searchParams);
    }
  }, [searchParams, setSearchParams]);

  const handleLoadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  const handleReset = useCallback(() => {
    setSearchTerm('');
    setSearchQuery('');
    setPage(1);
    setSearchParams({});
  }, [setSearchParams]);

  const handleLimitChange = useCallback((e) => {
    setLimit(Number(e.target.value));
    setPage(1); // Reset to first page when changing limit
  }, []);

  // Đảm bảo page hiện tại không vượt quá totalPages
  useEffect(() => {
    if (page > totalPages) {
      setPage(Math.max(1, totalPages));
    }
  }, [page, totalPages]);

  return (
    <div className="container mx-auto px-4 pt-20 sm:pt-24 md:pt-32 pb-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* Category Toggle Button - Only visible on mobile */}
        <button 
          className="lg:hidden w-full bg-white p-3 rounded-lg shadow-sm flex items-center justify-between"
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          <span className="font-medium text-gray-800">Danh mục sản phẩm</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform ${isCategoryOpen ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Sidebar */}
        <div className={`lg:w-1/4 transition-all duration-300 ${isCategoryOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 lg:max-h-full lg:opacity-100'} overflow-hidden`}>
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6">
            <h2 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-gray-800">Danh mục</h2>
            <ul className="space-y-1 sm:space-y-2">
              <li>
                <button
                  onClick={() => {
                    handleCategoryChange(null);
                    setIsCategoryOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded transition-colors ${!category ? 'bg-pink-50 text-pink-600 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                  Tất cả sản phẩm
                </button>
              </li>
              {categoryList.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      handleCategoryChange(cat.id);
                      setIsCategoryOpen(false);
                    }}
                    className={`w-full text-left px-2 py-1.5 rounded transition-colors ${category === cat.id.toString() ? 'bg-pink-50 text-pink-600 font-medium' : 'hover:bg-gray-50 text-gray-700'}`}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className={`bg-white p-3 sm:p-4 rounded-lg shadow-sm ${!isCategoryOpen && 'hidden lg:block'}`}>
            <button
              onClick={() => {
                handleReset();
                setIsCategoryOpen(false);
              }}
              className="w-full bg-pink-600 text-white py-2 sm:py-2.5 px-4 rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors font-medium text-sm sm:text-base"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4">
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4">
              {/* Search form */}
              <form onSubmit={handleSearch} className="flex flex-1 max-w-md">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-200 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-colors"
                  placeholder="Tìm kiếm sản phẩm..."
                />
                <button
                  type="submit"
                  className="bg-pink-600 text-white px-4 sm:px-6 py-2 rounded-r-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {isLoading && page === 1 ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-pink-500"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 py-6 sm:py-8">
              Đã có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.
            </div>
          ) : products?.length === 0 ? (
            <div className="text-center text-gray-600 py-6 sm:py-8">
              Không tìm thấy sản phẩm nào phù hợp với tiêu chí tìm kiếm.
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
                {products.map((product) => (
                  <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
                    <Link to={ROUTES.PRODUCT_DETAIL.replace(':id', product.id)} className="block relative pt-[100%] overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute top-0 left-0 w-full h-full object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'placeholder-image-url';
                        }}
                      />
                    </Link>
                    <div className="p-2 sm:p-3 flex flex-col flex-1">
                      <div className="mb-2">
                        <p className="inline-block px-2 py-0.5 text-xs font-medium text-pink-500 bg-pink-50 rounded-full">
                          {categoryList.find(cat => cat.id === product.category_id)?.name || 'Chưa phân loại'}
                        </p>
                      </div>
                      <Link to={ROUTES.PRODUCT_DETAIL.replace(':id', product.id)} className="flex-1">
                        <h3 className="font-medium sm:font-semibold text-gray-800 hover:text-pink-600 transition-colors line-clamp-2 text-xs sm:text-sm">
                          {product.name}
                        </h3>
                      </Link>
                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-gray-100">
                        <span className="text-sm sm:text-base md:text-lg font-bold text-pink-600">{formatCurrency(product.price)}</span>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-pink-500 text-white p-1.5 sm:p-2 rounded-full hover:bg-pink-600 transition-colors flex items-center justify-center"
                          title="Thêm vào giỏ"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Section */}
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                  <div className="text-xs sm:text-sm text-gray-600">
                    Hiển thị {products.length} trên tổng số {productsData?.data?.totalItems || 0} sản phẩm
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm text-gray-600">Hiển thị</span>
                      <select
                        value={limit}
                        onChange={handleLimitChange}
                        className="border border-gray-200 rounded-md px-1.5 sm:px-2 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500"
                      >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                      </select>
                      <span className="text-xs sm:text-sm text-gray-600">dòng mỗi trang</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage; 