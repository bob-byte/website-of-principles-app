export function detectMobilePlatform() {
  if (typeof navigator === "undefined") {
    return "other";
  }

  const userAgent = navigator.userAgent || "";

  if (/iPad|iPhone|iPod/i.test(userAgent)) {
    return "ios";
  }

  if (/Android/i.test(userAgent)) {
    return "android";
  }

  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
    return "ios";
  }

  return "other";
}

export function isMobileViewport() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(max-width: 1024px)").matches;
}

export function getStoreDisplayMode() {
  const platform = detectMobilePlatform();

  if (isMobileViewport() && platform !== "other") {
    return platform;
  }

  return "web";
}
