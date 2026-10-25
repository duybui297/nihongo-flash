/**
 * Utilities for handling images, videos, and thumbnail extraction
 */

/**
 * Reads a File object into a Data URL (base64)
 */
export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses an image data URL if it exceeds max dimension
 */
export async function optimizeImageDataUrl(
  dataUrl: string,
  maxWidth: number = 1200,
  maxHeight: number = 1200,
  quality: number = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let { width, height } = img;
      if (width <= maxWidth && height <= maxHeight) {
        resolve(dataUrl);
        return;
      }

      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

/**
 * Extracts a frame from a video file or object URL to use as thumbnail
 */
export async function extractVideoThumbnail(
  videoSource: File | string,
  seekTime: number = 1.0
): Promise<string | null> {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'metadata';

    let objectUrl: string | null = null;
    if (typeof videoSource === 'string') {
      video.src = videoSource;
    } else {
      objectUrl = URL.createObjectURL(videoSource);
      video.src = objectUrl;
    }

    const cleanup = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      video.remove();
    };

    const captureFrame = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          cleanup();
          resolve(null);
          return;
        }

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        cleanup();
        resolve(dataUrl);
      } catch (err) {
        console.warn('Could not extract video frame (cross-origin or unsupported codec):', err);
        cleanup();
        resolve(null);
      }
    };

    video.onloadedmetadata = () => {
      const targetTime = Math.min(seekTime, (video.duration || 2) / 2);
      video.currentTime = targetTime;
    };

    video.onseeked = () => {
      captureFrame();
    };

    video.onerror = () => {
      cleanup();
      resolve(null);
    };

    // Timeout fallback in case video never seeks
    setTimeout(() => {
      if (video.videoWidth > 0) {
        captureFrame();
      } else {
        cleanup();
        resolve(null);
      }
    }, 4000);
  });
}

/**
 * Check whether a string looks like a video URL
 */
export function isVideoUrl(url?: string): boolean {
  if (!url) return false;
  if (url.startsWith('data:video/')) return true;
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url) || url.includes('youtube.com') || url.includes('youtu.be');
}

/**
 * Check whether a string looks like an image URL
 */
export function isImageUrl(url?: string): boolean {
  if (!url) return false;
  if (url.startsWith('data:image/')) return true;
  return /\.(jpg|jpeg|png|webp|gif|svg|avif)(\?.*)?$/i.test(url);
}
