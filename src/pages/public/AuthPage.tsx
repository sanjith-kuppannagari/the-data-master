import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { ObservatoryBackdrop } from '../../components/common/ObservatoryBackdrop';
import { backendService } from '../../services/backend/backendService';
import { LogIn, ShieldCheck, Sparkles, UserCheck, Cloud, HardDrive } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login' }) => {
  const [isRegister, setIsRegister] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const isCloudActive = backendService.isCloudConnected;

  const handleDemoSignIn = async () => {
    await login('alex.rivera@datamaster.io', 'Alex Rivera');
    navigate('/platform/dashboard');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setAuthError(null);
    setIsSubmitting(true);

    try {
      if (isCloudActive) {
        if (isRegister) {
          const res = await backendService.adapter.signUp(email, password, name);
          if (!res.success) {
            setAuthError(res.error || 'Registration failed');
            setIsSubmitting(false);
            return;
          }
        } else {
          const res = await backendService.adapter.signIn(email, password);
          if (!res.success) {
            setAuthError(res.error || 'Invalid email or password');
            setIsSubmitting(false);
            return;
          }
        }
      }

      await login(email, name || email.split('@')[0], password);
      navigate('/platform/dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight text-slate-100 flex flex-col justify-center items-center p-4 relative font-sans">
      <ObservatoryBackdrop intensity="vibrant" />

      {/* Brand Header */}
      <Link to="/" className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-charcoal border border-charcoal-border flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-lime animate-pulse" />
        </div>
        <div className="text-left">
          <span className="font-heading font-extrabold text-xl tracking-tight text-white block">
            THE DATA MASTER
          </span>
          <span className="text-[10px] font-mono text-lime uppercase tracking-widest block">
            Observatory Station
          </span>
        </div>
      </Link>

      <div className="w-full max-w-md">
        <Card variant="bordered" className="p-8 shadow-2xl bg-charcoal/95 border-charcoal-border backdrop-blur-md">
          {/* Backend Status Banner */}
          <div className="mb-6 p-2.5 rounded-lg bg-midnight/80 border border-charcoal-border flex items-center justify-between text-[11px] font-mono">
            <span className="flex items-center gap-1.5 text-slate-300">
              {isCloudActive ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-cyan" />
                  <span>Cloud Backend Connected</span>
                </>
              ) : (
                <>
                  <HardDrive className="w-3.5 h-3.5 text-lime" />
                  <span>Local-First Offline Engine</span>
                </>
              )}
            </span>
            <Badge variant={isCloudActive ? 'cyan' : 'lime'}>
              {isCloudActive ? 'Supabase DB' : '100% Free / Local'}
            </Badge>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-2xl font-heading font-bold text-white">
              {isRegister ? 'Initialize Explorer Profile' : 'Access Your Studio'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {isRegister
                ? 'Begin your personalized journey into data mastery.'
                : 'Resume your learning roadmap, streaks, and challenges.'}
            </p>
          </div>

          {/* Quick Demo Access Button */}
          <div className="mb-6 p-4 rounded-xl bg-midnight border border-lime/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-lime font-mono font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Quick Prototype Access
              </span>
              <Badge variant="lime">Instant</Badge>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Pre-loaded with 450 XP, a 5-day streak, active projects, and completed SQL & Excel foundations.
            </p>
            <Button
              type="button"
              variant="primary"
              size="sm"
              icon={<UserCheck className="w-4 h-4" />}
              className="w-full mt-2 font-mono"
              onClick={handleDemoSignIn}
            >
              Sign In as Alex Rivera (Demo)
            </Button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-charcoal-border" />
            </div>
            <div className="relative flex justify-center text-[10px] font-mono uppercase tracking-wider">
              <span className="px-2 bg-charcoal text-slate-500">
                {isCloudActive ? 'Or sign in with cloud account' : 'Or create custom local profile'}
              </span>
            </div>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              {authError}
            </div>
          )}

          {/* Custom Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Full Name / Explorer Handle
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Smith"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-midnight border border-charcoal-border text-slate-100 text-sm focus:outline-none focus:border-lime/60 font-sans"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="analyst@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-midnight border border-charcoal-border text-slate-100 text-sm focus:outline-none focus:border-lime/60 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required={isCloudActive}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg bg-midnight border border-charcoal-border text-slate-100 text-sm focus:outline-none focus:border-lime/60 font-sans"
              />
            </div>

            <Button
              type="submit"
              variant="secondary"
              className="w-full justify-center mt-2"
              icon={<LogIn className="w-4 h-4" />}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Authenticating...'
                : isRegister
                ? 'Create Profile & Enter'
                : 'Sign In'}
            </Button>
          </form>

          {/* Toggle between Login and Register */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isRegister ? (
              <span>
                Already have an explorer profile?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(false)}
                  className="text-lime hover:underline font-semibold"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                New to The Data Master?{' '}
                <button
                  type="button"
                  onClick={() => setIsRegister(true)}
                  className="text-lime hover:underline font-semibold"
                >
                  Create an account
                </button>
              </span>
            )}
          </div>

          {/* Data Privacy Disclosure */}
          <div className="mt-6 pt-4 border-t border-charcoal-border/70 flex items-start gap-2 text-[10px] text-slate-400 font-mono leading-tight">
            <ShieldCheck className="w-3.5 h-3.5 text-lime shrink-0 mt-0.5" />
            <span>
              {isCloudActive
                ? 'Secure cloud authentication powered by Supabase PostgreSQL and Row-Level Security.'
                : 'Free-First Local Architecture: Data is stored securely in your browser. No external API keys or accounts required.'}
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};
