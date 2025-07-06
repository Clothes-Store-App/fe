import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m0 0v2m0-2h2m-2 0H9.5m11 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Không có quyền truy cập</h1>
      
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Rất tiếc, bạn không có quyền truy cập vào trang này. Vui lòng đăng nhập bằng tài khoản phù hợp hoặc liên hệ với quản trị viên.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to={ROUTES.LOGIN}
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
        >
          Đăng nhập
        </Link>
        
        <Link
          to={ROUTES.HOME}
          className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default UnauthorizedPage; 