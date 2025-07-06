import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetActiveBannerQuery } from '../services/banner.service';

const BannerPopup = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const { data: activeBanner, isLoading, isError } = useGetActiveBannerQuery();

  useEffect(() => {
    // Chỉ bắt đầu đếm ngược khi có dữ liệu banner và banner đang active
    if (activeBanner?.data?.status && isOpen) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsOpen(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [activeBanner, isOpen]);

  const handleViewMore = () => {
    navigate('/products');
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleImageLoad = (e) => {
    setImageLoaded(true);
    const aspectRatio = e.target.naturalWidth / e.target.naturalHeight;
    e.target.style.aspectRatio = aspectRatio;
  };

  // Kiểm tra các điều kiện để hiển thị banner
  const shouldShowBanner = 
    !isLoading && // Không đang loading
    !isError && // Không có lỗi
    activeBanner?.data && // Có dữ liệu banner
    activeBanner.data.status && // Banner đang active
    activeBanner.data.image && // Có hình ảnh
    isOpen; // Người dùng chưa đóng popup

  // Nếu không đủ điều kiện hiển thị, return null
  if (!shouldShowBanner) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 animate-fadeIn backdrop-blur-sm">
      <div 
        className="bg-white rounded-lg shadow-2xl w-full max-w-[95%] sm:max-w-[90%] md:max-w-[800px] relative animate-scaleIn overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thanh tiến trình thời gian */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-200 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-1000 ease-linear"
            style={{ 
              width: `${(timeLeft / 5) * 100}%`,
              boxShadow: '0 0 10px rgba(236, 72, 153, 0.5)'
            }}
          />
        </div>

        {/* Hiển thị thời gian */}
        <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold z-20 shadow-lg transform hover:scale-110 transition-transform text-sm sm:text-base">
          {timeLeft}
        </div>

        {/* Nút đóng */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 sm:p-1.5 shadow-lg hover:bg-gray-100 z-10 transition-all duration-300 hover:scale-110 hover:rotate-90"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Banner content */}
        <div className="flex flex-col md:flex-row">
          {/* Hình ảnh bên trái */}
          <div className="w-full md:w-1/2 relative overflow-hidden group bg-gray-50">
            <div className="relative w-full h-full min-h-[200px]">
              <img
                src={activeBanner.data.image}
                alt={activeBanner.data.title}
                onLoad={handleImageLoad}
                onError={() => setImageLoaded(true)} // Xử lý trường hợp lỗi hình ảnh
                className={`w-full h-full object-contain transition-all duration-500 ${
                  !imageLoaded ? 'opacity-0' : 'opacity-100'
                } ${isHovered ? 'scale-110 brightness-110' : 'scale-100'}`}
              />
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>

          {/* Nội dung bên phải */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 flex flex-col justify-center bg-gradient-to-br from-white to-pink-50">
            <div className="animate-slideInRight">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-2 sm:mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent line-clamp-2">
                {activeBanner.data.title}
              </h2>
              <p className="text-gray-600 mb-4 sm:mb-6 md:mb-8 text-sm sm:text-base md:text-lg leading-relaxed line-clamp-3 sm:line-clamp-4">
                {activeBanner.data.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <button
                  onClick={handleViewMore}
                  className="w-full sm:flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  Xem thêm
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full sm:flex-1 border-2 border-pink-500 text-pink-500 py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-pink-50 transform hover:scale-105 transition-all duration-300 font-medium text-sm sm:text-base"
                >
                  Bỏ qua
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Thêm styles vào file CSS của bạn
const styles = `
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(20px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

.animate-scaleIn {
  animation: scaleIn 0.5s ease-out;
}

.animate-slideInRight {
  animation: slideInRight 0.5s ease-out;
}
`;

export default BannerPopup; 