import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../constants';

const BottomNavigation = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="mobile-bottom-nav safe-area-padding lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-1">
          <Link
            to={ROUTES.HOME}
            className={`flex flex-col items-center p-2 relative group ${
              isActive(ROUTES.HOME) ? 'text-pink-600' : 'text-gray-600'
            }`}
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className={`p-1.5 rounded-lg group-hover:bg-pink-50 transition-colors ${
              isActive(ROUTES.HOME) ? 'bg-pink-50' : ''
            }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
              </svg>
            </div>
            <span className="text-xs font-medium mt-1">Trang chủ</span>
          </Link>

          <Link
            to={ROUTES.PRODUCTS}
            className={`flex flex-col items-center p-2 relative group ${
              isActive(ROUTES.PRODUCTS) ? 'text-pink-600' : 'text-gray-600'
            }`}
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className={`p-1.5 rounded-lg group-hover:bg-pink-50 transition-colors ${
              isActive(ROUTES.PRODUCTS) ? 'bg-pink-50' : ''
            }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375z" />
                <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 006.62 21h10.757a3 3 0 002.995-2.824L20.913 9H3.087zm6.163 3.75A.75.75 0 0110 12h4a.75.75 0 010 1.5h-4a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-xs font-medium mt-1">Sản phẩm</span>
          </Link>

          <Link
            to={ROUTES.CART}
            className={`flex flex-col items-center p-2 relative group ${
              isActive(ROUTES.CART) ? 'text-pink-600' : 'text-gray-600'
            }`}
            onClick={() => window.scrollTo(0, 0)}
          >
            <div className={`p-1.5 rounded-lg group-hover:bg-pink-50 transition-colors ${
              isActive(ROUTES.CART) ? 'bg-pink-50' : ''
            }`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6"
              >
                <path d="M2.25 2.25a.75.75 0 000 1.5h1.386c.17 0 .318.114.362.278l2.558 9.592a3.752 3.752 0 00-2.806 3.63c0 .414.336.75.75.75h15.75a.75.75 0 000-1.5H5.378A2.25 2.25 0 017.5 15h11.218a.75.75 0 00.674-.421 60.358 60.358 0 002.96-7.228.75.75 0 00-.525-.965A60.864 60.864 0 005.68 4.509l-.232-.867A1.875 1.875 0 003.636 2.25H2.25zM3.75 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM16.5 20.25a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z" />
              </svg>
            </div>
            <span className="text-xs font-medium mt-1">Giỏ hàng</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation; 