import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Bot, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../db/supabase';

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

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

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (strength.score < 5) {
      setError("Password must contain at least 8 characters, an uppercase letter, a lowercase letter, a number, and a special character.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const { error: profileError } = await supabase
          .from("users")
          .insert({
            id: data.user.id,
            full_name: fullName,
            email: email,
          });

        if (profileError) {
          throw profileError;
        }
      }

      alert("🎉 Registration Successful!");

      console.log("User Created:", data.user);

      // Redirect user to login page
      navigate('/login');

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInSignUp = async () => {
    try {
      setLinkedinLoading(true);
      setError('');
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      });

      if (error) throw error;
      
    } catch (err: any) {
      setError(err.message || 'Failed to sign up with LinkedIn.');
      setLinkedinLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-indigo-500/30 relative">

      {/* Back Button */}
      <Link
        to="/"
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group"
      >
        <div className="p-2 rounded-full bg-neutral-900/50 border border-neutral-800 group-hover:bg-neutral-800 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium">Back</span>
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center mb-8">
          <img src="/logo.png" alt="LinkConnect Logo" className="h-28 sm:h-32 w-auto object-contain" />
        </Link>

        <h2 className="text-center text-3xl font-bold tracking-tight text-white mb-2">
          Create an account
        </h2>

        <p className="text-center text-sm text-neutral-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[400px]">
        <div className="bg-neutral-900/50 backdrop-blur-sm py-8 px-4 border border-neutral-800 shadow-2xl shadow-indigo-500/5 sm:rounded-2xl sm:px-10">

          <form className="space-y-5" onSubmit={handleSubmit}>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Full Name
              </label>

              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="block w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white placeholder-neutral-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Email Address
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

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1.5">
                Password
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

            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                required
                className="h-4 w-4 rounded border-neutral-800 bg-neutral-950 text-indigo-500"
              />

              <label htmlFor="terms" className="ml-2 text-sm text-neutral-400">
                I agree to the{' '}
                <a href="#" className="text-indigo-400">
                  Terms of Service
                </a>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || linkedinLoading}
              className="flex w-full justify-center rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-600 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Create Account'
              )}
            </button>

          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-neutral-900/50 px-4 text-neutral-500 backdrop-blur-sm">OR</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleLinkedInSignUp}
                disabled={loading || linkedinLoading}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-[#0077b5] px-4 py-3 text-sm font-semibold text-white hover:bg-[#006396] transition-all disabled:opacity-50 shadow-lg shadow-[#0077b5]/20"
              >
                {linkedinLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <LinkedinIcon className="w-5 h-5" />
                    Continue with LinkedIn
                  </>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}