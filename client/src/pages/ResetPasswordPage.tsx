import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../db/supabase';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const navigate = useNavigate();

  // Check if we have a hash in the URL (Supabase appends the access token to the hash for password resets)
  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        console.log("Password recovery mode");
      }
    });
  }, []);

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { label: '', color: 'bg-neutral-800', score: 0 };
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', score };
    if (score === 3) return { label: 'Medium', color: 'bg-yellow-500', score };
    if (score === 4) return { label: 'Strong', color: 'bg-green-500', score };
    return { label: 'Very Strong', color: 'bg-green-400', score };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: "Passwords don't match" });
      return;
    }

    if (strength.score < 5) {
      setMessage({ type: 'error', text: "Password must contain at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character." });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      setMessage({ type: 'success', text: 'Password updated successfully. Redirecting...' });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (err: any) {
      if (err.message?.includes('Token expired')) {
         setMessage({ type: 'error', text: 'Expired reset link. Please request a new one.' });
      } else if (err.message?.includes('Invalid token')) {
         setMessage({ type: 'error', text: 'Invalid reset token.' });
      } else {
         setMessage({ type: 'error', text: err.message || 'Network error.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 relative">
      <Link
        to="/login"
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-neutral-900/50 border border-neutral-800 group-hover:bg-neutral-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Back to Login</span>
      </Link>

      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="flex justify-center items-center mb-8">
          <img src="/logo.png" alt="LinkConnect Logo" className="h-28 sm:h-32 w-auto object-contain" />
        </Link>

        <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">
          Reset Password
        </h2>
        <p className="text-center text-sm text-neutral-400 mb-8">
          Please enter your new password below.
        </p>
      </div>

      <div className="mt-8 mx-auto w-full max-w-[400px]">
        <div className="bg-neutral-900/50 backdrop-blur-sm py-8 px-4 border border-neutral-800 shadow-2xl shadow-indigo-500/5 sm:rounded-2xl sm:px-10">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {message && (
              <div className={`p-3 rounded-lg text-sm border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                {message.text}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-neutral-400">Password strength</span>
                    <span className={strength.label === 'Weak' ? 'text-red-400' : strength.label === 'Medium' ? 'text-yellow-400' : 'text-green-400'}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="flex gap-1 h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className={`h-full ${strength.score >= 1 ? strength.color : 'bg-transparent'} w-1/4 transition-all`}></div>
                    <div className={`h-full ${strength.score >= 3 ? strength.color : 'bg-transparent'} w-1/4 transition-all`}></div>
                    <div className={`h-full ${strength.score >= 4 ? strength.color : 'bg-transparent'} w-1/4 transition-all`}></div>
                    <div className={`h-full ${strength.score >= 5 ? strength.color : 'bg-transparent'} w-1/4 transition-all`}></div>
                  </div>
                  {strength.score < 5 && (
                    <p className="text-xs text-neutral-500 mt-1">
                      Must contain 8+ characters, uppercase, lowercase, number, and special character.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 pr-12"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
