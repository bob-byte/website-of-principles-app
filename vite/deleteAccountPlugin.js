import { loadEnv } from "vite";
import { encryptPassword } from "../src/utils/passwordEncryption.js";

const API_ERRORS = {
  EMAIL_NOT_FOUND: "EMAIL_NOT_FOUND",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  NO_PASSWORD_ACCOUNT: "NO_PASSWORD_ACCOUNT",
};

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
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
      "FIRST_KEY_OF_PASSWORD_ENCRYPTION has invalid length. Wrap it in double quotes in .env.local if it contains #.",
    );
  }

  if (ivBytes.length !== 16) {
    throw new Error(
      "SECOND_KEY_OF_PASSWORD_ENCRYPTION must be 16 bytes. Wrap it in double quotes in .env.local if needed.",
    );
  }
}

function getEnvKeys(env) {
  const firstKey = trimEnvValue(
    env.FIRST_KEY_OF_PASSWORD_ENCRYPTION || env.FIRST_KEY_OF_PASSWORD_ENCRYPTION,
  );
  const secondKey = trimEnvValue(
    env.SECOND_KEY_OF_PASSWORD_ENCRYPTION || env.SECOND_KEY_OF_PASSWORD_ENCRYPTION,
  );

  return { firstKey, secondKey };
}

function getApiTarget(env) {
  return (
    env.VITE_API_PROXY_TARGET
    || "https://principles-server.ckwavh.easypanel.host"
  ).replace(/\/$/, "");
}

async function readApiJson(response, fallbackError) {
  const text = await response.text();

  if (!response.ok) {
    const error = new Error(mapApiErrorText(text));
    error.statusCode = response.status >= 400 && response.status < 500 ? 400 : 500;
    throw error;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(fallbackError);
  }
}

function mapApiErrorText(text) {
  const normalized = (text || "").replace(/^"|"$/g, "").trim();

  if (normalized === "EmailIsIncorrect") {
    return API_ERRORS.EMAIL_NOT_FOUND;
  }

  if (normalized === "YouDontHavePassword") {
    return API_ERRORS.NO_PASSWORD_ACCOUNT;
  }

  if (normalized === "InvalidEmailOrPassword" || normalized === "PasswordIsIncorrect") {
    return API_ERRORS.INVALID_CREDENTIALS;
  }

  return API_ERRORS.INVALID_CREDENTIALS;
}

function sendJsonError(res, statusCode, errorCode) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ error: errorCode }));
}

function isLocalApiTarget(apiTarget) {
  return /localhost|127\.0\.0\.1/i.test(apiTarget);
}

async function authorizeAccount(apiTarget, email, password, firstKey, secondKey) {
  const loginResponse = await fetch(
    `${apiTarget}/api/account/${isLocalApiTarget(apiTarget) ? "simpleauthorization" : "authorization"}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(
        isLocalApiTarget(apiTarget)
          ? { email, password }
          : { email, password: await encryptPassword(password, firstKey, secondKey) },
      ),
    },
  );

  const loginResult = await readApiJson(loginResponse, "Invalid API response during login.");
  const token = loginResult?.token ?? loginResult?.Token;

  if (!token) {
    const error = new Error(API_ERRORS.INVALID_CREDENTIALS);
    error.statusCode = 400;
    throw error;
  }

  return token;
}

async function sendVerificationCode(apiTarget, email) {
  const codeResponse = await fetch(
    `${apiTarget}/api/account/code?emailWhereSendCode=${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: { Accept: "application/json" },
    },
  );

  const codeResult = await readApiJson(
    codeResponse,
    "Invalid API response when sending verification code.",
  );
  const verificationCode = Number(codeResult?.code ?? codeResult?.Code);

  if (
    !Number.isInteger(verificationCode)
    || verificationCode < 100000
    || verificationCode > 999999
  ) {
    const error = new Error("Invalid verification code received from server.");
    error.statusCode = 500;
    throw error;
  }

  return verificationCode;
}

async function handleStartAccountDeletion(req, res, env) {
  let body;

  try {
    body = await readJsonBody(req);
  } catch {
    sendJsonError(res, 400, "INVALID_DATA");
    return;
  }

  const email = body?.email?.trim();
  const password = body?.password;

  if (!email || !password) {
    sendJsonError(res, 400, "INVALID_DATA");
    return;
  }

  const { firstKey, secondKey } = getEnvKeys(env);
  const apiTarget = getApiTarget(env);

  if (!firstKey || !secondKey) {
    res.statusCode = 500;
    res.end("Password encryption keys are not configured.");
    return;
  }

  try {
    assertEncryptionKeys(firstKey, secondKey);
    const verificationCode = await sendVerificationCode(apiTarget, email);
    const token = await authorizeAccount(apiTarget, email, password, firstKey, secondKey);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ token, verificationCode }));
  } catch (error) {
    if (error.message && Object.values(API_ERRORS).includes(error.message)) {
      sendJsonError(res, error.statusCode || 400, error.message);
      return;
    }

    console.error("[delete-account] start-account-deletion failed:", error);
    res.statusCode = error.statusCode || 500;
    res.end(error.message || "Failed to verify account.");
  }
}

async function handleConfirmAccountDeletion(req, res, env) {
  let body;

  try {
    body = await readJsonBody(req);
  } catch {
    sendJsonError(res, 400, "INVALID_DATA");
    return;
  }

  const token = body?.token;
  const userCodeDigits = String(body?.code ?? "").replace(/\D/g, "");
  const verificationCodeDigits = String(body?.verificationCode ?? "").replace(/\D/g, "");

  if (!token || !/^\d{6}$/.test(userCodeDigits) || !/^\d{6}$/.test(verificationCodeDigits)) {
    sendJsonError(res, 400, "INVALID_DATA");
    return;
  }

  if (userCodeDigits !== verificationCodeDigits) {
    sendJsonError(res, 400, "WRONG_CODE");
    return;
  }

  const apiTarget = getApiTarget(env);

  try {
    const deleteResponse = await fetch(`${apiTarget}/api/account`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!deleteResponse.ok) {
      res.statusCode = deleteResponse.status;
      res.end("Failed to delete account. Please try again later.");
      return;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.end("Your account has been successfully deleted.");
  } catch {
    res.statusCode = 500;
    res.end("Failed to delete account. Please try again later.");
  }
}

export function deleteAccountPlugin() {
  return {
    name: "delete-account-api",
    configureServer(server) {
      const env = loadEnv(server.config.mode, server.config.root, "");
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];

        try {
          if (url === "/settings/start-account-deletion" && req.method === "POST") {
            await handleStartAccountDeletion(req, res, env);
            return;
          }

          if (url === "/settings/confirm-account-deletion" && req.method === "POST") {
            await handleConfirmAccountDeletion(req, res, env);
            return;
          }
        } catch (error) {
          console.error("[delete-account] middleware error:", error);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.end(error?.message || "Internal server error.");
          }
          return;
        }

        next();
      });
    },
  };
}
