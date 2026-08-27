import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  User,
  Shield,
  Smartphone,
  Tv,
  Laptop,
  Check,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Navbar } from '../components/layout/Navbar';
import { MobileNav } from '../components/layout/MobileNav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { SUBSCRIPTION_PLANS, DEMO_DEVICES } from '../data/demoData';
import { subscriptionService } from '../services/subscriptionService';

export const AccountPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { profiles } = useProfile();
  const [selectedPlanModal, setSelectedPlanModal] = useState(false);
  const [activePlanId, setActivePlanId] = useState(user?.subscriptionPlanId || 'plan-premium');

  const currentPlan = SUBSCRIPTION_PLANS.find(p => p.id === (user?.subscriptionPlanId || activePlanId)) || SUBSCRIPTION_PLANS[2];

  const handleUpdatePlan = (planId: string) => {
    subscriptionService.updateUserPlan(planId);
    setActivePlanId(planId);
    refreshUser();
    setSelectedPlanModal(false);
  };

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden pt-20 pb-12 lg:pb-0">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="border-b border-white/10 pb-6">
          <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight">
            Account & Membership
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-1">
            Manage your subscription, security, profile access, and authorized streaming devices.
          </p>
        </div>

        {/* Membership & Plan Section */}
        <section className="p-6 rounded-3xl bg-[#12121B] border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">
                Membership Details
              </span>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-xl text-white">{currentPlan.name}</h2>
                <Badge variant="original">{user?.subscriptionStatus || 'Active'}</Badge>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedPlanModal(true)}
            >
              Change Subscription Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 space-y-1">
              <span className="text-text-muted block">Next Billing Cycle</span>
              <span className="text-white font-bold text-sm">{user?.nextBillingDate || '2026-09-28'}</span>
              <span className="text-[11px] text-text-muted block">Auto-renews at ${currentPlan.priceMonthly}/mo</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 space-y-1">
              <span className="text-text-muted block">Stream Resolution</span>
              <span className="text-white font-bold text-sm">{currentPlan.resolution}</span>
              <span className="text-[11px] text-emerald-400 block font-semibold">HDR & Dolby Atmos</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 space-y-1">
              <span className="text-text-muted block">Simultaneous Devices</span>
              <span className="text-white font-bold text-sm">{currentPlan.supportedDevicesCount} Screens</span>
              <span className="text-[11px] text-text-muted block">Downloads enabled</span>
            </div>
          </div>
        </section>

        {/* Profile Management Section */}
        <section className="p-6 rounded-3xl bg-[#12121B] border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="font-display font-bold text-white text-lg">Profiles on this Account</h3>
              <p className="text-xs text-text-muted">Manage avatars, maturity limits, and Kids mode</p>
            </div>

            <Link to="/profiles">
              <Button variant="outline" size="sm">
                Manage Profiles
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {profiles.map(p => (
              <div key={p.id} className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-3">
                <img
                  src={p.avatarUrl}
                  alt={p.name}
                  className="w-10 h-10 rounded-full object-cover border border-white/10"
                />
                <div className="min-w-0">
                  <h4 className="font-bold text-xs text-white truncate">{p.name}</h4>
                  <span className="text-[10px] text-text-muted font-mono block">
                    {p.isKids ? 'Kids Mode' : p.maturityLevel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Security & Password */}
        <section className="p-6 rounded-3xl bg-[#12121B] border border-white/10 space-y-4">
          <h3 className="font-display font-bold text-white text-lg">Security & Access</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div>
                <span className="font-bold text-white block">Email Address</span>
                <span className="text-text-muted">{user?.email}</span>
              </div>
              <span className="text-xs text-brand-amber font-bold">Verified</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <div>
                <span className="font-bold text-white block">Password</span>
                <span className="text-text-muted">••••••••••••</span>
              </div>
              <Link to="/forgot-password" className="text-brand-primary font-bold hover:underline">
                Reset Password
              </Link>
            </div>
          </div>
        </section>

        {/* Authorized Streaming Devices */}
        <section className="p-6 rounded-3xl bg-[#12121B] border border-white/10 space-y-4">
          <h3 className="font-display font-bold text-white text-lg">Authorized Devices</h3>
          <div className="space-y-2">
            {DEMO_DEVICES.map(dev => (
              <div
                key={dev.id}
                className="p-3.5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-text-muted">
                    {dev.type === 'tv' ? (
                      <Tv className="w-5 h-5" />
                    ) : dev.type === 'mobile' ? (
                      <Smartphone className="w-5 h-5" />
                    ) : (
                      <Laptop className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{dev.name}</span>
                      {dev.isCurrent && (
                        <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                          Current
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-text-muted">{dev.browser} • {dev.location}</span>
                  </div>
                </div>
                <span className="text-[11px] text-text-muted font-mono">{dev.lastActive}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Change Plan Modal */}
      {selectedPlanModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="fixed inset-0" onClick={() => setSelectedPlanModal(false)} />
          <div className="relative w-full max-w-2xl bg-[#12121B] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-cinematic z-10 animate-in zoom-in-95 duration-200">
            <h3 className="font-display font-black text-2xl text-white mb-6">Select a Subscription Plan</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {SUBSCRIPTION_PLANS.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleUpdatePlan(p.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    user?.subscriptionPlanId === p.id
                      ? 'bg-brand-primary/20 border-brand-primary text-white shadow-glow-primary'
                      : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
                  }`}
                >
                  <h4 className="font-bold text-sm text-white mb-1">{p.name}</h4>
                  <div className="font-black text-lg text-white mb-2">${p.priceMonthly}/mo</div>
                  <p className="text-xs text-text-muted leading-relaxed">{p.resolution}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedPlanModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
      <MobileNav />
    </div>
  );
};
