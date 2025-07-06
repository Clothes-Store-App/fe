import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGetProductsQuery } from '../../services/api';
import { formatCurrency } from '../../utils/helpers';
import { ROUTES } from '../../constants';

const ProductListPage = () => {
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    brand: 'all',
    sortBy: 'newest'
  });

  const { data: products, isLoading } = useGetProductsQuery();
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Danh sách thương hiệu
  const brands = [
    { id: 'all', name: 'Tất cả' },
    { id: 'vinamilk', name: 'Vinamilk' },
    { id: 'th', name: 'TH True Milk' },
    { id: 'dutch-lady', name: 'Dutch Lady' },
    { id: 'milo', name: 'Milo' },
  ];

  // Danh sách khoảng giá
  const priceRanges = [
    { id: 'all', name: 'Tất cả mức giá' },
    { id: '0-50000', name: 'Dưới 50.000₫' },
    { id: '50000-100000', name: '50.000₫ - 100.000₫' },
    { id: '100000-200000', name: '100.000₫ - 200.000₫' },
    { id: '200000', name: 'Trên 200.000₫' }
  ];

  // Danh sách danh mục
  const categories = [
    { id: 'all', name: 'Tất cả sản phẩm' },
    { id: 'fresh-milk', name: 'Sữa tươi' },
    { id: 'powdered-milk', name: 'Sữa bột' },
    { id: 'yogurt', name: 'Sữa chua' },
    { id: 'condensed-milk', name: 'Sữa đặc' },
  ];

  // Danh sách sắp xếp
  const sortOptions = [
    { id: 'newest', name: 'Mới nhất' },
    { id: 'price-asc', name: 'Giá thấp đến cao' },
    { id: 'price-desc', name: 'Giá cao đến thấp' },
    { id: 'name-asc', name: 'Tên A-Z' },
    { id: 'name-desc', name: 'Tên Z-A' },
  ];

  // Xử lý lọc và sắp xếp sản phẩm
  useEffect(() => {
    if (!products) return;

    let result = [...products];

    // Lọc theo danh mục
    if (filters.category !== 'all') {
      result = result.filter(product => product.category === filters.category);
    }

    // Lọc theo thương hiệu
    if (filters.brand !== 'all') {
      result = result.filter(product => product.brand === filters.brand);
    }

    // Lọc theo khoảng giá
    if (filters.priceRange !== 'all') {
      const [min, max] = filters.priceRange.split('-').map(Number);
      result = result.filter(product => {
        const price = product.price * (1 - product.discount / 100);
        if (!max) return price >= min;
        return price >= min && price <= max;
      });
    }

    // Sắp xếp
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.price * (1 - a.discount / 100)) - (b.price * (1 - b.discount / 100)));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.price * (1 - b.discount / 100)) - (a.price * (1 - a.discount / 100)));
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProducts(result);
  }, [products, filters]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
            
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-pink-300 border-t-pink-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link to={ROUTES.HOME} className="text-gray-600 hover:text-pink-600 transition-colors">
            Trang chủ
          </Link>
          <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-800 font-medium">Sản phẩm</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
              {/* Danh mục */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Danh mục sản phẩm</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setFilters(prev => ({ ...prev, category: category.id }))}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        filters.category === category.id
                          ? 'bg-pink-50 text-pink-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thương hiệu */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thương hiệu</h3>
                <div className="space-y-2">
                  {brands.map(brand => (
                    <button
                      key={brand.id}
                      onClick={() => setFilters(prev => ({ ...prev, brand: brand.id }))}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        filters.brand === brand.id
                          ? 'bg-pink-50 text-pink-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Khoảng giá */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Khoảng giá</h3>
                <div className="space-y-2">
                  {priceRanges.map(range => (
                    <button
                      key={range.id}
                      onClick={() => setFilters(prev => ({ ...prev, priceRange: range.id }))}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        filters.priceRange === range.id
                          ? 'bg-pink-50 text-pink-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {range.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            {/* Sort Bar */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  Hiển thị {filteredProducts.length} sản phẩm
                </p>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                  className="form-select rounded-lg border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <Link
                  key={product.id}
                  to={ROUTES.PRODUCT_DETAIL.replace(':id', product.id)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-4 right-4 bg-pink-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                        -{product.discount}%
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline mb-2">
                      <span className="text-2xl font-bold text-pink-600">
                        {formatCurrency(product.price * (1 - product.discount / 100))}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          {formatCurrency(product.price)}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage; 