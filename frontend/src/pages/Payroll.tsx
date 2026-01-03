import { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Download, ChevronLeft, ChevronRight, FileText, Building2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Payroll = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const netSalary =
    (user?.salary.basic || 0) +
    (user?.salary.hra || 0) +
    (user?.salary.allowances || 0) -
    (user?.salary.deductions || 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownload = () => {
    toast({
      title: 'Download started',
      description: 'Your salary slip is being downloaded...',
    });
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
  };

  const salaryHistory = [
    { month: 'December 2025', amount: netSalary, status: 'Paid' },
    { month: 'November 2025', amount: netSalary - 500, status: 'Paid' },
    { month: 'October 2025', amount: netSalary, status: 'Paid' },
    { month: 'September 2025', amount: netSalary + 1000, status: 'Paid' },
    { month: 'August 2025', amount: netSalary, status: 'Paid' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold">Payroll</h1>
          <p className="text-muted-foreground">View your salary details and download payslips</p>
        </motion.div>

        {/* Month Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => changeMonth('prev')}
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-display text-lg font-semibold">
                {months[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
              </h2>
              <button
                onClick={() => changeMonth('next')}
                className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Salary Slip Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="overflow-hidden">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg">Dayflow Inc.</h3>
                    <p className="text-sm text-muted-foreground">Salary Slip for {months[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}</p>
                  </div>
                </div>
                <Button onClick={handleDownload} variant="outline" className="border-border">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {/* Employee Info */}
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-border">
              <div>
                <p className="text-xs text-muted-foreground">Employee Name</p>
                <p className="font-medium">{user?.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Employee ID</p>
                <p className="font-medium">{user?.employeeId}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="font-medium">{user?.department}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Designation</p>
                <p className="font-medium">{user?.designation}</p>
              </div>
            </div>

            {/* Salary Breakdown */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Earnings */}
                <div>
                  <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    Earnings
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Basic Salary', value: user?.salary.basic || 0 },
                      { label: 'House Rent Allowance', value: user?.salary.hra || 0 },
                      { label: 'Other Allowances', value: user?.salary.allowances || 0 },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                      >
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="font-medium">{formatCurrency(item.value)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-success/10 border border-success/20">
                      <span className="font-medium">Total Earnings</span>
                      <span className="font-bold text-success">
                        {formatCurrency(
                          (user?.salary.basic || 0) +
                          (user?.salary.hra || 0) +
                          (user?.salary.allowances || 0)
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deductions */}
                <div>
                  <h4 className="font-display font-semibold mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-destructive" />
                    Deductions
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Income Tax', value: (user?.salary.deductions || 0) * 0.6 },
                      { label: 'Provident Fund', value: (user?.salary.deductions || 0) * 0.3 },
                      { label: 'Professional Tax', value: (user?.salary.deductions || 0) * 0.1 },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
                      >
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="font-medium text-destructive">
                          -{formatCurrency(item.value)}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <span className="font-medium">Total Deductions</span>
                      <span className="font-bold text-destructive">
                        -{formatCurrency(user?.salary.deductions || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Salary */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20 border border-primary/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Net Salary</p>
                    <p className="text-4xl font-display font-bold gradient-text">
                      {formatCurrency(netSalary)}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-primary/10">
                    <IndianRupee className="w-10 h-10 text-primary" />
                  </div>
                </div>
              </motion.div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Salary History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="p-4 border-b border-border">
              <h3 className="font-display font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Salary History
              </h3>
            </div>
            <div className="divide-y divide-border/50">
              {salaryHistory.map((record, index) => (
                <motion.div
                  key={record.month}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IndianRupee className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{record.month}</p>
                      <p className="text-sm text-muted-foreground">{record.status}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(record.amount)}</p>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
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

export default Payroll;
