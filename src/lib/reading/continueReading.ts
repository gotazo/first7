export interface ContinueReading {
  title: string;
  description: string;
  url: string;
  category?: string;
  lastRead: string;
}

const STORAGE_KEY = "continue-reading";

/**
 * Validate persisted data before it is used to render reader-facing UI.
 * Only same-origin-style absolute paths are accepted; protocol-relative URLs
 * such as //example.com are deliberately rejected.
 */
export function isContinueReading(value: unknown): value is ContinueReading {
  if (!value || typeof value !== "object") {
    return false;
  }

  const reading = value as Partial<ContinueReading>;
  const timestamp = typeof reading.lastRead === "string"
    ? Date.parse(reading.lastRead)
    : Number.NaN;

  return typeof reading.title === "string"
    && reading.title.trim().length > 0
    && typeof reading.description === "string"
    && typeof reading.url === "string"
    && reading.url.startsWith("/")
    && !reading.url.startsWith("//")
    && Number.isFinite(timestamp)
    && (reading.category === undefined || typeof reading.category === "string");
}

/** Save the current reading item. Returns false when browser storage is unavailable. */
export function saveContinueReading(
  data: Omit<ContinueReading, "lastRead">,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const reading: ContinueReading = {
    ...data,
    lastRead: new Date().toISOString(),
  };

  if (!isContinueReading(reading)) {
    return false;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reading));
    return true;
  } catch {
    // Private browsing, user settings, or storage quotas can make storage fail.
    return false;
  }
}

/** Get the last reading item, ignoring unavailable or invalid persisted data. */
export function getContinueReading(): ContinueReading | null {
  if (typeof window === "undefined") {
    return null;
  }

  let stored: string | null;
  try {
    stored = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }

  if (!stored) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(stored);
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Invalid data is ignored even if it cannot be removed.
    }
    return null;
  }

  if (isContinueReading(parsed)) {
    return parsed;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Invalid data is ignored even if it cannot be removed.
  }
  return null;
}

/** Remove the saved reading item. Returns false when browser storage is unavailable. */
export function clearContinueReading(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
