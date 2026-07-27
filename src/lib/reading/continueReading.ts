export interface ContinueReading {
  title: string;
  description: string;
  url: string;
  category?: string;
  lastRead: string;
}

const STORAGE_KEY = "continue-reading";

/**
 * Save the current reading item.
 */
export function saveContinueReading(
  data: Omit<ContinueReading, "lastRead">
) {
  if (typeof window === "undefined") {
    return;
  }

  const reading: ContinueReading = {
    ...data,
    lastRead: new Date().toISOString(),
  };

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(reading)
  );
}

/**
 * Get the last reading item.
 */
export function getContinueReading(): ContinueReading | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as ContinueReading;
  } catch {
    return null;
  }
}

/**
 * Remove the saved reading item.
 */
export function clearContinueReading() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}