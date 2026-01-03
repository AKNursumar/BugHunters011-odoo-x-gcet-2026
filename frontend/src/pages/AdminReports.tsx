import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Clock,
  IndianRupee,
  Download,
  FileText,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { MetricCard } from '@/components/ui/MetricCard';
import { monthlyAttendance, departmentData, salaryDistribution, dashboardMetrics } from '@/data/dummyData';
import { useToast } from '@/hooks/use-toast';

const AdminReports = () => {
  const { toast } = useToast();

  const COLORS = ['#7c3aed', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6'];

  const handleDownload = (reportName: string) => {
    toast({
      title: 'Download Started',
      description: `${reportName} report is being generated...`,
    });
  };

  const reportsAvailable = [
    { name: 'Monthly Attendance Report', icon: Clock, type: 'PDF' },
    { name: 'Salary Summary Report', icon: IndianRupee, type: 'Excel' },
    { name: 'Leave Analysis Report', icon: Calendar, type: 'PDF' },
    { name: 'Department Wise Report', icon: Users, type: 'Excel' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into your organization</p>
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
            title="Avg. Attendance"
            value={dashboardMetrics.averageAttendance}
            suffix="%"
            icon={TrendingUp}
            delay={0.2}
            decimals={1}
          />
          <MetricCard
            title="Leave Requests"
            value={dashboardMetrics.pendingLeaves}
            suffix=" pending"
            icon={Calendar}
            delay={0.3}
          />
          <MetricCard
            title="Departments"
            value={dashboardMetrics.totalDepartments}
            icon={BarChart3}
            delay={0.4}
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Attendance Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Attendance Trend
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload('Attendance Trend')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={monthlyAttendance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="leave" name="Leave" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Department Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Department Distribution
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload('Department Distribution')}
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="name"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    labelLine={false}
                  >
                    {departmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        </div>

        {/* Salary Distribution & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Salary Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GlassCard className="p-6">
              <h3 className="font-display font-semibold flex items-center gap-2 mb-6">
                <IndianRupee className="w-5 h-5 text-primary" />
                Salary Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={salaryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    dataKey="value"
                    nameKey="name"
                  >
                    {salaryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Monthly Trend Line */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <GlassCard className="p-6">
              <h3 className="font-display font-semibold flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-primary" />
                Attendance Rate Trend
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={monthlyAttendance.map((m) => ({
                    ...m,
                    rate: Math.round((m.present / (m.present + m.absent + m.leave)) * 100),
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[80, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    name="Attendance %"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ fill: '#7c3aed', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        </div>

        {/* Available Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <GlassCard className="p-6">
            <h3 className="font-display font-semibold flex items-center gap-2 mb-6">
              <FileText className="w-5 h-5 text-primary" />
              Available Reports
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportsAvailable.map((report, index) => (
                <motion.div
                  key={report.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <report.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-xs text-muted-foreground">{report.type} format</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(report.name)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminReports;
