import { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Search, Edit2, Save, X, Download, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { employees as initialEmployees, User } from '@/data/dummyData';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

const AdminPayroll = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<User[]>(initialEmployees);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [editingSalary, setEditingSalary] = useState({
    basic: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
  });
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const getNetSalary = (emp: User) => {
    return emp.salary.basic + emp.salary.hra + emp.salary.allowances - emp.salary.deductions;
  };

  const totalPayroll = employees.reduce((acc, emp) => acc + getNetSalary(emp), 0);

  const openEditModal = (emp: User) => {
    setSelectedEmployee(emp);
    setEditingSalary({ ...emp.salary });
  };

  const handleSave = () => {
    if (!selectedEmployee) return;

    setEmployees((prev) =>
      prev.map((e) =>
        e.id === selectedEmployee.id
          ? { ...e, salary: editingSalary }
          : e
      )
    );

    toast({
      title: 'Salary Updated',
      description: `${selectedEmployee.name}'s salary has been updated successfully.`,
    });

    setSelectedEmployee(null);
  };

  const handleDownloadPayslip = (emp: User) => {
    toast({
      title: 'Download Started',
      description: `Generating payslip for ${emp.name}...`,
    });
  };

  const changeMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedMonth);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setSelectedMonth(newDate);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-2xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Manage employee salaries and payslips</p>
        </motion.div>

        {/* Month Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={() => changeMonth('prev')}>
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="font-display text-lg font-semibold">
                {months[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
              </h2>
              <Button variant="ghost" onClick={() => changeMonth('next')}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </GlassCard>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <IndianRupee className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Payroll</p>
                <p className="text-2xl font-bold">{formatCurrency(totalPayroll)}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-success/10">
                <Users className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employees</p>
                <p className="text-2xl font-bold">{employees.length}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-cyan-500/10">
                <IndianRupee className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Salary</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(Math.round(totalPayroll / employees.length))}
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, ID, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50 border-border"
            />
          </div>
        </motion.div>

        {/* Payroll Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Employee</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Department</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Basic</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">HRA</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Allowances</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Deductions</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Net Salary</th>
                    <th className="text-center p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp, index) => (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{emp.name}</p>
                            <p className="text-xs text-muted-foreground">{emp.employeeId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{emp.department}</td>
                      <td className="p-4 text-right">{formatCurrency(emp.salary.basic)}</td>
                      <td className="p-4 text-right">{formatCurrency(emp.salary.hra)}</td>
                      <td className="p-4 text-right">{formatCurrency(emp.salary.allowances)}</td>
                      <td className="p-4 text-right text-destructive">
                        -{formatCurrency(emp.salary.deductions)}
                      </td>
                      <td className="p-4 text-right font-semibold text-primary">
                        {formatCurrency(getNetSalary(emp))}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(emp)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadPayslip(emp)}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* Edit Salary Modal */}
        <Dialog open={!!selectedEmployee} onOpenChange={() => setSelectedEmployee(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" />
                Edit Salary Structure
              </DialogTitle>
              <DialogDescription>
                Update salary details for {selectedEmployee?.name}
              </DialogDescription>
            </DialogHeader>

            {selectedEmployee && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
                  <img
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium">{selectedEmployee.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedEmployee.designation} • {selectedEmployee.department}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Basic Salary (₹)</label>
                    <Input
                      type="number"
                      value={editingSalary.basic}
                      onChange={(e) =>
                        setEditingSalary({ ...editingSalary, basic: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">HRA (₹)</label>
                    <Input
                      type="number"
                      value={editingSalary.hra}
                      onChange={(e) =>
                        setEditingSalary({ ...editingSalary, hra: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Allowances (₹)</label>
                    <Input
                      type="number"
                      value={editingSalary.allowances}
                      onChange={(e) =>
                        setEditingSalary({ ...editingSalary, allowances: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Deductions (₹)</label>
                    <Input
                      type="number"
                      value={editingSalary.deductions}
                      onChange={(e) =>
                        setEditingSalary({ ...editingSalary, deductions: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Net Salary</span>
                    <span className="text-xl font-bold text-primary">
                      {formatCurrency(
                        editingSalary.basic +
                          editingSalary.hra +
                          editingSalary.allowances -
                          editingSalary.deductions
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedEmployee(null)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button className="btn-primary-gradient" onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default AdminPayroll;
