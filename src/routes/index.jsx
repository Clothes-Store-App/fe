import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin } from '../store/authSlice';
import { ROUTES } from '../constants';
import { lazy, Suspense } from 'react';

// Middleware
import { RequireAuth, RequireAdmin } from '../middleware/AuthMiddleware';

// Layouts
import CustomerLayout from '../views/customer/Layout';
import AdminLayout from '../views/admin/Layout';

// Customer Pages
import HomePage from '../views/customer/HomePage';
import ProductsPage from '../views/customer/ProductsPage';
import ProductDetailPage from '../views/customer/ProductDetailPage';
import CartPage from '../views/customer/CartPage';
import ContactPage from '../views/customer/ContactPage';
import CheckoutPage from '../views/customer/CheckoutPage';
import LoginPage from '../views/customer/LoginPage';
import RegisterPage from '../views/customer/RegisterPage';
import UnauthorizedPage from '../views/customer/UnauthorizedPage';
import PostsPage from '../views/customer/PostsPage';
import PostDetailPage from '../views/customer/PostDetailPage';

// Admin Pages
import Dashboard from '../views/admin/Dashboard';
import CategoryList from '../views/admin/categories/CategoryList';
import CreateCategory from '../views/admin/categories/CreateCategory';
import ProductList from '../views/admin/products/ProductList';
import ProductForm from '../views/admin/products/ProductForm';
import OrderList from '../views/admin/orders/OrderList';
import SliderList from '../views/admin/sliders/SliderList';
import BannerList from '../views/admin/banners/BannerList';

const VideoList = lazy(() => import('../views/admin/videos/VideoList'));
const PostList = lazy(() => import('../views/admin/posts/PostList'));
const PostFormCreate = lazy(() => import('../views/admin/posts/PostFormCreate'));
const PostFormEdit = lazy(() => import('../views/admin/posts/PostFormEdit'));
const PostDetail = lazy(() => import('../views/admin/posts/PostDetail'));

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
        {/* Public Customer Routes */}
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path={ROUTES.PRODUCTS} element={<ProductsPage />} />
          <Route path={ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path={ROUTES.POSTS} element={<PostsPage />} />
          <Route path={ROUTES.POST_DETAIL} element={<PostDetailPage />} />
          
          {/* Auth Routes - Redirect if already logged in */}
          <Route path={ROUTES.LOGIN} element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          } />
          <Route path={ROUTES.REGISTER} element={
            isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />
          } />
          
          {/* Protected Customer Routes */}
            <Route path={ROUTES.CART} element={<CartPage />} />
            <Route path={ROUTES.CHECKOUT} element={<CheckoutPage />} />

          {/* Error Pages */}
          <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path={ROUTES.ADMIN} element={
          isAuthenticated ? (
            isAdmin ? <Navigate to={ROUTES.ADMIN_DASHBOARD} replace /> : <Navigate to={ROUTES.UNAUTHORIZED} replace />
          ) : <LoginPage />
        } />
        
        {/* Protected Admin Routes */}
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path={ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.ADMIN_CATEGORIES} element={<CategoryList />} />
            <Route path={ROUTES.ADMIN_CATEGORY_ADD} element={<CreateCategory />} />
            <Route path="/admin/products" element={<ProductList />} />
            <Route path="/admin/products/add" element={<ProductForm />} />
            <Route path="/admin/products/edit/:id" element={<ProductForm />} />
            <Route path={ROUTES.ADMIN_ORDERS} element={<OrderList />} />
            <Route path={ROUTES.ADMIN_VIDEOS} element={
              <Suspense fallback={<Loading />}>
                <VideoList />
              </Suspense>
            } />
            <Route path={ROUTES.ADMIN_POSTS} element={
              <Suspense fallback={<Loading />}>
                <PostList />
              </Suspense>
            } />
            <Route path={ROUTES.ADMIN_POST_ADD} element={
              <Suspense fallback={<Loading />}>
                <PostFormCreate />
              </Suspense>
            } />
            <Route path={ROUTES.ADMIN_POST_EDIT} element={
              <Suspense fallback={<Loading />}>
                <PostFormEdit />
              </Suspense>
            } />
            <Route path={ROUTES.ADMIN_POST_DETAIL} element={
              <Suspense fallback={<Loading />}>
                <PostDetail />
              </Suspense>
            } />
            <Route path={ROUTES.ADMIN_SLIDERS} element={<SliderList />} />
            <Route path={ROUTES.ADMIN_BANNERS} element={<BannerList />} />
          </Route>
        </Route>
        
        {/* 404 Not Found */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes; 