var luhnAlgorithm = require( './luhnAlgorithm' );
var parseDate = require( './parseDate' );

module.exports = function validate( input, options ) {
  // checks that the input is of correct type
  if ( typeof input !== 'number' && typeof input !== 'string' ) {
    return { valid: false, reason: 'invalid input type', input: input };
  }

  // coerce input to string
  input = '' + input;

  /** Regex is:
   *  possible 2 digits (century), 2 digits year, 2 digits month, 2 digits date,
   *  possible separator (-|+) (needed if the person is older than 100)
   *  2 digits (birthplace if year < 1990), 1 digit (gender: odd if male, even if female), 1 digit (checksum used in luhn algorithm)
   */
  var reg = /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([-|+]{0,1})?(\d{2})(\d{1})(\d{1})$/g;
  var group = reg.exec( input );

  // checks if input is of correct personal number format
  if ( !group ) {
    return { valid: false, reason: 'invalid format', input: input };
  }

  // unpacks regex groups into variables
  var centuryNum = group[ 1 ];
  var yearNum = group[ 2 ];
  var monthNum = group[ 3 ];
  var dayNum = group[ 4 ];
  var sep = group[ 5 ];
  var serialNum = group[ 6 ];
  var genderNum = group[ 7 ];
  var checkNum = group[ 8 ];

  // parses and checks date
  var date = parseDate( +yearNum, +monthNum, +dayNum, sep, centuryNum );
  if ( !date.valid ) return { valid: false, reason: date.reason, input: input };
  date = date.date;

  // validates control number using luhns algorithm
  if ( luhnAlgorithm( '' + yearNum + monthNum + dayNum + serialNum + genderNum ) !== +checkNum ) {
    return { valid: false, reason: 'invalid checksum', input: input };
  }

  // calculates age
  var age = ~~( ( Date.now() - +date ) / ( 31557600000 ) );

  // if validation is strict, i.e. separator must match the age (this may occur if the user uses a incorrectly separator in addition to specifying the century)
  // the personal number can not be from the future
  // the age can not be greater than 120
  if ( options && options.strict ) {
    // if validation is forgiving, i.e. if the user possibly incorrectly used a '+' separator instead of a '-' separator
    // this will in most cases produce an age over 120
    if ( options.forgiving ) {
      if ( age < 100 && sep === '+' ) sep = '-';
      else if ( age >= 100 && sep === '-' ) sep = '+';

      if ( !centuryNum && age > 120 ) {
        age -= 100;
        sep = '-';
        date = new Date( Date.UTC( date.getFullYear() + 100, date.getMonth(), date.getDate() ) );
      } else if ( centuryNum && age < 0 ) {
        age += 100;
        sep = '-';
        date = new Date( Date.UTC( date.getFullYear() - 100, date.getMonth(), date.getDate() ) );
      }
    }

    // validates strict
    if ( !( centuryNum && options.forgiving ) && sep && ( ( age >= 100 && sep === '-' ) || ( age < 100 && sep === '+' ) ) ) return { valid: false, reason: 'century and separator contradict', input: input };
    if ( date > new Date() ) return { valid: false, reason: 'personal number is from the future', input: input };
    if ( age > 120 ) return { valid: false, reason: 'age is too old', input: input };
  }

  return { valid: true, input: input };
};