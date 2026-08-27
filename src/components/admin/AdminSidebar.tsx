import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Film,
  Tv,
  Users,
  CreditCard,
  BarChart3,
  Activity,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import { Logo } from '../common/Logo';

export type AdminTab = 'overview' | 'movies' | 'shows' | 'users' | 'subscriptions' | 'activity';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab
}) => {
  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview Metrics', icon: LayoutDashboard },
    { id: 'movies', label: 'Movies Management', icon: Film },
    { id: 'shows', label: 'TV Shows & Seasons', icon: Tv },
    { id: 'users', label: 'User Accounts', icon: Users },
    { id: 'subscriptions', label: 'Subscription Plans', icon: CreditCard },
    { id: 'activity', label: 'Live Telemetry & Logs', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-[#0E0E15] border-r border-white/10 flex flex-col shrink-0 min-h-screen">
      {/* Top Brand */}
      <div className="p-6 border-b border-white/10">
        <Logo size="md" to="/home" />
        <div className="flex items-center gap-1.5 mt-3 text-xs font-bold text-brand-amber">
          <ShieldCheck className="w-4 h-4" />
          <span>Admin Control Center</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                isActive
                  ? 'bg-gradient-to-r from-brand-primary/20 to-brand-amber/10 text-white border border-brand-primary/30 shadow-glow-primary/30'
                  : 'text-text-secondary hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-primary' : 'text-text-muted'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Return to Public Stream Portal */}
      <div className="p-4 border-t border-white/10">
        <Link
          to="/home"
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Admin to Streaming</span>
        </Link>
      </div>
    </aside>
  );
};
