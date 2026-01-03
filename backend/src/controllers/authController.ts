import { Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import authService from '../services/authService';
import { AuthRequest, ApiResponse } from '../types';
import { verifyRefreshToken } from '../utils/jwt';

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public (or Admin only - depends on requirements)
export const register = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { user, tokens } = await authService.register(req.body);

    const response: ApiResponse = {
      success: true,
      data: {
        user,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
      message: 'User registered successfully',
    };

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json(response);
  }
);

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      console.log('Login attempt for:', email);

      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
        return;
      }

      // Support both email and employeeId for login
      const { user, tokens } = await authService.login(email, password);

      console.log('Login successful for user:', user.employeeId);

      const response: ApiResponse = {
        success: true,
        data: {
          user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        },
        message: 'Login successful',
      };

      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.status(200).json(response);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
);

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user) {
      await authService.logout(String(req.user.id));
    }

    res.clearCookie('refreshToken');

    const response: ApiResponse = {
      success: true,
      message: 'Logout successful',
    };

    res.status(200).json(response);
  }
);

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      res.status(401).json({
        success: false,
        error: 'Refresh token not provided',
      });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);
    const tokens = await authService.refreshToken(String(decoded.id), refreshToken);

    const response: ApiResponse = {
      success: true,
      data: tokens,
      message: 'Token refreshed successfully',
    };

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json(response);
  }
);

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { email } = req.body;

    await authService.forgotPassword(email);

    const response: ApiResponse = {
      success: true,
      message: 'Password reset email sent',
    };

    res.status(200).json(response);
  }
);

// @desc    Reset password
// @route   POST /api/auth/reset-password/:token
// @access  Public
export const resetPassword = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;

    await authService.resetPassword(token, password);

    const response: ApiResponse = {
      success: true,
      message: 'Password reset successful',
    };

    res.status(200).json(response);
  }
);

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await authService.getCurrentUser(String(req.user!.id));

    const response: ApiResponse = {
      success: true,
      data: user,
    };

    res.status(200).json(response);
  }
);
