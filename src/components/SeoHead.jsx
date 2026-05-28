import { useEffect } from "react";
import { env } from "../config/runtimeEnv";

const SITE_URL = (env("VITE_SITE_URL") || "https://principles.top").replace(/\/$/, "");

function upsertMeta(attribute, name, content) {
  if (!content) {
    document.querySelector(`meta[${attribute}="${name}"]`)?.remove();
    return;
  }

  let element = document.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

function upsertLink(rel, href) {
  if (!href) {
    document.querySelector(`link[rel="${rel}"]`)?.remove();
    return;
  }

  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  element.href = href;
}

function upsertJsonLd(id, data) {
  const existing = document.getElementById(id);
  if (!data) {
    existing?.remove();
    return;
  }

  const script = existing ?? document.createElement("script");
  script.id = id;
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  if (!existing) {
    document.head.appendChild(script);
  }
}

function SeoHead({ title, description, path, includeWebsiteSchema = false }) {
  const canonical = `${SITE_URL}${path === "/" ? "" : path}`;

  useEffect(() => {
    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", "index, follow");
    upsertLink("canonical", canonical);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", "Principles");

    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);

    if (includeWebsiteSchema) {
      upsertJsonLd("seo-website-jsonld", {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Principles",
        url: SITE_URL,
        description,
      });
    } else {
      upsertJsonLd("seo-website-jsonld", null);
    }
  }, [title, description, canonical, includeWebsiteSchema]);

  return null;
}

export default SeoHead;
