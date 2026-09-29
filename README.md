# @stackline/blanket

> Maintained Blanket.js 1.2.3 compatibility fork with directive-safe coverage instrumentation.

[![npm version](https://img.shields.io/npm/v/@stackline/blanket.svg?style=flat-square)](https://www.npmjs.com/package/@stackline/blanket)
[![license](https://img.shields.io/npm/l/@stackline/blanket.svg?style=flat-square)](https://github.com/alexandroit/stackline-blanket)
[![GitHub repository](https://img.shields.io/badge/GitHub-repository-181717?style=flat-square&logo=github)](https://github.com/alexandroit/stackline-blanket)
[![Docs](https://img.shields.io/badge/docs-alexandro.net-0f766e?style=flat-square)](https://alexandro.net/docs/vanilla/blanket/)
[![Reddit community](https://img.shields.io/badge/community-r%2FStackline-ff4500?style=flat-square&logo=reddit&logoColor=white)](https://www.reddit.com/r/Stackline/)

**[Documentation](https://alexandro.net/docs/vanilla/blanket/)** | **[npm](https://www.npmjs.com/package/@stackline/blanket)** | **[Issues](https://github.com/alexandroit/stackline-blanket/issues)** | **[Repository](https://github.com/alexandroit/stackline-blanket)**

**Current package version:** `1.0.3`

---

## Why this package?

This is a maintained compatibility fork of the MIT-licensed `blanket@1.2.3` coverage instrumenter.

Version 1.0.0 fixed [upstream issue #340](https://github.com/alex-seville/blanket/issues/340): coverage counters no longer precede a function's directive prologue and accidentally disable strict mode. Program directives keep their order before coverage initialization; strictness does not leak between instrumented files. Ordinary string expressions, parenthesized strings, and escaped lookalikes do not become strict directives.

The implementation retains Blanket's instrumentation and coverage format. Its small MIT-licensed parser-walking and options-copying helpers are included internally, with attribution, and obsolete compatibility-shim dependencies are removed. Acorn is the single runtime dependency. The QUnit, Mocha, and Jasmine bundles, including their minified variants, are rebuilt from the same corrected source.

## Compatibility

| Item | Value |
| --- | --- |
| Package | `@stackline/blanket@1.0.3` |
| Supported Node.js | `>=20` |
| Module entry | `src/index.js` (CommonJS) |
| Runtime dependencies | 1 direct dependency |

Browser bundles require ES5 array/object methods and a browser supported by the selected test framework. The default parser remains configured for ECMAScript 5; updating the parser does not make the legacy instrumenter support every newer syntax feature.

## Installation

```bash
npm install --save-dev @stackline/blanket
```

The legacy Mocha require hook accepts the scoped name:

```sh
mocha --require @stackline/blanket
```

## Usage

```js
const blanket = require('@stackline/blanket')({ engineOnly: true });
const instrumented = blanket.instrumentSync({
  inputFile: "function example() { 'use strict'; return this; }",
  inputFileName: 'example.js'
});
```

## Security

Instrumentation preserves directive prologues, including `use strict`. The default parser targets ECMAScript 5; newer parser dependencies do not imply support for every newer language feature.

## API Surface

The full historical options and API reference are preserved in [README.upstream.md](https://github.com/alexandroit/stackline-blanket/blob/main/README.upstream.md). The compatibility notes above describe changes in the maintained package.

## Local Development

Clone the [repository](https://github.com/alexandroit/stackline-blanket) and run the following commands from its root:

```bash
npm ci
npm run build
npm test
```

Tests cover strict-mode behavior, directive order, counters, callbacks, branch data, a real CommonJS require hook, and all six distributed browser instrumenters in VM browser contexts. Full browser-runner UI behavior and every historical framework version are not covered. The old Mocha `html-cov` reporter is a separate integration concern; this fork does not restore a reporter removed by Mocha.

## Release Checklist

1. Update the package version, lockfile, generated version fields, and changelog together.
2. Run the development checks above and audit both `npm audit` and `npm audit --omit=dev`.
3. Use the [GitHub publish workflow](https://github.com/alexandroit/stackline-blanket/actions/workflows/publish.yml) with its `Prod` environment to publish the exact CI tarball.
4. Verify public npm bytes, package identity, provenance, and the immutable GitHub release evidence.

## License

[MIT](https://github.com/alexandroit/stackline-blanket/blob/main/LICENSE). Original copyright notices and upstream attribution are retained.

See [UPSTREAM.md](https://github.com/alexandroit/stackline-blanket/blob/main/UPSTREAM.md) and [THIRD_PARTY_NOTICES.md](https://github.com/alexandroit/stackline-blanket/blob/main/THIRD_PARTY_NOTICES.md) for the source basis and bundled helper attribution.

## Credits and original authors

- Original project: [blanket](https://github.com/alex-seville/blanket).
- Alex-Seville.
- Copyright (c) 2013 Alex Seville.
- Stackline maintenance: [Alexandro Paixao Marques](https://www.linkedin.com/in/aleinfo/) and [Stackline contributors](https://github.com/alexandroit).

Original copyright, license notices and contributor acknowledgements remain part of this distribution. Stackline maintenance does not replace authorship of the original work.

## Community and Links

- [Stackline website](https://alexandro.net/)
- [GitHub projects](https://github.com/alexandroit)
- [npm packages](https://www.npmjs.com/~alex360qc)
- [Reddit community — r/Stackline](https://www.reddit.com/r/Stackline/)
- [Maintainer LinkedIn](https://www.linkedin.com/in/aleinfo/)

Use this repository's issue tracker for reproducible bugs and feature requests. Join r/Stackline for examples, usage questions and release discussions.
