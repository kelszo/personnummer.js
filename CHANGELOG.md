# Changelog for personnummer.js

## 2.2.0

Added normalisation format option. Types our now mostly enums. Removed forgiving logic around if age > 120. Strict and forgiving are now default true.

## 2.1.0

UTC fixes

## 2.0.0

Rewrite to TypeScript. Change of license to MIT.

A lot of API breaking changes. Constants such as `gender`, `errors`, and `personal number types` are now caps, ex. `male` => `MALE`.

## 1.1.0

-   Added type to personnummer.validate(). It can either be `personnummer` or `samordningsnummer`.
-   Removed optimised `validate` and `normalise` functions since benchmarking showed little to no difference.
-   Added `parseCIN`, `normaliseCIN`, and `validateCIN`.
-   Updated `README` to account for updates.

## 1.0.1

Added some additional keywords to package.json and cleaned `README.md`
