import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin } from '../store/authSlice';
import { ROUTES } from '../constants';

export const RequireAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Lưu lại trang người dùng đang cố truy cập
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export const RequireAdmin = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();
  
  
  if (!isAuthenticated) {
    console.error('Not authenticated, redirecting to admin login');
    // Lưu lại trang admin đang cố truy cập
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    console.error('Not admin, redirecting to unauthorized');
    return <Navigate to={ROUTES.UNAUTHORIZED} state={{ 
      message: 'Bạn không có quyền truy cập trang quản trị',
      from: location.pathname 
    }} replace />;
  }
  
  return <Outlet />;
}; 