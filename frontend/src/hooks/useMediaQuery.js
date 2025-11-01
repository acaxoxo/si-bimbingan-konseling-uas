import { useState, useEffect } from "react";

export const BREAKPOINTS = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
};

export function useMediaQuery() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < BREAKPOINTS.md,
    isTablet: windowSize.width >= BREAKPOINTS.md && windowSize.width < BREAKPOINTS.lg,
    isDesktop: windowSize.width >= BREAKPOINTS.lg,
    isSmallScreen: windowSize.width < BREAKPOINTS.sm,
    isMediumScreen: windowSize.width >= BREAKPOINTS.sm && windowSize.width < BREAKPOINTS.lg,
    isLargeScreen: windowSize.width >= BREAKPOINTS.lg,
    isXLargeScreen: windowSize.width >= BREAKPOINTS.xl,
    is2XLargeScreen: windowSize.width >= BREAKPOINTS["2xl"],
  };
}

export function useBreakpoint(breakpoint) {
  const { width } = useMediaQuery();
  return width >= BREAKPOINTS[breakpoint];
}

export function useOrientation() {
  const [orientation, setOrientation] = useState(
    typeof window !== "undefined"
      ? window.innerHeight > window.innerWidth
        ? "portrait"
        : "landscape"
      : "portrait"
  );

  useEffect(() => {
    function handleResize() {
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return orientation;
}

export function getResponsiveClass(classes, currentWidth) {
  const breakpoints = Object.keys(BREAKPOINTS).sort(
    (a, b) => BREAKPOINTS[b] - BREAKPOINTS[a]
  );

  for (const bp of breakpoints) {
    if (currentWidth >= BREAKPOINTS[bp] && classes[bp]) {
      return classes[bp];
    }
  }

  return classes.default || "";
}

export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const hasTouch =
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;
    
    setIsTouch(hasTouch);
  }, []);

  return isTouch;
}

export function isMobileDevice() {
  if (typeof window === "undefined") return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

export function useIsMobile() {
  const { isMobile } = useMediaQuery();
  const [isMobileUA, setIsMobileUA] = useState(false);

  useEffect(() => {
    setIsMobileUA(isMobileDevice());
  }, []);

  return isMobile || isMobileUA;
}
