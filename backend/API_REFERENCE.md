# 🚀 DayFlow HR Suite - API Quick Reference

Base URL: `http://localhost:5000/api`

## 🔐 Authentication Required

All endpoints except `/auth/register`, `/auth/login`, `/auth/refresh`, `/auth/forgot-password`, and `/auth/reset-password/:token` require authentication.

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

## 📚 API Endpoints Reference

### 🔑 Authentication (`/api/auth`)

#### Register User
```http
POST /api/auth/register
```
**Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "employeeId": "EMP001",
  "role": "employee",
  "joiningDate": "2024-01-01"
}
```

#### Login
```http
POST /api/auth/login
```
**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Logout
```http
POST /api/auth/logout
```
**Headers:** Authorization required

#### Refresh Token
```http
POST /api/auth/refresh
```
**Body:**
```json
{
  "refreshToken": "your-refresh-token"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
```
**Body:**
```json
{
  "email": "john@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password/:token
```
**Body:**
```json
{
  "password": "newPassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
```
**Headers:** Authorization required

---

### 👥 Employees (`/api/employees`)

#### Get All Employees
```http
GET /api/employees?page=1&limit=10&search=john&department=IT&role=employee&status=active
```
**Query Params:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search by name, email, or employee ID
- `department` (optional): Filter by department ID
- `role` (optional): Filter by role (admin, hr, manager, employee)
- `status` (optional): Filter by employment status

#### Get Employee by ID
```http
GET /api/employees/:id
```

#### Create Employee
```http
POST /api/employees
```
**Roles:** Admin, HR only
**Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "password": "password123",
  "employeeId": "EMP002",
  "role": "employee",
  "department": "department-id",
  "position": "Software Engineer",
  "phoneNumber": "+1234567890",
  "dateOfBirth": "1990-01-01",
  "joiningDate": "2024-01-01",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "country": "USA"
  }
}
```

#### Update Employee
```http
PUT /api/employees/:id
```
**Body:** (all fields optional)
```json
{
  "firstName": "Jane",
  "position": "Senior Software Engineer",
  "phoneNumber": "+1234567890"
}
```

#### Delete Employee
```http
DELETE /api/employees/:id
```
**Roles:** Admin, HR only

#### Upload Profile Picture
```http
POST /api/employees/:id/upload-avatar
```
**Content-Type:** multipart/form-data
**Form Data:**
- `profilePicture`: Image file (JPEG, JPG, PNG)

#### Get Employee Statistics
```http
GET /api/employees/stats
```
**Roles:** Admin, HR only

---

### 📅 Leave Management (`/api/leaves`)

#### Apply for Leave
```http
POST /api/leaves
```
**Body:**
```json
{
  "leaveType": "casual",
  "startDate": "2024-02-01",
  "endDate": "2024-02-03",
  "duration": 3,
  "reason": "Personal reasons - family event"
}
```
**Leave Types:** sick, casual, vacation, unpaid, maternity, paternity

#### Get All Leaves
```http
GET /api/leaves?status=pending&page=1&limit=10&startDate=2024-01-01&endDate=2024-12-31
```
**Query Params:**
- `status` (optional): pending, approved, rejected, cancelled
- `page`, `limit`: Pagination
- `startDate`, `endDate`: Date range filter

#### Get Leave by ID
```http
GET /api/leaves/:id
```

#### Approve Leave
```http
PATCH /api/leaves/:id/approve
```
**Roles:** Manager, HR, Admin
**Body:**
```json
{
  "comments": "Approved for the requested dates"
}
```

#### Reject Leave
```http
PATCH /api/leaves/:id/reject
```
**Roles:** Manager, HR, Admin
**Body:**
```json
{
  "comments": "Insufficient leave balance"
}
```

#### Get Leave Balance
```http
GET /api/leaves/balance/:employeeId
```
**Note:** Employees can only view their own balance

#### Get Leave Calendar
```http
GET /api/leaves/calendar?startDate=2024-01-01&endDate=2024-12-31
```

---

### ⏰ Attendance (`/api/attendance`)

#### Check In
```http
POST /api/attendance/check-in
```
**Body:**
```json
{
  "location": "Office",
  "notes": "Early arrival"
}
```

#### Check Out
```http
POST /api/attendance/check-out
```

#### Get Attendance Records
```http
GET /api/attendance?employeeId=123&page=1&limit=10&startDate=2024-01-01&endDate=2024-01-31
```
**Query Params:**
- `employeeId` (optional): Filter by employee
- `page`, `limit`: Pagination
- `startDate`, `endDate`: Date range

#### Get Today's Attendance
```http
GET /api/attendance/today
```
**Roles:** Admin, HR only

#### Mark Attendance Manually
```http
POST /api/attendance/mark
```
**Roles:** Admin, HR only
**Body:**
```json
{
  "employee": "employee-id",
  "date": "2024-01-15",
  "checkIn": "2024-01-15T09:00:00Z",
  "checkOut": "2024-01-15T18:00:00Z",
  "status": "present",
  "location": "Office",
  "notes": "Manual entry"
}
```
**Status Options:** present, absent, late, half_day, remote

#### Get Attendance Report
```http
GET /api/attendance/report?startDate=2024-01-01&endDate=2024-01-31&employeeId=123
```
**Roles:** Admin, HR only

#### Get Employee Attendance
```http
GET /api/attendance/:employeeId?month=1&year=2024
```

---

### 💰 Payroll (`/api/payroll`)

#### Generate Payroll
```http
POST /api/payroll/generate
```
**Roles:** Admin, HR only
**Body:**
```json
{
  "employee": "employee-id",
  "month": 1,
  "year": 2024,
  "basicSalary": 50000,
  "allowances": [
    { "type": "HRA", "amount": 15000 },
    { "type": "Transport", "amount": 3000 }
  ],
  "deductions": [
    { "type": "PF", "amount": 5000 }
  ],
  "taxDeduction": 8000
}
```

#### Bulk Generate Payroll
```http
POST /api/payroll/bulk-generate
```
**Roles:** Admin, HR only
**Body:**
```json
{
  "month": 1,
  "year": 2024
}
```

#### Get All Payroll
```http
GET /api/payroll?page=1&limit=10
```
**Roles:** Admin, HR only

#### Get Payroll by ID
```http
GET /api/payroll/:id
```

#### Get Employee Payroll History
```http
GET /api/payroll/employee/:id
```

#### Update Payroll
```http
PUT /api/payroll/:id
```
**Roles:** Admin, HR only
**Body:** (fields to update)
```json
{
  "status": "paid",
  "paymentDate": "2024-01-31"
}
```

#### Get Payroll Statistics
```http
GET /api/payroll/stats?month=1&year=2024
```
**Roles:** Admin, HR only

---

## 📊 Response Formats

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message description"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

## 🔒 User Roles & Permissions

| Endpoint | Employee | Manager | HR | Admin |
|----------|----------|---------|-----|-------|
| View own data | ✅ | ✅ | ✅ | ✅ |
| View all employees | ❌ | ❌ | ✅ | ✅ |
| Create/Delete employees | ❌ | ❌ | ✅ | ✅ |
| Apply for leave | ✅ | ✅ | ✅ | ✅ |
| Approve/Reject leaves | ❌ | ✅ | ✅ | ✅ |
| Mark attendance | ✅ | ✅ | ✅ | ✅ |
| Manual attendance | ❌ | ❌ | ✅ | ✅ |
| View own payroll | ✅ | ✅ | ✅ | ✅ |
| Generate payroll | ❌ | ❌ | ✅ | ✅ |
| View reports | ❌ | ❌ | ✅ | ✅ |

---

## 🚨 Common Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request / Validation error |
| 401 | Unauthorized / Invalid token |
| 403 | Forbidden / Insufficient permissions |
| 404 | Resource not found |
| 429 | Too many requests / Rate limit exceeded |
| 500 | Internal server error |

---

## 💡 Tips

1. **Token Management:**
   - Access tokens expire in 15 minutes
   - Use refresh token to get new access token
   - Store refresh token securely (HTTP-only cookie recommended)

2. **Pagination:**
   - Default: page=1, limit=10
   - Maximum limit: 100 items per page

3. **Date Formats:**
   - Use ISO 8601 format: `YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ssZ`

4. **File Uploads:**
   - Maximum file size: 5MB (configurable)
   - Supported formats: JPEG, JPG, PNG, PDF, DOC, DOCX

5. **Rate Limiting:**
   - General API: 100 requests per 15 minutes
   - Authentication: 5 requests per 15 minutes
   - File uploads: 20 requests per hour

---

## 🧪 Testing with cURL

### Quick Test Flow
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@test.com","password":"test123","employeeId":"TEST001","joiningDate":"2024-01-01"}'

# 2. Login (save the token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 3. Get current user (use token from login)
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

**For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**
