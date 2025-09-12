// Update this page (the content is just a fallback if you fail to update the page)

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center ocean-gradient">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="text-8xl font-bold text-white/20">404</div>
        <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
        <p className="text-xl text-white/80 mb-8">
          The page you're looking for doesn't exist in AquaMind.
        </p>
        <Link to="/">
          <Button className="bg-white text-primary hover:bg-white/90">
            <Home className="w-4 h-4 mr-2" />
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
