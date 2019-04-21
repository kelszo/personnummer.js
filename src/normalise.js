var parseDate = require( './parseDate' );

module.exports = function normalise( input ) {
  // checks that the input is of correct type
  if ( typeof input !== 'number' && typeof input !== 'string' ) {
    return false;
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
    return false;
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
  if ( !date.valid ) return false;
  date = date.date;

  // normalises the personal number to the format year|month|day|serial|gender|checksum
  // e.g. 970214-5641 will become 199702145641
  return date.getFullYear() + monthNum + dayNum + serialNum + genderNum + checkNum;
};