import { STORE_DOWNLOAD_SECTION_ID } from "../config/storeLinks";

function isHomePath() {
  const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
  return pathname === "/";
}

export function scrollToStoreSection() {
  if (!isHomePath()) {
    window.location.href = `/#${STORE_DOWNLOAD_SECTION_ID}`;
    return;
  }

  const target = document.getElementById(STORE_DOWNLOAD_SECTION_ID);

  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
