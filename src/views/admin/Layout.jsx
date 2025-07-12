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
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className={`p-4 ${isSidebarOpen ? 'md:ml-64' : ''}`}>
        <div className="h-16"></div> {/* Spacer for navbar */}
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
