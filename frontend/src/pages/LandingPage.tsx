import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  Check,
  ChevronDown,
  Sparkles,
  Shield,
  Tv,
  Smartphone,
  Download,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { MediaCard } from '../components/media/MediaCard';
import { MOVIES } from '../data/movies';
import { SUBSCRIPTION_PLANS } from '../data/demoData';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { demoLogin } = useAuth();
  const [emailInput, setEmailInput] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      navigate(`/signup?email=${encodeURIComponent(emailInput.trim())}`);
    } else {
      navigate('/signup');
    }
  };

  const faqs = [
    {
      q: 'What is CineWave?',
      a: 'CineWave is a next-generation streaming entertainment service offering thousands of blockbuster movies, award-winning original television series, documentaries, and family cinema in stunning 4K Ultra HD and Dolby Atmos.'
    },
    {
      q: 'How much does CineWave cost?',
      a: 'Watch CineWave on your smartphone, tablet, Smart TV, laptop, or streaming device for one fixed monthly fee. Plans range from $8.99 to $19.99 a month with zero contracts and no hidden fees.'
    },
    {
      q: 'Where can I watch?',
      a: 'Watch anywhere, anytime. Sign in with your CineWave account to watch instantly on the web or download the app on your Smart TVs, smartphones, tablets, and media streaming players.'
    },
    {
      q: 'Is there a Kids profile mode?',
      a: 'Yes! CineWave includes built-in Kids profiles with parental maturity level filters, ensuring children only see family-friendly animated adventures and movies.'
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Absolutely. CineWave is flexible. There are no pesky contracts and no commitments. You can easily cancel or change your plan online in two clicks with zero cancellation fees.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#08080C] text-text-primary overflow-x-hidden">
      {/* Header Bar */}
      <header className="absolute top-0 left-0 right-0 z-30 px-4 sm:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="lg" to="/" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              demoLogin('user');
              navigate('/home');
            }}
            className="hidden sm:inline-flex text-xs font-bold text-brand-amber hover:text-white transition-colors bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20"
          >
            Quick Demo Login
          </button>
          <Link to="/login">
            <Button variant="primary" size="sm" className="shadow-glow-primary">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Cinematic Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Hero Background with High-End Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2000&q=85"
            alt="Cinema Hero"
            className="w-full h-full object-cover opacity-35 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08080C] via-[#08080C]/70 to-[#08080C]/80" />
          <div className="absolute inset-0 bg-radial-at-c from-brand-primary/15 via-transparent to-transparent" />
        </div>

        {/* Center Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-semibold text-brand-amber shadow-lg">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <span>Next-Gen Cinematic Streaming Experience</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-black text-white tracking-tight leading-[1.08] drop-shadow-2xl">
            Ride the Wave of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-amber">
              Pure Cinema.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed drop-shadow font-normal">
            Stream unlimited blockbuster movies, award-winning series, exclusive originals, and family entertainment in 4K Ultra HD.
          </p>

          {/* Email CTA Signup Box */}
          <form onSubmit={handleStart} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="email"
              placeholder="Enter your email address"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              className="flex-1 px-5 py-4 rounded-xl bg-black/60 border border-white/20 text-white placeholder-text-muted text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-brand-primary backdrop-blur-md"
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={<ArrowRight className="w-5 h-5" />}
              iconPosition="right"
              className="px-8 py-4 text-base font-bold shadow-glow-primary hover:scale-105"
            >
              Get Started
            </Button>
          </form>

          {/* Quick Demo Shortcuts */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-text-muted">
            <span>Instant Demo Access:</span>
            <button
              onClick={() => {
                demoLogin('user');
                navigate('/home');
              }}
              className="text-white hover:text-brand-primary font-bold underline px-1.5 py-0.5"
            >
              Movie Buff (Alex)
            </button>
            <span>•</span>
            <button
              onClick={() => {
                demoLogin('kids');
                navigate('/home');
              }}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline px-1.5 py-0.5"
            >
              Kids Profile
            </button>
            <span>•</span>
            <button
              onClick={() => {
                demoLogin('admin');
                navigate('/admin');
              }}
              className="text-brand-amber hover:text-amber-300 font-bold underline px-1.5 py-0.5"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* Feature Highlights Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center text-brand-primary mx-auto">
              <Tv className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-white text-lg">Watch on Any Screen</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Stream on your Smart TV, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-secondary/10 border border-brand-secondary/30 flex items-center justify-center text-brand-secondary mx-auto">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-white text-lg">Download & Watch Offline</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Save your favorite titles easily and always have something to watch on the go.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-brand-amber/10 border border-brand-amber/30 flex items-center justify-center text-brand-amber mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-display font-bold text-white text-lg">Kids Profiles Included</h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
              Send kids on adventures with their favorite characters in a space made just for them.
            </p>
          </div>
        </div>
      </section>

      {/* Live Preview Showcase Carousel */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight">
              Trending on CineWave
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Top streamed movies & exclusive series available right now
            </p>
          </div>
          <Link to="/login" className="text-xs font-bold text-brand-primary hover:underline">
            Explore All &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {MOVIES.slice(0, 6).map(movie => (
            <MediaCard key={movie.id} media={movie} variant="poster" />
          ))}
        </div>
      </section>

      {/* Subscription Plans Matrix */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
            Choose the Plan That Fits You
          </h2>
          <p className="text-sm sm:text-base text-text-muted">
            Join CineWave today. Switch plans or cancel anytime with zero penalty.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {SUBSCRIPTION_PLANS.map(plan => {
            const isPopular = plan.tier === 'premium';
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#1C1525] to-[#12121B] border-2 border-brand-primary shadow-cinematic'
                    : 'bg-[#12121B] border border-white/10 hover:border-white/20'
                }`}
              >
                {isPopular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-primary to-brand-amber text-white text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-glow-primary">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-display font-black text-xl text-white">{plan.name}</h3>
                    <p className="text-xs text-text-muted mt-1">{plan.resolution}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black font-display text-white">
                      ${plan.priceMonthly}
                    </span>
                    <span className="text-xs text-text-muted font-mono">/ month</span>
                  </div>

                  <ul className="space-y-3 pt-4 border-t border-white/10 text-xs sm:text-sm text-text-secondary">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <Link to={`/signup?plan=${plan.id}`}>
                    <Button
                      variant={isPopular ? 'primary' : 'outline'}
                      size="md"
                      className="w-full font-bold"
                    >
                      Choose {plan.name}
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/5">
        <h2 className="font-display text-3xl sm:text-4xl font-black text-white text-center tracking-tight mb-10">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#12121B] border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-bold text-white text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-text-muted transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-white/5 pt-4">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ready to Watch Bottom CTA */}
        <div className="text-center pt-16 space-y-4">
          <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
            Ready to experience CineWave?
          </h3>
          <p className="text-xs sm:text-sm text-text-muted max-w-lg mx-auto">
            Enter your email to create an account and unlock endless hours of cinema.
          </p>

          <form onSubmit={handleStart} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3 pt-2">
            <input
              type="email"
              placeholder="Email address"
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-white placeholder-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            <Button type="submit" variant="primary" size="md" className="shadow-glow-primary">
              Get Started
            </Button>
          </form>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-xs text-text-muted">
        <Logo size="sm" to="/" className="justify-center mb-3" />
        <p>&copy; {new Date().getFullYear()} CineWave Inc. All demo streaming rights reserved.</p>
      </footer>
    </div>
  );
};
