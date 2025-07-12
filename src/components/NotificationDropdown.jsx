import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import socketService from '../services/socket.service';
import { ROUTES } from '../constants';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Kết nối socket khi component mount
    console.log('Connecting to socket...');
    socketService.connect();

    // Lắng nghe thông báo từ socket
    socketService.onNotification((data) => {
      console.log('Received notification data:', data);
      // Thêm thông báo mới vào đầu danh sách
      setNotifications(prev => {
        const newNotification = {
          id: data.objectid || Date.now(),
          message: data.message || 'Đơn hàng mới',
          time: new Date(),
          read: false,
          orderId: data.orderId
        };
        console.log('Adding new notification:', newNotification);
        return [newNotification, ...prev];
      });
      
      // Tăng số thông báo chưa đọc
      setUnreadCount(prev => prev + 1);

      // Phát âm thanh thông báo - tạm thời bỏ qua để tránh lỗi
      // try {
      //   const audio = new Audio('/notification-sound.mp3');
      //   audio.play().catch(error => {
      //     console.error('Error playing notification sound:', error);
      //   });
      // } catch (error) {
      //   console.error('Error creating Audio object:', error);
      // }
    });

    return () => {
      console.log('Disconnecting socket...');
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    // Lắng nghe click outside để đóng dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (notificationId) => {
    // Đánh dấu thông báo đã đọc
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggleDropdown}
        className="relative p-2 text-gray-600 hover:bg-green-50 rounded-full focus:outline-none focus:ring-2 focus:ring-green-200"
      >
        <span className="sr-only">Thông báo</span>
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Không có thông báo nào
              </div>
            ) : (
              notifications.map(notification => (
                <Link
                  key={notification.id}
                  to={notification.orderId ? `${ROUTES.ADMIN_ORDERS}?id=${notification.orderId}` : ROUTES.ADMIN_ORDERS}
                  className={`block p-4 hover:bg-gray-50 border-b border-gray-100 transition-colors duration-150 ${
                    !notification.read ? 'bg-green-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start">
                    <div className="flex-1">
                      <p className={`text-sm ${!notification.read ? 'font-semibold' : ''}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(notification.time)}
                      </p>
                    </div>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setNotifications([]);
                  setUnreadCount(0);
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
              >
                Xóa tất cả thông báo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 