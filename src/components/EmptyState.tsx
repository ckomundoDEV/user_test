import { type ReactNode } from 'react';
import { type IconType } from 'react-icons';

interface EmptyStateProps {
  icon?: ReactNode | IconType;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  className = "" 
}: EmptyStateProps) => {
  return (
    <div className={`px-6 py-12 text-center ${className}`}>
      <div className="text-gray-500">
        {icon && (
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            {typeof icon === 'function' ? icon({}) : icon}
          </div>
        )}
        <p className="text-lg font-medium">{title}</p>
        {description && (
          <p className="text-sm">{description}</p>
        )}
        {action && (
          <div className="mt-4">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState; 