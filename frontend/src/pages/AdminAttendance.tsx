import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, Calendar, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import attendanceService from '@/services/attendanceService';
import employeeService from '@/services/employeeService';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EmployeeAttendance {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'remote';
  workHours?: number;
}

const AdminAttendance = () => {
  const { toast } = useToast();
  const [allRecords, setAllRecords] = useState<EmployeeAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [view, setView] = useState<'daily' | 'weekly'>('daily');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchAttendanceRecords();
  }, [selectedDate, view]);

  const fetchAttendanceRecords = async () => {
    try {
      setIsLoading(true);
      let startDate, endDate;

      if (view === 'daily') {
        startDate = endDate = selectedDate;
      } else {
        const weekStart = new Date(selectedDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        startDate = weekStart.toISOString().split('T')[0];
        endDate = weekEnd.toISOString().split('T')[0];
      }

      const response = await attendanceService.getAttendanceRecords({
        startDate,
        endDate,
      });

      setAllRecords(response.data || []);
    } catch (error: any) {
      toast({
        title: 'Error fetching attendance',
        description: error.message || 'Failed to load attendance records',
        variant: 'destructive',
      });
      setAllRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Get records based on view
  const filteredRecords = useMemo(() => {
    let records = allRecords;
    
    if (view === 'daily') {
      records = records.filter((r) => r.date === selectedDate);
    } else {
      // Get records for current week
      const weekStart = new Date(selectedDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      records = records.filter((r) => {
        const d = new Date(r.date);
        return d >= weekStart && d <= weekEnd;
      });
    }
    
    if (searchQuery) {
      records = records.filter((r) =>
        `${r.user?.firstName} ${r.user?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.user?.employeeId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return records;
  }, [allRecords, selectedDate, view, searchQuery]);

  // Stats for selected date/week
  // Map API status values to StatusChip compatible values
  const mapStatus = (status: string): 'present' | 'absent' | 'half-day' | 'leave' | 'pending' | 'approved' | 'rejected' => {
    const statusMap: Record<string, 'present' | 'absent' | 'half-day' | 'leave' | 'pending' | 'approved' | 'rejected'> = {
      'half_day': 'half-day',
      'remote': 'leave',
      'late': 'present',
    };
    return (statusMap[status] || status) as 'present' | 'absent' | 'half-day' | 'leave' | 'pending' | 'approved' | 'rejected';
  };

  const stats = useMemo(() => {
    const dateRecords = allRecords.filter((r) => r.date.startsWith(selectedDate));
    return {
      total: allRecords.length,
      present: dateRecords.filter((r) => r.status === 'present').length,
      absent: dateRecords.filter((r) => r.status === 'absent').length,
      leave: dateRecords.filter((r) => r.status === 'remote').length,
      halfDay: dateRecords.filter((r) => r.status === 'half_day').length,
    };
  }, [allRecords, selectedDate]);

  // Generate year calendar
  const generateYearCalendar = () => {
    const months = [];
    const year = currentMonth.getFullYear();
    
    for (let month = 0; month < 12; month++) {
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const days = [];
      
      // Add empty cells for days before first day of month
      for (let i = 0; i < firstDay.getDay(); i++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dayRecords = allRecords.filter((r) => r.date === dateStr);
        const presentCount = dayRecords.filter((r) => r.status === 'present').length;
        const totalCount = dayRecords.length || 1;
        const attendanceRate = (presentCount / Math.max(totalCount, 1)) * 100;
        
        days.push({
          day: i,
          date: dateStr,
          attendanceRate,
          isToday: dateStr === new Date().toISOString().split('T')[0],
          isWeekend: new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6,
        });
      }
      
      months.push({
        name: new Date(year, month).toLocaleDateString('en-US', { month: 'short' }),
        days,
      });
    }
    
    return months;
  };

  const yearCalendar = generateYearCalendar();

  const changeYear = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(newDate.getFullYear() + (direction === 'prev' ? -1 : 1));
    setCurrentMonth(newDate);
  };

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
            <h1 className="font-display text-2xl font-bold">Attendance Management</h1>
            <p className="text-muted-foreground">Track and manage employee attendance</p>
          </div>
          <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg">
            <button
              onClick={() => setView('daily')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'daily' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setView('weekly')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'weekly' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              Weekly
            </button>
          </div>
        </motion.div>

        {/* Date Selector & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4"
        >
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto bg-secondary/50 border-border"
          />
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50 border-border"
            />
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-bold text-success">{stats.present}</p>
            <p className="text-sm text-muted-foreground">Present</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-bold text-destructive">{stats.absent}</p>
            <p className="text-sm text-muted-foreground">Absent</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-bold text-warning">{stats.halfDay}</p>
            <p className="text-sm text-muted-foreground">Half Day</p>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <p className="text-2xl font-bold text-accent">{stats.leave}</p>
            <p className="text-sm text-muted-foreground">On Leave</p>
          </GlassCard>
        </motion.div>

        {/* Year Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {currentMonth.getFullYear()} Attendance Overview
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => changeYear('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => changeYear('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {yearCalendar.map((month) => (
                <div key={month.name} className="space-y-1">
                  <p className="text-sm font-medium text-center mb-2">{month.name}</p>
                  <div className="grid grid-cols-7 gap-0.5 text-[10px]">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                      <div key={i} className="text-center text-muted-foreground">
                        {d}
                      </div>
                    ))}
                    {month.days.map((day, i) => (
                      <div
                        key={i}
                        className={`aspect-square flex items-center justify-center rounded text-[9px] ${
                          day
                            ? day.isToday
                              ? 'bg-primary text-primary-foreground font-bold'
                              : day.isWeekend
                              ? 'text-muted-foreground/50'
                              : day.attendanceRate > 80
                              ? 'bg-success/20'
                              : day.attendanceRate > 50
                              ? 'bg-warning/20'
                              : 'bg-destructive/20'
                            : ''
                        }`}
                        title={day ? `${day.date}: ${day.attendanceRate.toFixed(0)}% attendance` : ''}
                      >
                        {day?.day}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 pt-4 border-t border-border text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-success/20" />
                <span>&gt;80% Present</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-warning/20" />
                <span>50-80% Present</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-destructive/20" />
                <span>&lt;50% Present</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Attendance Records Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {view === 'daily' ? 'Daily' : 'Weekly'} Attendance Records
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Employee</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check In</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check Out</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Hours</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center">
                        <div className="flex items-center justify-center">
                          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                          <span className="ml-3 text-muted-foreground">Loading attendance...</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.slice(0, 20).map((record, index) => (
                      <motion.tr
                        key={record._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="p-4 font-medium">
                          {record.user?.firstName} {record.user?.lastName}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {new Date(record.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '-'}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {record.workHours ? `${record.workHours.toFixed(1)} hrs` : '-'}
                        </td>
                        <td className="p-4">
                          <StatusChip status={mapStatus(record.status)} size="sm" />
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {!isLoading && filteredRecords.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No attendance records found for the selected criteria</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAttendance;
