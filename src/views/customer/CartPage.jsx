import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { formatCurrency } from '../../utils/helpers';
import {
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartTotal
} from '../../utils/cartStorage';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

// Định nghĩa style chung cho SweetAlert2
const swalConfig = {
  width: '300px',
  padding: '1.5rem',
  showClass: {
    popup: 'animate__animated animate__fadeIn animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOut animate__faster'
  },
  showCancelButton: true,
  confirmButtonColor: '#DB2777',
  cancelButtonColor: '#ffffff',
  confirmButtonText: 'Xóa sản phẩm',
  cancelButtonText: 'Không',
  reverseButtons: true,
  allowOutsideClick: true,
  allowEscapeKey: true,
  stopKeydownPropagation: false,
  scrollbarPadding: false,
  heightAuto: false,
  customClass: {
    popup: 'rounded-xl shadow-xl',
    title: 'text-lg font-medium text-gray-800 pb-1',
    htmlContainer: 'text-sm text-gray-600',
    actions: 'gap-2 px-2 pb-2',
    confirmButton: 'rounded-lg text-xs font-medium px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white min-w-[100px] shadow-sm',
    cancelButton: 'rounded-lg text-xs font-medium px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 min-w-[100px] shadow-sm',
    container: 'backdrop-blur-sm',
    overlay: 'bg-gray-900/50'
  },
  backdrop: `
    rgba(0,0,0,0.4)
    left 0
    top 0
    width 100%
    height 100%
    position fixed
    backdrop-filter: blur(2px)
  `
};

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const cartData = getCart();
    setCart(cartData);
    setTotalAmount(getCartTotal());
  }, []);
  
  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) quantity = 1;
    const updatedCart = updateCartItemQuantity(productId, quantity);
    setCart(updatedCart);
    setTotalAmount(getCartTotal());
  };
  
  const handleRemoveItem = async (productId, productName) => {
    const result = await Swal.fire({
      ...swalConfig,
      title: 'Xóa sản phẩm',
      confirmButtonText: 'Xóa',
      html: `
        <div class="flex flex-col items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
            <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div class="text-center space-y-1">
            <p class="text-sm">Bạn có chắc chắn muốn xóa</p>
            <p class="text-sm font-medium text-pink-600 max-w-[200px] truncate">${productName}</p>
            <p class="text-sm">khỏi giỏ hàng?</p>
          </div>
        </div>
      `
    });

    if (result.isConfirmed) {
      const updatedCart = removeFromCart(productId);
      setCart(updatedCart);
      setTotalAmount(getCartTotal());
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    }
  };
  
  const handleClearCart = async () => {
    const result = await Swal.fire({
      ...swalConfig,
      title: 'Xóa giỏ hàng',
      confirmButtonText: 'Xóa tất cả',
      html: `
        <div class="flex flex-col items-center gap-2">
          <div class="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center">
            <svg class="w-5 h-5 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div class="text-center space-y-1">
            <p class="text-sm">Bạn có chắc chắn muốn xóa</p>
            <p class="text-sm font-medium text-pink-600">tất cả sản phẩm</p>
            <p class="text-sm">trong giỏ hàng?</p>
          </div>
        </div>
      `
    });

    if (result.isConfirmed) {
      clearCart();
      setCart([]);
      setTotalAmount(0);
      toast.success('Đã xóa toàn bộ giỏ hàng');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Giỏ hàng của bạn
        </h1>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-6 sm:p-8 text-center">
            <div className="mb-4 sm:mb-6">
              <svg className="mx-auto h-12 sm:h-16 w-12 sm:w-16 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">Giỏ hàng của bạn đang trống</p>
            <Link
              to={ROUTES.PRODUCTS}
              className="inline-block bg-pink-600 text-white px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg hover:bg-pink-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Cart items */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                      Sản phẩm ({cart.reduce((total, item) => total + item.quantity, 0)})
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-pink-600 hover:text-pink-800 text-sm font-medium flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Xóa tất cả</span>
                    </button>
                  </div>
                </div>
                
                <ul className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <li key={item.id} className="p-4 sm:p-6">
                      <div className="flex gap-4 sm:gap-6">
                        <div className="flex-shrink-0">
                          <Link to={`${ROUTES.PRODUCTS}/${item.id}`}>
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-contain rounded-lg shadow-sm hover:opacity-80 transition-opacity"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" font-family="Arial" font-size="16" fill="%236b7280" text-anchor="middle">Hình ảnh không khả dụng</text></svg>';
                              }}
                            />
                          </Link>
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                            <div className="min-w-0">
                              <Link 
                                to={`${ROUTES.PRODUCTS}/${item.id}`}
                                className="font-medium text-base sm:text-lg text-gray-900 hover:text-pink-600 transition-colors line-clamp-2"
                              >
                                {item.name}
                              </Link>
                              <div className="mt-1 sm:hidden">
                                <span className="font-medium text-lg text-pink-600">
                                  {formatCurrency(item.price)}
                                </span>
                              </div>
                            </div>
                            <div className="hidden sm:block">
                              <span className="font-medium text-lg text-pink-600">
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                          </div>
                          
                          <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-4">
                            <div className="flex items-center bg-gray-50 rounded-lg">
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="text-gray-600 hover:text-pink-600 h-8 w-8 flex items-center justify-center transition-colors"
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                className="h-8 w-12 text-center bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
                              />
                              <button
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="text-gray-600 hover:text-pink-600 h-8 w-8 flex items-center justify-center transition-colors"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => handleRemoveItem(item.id, item.name)}
                              className="text-pink-600 hover:text-pink-800 transition-colors flex items-center gap-1.5"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                              <span className="text-sm">Xóa</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tổng đơn hàng</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-base text-gray-600">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base text-gray-600">
                    <span>Phí vận chuyển</span>
                    <span>Miễn phí</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-semibold text-gray-900">Tổng cộng</span>
                      <span className="text-lg font-semibold text-pink-600">{formatCurrency(totalAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to={ROUTES.CHECKOUT}
                    className="block w-full bg-pink-600 text-white text-center px-6 py-3 rounded-lg text-base font-medium hover:bg-pink-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                  >
                    Tiến hành thanh toán
                  </Link>
                  <Link
                    to={ROUTES.PRODUCTS}
                    className="block w-full text-center mt-4 text-sm text-gray-600 hover:text-pink-600 transition-colors"
                  >
                    ← Tiếp tục mua sắm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;