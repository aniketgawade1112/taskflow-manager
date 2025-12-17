// src/utils/memoization.ts
import { useMemo } from "react";

export function useMemoizedArray<T>(array: T[], keyFn: (item: T) => string) {
  return useMemo(
    () => array,
    [array.length, ...array.map((item) => keyFn(item))]
  );
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
