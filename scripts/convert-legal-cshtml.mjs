import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function decodeEntities(text) {
  return text
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function cleanHtml(html) {
  return balanceDivs(
    decodeEntities(html)
      .replace(/<a\s+asp-controller="Settings"\s+asp-action="Settings"[^>]*>/gi, '<a href="/settings">')
      .replace(/<a\s+href="([^"#]+)"[^>]*>/g, '<a href="$1">')
      .replace(/\s+style="[^"]*"/g, ""),
  );
}

/** Fix orphan wrapper <div> tags from cshtml section wrappers. */
function balanceDivs(html) {
  let result = html.trim();
  let opens = (result.match(/<div\b/gi) || []).length;
  let closes = (result.match(/<\/div>/gi) || []).length;

  while (opens > closes && /^\s*<div(?:\s[^>]*)?>\s*/i.test(result)) {
    result = result.replace(/^\s*<div(?:\s[^>]*)?>\s*/i, "");
    opens -= 1;
  }

  while (opens > closes && /\s*<div(?:\s[^>]*)?>\s*$/i.test(result)) {
    result = result.replace(/\s*<div(?:\s[^>]*)?>\s*$/i, "");
    opens -= 1;
  }

  while (opens > closes) {
    result += "</div>";
    closes += 1;
  }

  while (closes > opens && /\s*<\/div>\s*$/i.test(result)) {
    result = result.replace(/\s*<\/div>\s*$/i, "");
    closes -= 1;
  }

  result = result.replace(/(\s*<\/div>\s*)+<div>\s*$/gi, "");

  return result.trim();
}

function extractContentInner(withoutNav) {
  const openMatch = withoutNav.match(/<div class="content"[^>]*>/i);
  if (!openMatch) return withoutNav.trim();

  const start = openMatch.index + openMatch[0].length;
  const scriptIdx = withoutNav.search(/<script/i);
  const end = scriptIdx > start ? scriptIdx : withoutNav.length;
  let inner = withoutNav.slice(start, end).trim();
  inner = inner.replace(/\s*<\/div>\s*$/, "").trim();
  return inner;
}

function extractIntro(html) {
  let rest = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>\s*/i, "");
  rest = rest.replace(/<p>\s*<b>Last updated[\s\S]*?<\/b>\s*<\/p>\s*/i, "");
  rest = rest.replace(/<b>Last updated[\s\S]*?<\/b>\s*/i, "");

  const firstH2 = rest.search(/<h2\b/i);
  if (firstH2 === -1) return cleanHtml(rest);
  return cleanHtml(rest.slice(0, firstH2));
}

function extractSections(html) {
  const h2Matches = [...html.matchAll(/<h2(?:\s+id="([^"]+)")?[^>]*>([\s\S]*?)<\/h2>/gi)];
  const sections = [];

  for (let i = 0; i < h2Matches.length; i += 1) {
    const match = h2Matches[i];
    const id = match[1] || `section-${i + 1}`;
    const title = match[2].replace(/<[^>]+>/g, "").trim();
    const start = match.index + match[0].length;
    const end = i + 1 < h2Matches.length ? h2Matches[i + 1].index : html.length;
    const body = cleanHtml(html.slice(start, end));

    if (body) {
      sections.push({
        id,
        title,
        blocks: [{ type: "html", html: body }],
      });
    }
  }

  return sections;
}

function convertFile(relativePath) {
  const raw = readFileSync(join(root, relativePath), "utf8");
  const body = raw.replace(/^[\s\S]*?<body[^>]*>/i, "").replace(/<script[\s\S]*$/i, "");
  const withoutNav = body.replace(/<nav class="page-nav">[\s\S]*?<\/nav>/gi, "");
  const inner = extractContentInner(withoutNav);

  return {
    introHtml: extractIntro(inner),
    sections: extractSections(inner),
  };
}

const privacy = convertFile("scripts/legal-source/PrivacyPolicy.cshtml");
const agreement = convertFile("scripts/legal-source/UserAgreement.cshtml");

const output = `// Auto-generated from scripts/legal-source/*.cshtml — full document text
export const privacyPolicyIntroHtml = ${JSON.stringify(privacy.introHtml)};

export const privacyPolicySections = ${JSON.stringify(privacy.sections, null, 2)};

export const userAgreementIntroHtml = ${JSON.stringify(agreement.introHtml)};

export const userAgreementSections = ${JSON.stringify(agreement.sections, null, 2)};
`;

writeFileSync(join(root, "src/content/legalDocuments.js"), output);
console.log("Generated src/content/legalDocuments.js");
console.log(
  `Privacy: intro ${privacy.introHtml.length} chars, ${privacy.sections.length} sections`,
);
console.log(
  `Agreement: intro ${agreement.introHtml.length} chars, ${agreement.sections.length} sections`,
);
