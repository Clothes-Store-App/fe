import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin } from '../store/authSlice';
import { ROUTES } from '../constants';

export const RequireAuth = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  
  return <Outlet />;
};

export const RequireAdmin = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  
  return <Outlet />;
}; 