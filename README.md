# personnummer.js

Javascript script to validate and parse Swedish personal identity numbers

## Installing

Install the module with npm: `npm install --save personnummer.js`

## Basic usage

```javascript
var personnummer = require('personnummer.js');

personnummer.validate('970214-9890');
// true

personnummer.validate('123456-7890');
// false

personnummer.normalise('870724-1082');
// '198707241082'

personnummer.parse('710904-5307');
/*
{
  valid: true,
  input: '710904-5307',
  normalised: '197109045307',
  date: 1971-09-04T00:00:00.000Z, // Date object
  age: 47,
  gender: 'female',
  birthplace: 'göteborgs och bohus län' // only defined if personal number < 1990
}
*/
```

## Functions

### Description

| Function                                 | Description                                                                                                |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **validate(personalNumber [, options])** | Checks if the input personal number is a valid Swedish personal number.                                    |
| **normalise(personalNumber)**            | Normalises the input to the following format `year month day serial`. E.g. `960417-5050` -> `199604175050` |
| **parse(personalNumber [, options])**    | Parses the personal number and returns an object. See basic usage.                                         |

### Returns

| Function                                 | Returns                                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **validate(personalNumber [, options])** | boolean. true if valid, false if not.                                                                                                                                                                                                                                                                                          |
| **normalise(personalNumber)**            | string or false if input is not a recognised personal number format.                                                                                                                                                                                                                                                           |
| **parse(personalNumber [, options])**    | returns an object with: `valid` (boolean), `input` (string),`normalised` (string), `date` (Date object),`age` (number), `gender` (string: male or female), `birthplace` (string or undefined if personal number > 1990). If the personal number is invalid: resturns `valid:false` and a `reason:'example reason'` and `input` |

### Options

| Option    | Input                  | Description                                                                                                                                                                   |
| --------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| strict    | boolean: default false | sets strict validation, i.e. personal number can not be from the future, can not be older than 120 years, and separator must match age (- for age &lt; 100 + for ages >= 100) |
| forgiving | boolean: default false | if the user possibly incorrectly used a '+' separator instead of a '-' separator and produces an age >= 120 forgive them and correct their mistake                            |

Recommended options are: `{strict:true, forgiving:false}`. Additionally the option `verbose` (true|false) can be passed to parse. It will then return a reason like the parse function.

### Examples

```javascript
var personnummer = require('personnummer.js');

personnummer.parse( '980417+6320', { strict: false, forgiving: false } );
/*
{ valid: true,
  input: '980417+6320',
  normalised: '189804176320',
  date: 1898-04-17T00:00:00.000Z,
  age: 121,
  gender: 'female',
  birthplace: 'värmlands län'
}
*/

personnummer.parse( '980417+6320', { strict: true, forgiving: false } );
// { valid: false, reason: 'age is too old', input: '980417+6320' }

personnummer.parse( '980417+6320', { strict: true, forgiving: true } );
/*
{ valid: true,
  input: '980417+6320',
  normalised: '199804176320',
  date: 1998-04-17T00:00:00.000Z,
  age: 21,
  gender: 'female',
  birthplace: undefined
}
*/
```

### Invalid reasons

Possible reasons the `parse` function could return if personal number is invalid.

| Return             | Reason                                                                     | ex. input        |
| ------------------ | -------------------------------------------------------------------------- | ---------------- |
| invalid input type | input type is not string or number                                         | \[]              |
| invalid format     | the input personal number is of invalid format                             | +46-498-xx-34-xx |
| date is incorrect  | the input date is incorrect                                                | 010143-0987      |
| invalid checksum   | the personal number is incorrect, checksum of personal number is incorrect | 050607-4381      |

if `strict` option is enabled:

| Return                             | Reason                                                   | ex. input     |
| ---------------------------------- | -------------------------------------------------------- | ------------- |
| century and separator contradict   | if the age >= 100 but the separator is '-' or vice versa | 19181120-1829 |
| personal number is from the future | personal numbers date is from the future                 | 20300330-3975 |
| age is too old                     | the age of the personal number is too old                | 18971224+5472 |

## Testing

Run `npm test` (make sure you have all devDependencies installed)

## Contributing

See `CONTRIBUTING.md`

## License

GNU General Public License v3.0 ([GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.en.html)) or later.
