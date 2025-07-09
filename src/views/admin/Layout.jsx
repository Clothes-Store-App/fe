import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentUser, selectIsAuthenticated, selectIsAdmin, logout } from "../../store/authSlice";
import { ROUTES } from "../../constants";
import { useLogoutMutation } from "../../services/api";
import { handleLogout as handleLogoutUtil } from "../../utils/auth";
import LogoFdaily from "../../styles/Logo-Fdaily.png";

// Màu sắc mới - xanh đen
const THEME = {
  primary: '#f0fdf4',    // Green 50
  secondary: '#dcfce7',  // Green 100
  accent: '#22c55e',     // Green 500
  dark: '#14532d',      // Green 900
  text: {
    primary: '#1f2937',  // Gray 800
    secondary: '#4b5563', // Gray 600
  },
  border: '#bbf7d0',     // Green 200
};

function AdminLayout() {
  const [logoutMutation, { isLoading }] = useLogoutMutation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

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

  // If not authenticated or not admin, don't render anything
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 z-50 w-full bg-white border-b border-green-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                type="button"
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200"
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
                  src={LogoFdaily}
                  className="h-10 w-auto object-contain mr-3"
                  alt="Logo FDaily"
                />
                <span className="self-center text-xl font-semibold text-gray-800 whitespace-nowrap">
                  FDaily Clothes
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-green-50 rounded-lg"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 z-40 w-64 h-screen transition-transform bg-white border-r border-green-200 ${
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
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-green-50 group ${
                  isActive(ROUTES.ADMIN_DASHBOARD) ? 'bg-green-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600"
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
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-green-50 group ${
                  isActive(ROUTES.ADMIN_CATEGORIES) ? 'bg-green-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600"
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
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-green-50 group ${
                  isActive('/admin/products') ? 'bg-green-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600"
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
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-green-50 group ${
                  isActive(ROUTES.ADMIN_ORDERS) ? 'bg-green-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600"
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
                to={ROUTES.ADMIN_POSTS}
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-green-50 group ${
                  isActive(ROUTES.ADMIN_POSTS) ? 'bg-green-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z"/>
                  <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z"/>
                  <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z"/>
                </svg>
                <span className="ml-3">Bài viết</span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ADMIN_SLIDERS}
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-green-50 group ${
                  isActive(ROUTES.ADMIN_SLIDERS) ? 'bg-green-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"/>
                </svg>
                <span className="ml-3">Slider</span>
              </Link>
            </li>
            <li>
              <Link
                to={ROUTES.ADMIN_BANNERS}
                className={`flex items-center p-2 text-gray-800 rounded-lg hover:bg-green-50 group ${
                  isActive(ROUTES.ADMIN_BANNERS) ? 'bg-green-50' : ''
                }`}
              >
                <svg
                  className="w-5 h-5 text-gray-500 transition duration-75 group-hover:text-green-600"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 5h-.7c.229-.467.349-.98.351-1.5a3.5 3.5 0 0 0-3.5-3.5c-1.717 0-3.215 1.2-4.331 2.481C8.4.842 6.949 0 5.5 0A3.5 3.5 0 0 0 2 3.5c.003.52.123 1.033.351 1.5H2a2 2 0 0 0-2 2v3a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1V7a2 2 0 0 0-2-2ZM8.058 5H5.5a1.5 1.5 0 0 1 0-3c.9 0 2 .754 3.092 2.122-.219.337-.392.635-.534.878Zm6.1 0h-3.742c.933-1.368 2.371-3 3.739-3a1.5 1.5 0 0 1 0 3h.003ZM11 13H9v7h2v-7Zm-4 0H2v5a2 2 0 0 0 2 2h3v-7Zm6 0v7h3a2 2 0 0 0 2-2v-5h-5Z"/>
                </svg>
                <span className="ml-3">Banner</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className={`p-4 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        <div className="mt-14">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
