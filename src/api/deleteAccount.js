import { encryptPassword } from "../utils/passwordEncryption";
import { env } from "../config/runtimeEnv";

const API_BASE = env("VITE_API_BASE_URL").replace(/\/$/, "");

export const DELETION_ERRORS = {
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  NO_PASSWORD_ACCOUNT: "NO_PASSWORD_ACCOUNT",
  WRONG_CODE: "WRONG_CODE",
  INVALID_CODE: "INVALID_CODE",
  NETWORK_ERROR: "NETWORK_ERROR",
};

const CREDENTIALS_ERRORS = new Set([
  DELETION_ERRORS.EMAIL_NOT_FOUND,
  DELETION_ERRORS.INVALID_CREDENTIALS,
  DELETION_ERRORS.NO_PASSWORD_ACCOUNT,
  DELETION_ERRORS.WRONG_CODE,
  DELETION_ERRORS.INVALID_CODE,
]);

/** Maps API errors to one of two user-facing form error types (confirm is handled in the form). */
export function getDeletionMessageKey(error) {
  const code = error?.message;

  if (code && CREDENTIALS_ERRORS.has(code)) {
    return "settings.invalidCredentials";
  }

  if (String(code || "").toLowerCase().includes("failed to fetch")) {
    return "settings.serverError";
  }

  return "settings.serverError";
}

function hasClientEncryptionKeys() {
  return Boolean(
    env("FIRST_KEY_OF_PASSWORD_ENCRYPTION")
    && env("SECOND_KEY_OF_PASSWORD_ENCRYPTION"),
  );
}

function shouldUseDevProxy() {
  return false;
}

function isNetworkError(error) {
  return (
    error instanceof TypeError
    || error?.name === "TypeError"
    || String(error?.message || "").toLowerCase().includes("failed to fetch")
  );
}

function wrapNetworkError(error) {
  if (isNetworkError(error)) {
    throw new Error(DELETION_ERRORS.NETWORK_ERROR);
  }
  throw error;
}

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

function parseApiError(text) {
  if (!text) {
    return "Request failed.";
  }

  const normalized = text.replace(/^"|"$/g, "").trim();

  if (normalized === "EmailIsIncorrect") {
    return DELETION_ERRORS.INVALID_CREDENTIALS;
  }

  if (normalized === "YouDontHavePassword") {
    return DELETION_ERRORS.NO_PASSWORD_ACCOUNT;
  }

  if (normalized === "InvalidEmailOrPassword" || normalized === "PasswordIsIncorrect") {
    return DELETION_ERRORS.INVALID_CREDENTIALS;
  }

  try {
    const json = JSON.parse(text);
    if (json?.error && typeof json.error === "string") {
      return json.error;
    }
  } catch {
    // not JSON
  }

  return normalized;
}

async function parseErrorMessage(response) {
  const text = await response.text();
  return parseApiError(text);
}

function trimEnvValue(value) {
  return typeof value === "string" ? value.trim() : "";
}

function assertEncryptionKeys(firstKey, secondKey) {
  const keyBytes = new TextEncoder().encode(firstKey);
  const ivBytes = new TextEncoder().encode(secondKey);
  const validKeyLengths = new Set([16, 24, 32]);

  if (!validKeyLengths.has(keyBytes.length)) {
    throw new Error(
      "Encryption key is misconfigured. Wrap FIRST_KEY_OF_PASSWORD_ENCRYPTION in double quotes if it contains #.",
    );
  }

  if (ivBytes.length !== 16) {
    throw new Error(
      "Encryption IV is misconfigured. SECOND_KEY_OF_PASSWORD_ENCRYPTION must be 16 bytes.",
    );
  }
}

async function getEncryptionKeys() {
  const firstKey = trimEnvValue(env("FIRST_KEY_OF_PASSWORD_ENCRYPTION"));
  const secondKey = trimEnvValue(env("SECOND_KEY_OF_PASSWORD_ENCRYPTION"));

  if (!firstKey || !secondKey) {
    throw new Error("Account deletion is not configured. Contact support at batsbohdan@gmail.com.");
  }

  assertEncryptionKeys(firstKey, secondKey);
  return { firstKey, secondKey };
}

function readToken(payload) {
  return payload?.token ?? payload?.Token ?? null;
}

function readVerificationCode(payload) {
  const code = payload?.code ?? payload?.Code;
  const numericCode = Number(code);

  if (!Number.isInteger(numericCode) || numericCode < 100000 || numericCode > 999999) {
    throw new Error("Invalid verification code received from server.");
  }

  return numericCode;
}

function normalizeUserCode(code) {
  const digits = String(code).trim().replace(/\D/g, "");

  if (!/^\d{6}$/.test(digits)) {
    throw new Error(DELETION_ERRORS.INVALID_CODE);
  }

  return digits;
}

function isLocalApiBase() {
  const base = API_BASE || env("VITE_API_PROXY_TARGET");
  return /localhost|127\.0\.0\.1/i.test(base);
}

async function authorizeAccount(email, password) {
  const useSimpleAuth = import.meta.env.DEV && isLocalApiBase();
  let body;

  if (useSimpleAuth) {
    body = { email, password };
  } else {
    const { firstKey, secondKey } = await getEncryptionKeys();
    const passwordHash = await encryptPassword(password, firstKey, secondKey);
    body = { email, password: passwordHash };
  }

  const authPath = useSimpleAuth ? "/api/account/simpleauthorization" : "/api/account/authorization";
  let response;

  try {
    response = await fetch(apiUrl(authPath), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    wrapNetworkError(error);
  }

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const result = await response.json();
  const token = readToken(result);

  if (!token) {
    throw new Error(DELETION_ERRORS.INVALID_CREDENTIALS);
  }

  return token;
}

async function sendVerificationCode(email) {
  const url = `${apiUrl("/api/account/code")}?emailWhereSendCode=${encodeURIComponent(email)}`;
  let response;

  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    wrapNetworkError(error);
  }

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  const result = await response.json();
  return readVerificationCode(result);
}

async function deleteAccountWithToken(token) {
  const response = await fetch(apiUrl("/api/account"), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response));
  }

  return "Your account has been successfully deleted.";
}

async function startDeletionViaDevProxy(email, password) {
  let response;

  try {
    response = await fetch("/settings/start-account-deletion", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    wrapNetworkError(error);
  }

  const text = await response.text();
  if (!response.ok) {
    try {
      const json = JSON.parse(text);
      if (json?.error) {
        throw new Error(json.error);
      }
    } catch (error) {
      if (error.message && Object.values(DELETION_ERRORS).includes(error.message)) {
        throw error;
      }
    }
    throw new Error(parseApiError(text));
  }

  let result;
  try {
    result = JSON.parse(text);
  } catch {
    throw new Error(DELETION_ERRORS.NETWORK_ERROR);
  }
  const token = readToken(result);

  if (!token) {
    throw new Error(DELETION_ERRORS.INVALID_CREDENTIALS);
  }

  return {
    token,
    verificationCode: readVerificationCode(result),
  };
}

async function confirmDeletionViaDevProxy({ token, code, verificationCode }) {
  const response = await fetch("/settings/confirm-account-deletion", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ token, code, verificationCode }),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(parseApiError(text));
  }

  return text || "Your account has been successfully deleted.";
}

/** Step 1: verify email/password, send 6-digit code to email. */
export async function startAccountDeletion({ email, password }) {
  const normalizedEmail = email.trim();

  try {
    if (shouldUseDevProxy()) {
      return await startDeletionViaDevProxy(normalizedEmail, password);
    }

    // 1) Email must exist in DB; sends 6-digit code to inbox
    const verificationCode = await sendVerificationCode(normalizedEmail);
    // 2) Verify password (encrypted like mobile app)
    const token = await authorizeAccount(normalizedEmail, password);

    return { token, verificationCode };
  } catch (error) {
    wrapNetworkError(error);
  }
}

/** Step 2: confirm code from email and delete account. */
export async function confirmAccountDeletion({ token, code, verificationCode }) {
  const userCodeDigits = normalizeUserCode(code);

  if (userCodeDigits !== String(verificationCode).padStart(6, "0")) {
    throw new Error(DELETION_ERRORS.WRONG_CODE);
  }

  if (shouldUseDevProxy()) {
    return confirmDeletionViaDevProxy({
      token,
      code: Number(userCodeDigits),
      verificationCode,
    });
  }

  return deleteAccountWithToken(token);
}
