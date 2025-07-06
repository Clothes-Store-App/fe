import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';

const NotificationDropdown = ({ notifications, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = (notification) => {
    setIsOpen(false);
    onClose();
    navigate(ROUTES.ADMIN_ORDERS);
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
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
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pink-600 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-50 border border-slate-200">
          <div className="px-4 py-2 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900">Thông báo</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification, index) => (
              <button
                key={index}
                onClick={() => handleNotificationClick(notification)}
                className="w-full px-4 py-3 hover:bg-slate-50 flex flex-col items-start border-b border-slate-100 last:border-0"
              >
                <p className="text-sm font-medium text-slate-900">
                  {notification.message}
                </p>
                <span className="text-xs text-slate-500 mt-1">
                  {formatTime(notification.order.createdAt)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown; 