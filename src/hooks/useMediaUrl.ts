import { useState, useEffect } from "react";
import { resolveMediaUrl, isMediaPrefix } from "@/lib/mediaResolver";

/**
 * Hook to resolve a media URL. If the value is a media prefix (e.g. Fig.IMG2.0.8),
 * it resolves it via the media server. Otherwise returns the value as-is.
 */
export function useMediaUrl(value: string | null | undefined): {
  url: string | null;
  loading: boolean;
} {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!value) {
      setUrl(null);
      return;
    }

    if (!isMediaPrefix(value)) {
      setUrl(value);
      return;
    }

    setLoading(true);
    resolveMediaUrl(value)
      .then((resolved) => setUrl(resolved))
      .finally(() => setLoading(false));
  }, [value]);

  return { url, loading };
}
