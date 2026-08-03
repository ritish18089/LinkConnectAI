import React, { useState } from 'react';
import { Link } from 'react-router';
import { Loader2, ArrowLeft } from 'lucide-react';
import { supabase } from '../db/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage({ type: 'error', text: 'Invalid email format.' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Password reset email sent successfully.' });
      setEmail('');
    } catch (err: any) {
      if (err.message?.toLowerCase().includes('not found')) {
        setMessage({ type: 'error', text: 'Email not found.' });
      } else {
        setMessage({ type: 'error', text: err.message || 'Network error.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 relative">
      <Link
        to="/login"
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-neutral-900/50 border border-neutral-800 group-hover:bg-neutral-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Back to Login</span>
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center mb-8">
          <img src="/logo.png" alt="LinkConnect Logo" className="h-28 sm:h-32 w-auto object-contain" />
        </Link>

        <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">
          Forgot Password
        </h2>
        <p className="text-center text-sm text-neutral-400 mb-8">
          Enter your registered email address and we'll send you a link to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-neutral-900/50 backdrop-blur-sm py-8 px-4 border border-neutral-800 shadow-2xl shadow-indigo-500/5 sm:rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {message && (
              <div className={`p-3 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Registered Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
