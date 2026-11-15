---
name: github-actions
description: Use to make tests, checks and builds run automatically on GitHub on every push and pull request with GitHub Actions (free for public repos, free minutes for private). Use when asked for CI, automation, or to run Vitest/Playwright/Semgrep automatically.
---

# GitHub Actions: run it automatically

Workflows live in `.github/workflows/*.yml`. Add only the jobs for tools the project actually uses.

## Standard CI workflow

`.github/workflows/ci.yml`:

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:

permissions:
  contents: read

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx vitest run

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test --trace retain-on-failure
      - if: failure()
        uses: actions/upload-artifact@v4
        with: { name: playwright-report, path: playwright-report }

  semgrep:
    runs-on: ubuntu-latest
    container: semgrep/semgrep
    steps:
      - uses: actions/checkout@v4
      - run: semgrep scan --config auto --error
```

No `package-lock.json`? Use `npm install` instead of `npm ci` and drop `cache: npm`.

## Rules

- Give each workflow `permissions:` with the least it needs (`contents: read` by default).
- Secrets go in GitHub Settings -> Secrets and are read as `${{ secrets.NAME }}`. Never write a key in a workflow file.
- Pin actions to a major version (`@v4`), never `@main`.
- Check the YAML before committing (`npx yaml-lint` or `python -c "import yaml,sys;yaml.safe_load(open(sys.argv[1]))" file`).
- After pushing, read the run's result with the GitHub tools (`actions_list`, `get_job_logs`); fix a red run, never disable the check.
