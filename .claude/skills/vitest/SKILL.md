---
name: vitest
description: Use to test JavaScript/TypeScript code (functions, modules, components) with Vitest (free) - write unit tests, run them, fix failures. Use when adding or changing logic, or when asked to test the code.
---

# Vitest: test the code

## Setup

`npm i -D vitest` and in `package.json`: `"scripts": { "test": "vitest run" }`.
For DOM/components add `npm i -D jsdom` and `vitest.config.js`:

```js
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'jsdom' } });
```

## Writing tests

Put tests next to the code as `name.test.js` (or `.ts`):

```js
import { describe, it, expect, vi } from 'vitest';
import { price } from './price.js';

describe('price', () => {
  it('adds tax', () => expect(price(100)).toBe(115));
  it('rejects negatives', () => expect(() => price(-1)).toThrow());
});
```

- One behaviour per `it`; name it after what it should do.
- Cover the normal case, edge cases (0, empty, very large, Arabic text) and errors.
- Mock only the outside world (network, time, random): `vi.fn()`, `vi.mock('./api.js')`, `vi.useFakeTimers()`.

## Running

- All: `npx vitest run`. One file: `npx vitest run price`. Coverage: `npx vitest run --coverage` (needs `@vitest/coverage-v8`).
- When a test fails, fix the code, not the test, unless the test itself is wrong; say which.
- Never skip or delete a test to get green. Report the real result.
