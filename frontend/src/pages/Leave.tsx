import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Send, Clock, FileText, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import leaveService from '@/services/leaveService';
import { LeaveRequest } from '@/data/dummyData';

const Leave = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    type: 'sick' as 'sick' | 'casual' | 'vacation',
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await leaveService.getLeaveRequests();
      setMyLeaves(response.data);
    } catch (error) {
      console.error('Failed to fetch leaves:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await leaveService.applyLeave({
        leaveType: formData.type,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
        reason: formData.reason,
      });

      toast({
        title: 'Leave request submitted!',
        description: 'Your request is pending approval.',
      });

      await fetchLeaveRequests();
      setShowApplyForm(false);
      setFormData({ type: 'sick', startDate: '', endDate: '', reason: '' });
    } catch (error: any) {
      toast({
        title: 'Failed to submit leave request',
        description: error.message || 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const leaveBalance = [
    { type: 'Paid Leave', total: 15, used: 3, remaining: 12, color: 'bg-emerald-500' },
    { type: 'Sick Leave', total: 10, used: 2, remaining: 8, color: 'bg-amber-500' },
    { type: 'Unpaid Leave', total: 5, used: 0, remaining: 5, color: 'bg-violet-500' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="font-display text-2xl font-bold">Leave Management</h1>
            <p className="text-muted-foreground">Apply for leave and track your requests</p>
          </div>
          <Button
            onClick={() => setShowApplyForm(true)}
            className="btn-primary-gradient"
          >
            <Plus className="w-5 h-5 mr-2" />
            Apply for Leave
          </Button>
        </motion.div>

        {/* Leave Balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {leaveBalance.map((leave, index) => (
              <GlassCard key={leave.type} className="p-6" hover3D>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-sm text-muted-foreground">{leave.type}</h3>
                  <div className={`w-3 h-3 rounded-full ${leave.color}`} />
                </div>
                <div className="text-3xl font-display font-bold mb-2">{leave.remaining}</div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Used: {leave.used}</span>
                  <span>Total: {leave.total}</span>
                </div>
                <div className="mt-3 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(leave.remaining / leave.total) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className={`h-full ${leave.color}`}
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </motion.div>

        {/* Apply Form Modal */}
        {showApplyForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <GlassCard className="w-full max-w-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-xl font-bold">Apply for Leave</h2>
                  <button
                    onClick={() => setShowApplyForm(false)}
                    className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Leave Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Leave Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['paid', 'sick', 'unpaid'] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData({ ...formData, type })}
                          className={`p-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                            formData.type === type
                              ? 'border-primary bg-primary/10 text-primary'
                              : 'border-border bg-secondary/50 text-muted-foreground hover:border-primary/50'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Start Date</label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="bg-secondary/50 border-border"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">End Date</label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        className="bg-secondary/50 border-border"
                        required
                      />
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason</label>
                    <Textarea
                      placeholder="Describe your reason for leave..."
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      className="bg-secondary/50 border-border min-h-[100px]"
                      required
                    />
                  </div>

                  {/* Submit */}
                  <Button
                    type="submit"
                    className="w-full btn-primary-gradient"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Submit Request
                      </>
                    )}
                  </Button>
                </form>
              </GlassCard>
            </motion.div>
          </motion.div>
        )}

        {/* Leave Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                My Leave Requests
              </h3>
            </div>
            <div className="divide-y divide-border/50">
              {myLeaves.map((leave, index) => (
                <motion.div
                  key={leave.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium capitalize">{leave.type} Leave</span>
                          <StatusChip status={leave.status} size="sm" />
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {leave.startDate} to {leave.endDate}
                        </p>
                        <p className="text-sm text-muted-foreground">{leave.reason}</p>
                        {leave.adminComment && (
                          <div className="mt-2 p-2 rounded-lg bg-secondary/50">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Admin:</span> {leave.adminComment}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Applied on {leave.appliedOn}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Leave;
