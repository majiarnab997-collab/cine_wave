import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  actionHref,
  onAction,
  className = ''
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-16 max-w-lg mx-auto ${className}`}>
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-brand-primary mb-5 shadow-glow-primary/20">
          {icon}
        </div>
      )}
      <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2">{title}</h3>
      <p className="text-text-secondary text-sm md:text-base mb-6 leading-relaxed">{description}</p>
      {actionText && (
        actionHref ? (
          <Link to={actionHref}>
            <Button variant="primary" size="md">
              {actionText}
            </Button>
          </Link>
        ) : (
          <Button variant="primary" size="md" onClick={onAction}>
            {actionText}
          </Button>
        )
      )}
    </div>
  );
};
