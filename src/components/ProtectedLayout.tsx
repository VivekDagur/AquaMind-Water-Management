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
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};