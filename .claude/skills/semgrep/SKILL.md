---
name: semgrep
description: Use to find security holes and dangerous code patterns (injection, XSS, hard-coded secrets, unsafe eval) with Semgrep (free). Use before shipping, after big changes, or when asked for a security check.
---

# Semgrep: find the holes

## Setup

`pip install semgrep` (or `pipx install semgrep`, or `brew install semgrep`). Check: `semgrep --version`.

## Scan

```bash
semgrep scan --config auto .                      # rules picked for the languages found
semgrep scan --config p/security-audit --config p/secrets .
semgrep scan --config auto --json -o semgrep.json .   # for reading results in detail
```

Scan only changed files: `semgrep scan --config auto $(git diff --name-only main)`.
Skip vendored code: add a `.semgrepignore` (same syntax as `.gitignore`), e.g. `node_modules/`, `dist/`.

## Handling findings

For each finding: open the line, decide if it is real.
- Real: fix the code (escape output, parameterise queries, move the secret to an env var and rotate it), then rescan.
- False positive: add `// nosemgrep: <rule-id>` on that line with a one-line reason. Never silence a whole rule set to get a clean scan.

Report: how many findings, which were fixed, which were judged false positives and why.

## Custom rule

`.semgrep.yml`:

```yaml
rules:
  - id: no-innerhtml
    pattern: $EL.innerHTML = $X
    message: Use textContent, or sanitise $X first
    languages: [javascript, typescript]
    severity: WARNING
```

Run with `semgrep scan --config .semgrep.yml .`
