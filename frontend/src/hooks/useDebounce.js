import { useEffect, useState, useRef } from "react";

/**
 * Custom hook untuk debounce value
 * Berguna untuk search input agar tidak langsung fetch setiap keystroke
 * 
 * @param {any} value - Value yang akan di-debounce
 * @param {number} delay - Delay dalam milliseconds (default: 500ms)
 * @returns {any} - Debounced value
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState("");
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     fetchData(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set timeout untuk update value
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function - clear timeout jika value berubah sebelum delay selesai
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Debounce function utility
 * Untuk debounce function calls (alternative jika tidak pakai hook)
 * 
 * @param {Function} func - Function yang akan di-debounce
 * @param {number} wait - Wait time dalam milliseconds
 * @returns {Function} - Debounced function
 * 
 * @example
 * const debouncedSearch = debounce((searchTerm) => {
 *   fetchData(searchTerm);
 * }, 500);
 * 
 * // Di input handler
 * onChange={(e) => debouncedSearch(e.target.value)}
 */
export function debounce(func, wait = 500) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Custom hook untuk debounce callback function
 * 
 * @param {Function} callback - Function yang akan di-debounce
 * @param {number} delay - Delay dalam milliseconds
 * @returns {Function} - Debounced callback function
 * 
 * @example
 * const debouncedSearch = useDebouncedCallback((term) => {
 *   fetchSearchResults(term);
 * }, 500);
 * 
 * <input onChange={(e) => debouncedSearch(e.target.value)} />
 */
export function useDebouncedCallback(callback, delay = 500) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
  };
}

/**
 * Throttle function utility
 * Membatasi eksekusi function hanya sekali dalam periode tertentu
 * Berguna untuk scroll events, resize, dll
 * 
 * @param {Function} func - Function yang akan di-throttle
 * @param {number} limit - Time limit dalam milliseconds
 * @returns {Function} - Throttled function
 * 
 * @example
 * const throttledScroll = throttle(() => {
 *   console.log('Scrolling...');
 * }, 1000);
 * 
 * window.addEventListener('scroll', throttledScroll);
 */
export function throttle(func, limit = 1000) {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Custom hook untuk throttle callback
 * 
 * @param {Function} callback - Function yang akan di-throttle
 * @param {number} limit - Time limit dalam milliseconds
 * @returns {Function} - Throttled callback
 */
export function useThrottledCallback(callback, limit = 1000) {
  const callbackRef = useRef(callback);
  const inThrottleRef = useRef(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return (...args) => {
    if (!inThrottleRef.current) {
      callbackRef.current(...args);
      inThrottleRef.current = true;

      setTimeout(() => {
        inThrottleRef.current = false;
      }, limit);
    }
  };
}
