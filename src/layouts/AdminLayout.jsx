import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants';
import { useState, useEffect } from 'react';
import socketService from '../services/socket.service';
import NotificationDropdown from '../components/NotificationDropdown';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Kiểm tra kích thước màn hình khi component mount và khi resize
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px là breakpoint của lg trong Tailwind
    };
    
    // Kiểm tra lần đầu
    checkIsMobile();
    
    // Lắng nghe sự kiện resize
    window.addEventListener('resize', checkIsMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // Set sidebar state dựa trên kích thước màn hình
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  // Socket connection và notification handling
  useEffect(() => {
    // Kết nối socket
    socketService.connect();

    // Lắng nghe thông báo mới
    const handleNotification = (notification) => {
      setNotifications(prev => [notification, ...prev]);
      // Phát âm thông báo
      const audio = new Audio('/notification-sound.mp3');
      audio.play().catch(error => console.log('Error playing sound:', error));
    };

    socketService.onNotification(handleNotification);

    // Cleanup khi component unmount
    return () => {
      socketService.offNotification(handleNotification);
      socketService.disconnect();
    };
  }, []);

  // Clear notifications
  const handleClearNotifications = () => {
    setNotifications([]);
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleNavigate = (to) => {
    if (isMobile) {
      setSidebarOpen(false);
    }
    navigate(to);
  };

  const getBreadcrumbs = () => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    let breadcrumbs = [];
    let path = '';

    pathnames.forEach((name, index) => {
      path += `/${name}`;
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      breadcrumbs.push({
        name: formattedName === 'Admin' ? 'Dashboard' : formattedName,
        path: path,
        isLast: index === pathnames.length - 1
      });
    });

    return breadcrumbs;
  };

  const menuItems = [
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>,
      text: 'Dashboard',
      to: ROUTES.ADMIN_DASHBOARD
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>,
      text: 'Danh mục',
      to: ROUTES.ADMIN_CATEGORIES
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>,
      text: 'Sản phẩm',
      to: ROUTES.ADMIN_PRODUCTS
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>,
      text: 'Đơn hàng',
      to: ROUTES.ADMIN_ORDERS
    },
    {
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>,
      text: 'Videos',
      to: ROUTES.ADMIN_VIDEOS
    }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Backdrop for mobile */}
      {isSidebarOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-30 w-72 bg-white transform transition-transform duration-300 ease-in-out shadow-lg ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${!isMobile ? 'lg:translate-x-0' : ''}`}>
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-slate-100 bg-white/80 backdrop-blur-sm">
            <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <span className="text-lg font-bold text-white">M</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Milk Store
              </span>
            </Link>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1.5">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <button
                    onClick={() => handleNavigate(item.to)}
                    className={`flex w-full items-center px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive(item.to)
                        ? 'bg-gradient-to-r from-pink-500/10 to-purple-500/10 text-pink-600 font-medium'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <span className={`transition-colors duration-200 ${
                      isActive(item.to) 
                        ? 'text-pink-500' 
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}>
                      {item.icon}
                    </span>
                    <span className="ml-3">{item.text}</span>
                    {isActive(item.to) && (
                      <span className="ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b from-pink-500 to-purple-600" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-100">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-50">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">A</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  Admin
                </p>
                <p className="text-sm text-slate-500 truncate">
                  admin@milkstore.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${!isMobile ? 'lg:pl-72' : ''}`}>
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-sm border-b border-slate-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              {/* Breadcrumbs */}
              <nav className="hidden md:flex items-center" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  {getBreadcrumbs().map((breadcrumb, index) => (
                    <li key={index} className="flex items-center">
                      {index > 0 && (
                        <svg className="w-4 h-4 text-slate-400 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                      {!breadcrumb.isLast ? (
                        <Link to={breadcrumb.path} className="text-sm text-slate-500 hover:text-slate-700">
                          {breadcrumb.name}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-slate-800">{breadcrumb.name}</span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <NotificationDropdown 
                notifications={notifications}
                onClose={handleClearNotifications}
              />

              {/* Settings */}
              <button className="p-2 rounded-lg text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 