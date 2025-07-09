import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated, selectIsAdmin, logout } from "../../store/authSlice";
import { ROUTES } from "../../constants";
import { useLogoutMutation } from "../../services/api";
import { handleLogout as handleLogoutUtil } from "../../utils/auth";
import socketService from "../../services/socket.service";

// Màu sắc mới
const THEME = {
  primary: '#fdf2f8',    // Pink 50
  secondary: '#fbcfe8',  // Pink 200
  accent: '#f472b6',     // Pink 400
  text: {
    primary: '#1f2937',  // Gray 800
    secondary: '#4b5563', // Gray 600
  },
  border: '#fce7f3',     // Pink 100
};

function AdminLayout() {
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const [notifications, setNotifications] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Socket connection và notification handling
  useEffect(() => {
    if (!isAuthenticated || !isAdmin) return;

    // Kết nối socket
    socketService.connect();

    // Lắng nghe thông báo mới
    const handleNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      // Phát âm thông báo
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(error => console.error('Error playing sound:', error));
    };

    socketService.onNotification(handleNotification);

    // Cleanup khi component unmount
    return () => {
      socketService.offNotification(handleNotification);
      socketService.disconnect();
    };
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {

    if (!isAuthenticated) {
      console.error('User not authenticated, redirecting to admin login...');
      navigate(ROUTES.ADMIN);
      return;
    }

    if (!isAdmin) {
      console.error('User is not admin, redirecting to unauthorized...');
      navigate(ROUTES.UNAUTHORIZED);
      return;
    }
  }, [isAuthenticated, isAdmin, location.pathname]);

  const handleLogout = async () => {
    await handleLogoutUtil(dispatch, logoutMutation, logout, navigate);
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Clear notifications
  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Format time for notifications
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

  // If not authenticated or not admin, don't render anything
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-pink-100">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-200"
              >
                <span className="sr-only">Toggle sidebar</span>
                <svg
                  className="w-6 h-6"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                  />
                </svg>
              </button>
              <Link to={ROUTES.HOME} className="flex items-center ml-2 md:mr-24">
                <img
                  src=""
                  className="h-10 w-10 rounded-full object-cover mr-3"
                  alt="Logo FDaily"
                />
                <span className="self-center text-xl font-semibold text-gray-800 whitespace-nowrap">
                  FDaily Clothes
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {/* Notification Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setNotifications([])}
                  className="relative p-2 text-gray-500 hover:bg-pink-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full">
                      {notifications.length}
                    </span>
                  )}
                </button>
                {/* Notification Panel */}
                {notifications.length > 0 && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg overflow-hidden border border-pink-100">
                    <div className="p-3 border-b border-pink-100">
                      <h3 className="text-sm font-semibold text-gray-800">Thông báo</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="p-4 border-b border-pink-50 hover:bg-pink-50 cursor-pointer"
                          onClick={() => {
                            navigate(ROUTES.ADMIN_ORDERS);
                            setNotifications([]);
                          }}
                        >
                          <p className="text-sm text-gray-800">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(notification.order.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 rounded-lg"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 z-40 w-64 h-screen transition-transform bg-white border-r border-pink-100 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-white">
          <div className="h-16"></div> {/* Spacer for navbar */}
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to={ROUTES.ADMIN_DASHBOARD}
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-pink-50 group ${
                  isActive(ROUTES.ADMIN_DASHBOARD) ? 'bg-pink-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-pink-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ADMIN_CATEGORIES}
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-pink-50 group ${
                  isActive(ROUTES.ADMIN_CATEGORIES) ? 'bg-pink-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-pink-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
                  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="ml-3">Danh mục</span>
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-pink-50 group ${
                  isActive('/admin/products') ? 'bg-pink-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-pink-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span className="ml-3">Sản phẩm</span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ADMIN_ORDERS}
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-pink-50 group ${
                  isActive(ROUTES.ADMIN_ORDERS) ? 'bg-pink-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-pink-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.721 12.22a1 1 0 0 0-.721-.96l-1.1-.25a1 1 0 0 1-.75-.761L14.9 8.8a1 1 0 0 1 .299-.919l.8-.79a1 1 0 0 0-.358-1.639l-1.1-.25a1 1 0 0 1-.75-.761l-.25-1.099a1 1 0 0 0-1.639-.359l-.79.8a1 1 0 0 1-.92.3l-1.45-.25a1 1 0 0 1-.76-.75l-.25-1.101a1 1 0 0 0-.96-.72 1 1 0 0 0-.96.72l-.25 1.1a1 1 0 0 1-.76.75l-1.45.25a1 1 0 0 1-.92-.3l-.79-.8a1 1 0 0 0-1.639.359l-.25 1.1a1 1 0 0 1-.75.76l-1.1.25a1 1 0 0 0 0 1.92l1.1.25a1 1 0 0 1 .75.761l.149.659a1 1 0 0 1-.299.919l-.8.79a1 1 0 0 0 .358 1.639l1.1.25a1 1 0 0 1 .75.761l.25 1.099a1 1 0 0 0 1.639.359l.79-.8a1 1 0 0 1 .92-.3l1.45.25a1 1 0 0 1 .76.75l.25 1.101a1 1 0 0 0 .96.72 1 1 0 0 0 .96-.72l.25-1.1a1 1 0 0 1 .76-.75l1.45-.25a1 1 0 0 1 .92.3l.79.8a1 1 0 0 0 1.639-.359l.25-1.1a1 1 0 0 1 .75-.76l1.1-.25a1 1 0 0 0 .721-.96z"/>
                </svg>
                <span className="ml-3">Đơn hàng</span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ADMIN_VIDEOS}
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-pink-50 group ${
                  isActive(ROUTES.ADMIN_VIDEOS) ? 'bg-pink-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-pink-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="ml-3">Videos</span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ADMIN_SLIDERS}
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-pink-50 group ${
                  isActive(ROUTES.ADMIN_SLIDERS) ? 'bg-pink-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-pink-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                </svg>
                <span className="ml-3">Sliders</span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ADMIN_BANNERS}
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-pink-50 group ${
                  isActive(ROUTES.ADMIN_BANNERS) ? 'bg-pink-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-pink-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4 5h16v2H4V5zm0 5h16v2H4v-2zm0 5h16v2H4v-2z"/>
                </svg>
                <span className="ml-3">Banners</span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ADMIN_POSTS}
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-pink-50 group ${
                  isActive(ROUTES.ADMIN_POSTS) ? 'bg-pink-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-pink-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
                </svg>
                <span className="ml-3">Bài viết</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className={`p-4 md:ml-64 min-h-screen pt-20 transition-all duration-300 ${
        !isSidebarOpen ? 'md:ml-0' : ''
      }`}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
