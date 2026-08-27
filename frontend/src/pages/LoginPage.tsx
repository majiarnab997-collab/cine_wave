import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Shield, User, Lock, Mail, ArrowRight } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, demoLogin } = useAuth();

  const [email, setEmail] = useState('alex@cinewave.tv');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const res = login(email);
      setIsLoading(false);
      if (res.success) {
        navigate('/profiles');
      } else {
        setError(res.error || 'Invalid credentials');
      }
    }, 400);
  };

  const handleDemo = (role: 'user' | 'kids' | 'admin') => {
    demoLogin(role);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/profiles');
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] flex flex-col justify-between relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85"
          alt=""
          className="w-full h-full object-cover opacity-20 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-[#08080C]/80 to-[#08080C]" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 max-w-7xl mx-auto w-full">
        <Logo size="md" to="/" />
      </header>

      {/* Form Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#12121B]/95 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-cinematic backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="mb-6 space-y-1">
            <h1 className="font-display font-black text-2xl sm:text-3xl text-white tracking-tight">
              Sign In
            </h1>
            <p className="text-xs sm:text-sm text-text-muted">
              Enter your account to start streaming
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-text-muted hover:text-white transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary placeholder-text-muted"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-bold shadow-glow-primary mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* 1-Click Demo Logins */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-2.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted block text-center">
              1-Click Demo Profiles
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('user')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all text-center flex flex-col items-center gap-1 hover:border-brand-primary"
              >
                <User className="w-4 h-4 text-brand-primary" />
                <span>Alex</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('kids')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all text-center flex flex-col items-center gap-1 hover:border-emerald-400"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Kids</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemo('admin')}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all text-center flex flex-col items-center gap-1 hover:border-amber-400"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-text-muted">
            New to CineWave?{' '}
            <Link to="/signup" className="text-brand-primary font-bold hover:underline ml-1">
              Sign up now
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center text-xs text-text-muted">
        &copy; {new Date().getFullYear()} CineWave Media Inc.
      </footer>
    </div>
  );
};
