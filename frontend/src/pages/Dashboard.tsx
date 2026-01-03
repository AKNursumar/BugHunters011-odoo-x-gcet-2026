import { motion } from 'framer-motion';
import {
  User,
  Clock,
  Calendar,
  DollarSign,
  Bell,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { MetricCard } from '@/components/ui/MetricCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { useAuth } from '@/contexts/AuthContext';
import { recentActivities, attendanceRecords } from '@/data/dummyData';

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    { icon: User, label: 'My Profile', to: '/profile', color: 'bg-violet-500/10 text-violet-400' },
    { icon: Clock, label: 'Attendance', to: '/attendance', color: 'bg-cyan-500/10 text-cyan-400' },
    { icon: Calendar, label: 'Leave', to: '/leave', color: 'bg-emerald-500/10 text-emerald-400' },
    { icon: DollarSign, label: 'Payroll', to: '/payroll', color: 'bg-amber-500/10 text-amber-400' },
  ];

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
  const presentDays = attendanceRecords.filter((r) => r.status === 'present').length;
  const totalWorkHours = attendanceRecords.reduce((acc, r) => acc + r.workHours, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Hero Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-primary/20 via-primary/10 to-accent/10 border border-primary/20"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-primary mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span className="text-sm font-medium">You're checked in</span>
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold mb-2">
              Good morning, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Ready to make today productive? Here's your work overview.
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-20 w-32 h-32 bg-accent/10 rounded-full blur-2xl" />
        </motion.div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Present Days"
            value={presentDays}
            suffix=" days"
            icon={CheckCircle2}
            delay={0.1}
          />
          <MetricCard
            title="Work Hours"
            value={totalWorkHours}
            suffix=" hrs"
            icon={Clock}
            delay={0.2}
            decimals={1}
          />
          <MetricCard
            title="Leave Balance"
            value={12}
            suffix=" days"
            icon={Calendar}
            delay={0.3}
          />
          <MetricCard
            title="This Month"
            value={94.5}
            suffix="%"
            icon={TrendingUp}
            delay={0.4}
            trend={{ value: 2.5, isPositive: true }}
          />
        </div>

        {/* Quick Actions & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link to={action.to}>
                    <GlassCard
                      hover3D
                      glow
                      className="p-6 text-center group cursor-pointer"
                    >
                      <div
                        className={`w-14 h-14 rounded-xl ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <action.icon className="w-7 h-7" />
                      </div>
                      <p className="font-medium text-sm">{action.label}</p>
                      <ArrowRight className="w-4 h-4 mx-auto mt-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </GlassCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-xl font-semibold">Recent Activity</h2>
              <Bell className="w-5 h-5 text-muted-foreground" />
            </div>
            <GlassCard className="p-4">
              <div className="space-y-4">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(activity.timestamp).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Today's Attendance */}
        <div>
          <h2 className="font-display text-xl font-semibold mb-4">This Week's Attendance</h2>
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check In</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check Out</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Hours</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.slice(0, 5).map((record, index) => (
                    <motion.tr
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-4 font-medium">
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="p-4 text-muted-foreground">{record.checkIn || '-'}</td>
                      <td className="p-4 text-muted-foreground">{record.checkOut || '-'}</td>
                      <td className="p-4 text-muted-foreground">{record.workHours || '-'} hrs</td>
                      <td className="p-4">
                        <StatusChip status={record.status} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
