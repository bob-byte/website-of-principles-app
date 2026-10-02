---
name: update-project-context
description: >-
  Updates this website repo's Cursor rules and skills when product decisions,
  architecture, or conventions change. Use when the user says "update context",
  "update rules", "update skills", or "remember this" for website / principles.top work.
---

# Update project context

This repo uses `.cursor/rules/` and `.cursor/skills/` instead of a memory bank.

## Where to put it

| Kind | Location |
|------|----------|
| Always-on product/stack | `.cursor/rules/*.mdc` with `alwaysApply: true` |
| Multi-step workflow | `.cursor/skills/<name>/SKILL.md` |

Workflow skills: `commit-changes` (phrase: **Commit website changes**).

## How

1. One concern per file; keep rules short and actionable.
2. Skills hold procedures; rules hold constraints and facts.
3. Do not log ephemeral git status or chat-only scratch.
4. Chat replies stay English.
