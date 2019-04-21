var luhnAlgorithm = require( './../luhnAlgorithm' );

var groupNumber = {
  1: 'Dödsbon',
  2: 'Stat, landsting, kommuner, församlingar',
  3: 'Utländska företag som bedriver näringsverksamhet eller äger fastigheter i Sverige',
  5: 'Aktiebolag',
  6: 'Enkelt bolag',
  7: 'Ekonomiska föreningar',
  8: 'Ideella föreningar och stiftelser',
  9: 'Handelsbolag, kommanditbolag och enkla bolag'
};


module.exports = function parse( input, options ) {
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
  var reg = /^(\d{2}){0,1}(\d{1})(\d{1})(\d{2})(\d{2})([-]{0,1})?(\d{3})(\d{1})$/g;
  var group = reg.exec( input );

  // checks if input is of correct personal number format
  if ( !group ) return { valid: false, reason: 'invalid format', input: input };


  // unpacks regex groups into variables
  var orgIdentifierNum = group[ 1 ]; // in some cases org numbers start with the num 16
  var groupNum = group[ 2 ];
  var orgNum1 = group[ 3 ];
  var orgValidation = group[ 4 ];
  var orgNum3 = group[ 5 ];
  var sep = group[ 6 ];
  var orgNum4 = group[ 7 ];
  var checkNum = group[ 8 ];

  if ( +groupNum === 4 ) return { valid: false, reason: 'invalid group number', input: input };
  if ( +orgValidation < 20 ) return { valid: false, reason: 'invalid organisations validation number', input: input };
  if ( orgIdentifierNum && orgIdentifierNum !== '16' ) return { valid: false, reason: 'invalid organisations number identifier', input: input };

  // validates control number using luhns algorithm
  if ( luhnAlgorithm( '' + groupNum + orgNum1 + orgValidation + orgNum3 + orgNum4 ) !== +checkNum ) {
    return { valid: false, reason: 'invalid checksum', input: input };
  }

  var type = groupNumber[ groupNum ];
  var normalised = '16' + groupNum + orgNum1 + orgValidation + orgNum3 + orgNum4 + checkNum;

  return { valid: true, type: type, input: input, normalised: normalised };
};