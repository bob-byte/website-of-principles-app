import { ANDROID_STORE_URL, IOS_STORE_URL } from "../config/storeLinks";
import { detectMobilePlatform } from "./mobilePlatform";

export function getPreferredStoreUrl() {
  const platform = detectMobilePlatform();

  if (platform === "ios") {
    return IOS_STORE_URL;
  }

  if (platform === "android") {
    return ANDROID_STORE_URL;
  }

  const userAgent = navigator.userAgent || "";
  if (/Macintosh|Mac OS X/i.test(userAgent)) {
    return IOS_STORE_URL;
  }

  return ANDROID_STORE_URL;
}

export function openAppStore() {
  window.open(getPreferredStoreUrl(), "_blank", "noopener,noreferrer");
}
