/**
 * Domain-based routing:
 * - www.nyungafoundation.com → public site only
 * - data.nyungafoundation.com → admin app only
 * - localhost / preview → both (dev mode)
 */
export type AppMode = "public" | "admin" | "dev";

export function getAppMode(): AppMode {
  const host = window.location.hostname;

  if (host === "data.nyungafoundation.com") return "admin";
  if (
    host === "nyungafoundation.com" ||
    host === "www.nyungafoundation.com" ||
    host === "nyungafun.lovable.app"
  ) return "public";

  // Localhost, preview URLs, etc. → full access
  return "dev";
}

export function useAppMode(): AppMode {
  return getAppMode();
}
