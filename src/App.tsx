import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/toaster';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Demo from './pages/Demo';
import { Layout } from './components/Layout';
import { useEffect } from 'react';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen bg-background">Loading...</div>;
  }

  if (!isAuthenticated && !location.pathname.startsWith('/demo')) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

// Main Layout Wrapper
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <Toaster />
    {children}
  </>
);

function App() {
  // Set page title
  useEffect(() => {
    document.title = 'AquaMind - Smart Water Management';
  }, []);

  return (
    <MainLayout>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Demo Route - Public */}
        <Route path="/demo" element={<Demo />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute><Layout showSidebar={true} /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
        
        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
