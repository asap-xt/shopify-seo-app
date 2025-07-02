// frontend/src/Routes.jsx
// This component defines all the client-side routes for the application.
// It maps URL paths to their corresponding page components.

import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/Dashboard.jsx';
import ProductsPage from './pages/Products.jsx';
import AnalyticsPage from './pages/Analytics.jsx';
import SettingsPage from './pages/Settings.jsx';
import AIQueriesPage from './pages/AIQueries.jsx';
import LoginPage from './pages/Login.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/ai-queries" element={<AIQueriesPage />} />
      
      {/* Fallback/Login page if no shop context is found */}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
}
