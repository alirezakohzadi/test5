/**
 * Central Media URL Utility
 * Transforms relative Django media paths (e.g. /media/products/a.webp)
 * into absolute backend origin URLs dynamically constructed from VITE_DJANGO_API_URL.
 */
export function getMediaUrl(path?: string | null): string {
  if (!path) return '';

  // Preserve absolute URLs, data URIs, or blob URIs
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const envUrl =
    typeof import.meta !== 'undefined' && import.meta.env
      ? import.meta.env.VITE_DJANGO_API_URL
      : undefined;

  const apiUrl =
    envUrl && envUrl.trim().length > 0
      ? envUrl.trim()
      : 'http://127.0.0.1:8000/api/v1';

  let origin = 'http://127.0.0.1:8000';
  try {
    origin = new URL(apiUrl).origin;
  } catch {
    const match = apiUrl.match(/^(https?:\/\/[^\/]+)/i);
    if (match) {
      origin = match[1];
    }
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${origin}${cleanPath}`;
}
