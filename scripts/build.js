'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { minify } = require('terser');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');

async function build() {
    const banner = '/*! @stackline/blanket - v' + require('../package.json').version +
        '; based on Blanket.js 1.2.3 (MIT). See THIRD_PARTY_NOTICES.md. */\n';
    const parser = '(function(define,module,exports){\n' + read('node_modules/acorn/dist/acorn.js') +
        '\n})(undefined,undefined,undefined);\n';
    const walker = '(function(require,module){\n' + read('src/vendor/falafel.js') +
        '\nwindow.falafel = module.exports;})(function(name){if(name === "acorn") return window.acorn;' +
        'throw new Error("Unknown parser dependency: " + name);},{exports:{}});\n';
    const common = [
        'src/blanket.js', 'src/blanket_browser.js', 'src/qunit/reporter.js',
        'src/config.js', 'src/blanketRequire.js'
    ];
    for (const [kind, filename, adapter] of [
        ['qunit', 'blanket', 'src/qunit/qunit.js'],
        ['jasmine', 'blanket_jasmine', 'src/adapters/jasmine-blanket.js'],
        ['mocha', 'blanket_mocha', 'src/adapters/mocha-blanket.js']
    ]) {
        const code = banner + (kind === 'qunit' ? read('src/qunit/noautorun.js') + '\n' : '') +
            parser + walker + [...common, adapter].map(read).join('\n');
        const result = await minify(code, {
            ecma: 5, compress: false, mangle: true,
            format: { ascii_only: true, comments: /^!|@license|@preserve/ }
        });
        fs.writeFileSync(path.join(root, 'dist', kind, filename + '.js'), code);
        fs.writeFileSync(path.join(root, 'dist', kind, filename + '.min.js'), result.code + '\n');
    }
}

build().catch(error => { console.error(error); process.exitCode = 1; });
