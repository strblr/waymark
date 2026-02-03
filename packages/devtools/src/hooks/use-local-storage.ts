import { useState, useCallback } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T) {
  const fullKey = `waymark-devtools:${key}`;

  const [value, set] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((previous: T) => T)) => {
      set(previous => {
        value = value instanceof Function ? value(previous) : value;
        try {
          window.localStorage.setItem(fullKey, JSON.stringify(value));
        } catch {}
        return value;
      });
    },
    [fullKey]
  );

  return [value, setValue] as const;
}
