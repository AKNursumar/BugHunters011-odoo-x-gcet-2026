import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

// Send email
export const sendEmail = async (options: EmailOptions): Promise<void> => {
  const mailOptions = {
    from: `DayFlow HR <${process.env.EMAIL_FROM}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
  };

  await transporter.sendMail(mailOptions);
};

// Send welcome email
export const sendWelcomeEmail = async (
  email: string,
  name: string,
  employeeId: string,
  temporaryPassword: string
): Promise<void> => {
  const html = `
    <h1>Welcome to DayFlow HR Suite!</h1>
    <p>Hi ${name},</p>
    <p>Your account has been created successfully.</p>
    <p><strong>Employee ID:</strong> ${employeeId}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Temporary Password:</strong> ${temporaryPassword}</p>
    <p>Please change your password after your first login.</p>
    <p>Login at: ${process.env.FRONTEND_URL}/signin</p>
    <br>
    <p>Best regards,<br>DayFlow HR Team</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Welcome to DayFlow HR Suite',
    html,
  });
};

// Send password reset email
export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const html = `
    <h1>Password Reset Request</h1>
    <p>You requested a password reset.</p>
    <p>Click the link below to reset your password:</p>
    <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
    <p>This link will expire in 1 hour.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <br>
    <p>Best regards,<br>DayFlow HR Team</p>
  `;

  await sendEmail({
    to: email,
    subject: 'Password Reset Request',
    html,
  });
};

// Send leave approval/rejection email
export const sendLeaveStatusEmail = async (
  email: string,
  name: string,
  leaveType: string,
  status: string,
  comments?: string
): Promise<void> => {
  const statusText = status === 'approved' ? 'Approved' : 'Rejected';
  const color = status === 'approved' ? '#10B981' : '#EF4444';

  const html = `
    <h1>Leave Request ${statusText}</h1>
    <p>Hi ${name},</p>
    <p>Your <strong>${leaveType}</strong> leave request has been <span style="color: ${color}; font-weight: bold;">${statusText}</span>.</p>
    ${comments ? `<p><strong>Comments:</strong> ${comments}</p>` : ''}
    <p>Login to view more details: ${process.env.FRONTEND_URL}/dashboard</p>
    <br>
    <p>Best regards,<br>DayFlow HR Team</p>
  `;

  await sendEmail({
    to: email,
    subject: `Leave Request ${statusText}`,
    html,
  });
};

// Send payroll notification
export const sendPayrollEmail = async (
  email: string,
  name: string,
  month: string,
  year: number,
  netSalary: number
): Promise<void> => {
  const html = `
    <h1>Payroll Processed</h1>
    <p>Hi ${name},</p>
    <p>Your payroll for <strong>${month} ${year}</strong> has been processed.</p>
    <p><strong>Net Salary:</strong> ₹${netSalary.toLocaleString()}</p>
    <p>Login to download your payslip: ${process.env.FRONTEND_URL}/payroll</p>
    <br>
    <p>Best regards,<br>DayFlow HR Team</p>
  `;

  await sendEmail({
    to: email,
    subject: `Payroll Processed - ${month} ${year}`,
    html,
  });
};
