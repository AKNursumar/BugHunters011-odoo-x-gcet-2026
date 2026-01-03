import api, { handleApiError } from '@/lib/api';

export interface Leave {
  _id: string;
  employee: string | any;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  duration: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approver?: string | any;
  approverComments?: string;
  appliedAt: Date;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeaveFilters {
  status?: string;
  leaveType?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface LeaveBalance {
  _id: string;
  employee: string;
  year: number;
  leaveType: string;
  totalLeaves: number;
  usedLeaves: number;
  remainingLeaves: number;
}

class LeaveService {
  async applyLeave(data: Partial<Leave>) {
    try {
      const response = await api.post('/leaves/apply', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAllLeaves(filters?: LeaveFilters) {
    try {
      const response = await api.get('/leaves', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getLeaveById(id: string): Promise<Leave> {
    try {
      const response = await api.get(`/leaves/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async approveLeave(id: string, comments?: string) {
    try {
      const response = await api.put(`/leaves/${id}/approve`, { comments });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async rejectLeave(id: string, comments?: string) {
    try {
      const response = await api.put(`/leaves/${id}/reject`, { comments });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async cancelLeave(id: string) {
    try {
      const response = await api.put(`/leaves/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getLeaveBalance(employeeId?: string) {
    try {
      const url = employeeId ? `/leaves/balance/${employeeId}` : '/leaves/balance';
      const response = await api.get(url);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new LeaveService();
