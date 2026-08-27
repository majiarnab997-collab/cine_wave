import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Logo } from '../components/common/Logo';
import { Button } from '../components/common/Button';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#08080C] flex flex-col justify-between relative overflow-hidden p-6">
      <header className="relative z-10 max-w-7xl mx-auto w-full">
        <Logo size="md" to="/" />
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-[#12121B]/95 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-cinematic backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          {!isSubmitted ? (
            <>
              <div className="mb-6 space-y-1">
                <h1 className="font-display font-black text-2xl text-white tracking-tight">
                  Reset Password
                </h1>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Enter your CineWave account email to receive recovery instructions.
                </p>
              </div>

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
                      required
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
                  Send Recovery Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-4 py-4 animate-in fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="font-display font-bold text-xl text-white">Check Your Inbox</h2>
              <p className="text-xs text-text-muted leading-relaxed">
                We sent password reset instructions to <span className="text-white font-semibold">{email}</span>.
              </p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-text-secondary hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center text-xs text-text-muted">
        &copy; {new Date().getFullYear()} CineWave Media Inc.
      </footer>
    </div>
  );
};
