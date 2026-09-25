import React, { useState, useEffect, useRef } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle, ShieldAlert, ShieldCheck, Clock } from 'lucide-react';

interface SecurityGateOverlayProps {
  onUnlock: () => void;
}

const AUTHORIZED_USERNAME = '25eg112a35@anurag.edu.in';
const AUTHORIZED_PASSWORD = 'Instacks@2029';
const MAX_ATTEMPTS = 15;
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds
const LOCKOUT_DURATION_MS = 60 * 1000; // 60 seconds lockout

export const SecurityGateOverlay: React.FC<SecurityGateOverlayProps> = ({ onUnlock }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check and update countdown if in lockout mode
  useEffect(() => {
    if (lockoutRemaining > 0) {
      timerRef.current = setInterval(() => {
        setLockoutRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setAttempts([]); // Clear attempts when lockout expires
            setErrorMessage(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [lockoutRemaining]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutRemaining > 0) {
      return;
    }

    const now = Date.now();
    // Filter attempts within the sliding 60-second window
    const recentAttempts = attempts.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    const newAttempts = [...recentAttempts, now];
    setAttempts(newAttempts);

    // Enforce rate limiting: > 15 requests in 60s
    if (newAttempts.length >= MAX_ATTEMPTS) {
      setLockoutRemaining(Math.ceil(LOCKOUT_DURATION_MS / 1000));
      setErrorMessage(`Too many attempts. Form locked for 60 seconds to prevent unauthorized access.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Verify hardcoded door credentials
    const trimmedUsername = username.trim().toLowerCase();
    const isUsernameMatch = trimmedUsername === AUTHORIZED_USERNAME.toLowerCase();
    const isPasswordMatch = password === AUTHORIZED_PASSWORD;

    if (isUsernameMatch && isPasswordMatch) {
      // Store flag in sessionStorage as requested
      sessionStorage.setItem('isDoorUnlocked', 'true');

      // If user selected "Remember", also persist to localStorage
      if (rememberMe) {
        localStorage.setItem('isDoorUnlocked', 'true');
      }

      onUnlock();
    } else {
      const remainingAttempts = MAX_ATTEMPTS - newAttempts.length;
      setErrorMessage(
        remainingAttempts > 0
          ? `Invalid username or password. (${remainingAttempts} attempt${remainingAttempts === 1 ? '' : 's'} remaining)`
          : `Invalid username or password.`
      );
      setIsSubmitting(false);
    }
  };

  const isLocked = lockoutRemaining > 0;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        {/* Card Header */}
        <div className="bg-slate-50 px-8 pt-8 pb-6 border-b border-slate-100 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-3 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Login Form</h1>
          <p className="text-xs text-slate-500 mt-1">Authorized personnel verification required</p>
        </div>

        {/* Card Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {/* Lockout / Countdown Alert */}
          {isLocked && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800 text-xs animate-shake">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Security Lockout Active</span>
                <span>Please wait <strong>{lockoutRemaining}s</strong> before attempting to login again.</span>
              </div>
            </div>
          )}

          {/* Error Alert */}
          {errorMessage && !isLocked && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3 text-rose-700 text-xs">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <span className="font-medium">{errorMessage}</span>
            </div>
          )}

          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                disabled={isLocked}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLocked}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Checkbox */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                disabled={isLocked}
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
              />
              <span className="text-xs text-slate-600 font-medium">Remember</span>
            </label>

            <span className="text-[11px] text-slate-400 font-mono">
              Max 15 attempts / min
            </span>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLocked || isSubmitting}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLocked ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Locked ({lockoutRemaining}s)
              </>
            ) : isSubmitting ? (
              'Verifying...'
            ) : (
              'Login'
            )}
          </button>
        </form>

        {/* Security Footer Notice */}
        <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Protected Access Gateway
          </span>
          <span className="text-slate-400">SIH26011 Node</span>
        </div>
      </div>
    </div>
  );
};
