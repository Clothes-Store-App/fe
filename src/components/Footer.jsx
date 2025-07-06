import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES, CONTACT_INFO, STORE_LOCATIONS } from '../constants';
import { FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram } from 'react-icons/fa';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { useGetCategoriesQuery } from '../services/category.service';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoriesQuery();
  const categories = categoriesData?.data || [];

  if (location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER) {
    return null;
  }
  
  return (
    <footer className="bg-gradient-to-b from-white to-pink-50 pt-8 sm:pt-12 md:pt-16">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKT57puJ1NwlHaibn56A34UFY2OKRTd7TtgQ&s" 
                  alt="Mẹ Xíu Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-md border-2 border-pink-100"
                />
                <div>
                <h2 className="text-lg sm:text-xl font-bold text-pink-600">{CONTACT_INFO.STORE_NAME}</h2>
                <p className="text-sm text-gray-500">Chăm sóc dinh dưỡng cho mẹ và bé</p>
                </div>
              </div>
              
            {/* Contact Info */}
            <div className="space-y-3">
              <a href={`tel:${CONTACT_INFO.HOTLINE}`} className="flex items-center text-gray-600 hover:text-pink-600 transition-colors">
                <FaPhone className="w-4 h-4 text-pink-500 mr-2" />
                <span className="text-sm">Hotline: {CONTACT_INFO.HOTLINE}</span>
              </a>
                {CONTACT_INFO.CUSTOMER_SERVICE.map((service, index) => (
                <a key={index} href={`tel:${service.phone}`} className="flex items-center text-gray-600 hover:text-pink-600 transition-colors">
                  <RiCustomerService2Fill className="w-4 h-4 text-pink-500 mr-2" />
                  <span className="text-sm">CSKH: {service.phone} {service.hasZalo && '(Zalo)'}</span>
                </a>
                ))}
              <div className="flex items-center text-gray-600">
                <span className="mr-2 text-lg">✈️</span>
                <span className="text-sm">Nhận ship COD toàn quốc</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors">
                <FaFacebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 flex items-center justify-center rounded-full bg-pink-100 text-pink-600 hover:bg-pink-200 transition-colors">
                <FaInstagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Store Locations */}
            <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 pb-2 border-b border-pink-100">Hệ thống cửa hàng</h3>
            <div className="space-y-3">
              {STORE_LOCATIONS.map(location => (
                <div key={location.id} className="flex items-start">
                  <FaMapMarkerAlt className="w-4 h-4 text-pink-500 mt-1 mr-2 flex-shrink-0" />
                  <p className="text-sm text-gray-600">{location.name}: {location.address}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 pb-2 border-b border-pink-100">Sản phẩm</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              {categoriesLoading ? (
                <div className="text-sm text-gray-500">Đang tải...</div>
              ) : categories.map(category => (
                  <Link 
                  key={category.id}
                    to={`${ROUTES.PRODUCTS}?category=${category.id}`}
                  className="text-sm text-gray-600 hover:text-pink-600 transition-colors hover:translate-x-1 inline-block"
                  onClick={() => window.scrollTo(0, 0)}
                  >
                    {category.name}
                  </Link>
              ))}
            </div>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 pb-2 border-b border-pink-100">Thông tin</h3>
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
              <Link to={ROUTES.ABOUT} className="text-sm text-gray-600 hover:text-pink-600 transition-colors">
                  Về chúng tôi
                </Link>
              <Link to="/privacy-policy" className="text-sm text-gray-600 hover:text-pink-600 transition-colors">
                  Chính sách bảo mật
                </Link>
              <Link to="/terms" className="text-sm text-gray-600 hover:text-pink-600 transition-colors">
                  Điều khoản dịch vụ
                </Link>
              <Link to="/shipping" className="text-sm text-gray-600 hover:text-pink-600 transition-colors">
                  Chính sách vận chuyển
                </Link>
              <Link to="/return-policy" className="text-sm text-gray-600 hover:text-pink-600 transition-colors">
                  Chính sách đổi trả
                </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 sm:mt-12 py-6 border-t border-pink-100">
          <p className="text-sm text-center text-gray-500">
            &copy; {currentYear} {CONTACT_INFO.STORE_NAME}. Tất cả các quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 