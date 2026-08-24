import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, signupUser } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  if (!isAuthModalOpen) return null;

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setFormError('');
  };

  const handleSwitchMode = (newMode: 'signin' | 'signup') => {
    setMode(newMode);
    setFormError('');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    const success = loginUser(cleanEmail, password);
    if (success) {
      resetForm();
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || cleanName.length < 2) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (!cleanPhone || cleanPhone.replace(/\D/g, '').length < 10) {
      setFormError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!password || password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    const success = signupUser(cleanName, cleanEmail, cleanPhone, password);
    if (success) {
      resetForm();
    }
  };

  const handleQuickDemo = (role: 'pro' | 'regular') => {
    if (role === 'pro') {
      loginUser('creator.pro@digivault.in', 'pro123', true, 'Vikramaditya (Pro Pass)');
    } else {
      loginUser('neha.design@example.com', 'user123', false, 'Neha Verma');
    }
    resetForm();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm sm:max-w-md rounded-3xl shadow-2xl border border-neutral-100 overflow-hidden flex flex-col">
        {/* Top Header */}
        <div className="px-5 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs font-serif shadow-xs">
              d
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                {mode === 'signin' ? 'Sign In' : 'Create Account'}
              </h2>
              <p className="text-[11px] text-neutral-400">
                {mode === 'signin'
                  ? 'Access your digital vault & downloads'
                  : 'Get instant 4K drops & commercial files'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              resetForm();
            }}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pb-1">
          <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-2xl text-xs font-medium">
            <button
              type="button"
              onClick={() => handleSwitchMode('signin')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white text-neutral-900 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('signup')}
              className={`py-2 rounded-xl transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white text-neutral-900 font-semibold shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4">
          {formError && (
            <div className="px-3.5 py-2.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-600 font-medium">
              {formError}
            </div>
          )}

          {mode === 'signin' ? (
            /* Sign In Form */
            <form onSubmit={handleSignIn} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. arjun@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-neutral-700">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white font-semibold text-xs sm:text-sm py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Sign In to Vault</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arjun Sharma"
                    className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. arjun@gmail.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-neutral-700 block mb-1">
                  Password (min 6 chars)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-10 py-2.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-neutral-900 hover:bg-neutral-800 active:bg-black text-white font-semibold text-xs sm:text-sm py-3 rounded-2xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Create Free Account</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Quick Demo Logins */}
          <div className="pt-2 border-t border-neutral-100">
            <div className="text-[10px] uppercase font-mono tracking-wider text-neutral-400 text-center mb-2">
              Quick 1-Tap Test Accounts
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('pro')}
                className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-left text-neutral-800 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold flex items-center gap-1 text-amber-900">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>Pro Member</span>
                </div>
                <div className="text-[10px] text-amber-700">Annual Pass (Live)</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('regular')}
                className="p-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl text-left text-neutral-800 transition-colors cursor-pointer"
              >
                <div className="text-[11px] font-bold text-neutral-800">
                  Regular User
                </div>
                <div className="text-[10px] text-neutral-500">Instant Access</div>
              </button>
            </div>
          </div>

          {/* Footer note */}
          <div className="text-center pt-1 text-[11px] text-neutral-400">
            <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
            <span>Secure 256-bit encrypted authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
