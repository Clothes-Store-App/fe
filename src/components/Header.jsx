import { useState, useEffect, useCallback, memo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ROUTES, CONTACT_INFO } from '../constants';
import { useGetCategoriesQuery } from '../services/category.service';
import { getCartFromLocalStorage } from '../utils/localStorage';
import { FaPhone, FaShoppingCart, FaUser, FaCommentDots } from 'react-icons/fa';
import { RiCustomerService2Fill } from 'react-icons/ri';

const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];
  
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top when location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const updateCartCount = useCallback(() => {
    const cart = getCartFromLocalStorage();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
  }, []);

  useEffect(() => {
    updateCartCount();
    
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        updateCartCount();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, [updateCartCount]);

  const handleNavigation = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  // Don't render header on login page
  if (location.pathname === ROUTES.LOGIN) {
    return null;
  }

  return (
    <>
      <header className={`fixed w-full top-0 z-40 transform-gpu transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
        {/* Top bar */}
        <div className={`bg-gradient-to-r from-pink-100 to-pink-50 text-pink-800 overflow-hidden transition-all duration-300 ${isScrolled ? 'h-0 md:h-8' : 'h-8'} hidden sm:block`}>
          <div className="container mx-auto px-4 h-full">
            <div className="flex justify-between items-center h-full text-xs">
              <div className="flex items-center space-x-6">
                <a href={`tel:${CONTACT_INFO.HOTLINE}`} className="hover:text-pink-600 flex items-center transition-colors group">
                  <div className="p-1 rounded-full bg-pink-100 group-hover:bg-pink-200 mr-2 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-medium">Hotline: {CONTACT_INFO.HOTLINE}</span>
                </a>
                <div className="hidden lg:flex items-center space-x-6">
                  {CONTACT_INFO.CUSTOMER_SERVICE.map((service, index) => (
                    <a key={index} href={`tel:${service.phone}`} className="hover:text-pink-600 flex items-center transition-colors group">
                      <div className="p-1 rounded-full bg-pink-100 group-hover:bg-pink-200 mr-2 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <span className="font-medium">CSKH: {service.phone} {service.hasZalo && '(Zalo)'}</span>
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex items-center space-x-2 bg-white/50 px-3 py-1 rounded-full">
                  <span className="animate-bounce">✈️</span>
                  <span className="font-medium">Nhận ship COD toàn quốc</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className={`bg-white/95 backdrop-blur-lg transition-all duration-300 ${isScrolled ? 'py-2' : 'py-3'}`}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to={ROUTES.HOME} className="flex items-center flex-shrink-0 group">
                <div className={`transition-all duration-300 ${isScrolled ? 'h-9 w-9' : 'h-11 w-11'} relative overflow-hidden rounded-full bg-gradient-to-br from-pink-100 to-pink-200 p-0.5`}>
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKT57puJ1NwlHaibn56A34UFY2OKRTd7TtgQ&s" 
                    alt="Mẹ Xíu Logo"
                    className="w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="ml-3">
                  <span className={`block font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-pink-500 transition-all duration-300 ${isScrolled ? 'text-lg' : 'text-xl'}`}>
                    Mẹ Xíu
                  </span>
                  <span className={`text-gray-500 transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-sm'} hidden sm:inline`}>
                    Sữa mẹ và bé
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Menu */}
              <nav className="hidden lg:block flex-1 max-w-xl mx-8">
                <ul className="flex justify-center space-x-8">
                  <li>
                    <Link
                      to={ROUTES.HOME}
                      onClick={() => window.scrollTo(0, 0)}
                      className={`text-gray-700 hover:text-pink-600 transition-colors font-medium relative group ${
                        location.pathname === ROUTES.HOME ? 'text-pink-600' : ''
                      }`}
                    >
                      <span>Trang chủ</span>
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 transform origin-left transition-transform duration-300 ${
                        location.pathname === ROUTES.HOME ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.PRODUCTS}
                      onClick={() => window.scrollTo(0, 0)}
                      className={`text-gray-700 hover:text-pink-600 transition-colors font-medium relative group ${
                        location.pathname === ROUTES.PRODUCTS ? 'text-pink-600' : ''
                      }`}
                    >
                      <span>Sản phẩm</span>
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 transform origin-left transition-transform duration-300 ${
                        location.pathname === ROUTES.PRODUCTS ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}></span>
                    </Link>
                  </li>
                  <li className="relative group">
                    <div className="flex items-center text-gray-700 hover:text-pink-600 transition-colors font-medium cursor-pointer">
                      <span>Danh mục</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <div className="absolute top-full left-0 w-56 bg-white/95 backdrop-blur-lg rounded-xl shadow-lg py-2 transform-gpu z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-pink-100/50">
                      {categoriesLoading ? (
                        <div className="px-4 py-2 text-sm text-gray-500">Đang tải...</div>
                      ) : categories.slice(0, 6).map((category) => (
                        <Link
                          key={category.id}
                          to={`${ROUTES.PRODUCTS}?category=${category.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                          onClick={() => window.scrollTo(0, 0)}
                        >
                          {category.name}
                        </Link>
                      ))}
                      <Link
                        to={ROUTES.PRODUCTS}
                        className="block px-4 py-2 text-sm font-medium text-pink-600 hover:bg-pink-50 border-t border-pink-100/50 mt-1"
                        onClick={() => window.scrollTo(0, 0)}
                      >
                        Xem thêm →
                      </Link>
                    </div>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.POSTS}
                      onClick={() => window.scrollTo(0, 0)}
                      className={`text-gray-700 hover:text-pink-600 transition-colors font-medium relative group ${
                        location.pathname === '/posts' ? 'text-pink-600' : ''
                      }`}
                    >
                      Bài viết
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 transform origin-left transition-transform duration-300 ${
                        location.pathname === '/posts' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}></span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={ROUTES.CONTACT}
                      onClick={() => window.scrollTo(0, 0)}
                      className={`text-gray-700 hover:text-pink-600 transition-colors font-medium relative group ${
                        location.pathname === '/contact' ? 'text-pink-600' : ''
                      }`}
                    >
                      <span>Liên hệ</span>
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 transform origin-left transition-transform duration-300 ${
                        location.pathname === '/contact' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}></span>
                    </Link>
                  </li>
                </ul>
              </nav>

              {/* Right side icons */}
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden text-gray-700 hover:text-pink-600 transition-colors focus:outline-none"
                  aria-label="Toggle menu"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 transition-transform duration-200 ${isMenuOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>

                {/* Cart */}
                <Link 
                  to={ROUTES.CART} 
                  className="text-gray-700 hover:text-pink-600 relative group p-2 hover:bg-pink-50 rounded-full transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm transform transition-transform group-hover:scale-110 animate-bounce">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-opacity duration-300 lg:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 w-[280px] h-full bg-white/95 backdrop-blur-lg shadow-xl z-50 transform transition-transform duration-300 lg:hidden ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-pink-100/50">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-pink-600 to-pink-500 bg-clip-text text-transparent">Menu</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="text-gray-500 hover:text-gray-700 p-1 hover:bg-pink-50 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="py-4">
              <Link
                to={ROUTES.HOME}
                className={`block px-4 py-2.5 hover:bg-pink-50 transition-colors ${
                  location.pathname === ROUTES.HOME ? 'text-pink-600 bg-pink-50' : 'text-gray-700'
                }`}
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Trang chủ
              </Link>
              <div className="px-4 py-2.5">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="flex items-center justify-between w-full text-gray-700"
                >
                  <span>Danh mục</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform duration-200 ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className={`mt-2 space-y-1 ${isCategoryDropdownOpen ? 'block' : 'hidden'}`}>
                  {categoriesLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Đang tải...</div>
                  ) : categories.slice(0, 6).map((category) => (
                    <Link
                      key={category.id}
                      to={`${ROUTES.PRODUCTS}?category=${category.id}`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                      onClick={() => {
                        setIsMenuOpen(false);
                        window.scrollTo(0, 0);
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                  <Link
                    to={ROUTES.PRODUCTS}
                    className="block px-4 py-2 text-sm font-medium text-pink-600 hover:bg-pink-50 border-t border-pink-100/50 mt-1"
                    onClick={() => {
                      setIsMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    Xem thêm →
                  </Link>
                </div>
              </div>
              <Link
                to={ROUTES.PRODUCTS}
                className={`block px-4 py-2.5 hover:bg-pink-50 transition-colors ${
                  location.pathname === ROUTES.PRODUCTS ? 'text-pink-600 bg-pink-50' : 'text-gray-700'
                }`}
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Sản phẩm
              </Link>
              <Link
                to={ROUTES.POSTS}
                className="block px-4 py-2.5 text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Bài viết
              </Link>
              <Link
                to={ROUTES.CONTACT}
                className="block px-4 py-2.5 text-gray-700 hover:bg-pink-50 hover:text-pink-600"
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                Liên hệ
              </Link>
            </nav>

            <div className="border-t border-pink-100/50 py-4">
              <a
                href={`tel:${CONTACT_INFO.HOTLINE}`}
                className="block px-4 py-2.5 text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded-full bg-pink-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="font-medium">Hotline: {CONTACT_INFO.HOTLINE}</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default Header;
