export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  bytes: number;
}

export const CLOUDINARY_CONFIG = {
  cloudName: (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined) || 'mkvbfqvh',
  uploadPreset: (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined) || 'nihongo_preset',
};

/**
 * Uploads a file (image or video) directly to Cloudinary using an unsigned upload preset.
 * Works seamlessly client-side on Vercel without requiring a backend server.
 */
export async function uploadToCloudinary(file: File): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/auto/upload`;

  const res = await fetch(endpoint, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => null);
    const msg = errData?.error?.message || `Lỗi tải lên Cloudinary (${res.status})`;
    throw new Error(msg);
  }

  const data = await res.json();
  return {
    url: data.secure_url || data.url,
    secure_url: data.secure_url || data.url,
    public_id: data.public_id,
    format: data.format,
    resource_type: data.resource_type,
    bytes: data.bytes,
  };
}
