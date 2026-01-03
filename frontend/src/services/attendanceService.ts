import api, { handleApiError } from '@/lib/api';

export interface Attendance {
  _id: string;
  employee: string | any;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  status: 'present' | 'absent' | 'late' | 'half_day' | 'remote';
  location?: string;
  notes?: string;
  overtimeHours?: number;
  isManual: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceFilters {
  startDate?: Date;
  endDate?: Date;
  status?: string;
  page?: number;
  limit?: number;
}

class AttendanceService {
  async checkIn(location?: string, notes?: string) {
    try {
      const response = await api.post('/attendance/check-in', { location, notes });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async checkOut() {
    try {
      const response = await api.post('/attendance/check-out');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAttendanceRecords(filters?: AttendanceFilters, employeeId?: string) {
    try {
      const response = await api.get('/attendance', {
        params: { ...filters, employeeId },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAttendanceById(id: string): Promise<Attendance> {
    try {
      const response = await api.get(`/attendance/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getTodayAttendance() {
    try {
      const response = await api.get('/attendance/today');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateAttendance(id: string, data: Partial<Attendance>) {
    try {
      const response = await api.put(`/attendance/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async markAttendance(data: {
    employeeId: string;
    date: Date;
    checkIn?: Date;
    checkOut?: Date;
    status: string;
    location?: string;
    notes?: string;
  }) {
    try {
      const response = await api.post('/attendance/mark', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getAttendanceSummary(startDate?: Date, endDate?: Date) {
    try {
      const response = await api.get('/attendance/summary', {
        params: { startDate, endDate },
      });
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new AttendanceService();
