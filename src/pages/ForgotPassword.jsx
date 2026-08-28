import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mail, Lock, Loader2, AlertCircle, CheckCircle2, Sparkles, ArrowLeft } from 'lucide-react';
import { authService } from '../services/authService';
import Button from '../components/Button';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('forgot'); // 'forgot' or 'reset'

  // Check if we're in reset password mode
  const resetToken = searchParams.get('token');
  const resetType = searchParams.get('type');

  if (resetToken || resetType === 'recovery') {
    setStep('reset');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (step === 'forgot') {
      if (!email) {
        setError('Please enter your email address');
        return;
      }

      setLoading(true);
      try {
        await authService.resetPassword(email);
        setSuccess(true);
        setLoading(false);
      } catch (err) {
        // Don't reveal if email exists
        setSuccess(true);
        setLoading(false);
      }
    } else {
      // Reset password step
      if (!password || !confirmPassword) {
        setError('Please fill in all fields');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setLoading(true);
      try {
        await authService.updatePassword(password);
        setSuccess(true);
        setLoading(false);
      } catch (err) {
        setError('Failed to update password. The link may have expired.');
        setLoading(false);
      }
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-charcoal-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 mb-6">
            <Sparkles className="h-8 w-8" />
            <span className="text-2xl font-bold text-white">CookFlow</span>
          </Link>
          {step === 'forgot' ? (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Forgot Password?</h1>
              <p className="text-charcoal-400">Enter your email and we'll send you reset instructions</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-white mb-2">Reset Password</h1>
              <p className="text-charcoal-400">Enter your new password below</p>
            </>
          )}
        </div>

        <div className="card bg-charcoal-900 border-charcoal-800 p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-800/50 text-red-300 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {success && !loading && (
            <div className="mb-6 p-4 rounded-xl bg-green-900/30 border border-green-800/50 text-green-300 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              <p className="text-sm">
                {step === 'forgot' 
                  ? 'If an account exists for this email, we\'ve sent password reset instructions.'
                  : 'Your password has been updated successfully!'}
              </p>
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 'forgot' ? (
                <div>
                  <label htmlFor="email" className="label">Email</label>
                  <div className="relative mt-1">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="input pl-10"
                      placeholder="you@example.com"
                      disabled={loading}
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label htmlFor="password" className="label">New Password</label>
                    <div className="relative mt-1">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6M12 15l3-3m0 0l-3-3m3 3H6"/></svg>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="input pl-10 pr-12"
                        placeholder="Enter new password"
                        disabled={loading}
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                    <div className="relative mt-1">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6M12 15l3-3m0 0l-3-3m3 3H6"/></svg>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        autoComplete="new-password"
                        className="input pl-10"
                        placeholder="Confirm new password"
                        disabled={loading}
                      />
                    </div>
                  </div>
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                loading={loading}
              >
                {step === 'forgot' ? 'Send Reset Link' : 'Update Password'}
              </Button>
            </form>
          )}

          {success && !loading && (
            <div className="mt-6 text-center">
              <Button
                variant="primary"
                onClick={handleBackToLogin}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </div>
          )}

          {!success && (
            <p className="mt-6 text-center text-sm text-charcoal-400">
              <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
                {step === 'forgot' ? 'Back to Sign In' : 'Cancel'}
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}