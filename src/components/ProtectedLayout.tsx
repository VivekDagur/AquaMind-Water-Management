import React, { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

/**
 * ProtectedLayout provides the common layout for authenticated pages
 * Includes navbar, sidebar, and main content area with responsive behavior
 */
export const ProtectedLayout: React.FC<ProtectedLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const user = { role: 'admin' }; // assuming user object is defined somewhere

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar onSidebarToggle={toggleSidebar} />
      
      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar}
        />
        
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-30 bg-black/50 md:hidden"
            onClick={closeSidebar}
          />
        )}
        
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            <nav className="flex space-x-8">
              <Link
                to="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/reports"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/reports' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Reports
              </Link>
              <Link
                to="/alerts"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/alerts' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Alerts
              </Link>
              <Link
                to="/analytics"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === '/analytics' ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                📊 Analytics
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === '/admin' ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};