
import React from 'react';
import { Card } from '@/components/ui/card';
import { User } from '@/context/AuthContext';

interface WelcomeCardProps {
  user: User | null;
}

export const WelcomeCard: React.FC<WelcomeCardProps> = ({ user }) => {
  if (!user) return null;
  
  return (
    <Card className="p-6 mb-6">
      <h2 className="text-lg font-medium mb-4">Welcome, {user.name}!</h2>
      <p className="text-muted-foreground">
        You're logged in as: <span className="font-medium capitalize">{user.role.toLowerCase().replace('_', ' ')}</span>
      </p>
    </Card>
  );
};
