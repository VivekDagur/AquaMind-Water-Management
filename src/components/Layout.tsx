import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from '@/components/Header';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children?: ReactNode;
  showSidebar?: boolean;
}

export const Layout = ({ children, showSidebar = true }: LayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-background">
      {showSidebar && (
        <div className="hidden md:flex md:flex-shrink-0">
          <Sidebar user={user} onLogout={logout} />
        </div>
      )}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {showSidebar && <Header user={user} />}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/20">
          <div className="max-w-7xl mx-auto w-full">
            {children || <Outlet />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
