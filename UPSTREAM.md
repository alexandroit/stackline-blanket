# Upstream basis

- Package: `blanket@1.2.3`, published 2016-03-19.
- Registry artifact: https://registry.npmjs.org/blanket/-/blanket-1.2.3.tgz
- Integrity: `sha512-u0jo0RgUaVK45tEWOBq8BhexulW74S0NcGmmqTXRyCc3bSl76TQgk6+NP0/+EWvBVAMBMyd9AffGXKFWkN8Eww==`.
- Upstream project: https://github.com/alex-seville/blanket
- Original release-era commit: [8047c29f338d60f7e39522ba07045f8556f7b4b8](https://github.com/alex-seville/blanket/commit/8047c29f338d60f7e39522ba07045f8556f7b4b8).
- License: the plain MIT license from the published 1.2.3 artifact. The original LICENSE and Alex Seville attribution are retained. This fork does not import the different license subsequently placed on the upstream default branch.

The initial import is the exact published npm artifact. Browser distribution files are now rebuilt with a small Node.js script, using the same source and adapter ordering as the release-era Grunt configuration. The obsolete Grunt/PhantomJS development toolchain is not needed.

The directive fix addresses [#340](https://github.com/alex-seville/blanket/issues/340), confirmed against the published artifact. It preserves actual directive prologues and avoids carrying program-level strictness into the next file. Regression tests execute the generated code and published browser bundles.

The internal `falafel` helper derives from version 1.2.0, with native array/object helpers replacing old shims. The `xtend` helper retains the implementation from version 4.0.2. Acorn is updated while the default `ecmaVersion: 5` setting remains. Full third-party license text is in THIRD_PARTY_NOTICES.md.

No vulnerability claim is made: the isolated published baseline runtime installation had no npm audit advisories on 2026-09-27. This fork has its own 1.x version series and does not imply upstream endorsement.
