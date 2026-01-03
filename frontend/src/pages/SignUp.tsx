import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Building2, Upload, User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Check, X, CheckCircle, Users, Shield } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const SignUp = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedLoginId, setGeneratedLoginId] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [registrationType, setRegistrationType] = useState<'company' | 'employee'>('company');
  const [formData, setFormData] = useState({
    companyName: '',
    companyLogo: null as File | null,
    companyCode: '', // For employee registration
    name: '',
    email: '',
    phone: '',
    designation: '', // For employee registration
    department: '', // For employee registration
    password: '',
    confirmPassword: '',
  });

  const passwordRules = [
    { label: 'At least 8 characters', valid: formData.password.length >= 8 },
    { label: 'Contains uppercase letter', valid: /[A-Z]/.test(formData.password) },
    { label: 'Contains lowercase letter', valid: /[a-z]/.test(formData.password) },
    { label: 'Contains number', valid: /\d/.test(formData.password) },
    { label: 'Contains special character', valid: /[!@#$%^&*]/.test(formData.password) },
  ];

  const generateLoginId = (companyName: string, fullName: string, isEmployee: boolean = false) => {
    if (!fullName) return '';

    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts[nameParts.length - 1] || '';

    let companyCode = '';
    
    if (isEmployee && formData.companyCode) {
      // For employees, use the company code they provide
      companyCode = formData.companyCode.toUpperCase().substring(0, 4);
    } else if (companyName) {
      // For company/HR registration, generate from company name
      const companyWords = companyName.trim().split(' ');
      companyCode = companyWords
        .map(word => word.substring(0, 2).toUpperCase())
        .join('')
        .substring(0, 4); // Max 4 characters
    }

    // First 2 letters of first and last name
    const firstNameCode = firstName.substring(0, 2).toUpperCase();
    const lastNameCode = lastName.substring(0, 2).toUpperCase();

    // Current year
    const year = new Date().getFullYear();

    // Mock serial number (in real app, this would come from backend)
    const serialNo = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');

    return `${companyCode}${firstNameCode}${lastNameCode}${year}${serialNo}`;
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, companyLogo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'Password and Confirm Password must match',
        variant: 'destructive',
      });
      return;
    }

    // Validate password rules
    const allRulesValid = passwordRules.every(rule => rule.valid);
    if (!allRulesValid) {
      toast({
        title: 'Invalid password',
        description: 'Please ensure your password meets all requirements',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Split name into firstName and lastName
      const nameParts = formData.name.trim().split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || nameParts[0]; // If no last name, use first name

      // Generate Login ID (employeeId)
      const employeeId = generateLoginId(
        formData.companyName, 
        formData.name, 
        registrationType === 'employee'
      );

      // Prepare registration data
      const registrationData = {
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        employeeId,
        role: registrationType === 'company' ? 'hr' : 'employee',
        phoneNumber: formData.phone || undefined,
        position: formData.designation || undefined,
        department: formData.department || undefined,
        joiningDate: new Date(),
      };

      // Call API to register user
      await register(registrationData);

      // Show generated login ID
      setGeneratedLoginId(employeeId);

      toast({
        title: 'Registration Successful!',
        description: `Your account has been created with Login ID: ${employeeId}`,
      });
    } catch (error: any) {
      toast({
        title: 'Registration Failed',
        description: error.message || 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl relative z-10"
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
            {registrationType === 'company' ? 'Create Admin Account' : 'Employee Registration'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {registrationType === 'company' 
              ? "Set up your company's HR management system" 
              : 'Join your company on Dayflow HRMS'}
          </p>
        </div>

        {generatedLoginId ? (
          /* Success Screen */
          <GlassCard className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-success" />
            </motion.div>
            
            <h2 className="text-2xl font-bold mb-2">Account Created Successfully!</h2>
            <p className="text-muted-foreground mb-6">
              Your {registrationType === 'company' ? 'admin' : 'employee'} account has been set up
            </p>

            <div className="p-6 rounded-xl bg-primary/10 border border-primary/20 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Your Login ID</p>
              <p className="text-2xl font-bold text-primary font-mono">{generatedLoginId}</p>
              <p className="text-xs text-muted-foreground mt-3">
                Please save this Login ID. You'll need it to sign in.
              </p>
            </div>

            <div className="space-y-2 text-sm text-left mb-6 p-4 rounded-lg bg-muted/50">
              <p className="font-medium">Login ID Format:</p>
              <ul className="space-y-1 text-muted-foreground ml-4">
                <li>• <strong>{generatedLoginId.substring(0, 4)}</strong> - Company Code</li>
                <li>• <strong>{generatedLoginId.substring(4, 6)}</strong> - First Name Initials</li>
                <li>• <strong>{generatedLoginId.substring(6, 8)}</strong> - Last Name Initials</li>
                <li>• <strong>{generatedLoginId.substring(8, 12)}</strong> - Year of Joining</li>
                <li>• <strong>{generatedLoginId.substring(12)}</strong> - Serial Number</li>
              </ul>
            </div>

            <Button
              onClick={() => navigate('/signin')}
              className="w-full btn-primary-gradient h-12 text-base"
            >
              Continue to Sign In
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </GlassCard>
        ) : (
          /* Sign Up Form */
          <GlassCard className="p-8">
            {/* Registration Type Selector */}
            <div className="mb-6">
              <label className="text-sm font-medium mb-3 block">Registration Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRegistrationType('company')}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    registrationType === 'company'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <Shield className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium block">Company / HR</span>
                  <span className="text-xs opacity-75">Create organization</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRegistrationType('employee')}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    registrationType === 'employee'
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
                  }`}
                >
                  <Users className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium block">Employee</span>
                  <span className="text-xs opacity-75">Join organization</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {registrationType === 'company' ? (
                /* Company/HR Registration Fields */
                <>
                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Name</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your company name"
                        className="pl-10 bg-secondary/50 border-border focus:border-primary input-glow"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  {/* Company Logo */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Logo (Optional)</label>
                    <div className="flex items-center gap-4">
                      {logoPreview && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-border">
                          <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-border hover:border-primary transition-colors bg-secondary/50">
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formData.companyLogo ? formData.companyLogo.name : 'Click to upload logo'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                /* Employee Registration Fields */
                <>
                  {/* Company Code */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Company Code</label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Enter your company code (e.g., TECH)"
                        className="pl-10 bg-secondary/50 border-border focus:border-primary input-glow uppercase"
                        value={formData.companyCode}
                        onChange={(e) => setFormData({ ...formData, companyCode: e.target.value.toUpperCase() })}
                        maxLength={4}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Ask your HR for the company code</p>
                  </div>
                </>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 bg-secondary/50 border-border focus:border-primary input-glow"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              {/* Company Logo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Logo (Optional)</label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                      id="logo-upload"
                    />
                    <label
                      htmlFor="logo-upload"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-secondary/50 border border-border hover:border-primary cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Choose File</span>
                    </label>
                  </div>
                  {logoPreview && (
                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                      <img src={logoPreview} alt="Logo preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  {formData.companyLogo && (
                    <span className="text-sm text-muted-foreground">{formData.companyLogo.name}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      className="pl-10 bg-secondary/50 border-border focus:border-primary input-glow"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="john@company.com"
                      className="pl-10 bg-secondary/50 border-border focus:border-primary input-glow"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Employee-specific fields */}
              {registrationType === 'employee' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Designation */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Designation</label>
                    <Input
                      type="text"
                      placeholder="e.g., Software Engineer"
                      className="bg-secondary/50 border-border focus:border-primary input-glow"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      required
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Input
                      type="text"
                      placeholder="e.g., Engineering"
                      className="bg-secondary/50 border-border focus:border-primary input-glow"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Phone */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    className="pl-10 bg-secondary/50 border-border focus:border-primary input-glow"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-secondary/50 border-border focus:border-primary input-glow"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="pl-10 pr-10 bg-secondary/50 border-border focus:border-primary input-glow"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
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
              </div>

              {/* Password Rules */}
              {formData.password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-4 rounded-lg bg-muted/50 space-y-2"
                >
                  <p className="text-xs font-medium text-muted-foreground mb-2">Password Requirements:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {passwordRules.map((rule, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        {rule.valid ? (
                          <Check className="w-3.5 h-3.5 text-success flex-shrink-0" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        )}
                        <span className={rule.valid ? 'text-success' : 'text-muted-foreground'}>
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

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
                    Sign Up
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <p className="text-center mt-6 text-muted-foreground">
              Already have an account?{' '}
              <Link to="/signin" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </GlassCard>
        )}
      </motion.div>
    </div>
  );
};

export default SignUp;
