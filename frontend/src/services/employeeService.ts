import api, { handleApiError } from '@/lib/api';

export interface Employee {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  role: string;
  department?: string;
  position?: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  joiningDate: Date;
  employmentStatus: string;
  profilePicture?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

class EmployeeService {
  async getAllEmployees(filters?: EmployeeFilters) {
    try {
      const response = await api.get('/employees', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getEmployeeById(id: string): Promise<Employee> {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async createEmployee(data: Partial<Employee>) {
    try {
      const response = await api.post('/employees', data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async updateEmployee(id: string, data: Partial<Employee>) {
    try {
      const response = await api.put(`/employees/${id}`, data);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async deleteEmployee(id: string) {
    try {
      const response = await api.delete(`/employees/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async uploadProfilePicture(id: string, file: File) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.post(`/employees/${id}/profile-picture`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }

  async getEmployeeStats() {
    try {
      const response = await api.get('/employees/stats');
      return response.data.data;
    } catch (error) {
      throw new Error(handleApiError(error));
    }
  }
}

export default new EmployeeService();
