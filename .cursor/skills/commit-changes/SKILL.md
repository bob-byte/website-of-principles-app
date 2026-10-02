---
name: commit-changes
description: >-
  Commits uncommitted work in the website-of-principles-app git root, split by
  kind of change. Use when the user says "Commit website changes" or asks to
  commit website / principles.top work with separated commits.
---

# Commit website changes

## Triggers

- `Commit website changes`
- Similar phrasing that names the marketing site / principles.top and asks to commit

## Repo root

Use `git -C /Users/set/Desktop/SubconsciousET/Projects/website-of-principles-app …`
(or the absolute path to this repo). Do not fold Flutter, backend, or MAUI commits into this skill.

## Authorship (required)

- Never add `Co-authored-by`, Cursor/AI trailers, or any contributor attribution for the agent.
- Never pass `--author`, never change `user.name` / `user.email`, never amend to rewrite author.
- Commits must use the existing local git identity only.

## How to commit

1. Status, full diff, and recent `git log` in this repo only.
2. Group into **separate commits by kind** (copy/marketing vs legal vs theme/UX vs docs vs config). Prefer focused commits over one dump. Keep a legal source change and regenerated `legalDocuments.js` together.
3. Stage only files for the current commit; use HEREDOC messages in this repo’s style (imperative, why-focused, ~1–2 sentences).
4. No secrets (`.env.local`, real API keys, encryption key values). Warn and skip those files. `.env.example` without secrets is OK.
5. Skip **local development only** changes (machine-specific paths, personal Vite targets with secrets, scratch tooling). Leave them unstaged and mention them briefly after committing.
6. Do not push unless asked.
7. After all commits: `git status` and briefly list the new commit subjects.

Follow the user’s global git safety rules (no force push, no amend unless those rules allow it, no `--no-verify`).
