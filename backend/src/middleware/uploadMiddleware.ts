import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { ErrorResponse } from './errorMiddleware';

// Configure storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  // Allowed extensions
  const allowedFileTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(
      new ErrorResponse(
        'Invalid file type. Only JPEG, PNG, PDF, DOC, DOCX files are allowed',
        400
      )
    );
  }
};

// Single file upload
export const uploadSingle = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter,
}).single('file');

// Multiple files upload
export const uploadMultiple = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB default
  },
  fileFilter,
}).array('files', 5); // Max 5 files

// Profile picture upload
export const uploadProfilePicture = multer({
  storage,
  limits: {
    fileSize: 2097152, // 2MB for profile pictures
  },
  fileFilter: (_req, file, cb) => {
    const allowedImageTypes = /jpeg|jpg|png/;
    const extname = allowedImageTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedImageTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new ErrorResponse(
          'Invalid file type. Only JPEG, JPG, PNG images are allowed',
          400
        )
      );
    }
  },
}).single('profilePicture');
