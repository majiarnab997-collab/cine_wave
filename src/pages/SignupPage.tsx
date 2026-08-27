import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, User, Check, Sparkles } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { SUBSCRIPTION_PLANS } from '../data/demoData';
import { useAuth } from '../context/AuthContext';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signup } = useAuth();

  const initialEmail = searchParams.get('email') || '';
  const initialPlan = searchParams.get('plan') || 'plan-standard';

  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState(initialPlan);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please provide a valid email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const res = signup(name, email, selectedPlanId);
      setIsLoading(false);
      if (res.success) {
        navigate('/profiles');
      } else {
        setError(res.error || 'Failed to create account.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#08080C] flex flex-col justify-between relative overflow-hidden py-6 px-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85"
          alt=""
          className="w-full h-full object-cover opacity-15 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-[#08080C]/80 to-[#08080C]" />
      </div>

      {/* Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between pb-6">
        <Logo size="md" to="/" />
        <Link to="/login" className="text-xs sm:text-sm font-semibold text-text-secondary hover:text-white">
          Sign In
        </Link>
      </header>

      {/* Signup Form Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-4">
        <div className="w-full max-w-xl bg-[#12121B]/95 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-cinematic backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="mb-6 space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">Step 1 of 2</span>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Create Your CineWave Account
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Start streaming thousands of 4K movies and shows today.
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alex Vance"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder-text-muted"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder-text-muted"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder-text-muted"
                />
              </div>
            </div>

            {/* Plan Selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
                Select Your Plan
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {SUBSCRIPTION_PLANS.map(plan => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <button
                      type="button"
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-brand-primary/15 border-brand-primary text-white shadow-glow-primary'
                          : 'bg-white/5 border-white/10 text-text-secondary hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs truncate">{plan.name.split(' ')[0]}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-primary stroke-[3]" />}
                      </div>
                      <div className="font-black text-sm text-white">${plan.priceMonthly}/mo</div>
                      <span className="text-[10px] text-text-muted block mt-0.5">{plan.resolution.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold shadow-glow-primary mt-4"
            >
              Start 30-Day Free Trial
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-primary font-bold hover:underline ml-1">
              Sign In
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 p-4 text-center text-xs text-text-muted">
        &copy; {new Date().getFullYear()} CineWave Media Inc.
      </footer>
    </div>
  );
};
