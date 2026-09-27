# @stackline/blanket

A maintained compatibility fork of the MIT-licensed `blanket@1.2.3` coverage instrumenter.

```sh
npm install --save-dev @stackline/blanket
```

```js
const blanket = require('@stackline/blanket')({ engineOnly: true });
const instrumented = blanket.instrumentSync({
  inputFile: "function example() { 'use strict'; return this; }",
  inputFileName: 'example.js'
});
```

The legacy Mocha require hook accepts the scoped name:

```sh
mocha --require @stackline/blanket
```

Version 1.0.0 fixes [upstream issue #340](https://github.com/alex-seville/blanket/issues/340): coverage counters no longer precede a function's directive prologue and accidentally disable strict mode. Program directives keep their order before coverage initialization; strictness does not leak between instrumented files. Ordinary string expressions, parenthesized strings, and escaped lookalikes do not become strict directives.

The implementation retains Blanket's instrumentation and coverage format. Its small MIT-licensed parser-walking and options-copying helpers are included internally, with attribution, and obsolete compatibility-shim dependencies are removed. Acorn is the single runtime dependency. The QUnit, Mocha, and Jasmine bundles, including their minified variants, are rebuilt from the same corrected source.

Node.js 20+ is required. Browser bundles require ES5 array/object methods and a browser supported by the selected test framework. The default parser remains configured for ECMAScript 5. Updating the parser does not make Blanket's legacy instrumenter support every newer syntax feature.

Run `npm ci`, `npm run build`, and `npm test`. Tests cover strict-mode behavior, directive order, counters, callbacks, branch data, a real CommonJS require hook, and all six distributed browser instrumenters in VM browser contexts. Full browser-runner UI behavior and every historical framework version are not covered. The old Mocha `html-cov` reporter is a separate dependency/integration concern; this fork does not restore a reporter removed by Mocha.

Historical configuration and adapter documentation is in [README.upstream.md](README.upstream.md). See [UPSTREAM.md](UPSTREAM.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for the source basis and attribution. The original [MIT license](LICENSE) is retained.
