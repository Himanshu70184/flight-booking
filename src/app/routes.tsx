import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from './App'; // Original landing page
import { SearchResultsPage } from './pages/SearchResultsPage';
import AdminCmsPage from './pages/AdminCmsPage';
import BlogManagementPage from './pages/BlogManagementPage';
import TestimonialManagementPage from './pages/TestimonialManagementPage';
import FAQManagementPage from './pages/FAQManagementPage';
import SeoManagementPage from './pages/SeoManagementPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/search-results',
    element: <SearchResultsPage />,
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminCmsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/dashboard',
    element: (
      <ProtectedRoute>
        <AdminCmsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/blogs',
    element: (
      <ProtectedRoute>
        <BlogManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/testimonials',
    element: (
      <ProtectedRoute>
        <TestimonialManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/faqs',
    element: (
      <ProtectedRoute>
        <FAQManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/seo',
    element: (
      <ProtectedRoute>
        <SeoManagementPage />
      </ProtectedRoute>
    ),
  },
]);