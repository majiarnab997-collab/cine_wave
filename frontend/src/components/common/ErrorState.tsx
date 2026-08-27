import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from './Button';
import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an issue while loading this content. Please try again or return to the home screen.',
  onRetry,
  showHomeButton = true,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-16 max-w-md mx-auto min-h-[40vh] ${className}`}>
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 mb-5 shadow-lg">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">{title}</h3>
      <p className="text-text-secondary text-sm md:text-base mb-6 leading-relaxed">{message}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        {onRetry && (
          <Button variant="primary" icon={<RefreshCw className="w-4 h-4" />} onClick={onRetry}>
            Try Again
          </Button>
        )}
        {showHomeButton && (
          <Link to="/home">
            <Button variant="secondary" icon={<Home className="w-4 h-4" />}>
              Go Home
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
