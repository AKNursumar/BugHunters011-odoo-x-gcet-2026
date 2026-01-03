import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest, JwtPayload, UserRole } from '../types';

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          error: 'User not found or inactive',
        });
        return;
      }

      // Attach user to request
      req.user = {
        id: user._id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId,
      };

      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        error: 'Invalid or expired token',
      });
      return;
    }
  } catch (error) {
    next(error);
  }
};

// Authorize specific roles
export const authorize = (...roles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Not authenticated',
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `Role '${req.user.role}' is not authorized to access this route`,
      });
      return;
    }

    next();
  };
};

// Check if user owns the resource or is admin/HR
export const authorizeOwnerOrAdmin = (resourceField: string = 'employee') => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Not authenticated',
        });
        return;
      }

      // Admin and HR can access all resources
      if (
        req.user.role === UserRole.ADMIN ||
        req.user.role === UserRole.HR
      ) {
        next();
        return;
      }

      // Check if user owns the resource
      const resourceId =
        req.params[resourceField] || req.body[resourceField] || req.params.id;

      if (resourceId && resourceId.toString() === req.user.id) {
        next();
        return;
      }

      res.status(403).json({
        success: false,
        error: 'Not authorized to access this resource',
      });
    } catch (error) {
      next(error);
    }
  };
};
