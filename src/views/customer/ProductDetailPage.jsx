import { useState, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { formatCurrency } from '../../utils/helpers';
import { addToCart } from '../../utils/cartStorage';
import { useGetProductByIdQuery } from '../../services/products.service';
import toast, { Toaster } from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const { data: response, isLoading, error } = useGetProductByIdQuery(id);
  const product = response?.data;
  
  const handleQuantityChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  }, []);
  
  const decreaseQuantity = useCallback(() => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  }, [quantity]);
  
  const increaseQuantity = useCallback(() => {
    setQuantity(prev => prev + 1);
  }, []);
  
  const handleAddToCart = useCallback(async () => {
    if (product) {
      try {
        setIsAddingToCart(true);
        addToCart(product, quantity);
        toast.success(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`, {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
      } catch (error) {
        toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng', {
          duration: 2000,
          position: 'top-center',
        });
      } finally {
        setIsAddingToCart(false);
      }
    }
  }, [product, quantity]);

  const handleBuyNow = useCallback(async () => {
    if (product) {
      try {
        setIsAddingToCart(true);
        addToCart(product, quantity);
        toast.success(`Đã thêm ${quantity} sản phẩm "${product.name}" vào giỏ hàng!`, {
          duration: 1000,
          position: 'top-center',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        setTimeout(() => {
          navigate(ROUTES.CART);
        }, 1000);
      } catch (error) {
        toast.error('Có lỗi xảy ra khi thêm vào giỏ hàng', {
          duration: 2000,
          position: 'top-center',
        });
      } finally {
        setIsAddingToCart(false);
      }
    }
  }, [product, quantity, navigate]);

  const toggleDescription = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-60 sm:h-80">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-pink-300 border-t-pink-600"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">Đã xảy ra lỗi khi tải thông tin sản phẩm.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 sm:py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">Không tìm thấy sản phẩm.</p>
                <Link to={ROUTES.PRODUCTS} className="text-sm font-medium text-yellow-700 hover:text-yellow-600 underline mt-2 inline-block">
                  Quay lại danh sách sản phẩm
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm mb-4 sm:mb-6 md:mb-8 overflow-x-auto whitespace-nowrap">
          <Link to={ROUTES.HOME} className="text-gray-600 hover:text-pink-600 transition-colors flex-shrink-0">
            Trang chủ
          </Link>
          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <Link to={ROUTES.PRODUCTS} className="text-gray-600 hover:text-pink-600 transition-colors flex-shrink-0">
            Sản phẩm
          </Link>
          <svg className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-800 font-medium truncate flex-shrink-0">{product.name}</span>
        </nav>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Product Image */}
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg p-4 sm:p-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="%236b7280" text-anchor="middle">Hình ảnh không khả dụng</text></svg>';
                }}
              />
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col p-4 sm:p-6 lg:p-8">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">{product.name}</h1>
              
              <div className="flex items-baseline mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl font-bold text-pink-600">
                    {formatCurrency(product.price)}
                  </span>
              </div>
              
              {product.description && (
                <div className="prose prose-sm sm:prose prose-pink mb-6">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Mô tả sản phẩm</h2>
                  <div className="relative">
                    <p className={`text-sm sm:text-base text-gray-600 leading-relaxed ${!isExpanded ? 'line-clamp-3' : ''}`}>
                      {product.description}
                    </p>
                    {product.description.length > 150 && (
                      <button
                        onClick={toggleDescription}
                        className="text-pink-600 hover:text-pink-700 font-medium mt-2 flex items-center text-sm"
                      >
                        {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                        <svg
                          className={`h-4 w-4 ml-1 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Product Features */}
              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Đặc điểm nổi bật</h2>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-center text-sm sm:text-base text-gray-600">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500 mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Sản phẩm chính hãng 100%
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500 mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Giao hàng toàn quốc
                  </li>
                  <li className="flex items-center text-sm sm:text-base text-gray-600">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500 mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Đổi trả trong 7 ngày
                  </li>
                </ul>
              </div>
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">Số lượng</h2>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center bg-gray-50 rounded-lg">
                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity <= 1 || isAddingToCart}
                      className="p-2 text-gray-600 hover:text-pink-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                      </svg>
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      disabled={isAddingToCart}
                      className="w-12 text-center bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 text-sm"
                    />
                    <button
                      onClick={increaseQuantity}
                      disabled={isAddingToCart}
                      className="p-2 text-gray-600 hover:text-pink-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex-1 bg-pink-100 text-pink-600 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  Thêm vào giỏ
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isAddingToCart}
                  className="flex-1 bg-pink-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors disabled:bg-pink-400 disabled:cursor-not-allowed"
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage; 