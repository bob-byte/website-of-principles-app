/**
 * Matches Principles.Helpers.PasswordHelper.EncryptPassword (AES-CBC, PKCS7).
 */
export async function encryptPassword(plainText, firstKey, secondKey) {
  const keyBytes = new TextEncoder().encode(firstKey);
  const ivBytes = new TextEncoder().encode(secondKey);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyBytes,
    { name: "AES-CBC" },
    false,
    ["encrypt"],
  );

  const encoded = new TextEncoder().encode(plainText);
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: ivBytes },
    cryptoKey,
    encoded,
  );

  const bytes = new Uint8Array(encrypted);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
