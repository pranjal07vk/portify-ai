import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

// Lazy load pages for performance
const Home = React.lazy(() => import('./pages/Home'));
const Auth = React.lazy(() => import('./pages/Auth'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Builder = React.lazy(() => import('./pages/Builder'));
const Portfolio = React.lazy(() => import('./pages/Portfolio'));
const PortfoliosList = React.lazy(() => import('./pages/PortfoliosList'));

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/auth" />;
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/generate" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
        <Route path="/portfolios" element={<ProtectedRoute><PortfoliosList /></ProtectedRoute>} />
        <Route path="/portfolio/:id" element={<Portfolio />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <div className="bg-grid"></div>
          <div className="bg-glow"></div>
          
          {/* Header placeholder */}
          <header className="glass sticky top-0 z-50 py-4 px-6 flex justify-between items-center">
            <div className="text-xl font-bold text-[var(--color-primary)]">CareerFolio</div>
            {/* Nav placeholder */}
          </header>

          <main className="flex-1 relative">
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--color-primary)]">Loading...</div>}>
              <AnimatedRoutes />
            </Suspense>
          </main>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
