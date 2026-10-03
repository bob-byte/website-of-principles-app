import { env } from "../config/runtimeEnv";

/** IANA id for Kyiv — same role as backend `TimeZoneInfo.FindSystemTimeZoneById`. */
const KYIV_TIME_ZONE_ID = "Europe/Kyiv";
const OPEN_LOG_SESSION_KEY = "principles-site-open-logged";
const GEO_ENDPOINT = "https://ipwho.is/";

function apiBase() {
  return env("VITE_API_BASE_URL").replace(/\/$/, "");
}

function apiUrl(path) {
  return `${apiBase()}${path}`;
}

function pad2(value) {
  return String(value).padStart(2, "0");
}

/** Matches backend Serilog: `[HH:mm:ss dd-MM-yyyy INF]`. */
export function formatKyivLogPrefix(date = new Date(), level = "INF") {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: KYIV_TIME_ZONE_ID,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);

  const get = (type) => parts.find((part) => part.type === type)?.value ?? "00";
  const time = `${get("hour")}:${get("minute")}:${get("second")}`;
  const day = `${pad2(get("day"))}-${pad2(get("month"))}-${get("year")}`;
  return `[${time} ${day} ${level}]`;
}

function formatLogLine(message, level = "INF") {
  return `${formatKyivLogPrefix(new Date(), level)} ${message}`;
}

function readButtonLabel(element) {
  const explicit = element.getAttribute("data-site-log");
  if (explicit) {
    return explicit.trim();
  }

  const aria = element.getAttribute("aria-label");
  if (aria?.trim()) {
    return aria.trim();
  }

  if (element instanceof HTMLSelectElement) {
    return `language:${element.value}`;
  }

  if (element instanceof HTMLAnchorElement) {
    const text = element.textContent?.replace(/\s+/g, " ").trim();
    if (text) {
      return text;
    }
    return element.getAttribute("href") || "link";
  }

  const text = element.textContent?.replace(/\s+/g, " ").trim();
  return text || element.tagName.toLowerCase();
}

async function resolveApproximateLocation() {
  try {
    const response = await fetch(GEO_ENDPOINT, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Geo lookup failed: ${response.status}`);
    }

    const data = await response.json();
    if (data?.success === false) {
      throw new Error(data?.message || "Geo lookup unsuccessful");
    }

    // Approximate only: city / region / country (no coordinates, no IP in the log).
    const parts = [data.city, data.region, data.country].filter(
      (part) => typeof part === "string" && part.trim().length > 0,
    );
    if (parts.length > 0) {
      return parts.join(", ");
    }
  } catch {
    // Fall back to timezone id (still an approximate place signal).
  }

  try {
    return (
      Intl.DateTimeFormat().resolvedOptions().timeZone || KYIV_TIME_ZONE_ID
    );
  } catch {
    return "unknown";
  }
}

async function postToServer(message) {
  const body = {
    deviceOs: "Web",
    deviceModelName: navigator.userAgent || "browser",
    deviceType: "Browser",
    deviceManufacturer: "Web",
    appVersion: "website",
    logType: "Information",
    logMessage: message,
  };

  try {
    await fetch(apiUrl("/api/logs"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    // Local console line is enough when the API is unreachable.
  }
}

export async function logSiteInfo(message) {
  const line = formatLogLine(message, "INF");
  console.log(line);
  await postToServer(message);
}

export async function logWebsiteOpened() {
  if (sessionStorage.getItem(OPEN_LOG_SESSION_KEY) === "1") {
    return;
  }
  sessionStorage.setItem(OPEN_LOG_SESSION_KEY, "1");

  const path = window.location.pathname.replace(/\/+$/, "") || "/";
  const locationLabel = await resolveApproximateLocation();
  await logSiteInfo(
    `Website opened (${path}). Approximate location: ${locationLabel}`,
  );
}

export async function logButtonPressed(buttonName) {
  const name = String(buttonName || "").trim();
  if (!name) {
    return;
  }
  await logSiteInfo(`Button pressed: ${name}`);
}

function onDocumentClick(event) {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  if (target.closest("[data-site-log-ignore]")) {
    return;
  }

  const control = target.closest(
    "button, a[href], [role='button'], [data-site-log]",
  );
  if (!control || control instanceof HTMLSelectElement) {
    return;
  }

  // Ignore pure hash-only in-page legal TOC jumps without an explicit label.
  if (
    control instanceof HTMLAnchorElement
    && control.getAttribute("href")?.startsWith("#")
    && !control.hasAttribute("data-site-log")
  ) {
    return;
  }

  void logButtonPressed(readButtonLabel(control));
}

function onDocumentChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) {
    return;
  }
  if (target.closest("[data-site-log-ignore]")) {
    return;
  }
  void logButtonPressed(readButtonLabel(target));
}

let initialized = false;

/** Logs approximate location on first open and every button/link press. */
export function initSiteLogging() {
  if (initialized || typeof document === "undefined") {
    return;
  }
  initialized = true;

  void logWebsiteOpened();
  document.addEventListener("click", onDocumentClick, true);
  document.addEventListener("change", onDocumentChange, true);
}
