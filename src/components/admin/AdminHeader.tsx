import React from 'react';
import { Shield, Bell, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title,
  description
}) => {
  const { user } = useAuth();

  return (
    <header className="h-16 px-6 sm:px-8 border-b border-white/10 bg-[#0E0E15]/80 backdrop-blur-md flex items-center justify-between shrink-0">
      <div>
        <h2 className="font-display font-black text-white text-lg tracking-tight">{title}</h2>
        {description && <p className="text-xs text-text-muted">{description}</p>}
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/home"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs text-brand-primary hover:underline font-semibold"
        >
          <span>Live Site Preview</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-glow-primary">
            A
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-bold text-white">{user?.name || 'Administrator'}</div>
            <span className="text-[10px] text-brand-amber font-mono font-bold">SUPERADMIN</span>
          </div>
        </div>
      </div>
    </header>
  );
};
