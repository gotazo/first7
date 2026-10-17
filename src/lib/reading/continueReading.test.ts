import assert from "node:assert/strict";
import test from "node:test";

import {
  clearContinueReading,
  getContinueReading,
  isContinueReading,
  saveContinueReading,
} from "./continueReading.ts";

const validReading = {
  title: "The Good Shepherd",
  description: "A study from John 10.",
  url: "/teachings/the-good-shepherd",
  category: "Jesus Christ",
  lastRead: "2026-10-13T12:00:00.000Z",
};

function withStorage<T>(run: (store: Map<string, string>) => T): T {
  const store = new Map<string, string>();
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => { store.set(key, value); },
        removeItem: (key: string) => { store.delete(key); },
      },
    },
  });

  try {
    return run(store);
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      delete (globalThis as typeof globalThis & { window?: unknown }).window;
    }
  }
}

test("validates a saved reading record", () => {
  assert.equal(isContinueReading(validReading), true);
});

test("rejects malformed records and external protocol-relative URLs", () => {
  assert.equal(isContinueReading(null), false);
  assert.equal(isContinueReading({ ...validReading, title: " " }), false);
  assert.equal(isContinueReading({ ...validReading, url: "//example.com" }), false);
  assert.equal(isContinueReading({ ...validReading, lastRead: "not-a-date" }), false);
  assert.equal(isContinueReading({ ...validReading, description: 42 }), false);
});

test("saves, reads, and clears a valid reading record", () => {
  withStorage((store) => {
    assert.equal(saveContinueReading({
      title: validReading.title,
      description: validReading.description,
      url: validReading.url,
      category: validReading.category,
    }), true);
    assert.deepEqual(getContinueReading(), {
      ...validReading,
      lastRead: getContinueReading()?.lastRead,
    });
    assert.equal(clearContinueReading(), true);
    assert.equal(getContinueReading(), null);
    assert.equal(store.size, 0);
  });
});

test("ignores malformed persisted JSON and removes it when possible", () => {
  withStorage((store) => {
    store.set("continue-reading", "{");
    assert.equal(getContinueReading(), null);
    assert.equal(store.has("continue-reading"), false);
  });
});

test("returns safely when browser storage throws", () => {
  const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      localStorage: {
        getItem: () => { throw new Error("blocked"); },
        setItem: () => { throw new Error("blocked"); },
        removeItem: () => { throw new Error("blocked"); },
      },
    },
  });

  try {
    assert.equal(getContinueReading(), null);
    assert.equal(saveContinueReading({
      title: validReading.title,
      description: validReading.description,
      url: validReading.url,
    }), false);
    assert.equal(clearContinueReading(), false);
  } finally {
    if (originalWindow) {
      Object.defineProperty(globalThis, "window", originalWindow);
    } else {
      delete (globalThis as typeof globalThis & { window?: unknown }).window;
    }
  }
});
