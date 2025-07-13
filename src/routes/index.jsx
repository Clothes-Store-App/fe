import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin } from '../store/authSlice';
import { ROUTES } from '../constants';
import { lazy, Suspense } from 'react';

// Middleware
import { RequireAuth, RequireAdmin } from '../middleware/AuthMiddleware';

// Layouts
import AdminLayout from '../views/admin/Layout';

// Pages
import LoginPage from '../views/customer/LoginPage';

// Admin Pages
import Dashboard from '../views/admin/Dashboard';
import CategoryList from '../views/admin/categories/CategoryList';
import CreateCategory from '../views/admin/categories/CreateCategory';
import ProductList from '../views/admin/products/ProductList';
import ProductForm from '../views/admin/products/ProductForm';
import OrderList from '../views/admin/orders/OrderList';
import SliderList from '../views/admin/sliders/SliderList';
import UserList from '../views/admin/users/UserList';
import RatingList from '../views/admin/ratings/RatingList';

// Loading component
const Loading = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
  </div>
);

const AppRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Root redirect to admin */}
        <Route path="/" element={<Navigate to={ROUTES.ADMIN} replace />} />
        
        {/* Login Route */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route element={<RequireAdmin />}>
          <Route path={ROUTES.ADMIN} element={<AdminLayout />}>
            <Route index element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.ADMIN_CATEGORIES} element={<CategoryList />} />
            <Route path={ROUTES.ADMIN_CATEGORY_ADD} element={<CreateCategory />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/products/add" element={<ProductForm />} />
            <Route path="/admin/products/edit/:id" element={<ProductForm />} />
            <Route path={ROUTES.ADMIN_ORDERS} element={<OrderList />} />
            <Route path={ROUTES.ADMIN_SLIDERS} element={<SliderList />} />
            <Route path={ROUTES.ADMIN_USERS} element={<UserList />} />
            <Route path={ROUTES.ADMIN_RATINGS} element={<RatingList />} />
          </Route>
        </Route>
        
        {/* 404 Not Found */}
        <Route path="*" element={<Navigate to={ROUTES.ADMIN} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes; 