import { v2 as cloudinary } from 'cloudinary';
import { ErrorResponse } from '../middleware/errorMiddleware';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload file to Cloudinary
export const uploadToCloudinary = async (
  file: Express.Multer.File,
  folder: string = 'dayflow-hr'
): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
          allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
        },
        (error, result) => {
          if (error) {
            reject(new ErrorResponse('File upload failed', 500));
          } else if (result) {
            resolve(result.secure_url);
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  } catch (error) {
    throw new ErrorResponse('File upload failed', 500);
  }
};

// Upload multiple files
export const uploadMultipleToCloudinary = async (
  files: Express.Multer.File[],
  folder: string = 'dayflow-hr'
): Promise<string[]> => {
  try {
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file, folder)
    );
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new ErrorResponse('Multiple file upload failed', 500);
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (
  publicId: string
): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new ErrorResponse('File deletion failed', 500);
  }
};

// Extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
};
