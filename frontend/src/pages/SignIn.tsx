import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, User, Lock, Eye, EyeOff, ArrowRight, AlertCircle, KeyRound, Check, Mail } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstTimeLogin, setIsFirstTimeLogin] = useState(false);
  const [systemPassword, setSystemPassword] = useState('');
  const [errors, setErrors] = useState({ loginId: '', password: '' });
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
  });
  const [newPasswordData, setNewPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const validateForm = () => {
    const newErrors = { loginId: '', password: '' };
    let isValid = true;

    if (!formData.loginId.trim()) {
      newErrors.loginId = 'Login ID or Email is required';
      isValid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Auto-detect user role from login ID or email
  const detectUserRole = (loginId: string): 'employee' | 'hr' => {
    const upperLoginId = loginId.toUpperCase();
    
    // Check if it's an admin/HR account
    // HR accounts typically contain 'ADMIN', 'HR', or specific company admin patterns
    if (
      upperLoginId.includes('ADMIN') || 
      upperLoginId.includes('HR') ||
      upperLoginId.includes('MANAGER') ||
      upperLoginId.endsWith('@HR.COM') ||
      // For demo: if email is from hr domain
      loginId.toLowerCase().includes('hr@')
    ) {
      return 'hr';
    }
    
    // Default to employee
    return 'employee';
  };

  // Generate a mock system password
  const generateSystemPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({ loginId: '', password: '' });

    try {
      // Call the real API login
      await login(formData.loginId, formData.password);
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully signed in',
      });
      
      // Navigate based on user role (will be set by AuthContext)
      // We'll check after a small delay to ensure state is updated
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (error: any) {
      setErrors({ 
        loginId: '', 
        password: error.message || 'Invalid credentials. Please try again.' 
      });
      toast({
        title: 'Login Failed',
        description: error.message || 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate new password
    if (newPasswordData.newPassword.length < 8) {
      toast({
        title: 'Invalid Password',
        description: 'Password must be at least 8 characters long',
        variant: 'destructive',
      });
      return;
    }

    if (newPasswordData.newPassword !== newPasswordData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirm password must match',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Call login with new password
      await login(formData.loginId, newPasswordData.newPassword);
      
      toast({
        title: 'Password Changed Successfully!',
        description: 'You can now access your dashboard',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/5" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -left-32 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-4 shadow-lg"
            style={{ boxShadow: 'var(--shadow-glow)' }}
          >
            <Briefcase className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold gradient-text">
            {isFirstTimeLogin ? 'Change Password' : 'Welcome Back'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isFirstTimeLogin 
              ? 'Set your new password to continue' 
              : 'Sign in to continue to Dayflow'
            }
          </p>
        </div>

        <GlassCard className="p-8">
          {isFirstTimeLogin ? (
            /* Change Password Form */
            <>
              <div className="mb-6 p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div className="flex items-start gap-3">
                  <KeyRound className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-warning mb-1">First Time Login Detected</p>
                    <p className="text-xs text-warning/80">
                      A secure password has been auto-generated and filled below. You can use it or change it.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showNewPassword ? 'text' : 'password'}
                      placeholder="Enter new password"
                      className="pl-10 pr-10 bg-secondary/50 border-border focus:border-primary input-glow"
                      value={newPasswordData.newPassword}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, newPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      className="pl-10 pr-10 bg-secondary/50 border-border focus:border-primary input-glow"
                      value={newPasswordData.confirmPassword}
                      onChange={(e) => setNewPasswordData({ ...newPasswordData, confirmPassword: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Match Indicator */}
                {newPasswordData.newPassword && newPasswordData.confirmPassword && (
                  <div className="flex items-center gap-2 text-sm">
                    {newPasswordData.newPassword === newPasswordData.confirmPassword ? (
                      <>
                        <Check className="w-4 h-4 text-success" />
                        <span className="text-success">Passwords match</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <span className="text-destructive">Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}

                {/* Password Requirements */}
                <div className="p-3 rounded-lg bg-muted/50 space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground mb-2">Password Requirements:</p>
                  <div className="flex items-center gap-2 text-xs">
                    {newPasswordData.newPassword.length >= 8 ? (
                      <Check className="w-3 h-3 text-success" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-muted-foreground" />
                    )}
                    <span className={newPasswordData.newPassword.length >= 8 ? 'text-success' : 'text-muted-foreground'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {/[A-Z]/.test(newPasswordData.newPassword) ? (
                      <Check className="w-3 h-3 text-success" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-muted-foreground" />
                    )}
                    <span className={/[A-Z]/.test(newPasswordData.newPassword) ? 'text-success' : 'text-muted-foreground'}>
                      Contains uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    {/[0-9]/.test(newPasswordData.newPassword) ? (
                      <Check className="w-3 h-3 text-success" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-muted-foreground" />
                    )}
                    <span className={/[0-9]/.test(newPasswordData.newPassword) ? 'text-success' : 'text-muted-foreground'}>
                      Contains number
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full btn-primary-gradient h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Change Password & Continue
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </>
          ) : (
            /* Sign In Form */
            <>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Login ID or Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Login ID or Email</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Enter your Login ID or Email"
                      className={`pl-10 bg-secondary/50 border-border focus:border-primary input-glow ${
                        errors.loginId ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      value={formData.loginId}
                      onChange={(e) => {
                        setFormData({ ...formData, loginId: e.target.value });
                        setErrors({ ...errors, loginId: '' });
                      }}
                    />
                  </div>
                  {errors.loginId && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.loginId}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className={`pl-10 pr-10 bg-secondary/50 border-border focus:border-primary input-glow ${
                        errors.password ? 'border-destructive focus:border-destructive' : ''
                      }`}
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value });
                        setErrors({ ...errors, password: '' });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full btn-primary-gradient h-12 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Sign Up Link */}
              <p className="text-center mt-6 text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default SignIn;
