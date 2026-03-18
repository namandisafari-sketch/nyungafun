const MEDIA_RESOLVE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/media-resolve`;

interface MediaResult {
  url: string;
  type: "image" | "video" | "document" | "audio";
  path: string;
  timestamp: number;
}

const cache = new Map<string, MediaResult>();

/**
 * Check if a string looks like a media prefix (e.g. Fig.IMG2.0.8, Fig.VID0.1.3)
 */
export function isMediaPrefix(value: string): boolean {
  return /^Fig\.\w+\d+\.\d+\.\d+$/.test(value);
}

/**
 * Resolve a media prefix to a full URL via the media-resolve edge function.
 * Results are cached in memory.
 */
export async function resolveMediaPrefix(prefix: string): Promise<MediaResult | null> {
  if (cache.has(prefix)) {
    return cache.get(prefix)!;
  }

  try {
    const resp = await fetch(MEDIA_RESOLVE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ prefix }),
    });

    if (!resp.ok) return null;

    const data: MediaResult = await resp.json();
    cache.set(prefix, data);
    return data;
  } catch {
    return null;
  }
}

/**
 * Resolve a URL-like value: if it's a media prefix, resolve it; otherwise return as-is.
 */
export async function resolveMediaUrl(value: string | null | undefined): Promise<string | null> {
  if (!value) return null;
  if (isMediaPrefix(value)) {
    const result = await resolveMediaPrefix(value);
    return result?.url ?? null;
  }
  return value;
}
