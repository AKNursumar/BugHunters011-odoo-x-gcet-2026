import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Clock,
  Calendar,
  TrendingUp,
  UserCheck,
  ArrowUpRight,
  Search,
  Filter,
  IndianRupee,
  Mail,
  Phone,
  Building2,
  MapPin,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { dashboardMetrics, employees, leaveRequests, User } from '@/data/dummyData';
import { Link, useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const pendingLeaves = leaveRequests.filter((l) => l.status === 'pending');

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your organization's workforce
          </p>
        </motion.div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Employees"
            value={dashboardMetrics.totalEmployees}
            icon={Users}
            delay={0.1}
            trend={{ value: 5.2, isPositive: true }}
          />
          <MetricCard
            title="Present Today"
            value={dashboardMetrics.presentToday}
            icon={UserCheck}
            delay={0.2}
          />
          <MetricCard
            title="On Leave"
            value={dashboardMetrics.onLeave}
            icon={Calendar}
            delay={0.3}
          />
          <MetricCard
            title="Attendance Rate"
            value={dashboardMetrics.averageAttendance}
            suffix="%"
            icon={TrendingUp}
            delay={0.4}
            decimals={1}
          />
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Leave Requests */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold">Pending Leaves</h3>
              <Link
                to="/admin/leave"
                className="text-primary text-sm flex items-center gap-1 hover:underline"
              >
                View all <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="space-y-3">
              {pendingLeaves.slice(0, 3).map((leave, index) => (
                <motion.div
                  key={leave.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                >
                  <div>
                    <p className="font-medium text-sm">{leave.employeeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {leave.startDate} - {leave.endDate}
                    </p>
                  </div>
                  <StatusChip status="pending" size="sm" />
                </motion.div>
              ))}
              {pendingLeaves.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pending requests
                </p>
              )}
            </div>
          </GlassCard>

          {/* Department Overview */}
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-4">Department Stats</h3>
            <div className="space-y-3">
              {[
                { name: 'Engineering', count: 45, color: 'bg-violet-500' },
                { name: 'Design', count: 18, color: 'bg-cyan-500' },
                { name: 'Marketing', count: 22, color: 'bg-emerald-500' },
                { name: 'Finance', count: 15, color: 'bg-amber-500' },
              ].map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-3 h-3 rounded-full ${dept.color}`} />
                  <span className="text-sm flex-1">{dept.name}</span>
                  <span className="text-sm font-medium">{dept.count}</span>
                </motion.div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Actions */}
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'View All Employees', to: '/admin/employees', icon: Users },
                { label: 'Attendance Report', to: '/admin/attendance', icon: Clock },
                { label: 'Leave Approvals', to: '/admin/leave', icon: Calendar },
                { label: 'View Analytics', to: '/admin/reports', icon: TrendingUp },
              ].map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={action.to}
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                  >
                    <action.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium">{action.label}</span>
                    <ArrowUpRight className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Employee List Preview */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Employee Overview</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64 bg-secondary/50 border-border"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/employees')}
                className="border-border"
              >
                View All
              </Button>
            </div>
          </div>

          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Employee</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Department</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Designation</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedEmployee(employee)}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={employee.avatar}
                            alt={employee.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                          />
                          <div>
                            <p className="font-medium">{employee.name}</p>
                            <p className="text-xs text-muted-foreground">{employee.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{employee.department}</td>
                      <td className="p-4 text-muted-foreground">{employee.designation}</td>
                      <td className="p-4">
                        <StatusChip status="present" size="sm" />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredEmployees.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No employees found matching "{searchQuery}"</p>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Employee Detail Modal */}
        <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Employee Details</DialogTitle>
              <DialogDescription>View complete information about this employee</DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-primary/20"
                  />
                  <div>
                    <h3 className="text-xl font-bold">{selectedEmployee.name}</h3>
                    <p className="text-primary">{selectedEmployee.designation}</p>
                    <p className="text-sm text-muted-foreground">{selectedEmployee.employeeId}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{selectedEmployee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <Phone className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{selectedEmployee.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <Building2 className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Department</p>
                      <p className="text-sm font-medium">{selectedEmployee.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Joining Date</p>
                      <p className="text-sm font-medium">{selectedEmployee.joiningDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 col-span-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm font-medium">{selectedEmployee.address}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center gap-2 mb-3">
                    <IndianRupee className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold">Salary Details</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Basic:</span>
                      <span>{formatCurrency(selectedEmployee.salary.basic)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">HRA:</span>
                      <span>{formatCurrency(selectedEmployee.salary.hra)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Allowances:</span>
                      <span>{formatCurrency(selectedEmployee.salary.allowances)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deductions:</span>
                      <span className="text-destructive">-{formatCurrency(selectedEmployee.salary.deductions)}</span>
                    </div>
                    <div className="flex justify-between col-span-2 pt-2 border-t border-border font-semibold">
                      <span>Net Salary:</span>
                      <span className="text-primary">
                        {formatCurrency(
                          selectedEmployee.salary.basic +
                            selectedEmployee.salary.hra +
                            selectedEmployee.salary.allowances -
                            selectedEmployee.salary.deductions
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
                Close
              </Button>
              <Button className="btn-primary-gradient" onClick={() => navigate('/admin/employees')}>
                View All Employees
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
