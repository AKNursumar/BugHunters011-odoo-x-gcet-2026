import api, { handleApiError } from '@/lib/api';

export interface Payroll {
  _id: string;
  employee: string | any;
  month: number;
  year: number;
  basicSalary: number;
  allowances: Array<{ type: string; amount: number }>;
  deductions: Array<{ type: string; amount: number }>;
  grossSalary: number;
  taxDeduction: number;
  netSalary: number;
  paymentDate?: Date;
  status: 'pending' | 'processed' | 'paid' | 'failed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PayrollFilters {
  month?: number;
  year?: number;
  status?: string;
  employeeId?: string;
  page?: number;
  limit?: number;
}

class PayrollService {
  async getAllPayrolls(filters?: PayrollFilters) {
    try {
      const response = await api.get('/payroll', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getPayrollById(id: string): Promise<Payroll> {
    try {
      const response = await api.get(`/payroll/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async createPayroll(data: Partial<Payroll>) {
    try {
      const response = await api.post('/payroll', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updatePayroll(id: string, data: Partial<Payroll>) {
    try {
      const response = await api.put(`/payroll/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async processPayroll(id: string) {
    try {
      const response = await api.post(`/payroll/${id}/process`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async generatePayslip(id: string) {
    try {
      const response = await api.get(`/payroll/${id}/payslip`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getPayrollSummary(month?: number, year?: number) {
    try {
      const response = await api.get('/payroll/summary', {
        params: { month, year },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new PayrollService();
