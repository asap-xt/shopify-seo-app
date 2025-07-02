// frontend/src/Routes.jsx (Final Version)
import { Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/Dashboard.jsx';
import ProductsPage from './pages/Products.jsx';
import AnalyticsPage from './pages/Analytics.jsx';
import SettingsPage from './pages/Settings.jsx';
import AIQueriesPage from './pages/AIQueries.jsx';
import ExitIframe from './pages/ExitIframe.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/products" element={<ProductsPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/ai-queries" element={<AIQueriesPage />} />
      
      {/* This new route is essential for the OAuth flow to complete correctly. */}
      <Route path="/exitiframe" element={<ExitIframe />} />
    </Routes>
  );
}
