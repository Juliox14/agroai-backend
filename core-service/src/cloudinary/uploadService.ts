import cloudinary from './config.js';
import streamifier from 'streamifier';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export const subirImagenCloudinary = (fileBuffer: Buffer, folderName: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folderName,
        // Forzamos optimización automática con IA de Cloudinary (q_auto)
        format: 'jpg',
        quality: 'auto'
      },
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );

    // Pipe conecta la memoria RAM (fileBuffer) directo con la subida a Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};