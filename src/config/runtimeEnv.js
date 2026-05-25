/** Production: set in EasyPanel/VPS container env, written to /principles-env.js at start. Dev: .env.local via Vite. */
export function env(name) {
  const runtime = typeof window !== "undefined" ? window.__PRINCIPLES_ENV__ : undefined;
  const fromRuntime = runtime?.[name];

  if (typeof fromRuntime === "string" && fromRuntime.length > 0) {
    return fromRuntime;
  }

  const fromVite = import.meta.env[name];
  return typeof fromVite === "string" ? fromVite : "";
}
