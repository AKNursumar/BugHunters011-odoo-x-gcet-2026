import User from '../models/User';
import crypto from 'crypto';
import { generateTokenPair } from '../utils/jwt';
import { sendPasswordResetEmail } from '../utils/email';
import { ErrorResponse } from '../middleware/errorMiddleware';
import { IUser } from '../types';

export class AuthService {
  // Register new user
  async register(userData: Partial<IUser>): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: userData.email }, { employeeId: userData.employeeId }],
    });

    if (existingUser) {
      throw new ErrorResponse('User already exists with this email or employee ID', 400);
    }

    // Create user
    const user = await User.create(userData);

    // Generate tokens
    const tokens = generateTokenPair({
      id: user._id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });

    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return { user, tokens };
  }

  // Login user
  async login(emailOrEmployeeId: string, password: string): Promise<{ user: IUser; tokens: { accessToken: string; refreshToken: string } }> {
    // Find user by email or employeeId with password
    const user = await User.findOne({
      $or: [{ email: emailOrEmployeeId }, { employeeId: emailOrEmployeeId }],
    }).select('+password');

    if (!user || !user.isActive) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    // Check password
    const isPasswordMatch = await user.comparePassword(password);

    if (!isPasswordMatch) {
      throw new ErrorResponse('Invalid credentials', 401);
    }

    // Generate tokens
    const tokens = generateTokenPair({
      id: user._id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });

    // Save refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    // Remove password from response
    user.password = undefined as any;

    return { user, tokens };
  }

  // Logout user
  async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }

  // Refresh token
  async refreshToken(userId: string, refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await User.findById(userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      throw new ErrorResponse('Invalid refresh token', 401);
    }

    // Generate new tokens
    const tokens = generateTokenPair({
      id: user._id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
    });

    // Update refresh token
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return tokens;
  }

  // Forgot password
  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new ErrorResponse('No user found with this email', 404);
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // Send email
    await sendPasswordResetEmail(user.email, resetToken);
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ErrorResponse('Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
  }

  // Get current user
  async getCurrentUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId).populate('department');

    if (!user) {
      throw new ErrorResponse('User not found', 404);
    }

    return user;
  }
}

export default new AuthService();
