import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Film,
  Tv,
  Clock,
  DollarSign,
  HardDrive,
  Plus,
  BarChart2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AdminSidebar, AdminTab } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { MetricCard } from '../components/admin/MetricCard';
import { AnalyticsCharts } from '../components/admin/AnalyticsCharts';
import { MovieTable } from '../components/admin/MovieTable';
import { ShowTable } from '../components/admin/ShowTable';
import { UserTable } from '../components/admin/UserTable';
import { ActivityLog } from '../components/admin/ActivityLog';
import { ContentFormModal } from '../components/admin/ContentFormModal';
import { Button } from '../components/common/Button';
import { adminService } from '../services/adminService';
import { mediaService } from '../services/mediaService';
import { authService } from '../services/authService';
import { subscriptionService } from '../services/subscriptionService';
import { useAuth } from '../context/AuthContext';
import { Movie, TVShow, MediaItem, User } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [metrics, setMetrics] = useState(() => adminService.getMetrics());
  const [movies, setMovies] = useState<Movie[]>(() => mediaService.getMovies());
  const [shows, setShows] = useState<TVShow[]>(() => mediaService.getTVShows());
  const [users, setUsers] = useState<User[]>(() => adminService.getUsers());

  // Form Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<MediaItem | null>(null);

  const reloadData = () => {
    setMetrics(adminService.getMetrics());
    setMovies(mediaService.getMovies());
    setShows(mediaService.getTVShows());
    setUsers(adminService.getUsers());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleSaveContent = (item: MediaItem) => {
    if (item.type === 'movie') {
      mediaService.saveMovie(item as Movie);
    } else {
      mediaService.saveTVShow(item as TVShow);
    }
    reloadData();
  };

  const handleDeleteMovie = (id: string) => {
    mediaService.deleteMovie(id);
    reloadData();
  };

  const handleDeleteShow = (id: string) => {
    mediaService.deleteTVShow(id);
    reloadData();
  };

  const handleToggleSuspendUser = (userId: string) => {
    adminService.toggleUserSuspension(userId);
    reloadData();
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Delete this user account permanently?')) {
      adminService.deleteUser(userId);
      reloadData();
    }
  };

  const trafficData = adminService.getTrafficChart();
  const popularTitles = adminService.getPopularContentStats();
  const plans = subscriptionService.getPlans();

  const tabTitles: Record<AdminTab, { title: string; desc: string }> = {
    overview: { title: 'Executive Overview', desc: 'Real-time metrics, streaming performance, and revenue analytics' },
    movies: { title: 'Movie Catalog Management', desc: 'Manage 4K cinema assets, metadata, audio dubs, and video streams' },
    shows: { title: 'TV Series & Seasons Studio', desc: 'Manage episodic content, season schedules, and episode video pipelines' },
    users: { title: 'Subscriber Account Management', desc: 'Manage subscriber accounts, role authorizations, and profiles' },
    subscriptions: { title: 'Subscription Plans & Tiers', desc: 'Configure pricing, quality limits, and simultaneous streams' },
    activity: { title: 'Live Streaming Telemetry', desc: 'Live event stream of user watch activity and playback events' }
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary flex">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} onSelectTab={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader
          title={tabTitles[activeTab].title}
          description={tabTitles[activeTab].desc}
        />

        <div className="p-6 sm:p-8 space-y-8 flex-1">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <>
              {/* Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <MetricCard
                  title="Total Subscribers"
                  value={metrics.totalUsers.toLocaleString()}
                  change="+14.2%"
                  isPositive={true}
                  icon={<Users className="w-5 h-5" />}
                  subtitle={`${metrics.activeToday.toLocaleString()} active today`}
                />

                <MetricCard
                  title="Total Content Titles"
                  value={`${metrics.totalMovies + metrics.totalTVShows}`}
                  change="+6 new"
                  isPositive={true}
                  icon={<Film className="w-5 h-5" />}
                  subtitle={`${metrics.totalEpisodes} streamable episodes`}
                />

                <MetricCard
                  title="Watch Time (Hours)"
                  value={`${(metrics.totalWatchHours / 1000).toFixed(1)}k`}
                  change="+22.8%"
                  isPositive={true}
                  icon={<Clock className="w-5 h-5" />}
                  subtitle="Average 2.4 hrs / user"
                />

                <MetricCard
                  title="Monthly Revenue"
                  value={`$${metrics.monthlyRevenue.toLocaleString()}`}
                  change="+18.5%"
                  isPositive={true}
                  icon={<DollarSign className="w-5 h-5" />}
                  subtitle="Projected $2.2M ARR"
                />
              </div>

              {/* Interactive Traffic & Popular Content Charts */}
              <AnalyticsCharts
                trafficData={trafficData}
                popularTitles={popularTitles}
              />
            </>
          )}

          {/* TAB 2: MOVIES */}
          {activeTab === 'movies' && (
            <MovieTable
              movies={movies}
              onAddMovie={() => {
                setItemToEdit(null);
                setIsFormOpen(true);
              }}
              onEditMovie={m => {
                setItemToEdit(m);
                setIsFormOpen(true);
              }}
              onDeleteMovie={handleDeleteMovie}
              onPreviewMovie={m => navigate(`/watch/${m.id}`)}
            />
          )}

          {/* TAB 3: TV SHOWS */}
          {activeTab === 'shows' && (
            <ShowTable
              shows={shows}
              onAddShow={() => {
                setItemToEdit(null);
                setIsFormOpen(true);
              }}
              onEditShow={s => {
                setItemToEdit(s);
                setIsFormOpen(true);
              }}
              onDeleteShow={handleDeleteShow}
              onPreviewShow={s => navigate(`/watch/${s.id}`)}
            />
          )}

          {/* TAB 4: USERS */}
          {activeTab === 'users' && (
            <UserTable
              users={users}
              onToggleSuspend={handleToggleSuspendUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {/* TAB 5: SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    className="p-6 rounded-3xl bg-[#12121B] border border-white/10 space-y-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-black text-lg text-white">{plan.name}</h3>
                      <span className="text-xs font-mono font-bold text-brand-amber bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {plan.resolution}
                      </span>
                    </div>

                    <div className="text-3xl font-display font-black text-white">
                      ${plan.priceMonthly}<span className="text-xs text-text-muted">/mo</span>
                    </div>

                    <ul className="space-y-2 text-xs text-text-secondary border-t border-white/10 pt-4">
                      {plan.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ACTIVITY TELEMETRY */}
          {activeTab === 'activity' && <ActivityLog />}
        </div>
      </div>

      {/* Content Form Modal for Add/Edit Movie or TV Show */}
      <ContentFormModal
        isOpen={isFormOpen}
        itemToEdit={itemToEdit}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveContent}
      />
    </div>
  );
};
