import { Button } from '@/components/ui/button';
import { User } from '@/context/AuthContext';
import { LogOut, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: User | null;
  onMenuToggle?: () => void;
}

export const Header = ({ user, onMenuToggle }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 md:hidden"
        onClick={onMenuToggle}
      >
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
      
      <div className="flex-1">
        <h1 className="text-xl font-semibold">AquaMind</h1>
      </div>
      
      <nav className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {user.name || user.email}
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link to="/logout">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
