import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, XCircle, Clock, MessageSquare, Send } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import leaveService from '@/services/leaveService';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const AdminLeave = () => {
  const { toast } = useToast();
  const [leaveRequests, setLeaveRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null);
  const [adminComment, setAdminComment] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      setIsLoading(true);
      const response = await leaveService.getLeaveRequests();
      setLeaveRequests(response.data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching leave requests',
        description: error.message || 'Failed to load leave requests',
        variant: 'destructive',
      });
      setLeaveRequests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = leaveRequests.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const pendingCount = leaveRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = leaveRequests.filter((r) => r.status === 'approved').length;
  const rejectedCount = leaveRequests.filter((r) => r.status === 'rejected').length;

  const openActionModal = (request: any, action: 'approve' | 'reject') => {
    setSelectedRequest(request);
    setActionType(action);
    setAdminComment('');
  };

  const handleAction = async () => {
    if (!selectedRequest || !actionType) return;

    try {
      if (actionType === 'approve') {
        await leaveService.approveLeave(selectedRequest._id, adminComment);
      } else {
        await leaveService.rejectLeave(selectedRequest._id, adminComment);
      }

      toast({
        title: actionType === 'approve' ? 'Leave Approved' : 'Leave Rejected',
        description: `${selectedRequest.user?.firstName}'s leave request has been ${actionType === 'approve' ? 'approved' : 'rejected'}.`,
      });

      // Refresh leave requests
      fetchLeaveRequests();
      
      setSelectedRequest(null);
      setActionType(null);
      setAdminComment('');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || `Failed to ${actionType} leave request`,
        variant: 'destructive',
      });
    }
  };

  const getDaysDiff = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold">Leave Approvals</h1>
          <p className="text-muted-foreground">Manage employee leave requests</p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <GlassCard
            className={`p-4 cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setFilter('all')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{leaveRequests.length}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard
            className={`p-4 cursor-pointer transition-all ${filter === 'pending' ? 'ring-2 ring-warning' : ''}`}
            onClick={() => setFilter('pending')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Clock className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-warning">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard
            className={`p-4 cursor-pointer transition-all ${filter === 'approved' ? 'ring-2 ring-success' : ''}`}
            onClick={() => setFilter('approved')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <CheckCircle2 className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-success">{approvedCount}</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard
            className={`p-4 cursor-pointer transition-all ${filter === 'rejected' ? 'ring-2 ring-destructive' : ''}`}
            onClick={() => setFilter('rejected')}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <XCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">{rejectedCount}</p>
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Leave Requests List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold">
                {filter === 'all' ? 'All Requests' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Requests`}
              </h3>
            </div>
            <div className="divide-y divide-border/50">
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No {filter === 'all' ? '' : filter} leave requests found</p>
                </div>
              ) : (
                filteredRequests.map((request, index) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-primary/10">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">
                              {request.user?.firstName} {request.user?.lastName}
                            </span>
                            <StatusChip status={request.status} size="sm" />
                          </div>
                          <p className="text-sm text-muted-foreground capitalize mb-1">
                            {request.type} Leave • {getDaysDiff(request.startDate, request.endDate)} day(s)
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.startDate).toLocaleDateString()} to {new Date(request.endDate).toLocaleDateString()}
                          </p>
                          <p className="text-sm mt-2">{request.reason}</p>
                          {request.comments && (
                            <div className="mt-2 p-2 rounded-lg bg-secondary/50 text-sm">
                              <span className="text-muted-foreground">Admin: </span>
                              {request.comments}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-auto lg:ml-0">
                        {request.status === 'pending' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-success text-success hover:bg-success/10"
                              onClick={() => openActionModal(request, 'approve')}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-destructive text-destructive hover:bg-destructive/10"
                              onClick={() => openActionModal(request, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        <p className="text-xs text-muted-foreground">Applied: {request.appliedOn}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </GlassCard>
        </motion.div>

        {/* Action Modal */}
        <Dialog open={!!selectedRequest && !!actionType} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {actionType === 'approve' ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                {actionType === 'approve' ? 'Approve Leave' : 'Reject Leave'}
              </DialogTitle>
              <DialogDescription>
                {actionType === 'approve'
                  ? `Approve ${selectedRequest?.employeeName}'s leave request?`
                  : `Reject ${selectedRequest?.employeeName}'s leave request?`}
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-secondary/30">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Employee:</span>
                      <p className="font-medium">
                        {selectedRequest.user?.firstName} {selectedRequest.user?.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Type:</span>
                      <p className="font-medium capitalize">{selectedRequest.type} Leave</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Duration:</span>
                      <p className="font-medium">
                        {getDaysDiff(selectedRequest.startDate, selectedRequest.endDate)} day(s)
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Dates:</span>
                      <p className="font-medium">
                        {selectedRequest.startDate} - {selectedRequest.endDate}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className="text-muted-foreground text-sm">Reason:</span>
                    <p className="text-sm">{selectedRequest.reason}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Add Comment (Optional)
                  </label>
                  <Textarea
                    placeholder={
                      actionType === 'approve'
                        ? 'e.g., Enjoy your time off!'
                        : 'e.g., Project deadline approaching, please reschedule...'
                    }
                    value={adminComment}
                    onChange={(e) => setAdminComment(e.target.value)}
                    className="bg-secondary/50"
                  />
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                Cancel
              </Button>
              <Button
                className={
                  actionType === 'approve'
                    ? 'bg-success hover:bg-success/90'
                    : 'bg-destructive hover:bg-destructive/90'
                }
                onClick={handleAction}
              >
                <Send className="w-4 h-4 mr-2" />
                {actionType === 'approve' ? 'Approve' : 'Reject'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminLeave;
