'use strict';

const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { execFileSync } = require('node:child_process');
const blanket = require('../src/blanket').blanket;

function evaluate(engine, source, filename = 'fixture.js', browser) {
    const context = browser || { _$jscoverage: {} };
    const generated = engine.instrumentSync({ inputFile: source, inputFileName: filename });
    vm.runInNewContext(generated, context);
    return { context, generated, result: context.result };
}

const strictFunction = "function f(){'custom';'use strict';return this === undefined;} result = f();";

test('function directives retain strict this and arguments behavior (#340)', () => {
    assert.equal(evaluate(blanket, strictFunction).result, true);
    assert.equal(evaluate(blanket,
        "function f(a){'use strict';arguments[0]=2;return a;} result=f(1);").result, 1);
    assert.equal(evaluate(blanket,
        "result=(function(){'use strict';return this===undefined;}());").result, true);
});

test('program directives retain their original order before the coverage setup', () => {
    const source = "'custom';\n'use strict';\nvar result = (function(){return this===undefined;}());";
    const { result, generated } = evaluate(blanket, source);
    assert.equal(result, true);
    assert.ok(generated.startsWith("'custom';\n'use strict';\nif (typeof "));
    assert.equal((generated.match(/'use strict'/g) || []).length, 1);
});

test('strict state does not leak into a subsequent sloppy file', () => {
    evaluate(blanket, "'use strict'; var result = true;", 'strict.js');
    assert.equal(evaluate(blanket, 'result=(function(){return this !== undefined;}());', 'sloppy.js').result, true);
});

test('ordinary, parenthesized and escaped strings do not enable strict mode', () => {
    for (const body of ["0; 'use strict';", "('use strict');", "'use\\x20strict';"]) {
        assert.equal(evaluate(blanket, 'function f(){' + body + 'return this!==undefined;} result=f();').result, true);
    }
    assert.equal(evaluate(blanket, "0; 'use strict'; result=(function(){return this!==undefined;}());").result, true);
});

test('line counters, callback, branch coverage and source lines remain available', () => {
    const source = 'var a=1;\nresult=a ? 2 : 3;';
    blanket.options('branchTracking', true);
    const { context, result } = evaluate(blanket, source, 'branches.js');
    assert.equal(result, 2);
    assert.equal(context._$jscoverage['branches.js'][1], 1);
    assert.equal(context._$jscoverage['branches.js'][2], 1);
    assert.ok(context._$jscoverage['branches.js'].branchData[2]);
    assert.equal(context._$jscoverage['branches.js'].source.join('\n'), source);
    blanket.options('branchTracking', false);
    let callbackCode;
    assert.equal(blanket.instrumentSync({ inputFile: 'var x=1;', inputFileName: 'callback.js' },
        code => { callbackCode = code; }), undefined);
    assert.match(callbackCode, /callback\.js/);
});

test('public CommonJS entrypoint loads under node -e', () => {
    const output = execFileSync(process.execPath, ['-e',
        'const b=require(' + JSON.stringify(path.resolve(__dirname, '..')) + '); console.log(typeof b);'],
    { encoding: 'utf8' });
    assert.equal(output.trim(), 'function');
});

test('scoped --require loads the Mocha coverage hook and instruments a real required file', () => {
    const root = path.resolve(__dirname, '..');
    const code = `
        const assert = require('node:assert/strict');
        process.argv = [process.execPath, '/tmp/node_modules/mocha/bin/mocha', '--require', '@stackline/blanket'];
        const blanket = require(${JSON.stringify(root)});
        assert.equal(typeof blanket.instrumentSync, 'function');
        blanket.options('filter', ${JSON.stringify(path.join(root, 'test/fixtures/strict-module.js'))});
        const result = require(${JSON.stringify(path.join(root, 'test/fixtures/strict-module.js'))});
        assert.equal(result(), true);
        assert.ok(Object.keys(global._$jscoverage).some(key => key.endsWith('strict-module.js')));
        blanket.restoreNormalLoader();
    `;
    execFileSync(process.execPath, ['-e', code], { cwd: root, encoding: 'utf8' });
});

for (const file of [
    'qunit/blanket.js', 'qunit/blanket.min.js',
    'mocha/blanket_mocha.js', 'mocha/blanket_mocha.min.js',
    'jasmine/blanket_jasmine.js', 'jasmine/blanket_jasmine.min.js'
]) {
    test('distributed browser instrumenter preserves directives: ' + file, () => {
        const env = {};
        const context = {
            console, document: { scripts: [{ attributes: [] }], readyState: 'loading' },
            addEventListener() {},
            mocha: { _reporter: function Reporter() {}, reporter() {}, run() {} },
            jasmine: { getEnv: () => env }
        };
        context.window = context;
        vm.createContext(context);
        vm.runInContext(fs.readFileSync(path.join(__dirname, '../dist', file), 'utf8'), context);
        assert.equal(evaluate(context.blanket, strictFunction, file, context).result, true);
        assert.ok(context._$blanket[file]);
    });
}
