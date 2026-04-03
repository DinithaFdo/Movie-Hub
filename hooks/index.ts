/**
 * Custom hooks for common operations
 */

import { useEffect, useRef, useState } from "react";
import { useCallback } from "react";

/**
 * useDebounce - Debounce any value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

/**
 * useAsync - Fetch data with loading/error states
 */
export function useAsync<T, E = string>(
  asyncFunction: () => Promise<T>,
  immediate: boolean = true,
) {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const execute = useCallback(async () => {
    setStatus("pending");
    setData(null);
    setError(null);

    try {
      const result = await asyncFunction();
      setData(result);
      setStatus("success");
    } catch (error) {
      setError(error as E);
      setStatus("error");
    }
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { execute, status, data, error };
}

/**
 * usePagination - Manage pagination state
 */
export function usePagination(defaultPage: number = 1) {
  const [page, setPage] = useState(defaultPage);
  const [hasMore, setHasMore] = useState(true);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);
  const goToPage = useCallback((p: number) => setPage(Math.max(1, p)), []);

  return {
    page,
    setPage,
    nextPage,
    prevPage,
    goToPage,
    hasMore,
    setHasMore,
  };
}

/**
 * useInfiniteScroll - Infinite scroll detection
 */
export function useInfiniteScroll(
  callback: () => void,
  threshold: number = 0.1,
) {
  const observerTarget = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          callback();
        }
      },
      { threshold },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [callback, threshold]);

  return observerTarget;
}

/**
 * useLocalStorage - Persisted state with localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error writing to localStorage (${key}):`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue] as const;
}

/**
 * useQueryParams - Sync state with URL query params
 */
export function useQueryParams(defaultParams: Record<string, string>) {
  const [params, setParams] = useState(defaultParams);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const searchParams = new URLSearchParams(window.location.search);
    const newParams: Record<string, string> = { ...defaultParams };

    Object.keys(defaultParams).forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        newParams[key] = value;
      }
    });

    setParams(newParams);
  }, [defaultParams]);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      if (typeof window === "undefined") return;

      const newParams = { ...params };
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === "") {
          delete newParams[key];
        } else {
          newParams[key] = value;
        }
      });

      setParams(newParams);

      const searchParams = new URLSearchParams();
      Object.entries(newParams).forEach(([key, value]) => {
        searchParams.set(key, value);
      });

      const query = searchParams.toString();
      const newUrl = query ? `?${query}` : window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    },
    [params],
  );

  return [params, updateParams] as const;
}

/**
 * useForceUpdate - Force component re-render
 */
export function useForceUpdate(): () => void {
  const [, setVersion] = useState(0);
  return useCallback(() => setVersion((v) => v + 1), []);
}

/**
 * usePrevious - Get previous value
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

/**
 * useClickOutside - Detect clicks outside element
 */
export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

/**
 * useMounted - Check if component is mounted
 */
export function useMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
}
