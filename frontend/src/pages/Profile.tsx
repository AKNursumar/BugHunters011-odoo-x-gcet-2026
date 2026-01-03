import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Building2,
  Calendar,
  Edit2,
  Save,
  X,
  FileText,
  IndianRupee,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'job' | 'salary' | 'documents'>('personal');
  const [editData, setEditData] = useState({
    phone: user?.phone || '',
    address: user?.address || '',
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSave = () => {
    // Simulate save
    toast({
      title: 'Profile updated!',
      description: 'Your changes have been saved successfully.',
    });
    setIsEditing(false);
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'job', label: 'Job Details', icon: Briefcase },
    { id: 'salary', label: 'Salary', icon: IndianRupee },
    { id: 'documents', label: 'Documents', icon: FileText },
  ];

  const documents = [
    { name: 'Employment Contract', type: 'PDF', date: '2022-03-15' },
    { name: 'ID Proof', type: 'PDF', date: '2022-03-10' },
    { name: 'Address Proof', type: 'PDF', date: '2022-03-10' },
    { name: 'Tax Declaration', type: 'PDF', date: '2025-04-01' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <GlassCard className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar with Glow */}
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="avatar-glow"
                >
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-background"
                  />
                </motion.div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground">
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Info */}
              <div className="text-center md:text-left flex-1">
                <h1 className="font-display text-2xl font-bold">{user?.name}</h1>
                <p className="text-primary font-medium">{user?.designation}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {user?.department}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(user?.joiningDate || '').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(false)}
                      className="border-border"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="btn-primary-gradient"
                      onClick={handleSave}
                    >
                      <Save className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-border"
                  >
                    <Edit2 className="w-4 h-4 mr-1" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-2">
            <div className="flex flex-wrap gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'personal' && (
            <GlassCard className="p-6">
              <h3 className="font-display text-lg font-semibold mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </label>
                  <Input value={user?.name} disabled className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <Input value={user?.email} disabled className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Input
                    value={isEditing ? editData.phone : user?.phone}
                    onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                    disabled={!isEditing}
                    className={isEditing ? 'bg-background' : 'bg-secondary/50'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Employee ID
                  </label>
                  <Input value={user?.employeeId} disabled className="bg-secondary/50" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Address
                  </label>
                  <Input
                    value={isEditing ? editData.address : user?.address}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                    disabled={!isEditing}
                    className={isEditing ? 'bg-background' : 'bg-secondary/50'}
                  />
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'job' && (
            <GlassCard className="p-6">
              <h3 className="font-display text-lg font-semibold mb-6">Job Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Designation</label>
                  <Input value={user?.designation} disabled className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Department</label>
                  <Input value={user?.department} disabled className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Employee Type</label>
                  <Input value="Full-time" disabled className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Joining Date</label>
                  <Input value={user?.joiningDate} disabled className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Reporting Manager</label>
                  <Input value="Sarah Mitchell" disabled className="bg-secondary/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Work Location</label>
                  <Input value="Mumbai, India" disabled className="bg-secondary/50" />
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'salary' && (
            <GlassCard className="p-6">
              <h3 className="font-display text-lg font-semibold mb-6">Salary Structure</h3>
              <div className="space-y-4">
                {[
                  { label: 'Basic Salary', value: user?.salary?.basic || 0 },
                  { label: 'HRA', value: user?.salary?.hra || 0 },
                  { label: 'Allowances', value: user?.salary?.allowances || 0 },
                  { label: 'Deductions', value: user?.salary?.deductions || 0, isNegative: true },
                ].map((item, index) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30"
                  >
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={`font-semibold ${item.isNegative ? 'text-destructive' : ''}`}>
                      {item.isNegative ? '-' : ''}{formatCurrency(item.value)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="font-semibold">Net Salary</span>
                  <span className="font-bold text-xl text-primary">
                    {formatCurrency(
                      (user?.salary?.basic || 0) +
                      (user?.salary?.hra || 0) +
                      (user?.salary?.allowances || 0) -
                      (user?.salary?.deductions || 0)
                    )}
                  </span>
                </div>
              </div>
            </GlassCard>
          )}

          {activeTab === 'documents' && (
            <GlassCard className="p-6">
              <h3 className="font-display text-lg font-semibold mb-6">Documents</h3>
              <div className="space-y-3">
                {documents.map((doc, index) => (
                  <motion.div
                    key={doc.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.type} • Uploaded {doc.date}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      View
                    </Button>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
