# personnummer.js

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://img.shields.io/npm/v/personnummer.js.svg?style=popout-square)](https://www.npmjs.com/package/personnummer.js)
![Github issues](https://img.shields.io/github/issues/kelszo/personnummer.js.svg?style=popout-square)

JavaScript script (written in TypeScript) to validate and parse Swedish personal identity numbers. Fixes problems other packages fail to fix, e.g.: leap years, co-ordination numbers (samordningsnummer), parsing, and strict validation; while being backed by tests. **All in one small package without dependencies. Works for Swedish personal numbers of all formats, see examples below.**

Also works with Swedish organisations numbers.

## Installing

Install the module with npm: `npm install personnummer.js`

## Basic usage

```javascript
var personnummer = require("personnummer.js");

// valid personal number formats: yymmdd-nnnn yyyymmdd-nnnn yymmddnnnn yyyymmddnnnn yymmdd+nnnn yyyymmdd+nnnn
// valid personal number formats ex.: 040506-7356, 9912188324, 19780329-2833, 201005047640, 180604+0448

personnummer.validate("970214-9890");
// true

personnummer.validate("0708089396");
// true

personnummer.validate("123456-7890");
// false

personnummer.normalise("870724-1082");
// '198707241082'

personnummer.parse("19710904-5307");
/*
{
  valid: true,
  type: 'PERSONNUMMER',
  input: '19710904-5307',
  normalised: '197109045307',
  date: 1971-09-04T00:00:00.000Z,
  age: 47,
  gender: 'FEMALE',
  birthplace: 'Göteborgs och bohus län'
}
*/

personnummer.parse("0411643844", { normaliseFormat: "YYMMDD-NNNN" });
/*
{
  valid: true,
  type: 'SAMORDNINGSNUMMER',
  input: '0411643844',
  normalised: '041164-3844',
  date: 2004-11-04T00:00:00.000Z,
  age: 17,
  gender: 'FEMALE',
  birthplace: undefined
}
*/

personnummer.parseCIN("556007-3495");
/*
{
  valid: true,
  type: 'Aktiebolag',
  input: '556007-3495',
  normalised: '165560073495'
}
*/
```

## Functions

### Personal Number

#### Description

| Function                       | Description                                                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| **validate(str [, options])**  | Checks if the input personal number is a valid Swedish personal number.                                                   |
| **normalise(str [, options])** | Normalises the input. Default format: `yyyymmddnnnn`. E.g. `960417-5050` -> `199604175050`. See `options.normaliseFormat` |
| **parse(str [, options])**     | Parses the personal number and returns an object. See basic usage.                                                        |

#### Returns

| Function                      | Returns                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **validate(str [, options])** | boolean. true if valid, false if not.                                                                                                                                                                                                                                                                                                                          |
| **normalise(str [,options])** | string, can be empty if personal number is not valid.                                                                                                                                                                                                                                                                                                          |
| **parse(str [, options])**    | Returns an object with: `valid` (boolean), `input` (string), `normalised` (string), `date` (Date object), `age` (number), `gender` (string: male or female), `birthplace` (string or undefined if personal number > 1990). If the personal number is invalid: resturns `valid:false` and a `reason:'example reason'` and `input`. See basic usage or examples. |

#### Options

| Option              | Input                           | Description                                                                                                                                       |
| ------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **strict**          | `boolean (default true)`        | Sets strict validation, i.e. personal number can not be from the future and separator must match age (`-` for age &lt; 100 `+` for ages >= 100)   |
| **forgiving**       | `boolean (default true)`        | If the user possibly incorrectly used a '+' separator instead of a '-' separator forgive them and correct their mistake.                          |
| **normaliseFormat** | `string (default YYYYMMDDNNNN)` | Normalise the personal number to that format. Allowed format tokens: `YYYY`, `YY`, `MM`, `DD`, `-` or `+` (separator), `NNNN`. E.g. `YYMMDD-NNNN` |

### Examples

```javascript
var personnummer = require("personnummer.js");

personnummer.parse("19980417+6320", { normaliseFormat: "YYYYMMDD-NNNN" });
/*
{
  valid: true,
  type: 'PERSONNUMMER',
  input: '19980417+6320',
  normalised: '19980417-6320',
  date: 1998-04-17T00:00:00.000Z,
  age: 24,
  gender: 'FEMALE',
  birthplace: undefined
}
*/

personnummer.parse("19980417+6320", { normaliseFormat: "YYYYMMDD-NNNN", forgiving: false });
/*
{
  valid: false,
  reason: 'AGE_SEPARATOR_CONTRADICTION',
  input: '19980417+6320'
}
*/
```

#### Invalid reasons

Possible reasons the `parse` function could return if personal number is invalid.

| Return         | Reason                                                                      | ex. input        |
| -------------- | --------------------------------------------------------------------------- | ---------------- |
| INPUT_TYPE     | Input type is not string or number.                                         | \[]              |
| FORMAT         | The input personal number is of invalid format.                             | +46-498-xx-34-xx |
| INCORRECT_DATE | The input date is incorrect.                                                | 010143-0987      |
| CHECKSUM       | The personal number is incorrect, checksum of personal number is incorrect. | 050607-4381      |

if `strict` option is enabled:

| Return                      | Reason                                                    | ex. input     |
| --------------------------- | --------------------------------------------------------- | ------------- |
| AGE_SEPARATOR_CONTRADICTION | If the age >= 100 but the separator is '-' or vice versa. | 19181120-1829 |
| BACK_TO_THE_FUTURE          | Personal numbers date is from the future.                 | 20300330-3975 |
| AGE_IS_TOO_OLD              | The age of the personal number is too old.                | 18971224+5472 |

### Corporate Identity Number (CIN)

Note that a CIN in Sweden can be a personal number. This package takes that into account, ex. parsing a valid personal number to this function will return `type:'Enskild firma'` (along with other properties).

#### Description

| Function                         | Description                                                                        |
| -------------------------------- | ---------------------------------------------------------------------------------- |
| **validateCIN(str [, options])** | Checks if the input personal number is a valid Swedish personal number.            |
| **normaliseCIN(str)**            | Normalises the input to the following format. E.g. `802521-6220` -> `168025216220` |
| **parseCIN(str [, options])**    | Parses the personal number and returns an object. See basic usage or examples.     |

#### Returns

| Function                         | Returns                                                                                                               |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| **validateCIN(str [, options])** | boolean. true if valid, false if not.                                                                                 |
| **normaliseCIN(str [,options])** | string, is undefined if corporate identity number is not valid                                                        |
| **parseCIN(str [, options])**    | Returns an object with: `valid` (boolean), `input` (string), `normalised` (string), `type` (string). See basic usage. |

#### Options

| Option                 | Input                     | Description                                                                       |
| ---------------------- | ------------------------- | --------------------------------------------------------------------------------- |
| **shortNormalisation** | `boolean (default false)` | If true normalise organisation number to `NNNNNN-NNNN` format. I.e. `556007-3495` |

#### Invalid reasons

Possible reasons the `parse` function could return if personal number is invalid.

| Return                          | Reason                                                 | ex. input        |
| ------------------------------- | ------------------------------------------------------ | ---------------- |
| INPUT_TYPE                      | Input type is not string or number.                    | \[]              |
| FORMAT                          | The input CIN is of invalid format.                    | +46-498-xx-34-xx |
| GROUP_NUMBER                    | The group number (first of the 10 numbers) is 4        | 426002-7557      |
| ORGANISATIONS_VALIDATION_NUMBER | The CINs 3 and 4 number is &lt; 20                     | 961547-1286      |
| ORGANISATIONS_NUMBER_IDENTIFIER | If the CIN is 12 charachters the first 2 have to be 16 | 13446265-4349    |
| CHECKSUM                        | The CIN is incorrect, checksum of CIN is incorrect.    | 556007-3492      |

#### Examples

```javascript
var personnummer = require("personnummer.js");

personnummer.parseCIN("556007-3495");
/*
{
  valid: true,
  type: 'Aktiebolag',
  input: '556007-3495',
  normalised: '165560073495'
}
*/

pn.parseCIN("969667-6312", { shortNormalisation: true });
/*
{
  valid: true,
  type: 'Handelsbolag, kommanditbolag och enkla bolag',
  input: '969667-6312',
  normalised: '969667-6312'
}
*/

personnummer.parseCIN("19870923-7393");
/*
{
  valid: true,
  type: 'Enskild firma',
  input: '19870923-7393',
  normalised: '198709237393',
  date: 1987-09-23T00:00:00.000Z,
  age: 31,
  gender: 'MALE',
  birthplace: 'Kopparbergs län'
}
*/

personnummer.parseCIN("556339-2279");
/*
{
  valid: false,
  reason: 'CHECKSUM',
  input: '556238-2279'
}
*/
```

## Testing

Run `yarn test` (make sure you have all devDependencies installed)

## Contributing

See `CONTRIBUTING.md`

## License

[MIT](https://opensource.org/licenses/MIT)
See `LICENSE`
