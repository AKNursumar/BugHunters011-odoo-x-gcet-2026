import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, LogIn, LogOut, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatusChip } from '@/components/ui/StatusChip';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { AttendanceRecord } from '@/data/dummyData';
import attendanceService from '@/services/attendanceService';

// Persist check-in state in localStorage
const CHECKIN_KEY = 'dayflow_checkin_state';
const ATTENDANCE_KEY = 'dayflow_attendance_records';

interface CheckInState {
  isCheckedIn: boolean;
  checkInTime: string | null;
  date: string;
}

const Attendance = () => {
  const { toast } = useToast();
  const [view, setView] = useState<'daily' | 'weekly'>('daily');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch attendance records from MongoDB
  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getAttendanceRecords();
      const records = response.data.map((record: any) => ({
        id: record._id,
        date: new Date(record.date).toISOString().split('T')[0],
        checkIn: record.checkIn ? new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
        checkOut: record.checkOut ? new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : null,
        status: record.status,
        workHours: record.overtimeHours || 0,
      }));
      setAttendanceRecords(records);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check today's attendance status
  const [checkInState, setCheckInState] = useState<CheckInState>({
    isCheckedIn: false,
    checkInTime: null,
    date: today,
  });

  useEffect(() => {
    const todayRecord = attendanceRecords.find(r => r.date === today);
    if (todayRecord && todayRecord.checkIn && !todayRecord.checkOut) {
      setCheckInState({
        isCheckedIn: true,
        checkInTime: todayRecord.checkIn,
        date: today,
      });
    }
  }, [attendanceRecords, today]);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      await attendanceService.checkIn();
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      setCheckInState({
        isCheckedIn: true,
        checkInTime: time,
        date: today,
      });
      
      await fetchAttendanceRecords();
      
      toast({
        title: 'Checked In!',
        description: `You checked in at ${time}`,
      });
    } catch (error: any) {
      toast({
        title: 'Check-in Failed',
        description: error.message || 'Failed to check in',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      await attendanceService.checkOut();
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      setCheckInState({
        isCheckedIn: false,
        checkInTime: null,
        date: today,
      });
      
      await fetchAttendanceRecords();
      
      toast({
        title: 'Checked Out!',
        description: `You checked out at ${time}`,
      });
    } catch (error: any) {
      toast({
        title: 'Check-out Failed',
        description: error.message || 'Failed to check out',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate full year calendar
  const generateYearCalendar = () => {
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const firstDay = new Date(currentYear, month, 1);
      const lastDay = new Date(currentYear, month + 1, 0);
      const days = [];

      // Add empty cells for days before the first day of the month
      for (let i = 0; i < firstDay.getDay(); i++) {
        days.push(null);
      }

      // Add days of the month
      for (let i = 1; i <= lastDay.getDate(); i++) {
        const dateStr = `${currentYear}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const record = attendanceRecords.find((r) => r.date === dateStr);
        const currentDate = new Date();
        const isToday = dateStr === today;
        const isPast = new Date(dateStr) < currentDate && !isToday;
        
        days.push({
          day: i,
          date: dateStr,
          status: record?.status || (isPast ? 'present' : null),
          isToday,
          isWeekend: new Date(dateStr).getDay() === 0 || new Date(dateStr).getDay() === 6,
        });
      }

      months.push({
        name: new Date(currentYear, month).toLocaleDateString('en-US', { month: 'short' }),
        fullName: new Date(currentYear, month).toLocaleDateString('en-US', { month: 'long' }),
        month,
        days,
      });
    }

    return months;
  };

  const yearCalendar = generateYearCalendar();

  // Filter records based on view
  const getDisplayRecords = () => {
    if (view === 'daily') {
      return attendanceRecords.slice(0, 7);
    } else {
      // Weekly view - show current week's records
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return attendanceRecords.filter((r) => {
        const d = new Date(r.date);
        return d >= weekStart && d <= weekEnd;
      });
    }
  };

  const displayRecords = getDisplayRecords();

  const changeYear = (direction: 'prev' | 'next') => {
    setCurrentYear((prev) => prev + (direction === 'prev' ? -1 : 1));
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'present':
        return 'bg-success';
      case 'absent':
        return 'bg-destructive';
      case 'half-day':
        return 'bg-warning';
      case 'leave':
        return 'bg-accent';
      default:
        return '';
    }
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
            <h1 className="font-display text-2xl font-bold">Attendance</h1>
            <p className="text-muted-foreground">Track your daily attendance and work hours</p>
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

        {/* Check In/Out Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground mb-1">Current Status</p>
                <div className="flex items-center gap-3">
                  <StatusChip status={checkInState.isCheckedIn ? 'present' : 'absent'} />
                  <span className="text-2xl font-display font-bold">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                {checkInState.isCheckedIn && checkInState.checkInTime && (
                  <p className="text-xs text-primary mt-1">
                    Checked in at {checkInState.checkInTime}
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleCheckIn}
                  disabled={checkInState.isCheckedIn}
                  className={`${checkInState.isCheckedIn ? 'opacity-50' : 'btn-primary-gradient'}`}
                  size="lg"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Check In
                </Button>
                <Button
                  onClick={handleCheckOut}
                  disabled={!checkInState.isCheckedIn}
                  variant="outline"
                  size="lg"
                  className={`border-border ${!checkInState.isCheckedIn ? 'opacity-50' : ''}`}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Check Out
                </Button>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Year Calendar View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {currentYear} Attendance Calendar
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => changeYear('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium w-16 text-center">{currentYear}</span>
                <Button variant="ghost" size="sm" onClick={() => changeYear('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Year Calendar Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {yearCalendar.map((monthData) => (
                <div key={monthData.name} className="space-y-2">
                  <p className="text-sm font-semibold text-center">{monthData.fullName}</p>
                  <div className="grid grid-cols-7 gap-1">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <div key={i} className="text-center text-[10px] text-muted-foreground font-medium">
                        {day}
                      </div>
                    ))}
                    {monthData.days.map((day, index) => (
                      <div
                        key={index}
                        className={`aspect-square flex flex-col items-center justify-center rounded text-[10px] transition-all ${
                          day
                            ? day.isToday
                              ? 'bg-primary/20 border border-primary font-bold'
                              : day.isWeekend
                              ? 'text-muted-foreground/50'
                              : 'hover:bg-secondary/50'
                            : ''
                        }`}
                        title={day?.date}
                      >
                        {day && (
                          <>
                            <span className={day.isToday ? 'text-primary' : ''}>{day.day}</span>
                            {day.status && (
                              <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${getStatusColor(day.status)}`} />
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-border">
              {[
                { status: 'Present', color: 'bg-success' },
                { status: 'Absent', color: 'bg-destructive' },
                { status: 'Half Day', color: 'bg-warning' },
                { status: 'Leave', color: 'bg-accent' },
              ].map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-sm text-muted-foreground">{item.status}</span>
                </div>
              ))}
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
                {view === 'daily' ? 'Recent Attendance' : "This Week's Attendance"}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check In</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Check Out</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Work Hours</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {displayRecords.map((record, index) => (
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
                      <td className="p-4 text-muted-foreground">
                        {record.workHours ? `${record.workHours} hrs` : '-'}
                      </td>
                      <td className="p-4">
                        <StatusChip status={record.status} />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            {displayRecords.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No attendance records found</p>
              </div>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Attendance;
