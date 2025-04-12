
import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <Card className="flex flex-col items-center justify-center p-10 text-center h-64">
      <div className="text-muted-foreground mb-4 text-4xl">
        {icon}
      </div>
      <h3 className="font-semibold text-xl mb-1">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {action}
    </Card>
  );
};

export default EmptyState;
