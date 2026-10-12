import { v2 as cloudinary } from 'cloudinary';
import { config, cloudinaryEnabled } from './env.js';

if (cloudinaryEnabled) {
  cloudinary.config({
    cloud_name: config.cloudinary.cloudName,
    api_key: config.cloudinary.apiKey,
    api_secret: config.cloudinary.apiSecret,
    secure: true
  });
}

// Netlify's proxy has a hard ~30s limit, so an upload that reaches Cloudinary
// has to complete well under that. 20s leaves room for the round trip.
const UPLOAD_TIMEOUT_MS = 20000;

export { cloudinaryEnabled };

export const uploadImage = async (dataUrl) => {
  const result = await cloudinary.uploader.upload(dataUrl, {
    folder: config.cloudinary.folder,
    resource_type: 'image',
    // EXIF is stripped and delivery is optimised automatically by Cloudinary
    timeout: UPLOAD_TIMEOUT_MS
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    width: result.width,
    height: result.height
  };
};

// Deletion failures must never block removing the database record, otherwise
// the admin gets a stuck item they cannot clear.
export const deleteImage = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error(`[cloudinary] Failed to delete ${publicId}: ${error.message}`);
    return false;
  }
};

export default cloudinary;
