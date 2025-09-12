import React from 'react';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Users, Shield, Database } from 'lucide-react';

const Admin: React.FC = () => {
  return (
    <ProtectedLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold aqua-gradient bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-muted-foreground">
            System administration and user management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Manage user accounts and permissions
              </p>
              <Button className="w-full">Manage Users</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Tank Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Configure tank settings and thresholds
              </p>
              <Button className="w-full" variant="outline">Configure</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                System Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Global system configuration
              </p>
              <Button className="w-full" variant="outline">Settings</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  );
};

export default Admin;