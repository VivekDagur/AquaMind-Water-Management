import React from 'react';
import { Toaster as SonnerToaster } from 'sonner';

export const Toaster: React.FC = () => {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: 'hsl(var(--card))',
          color: 'hsl(var(--card-foreground))',
          border: '1px solid hsl(var(--border))',
        },
      }}
    />
  );
};