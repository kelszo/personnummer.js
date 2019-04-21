var parse = require( './src/personalNumber/parse' );

var parseCin = require( './src/corporateIdentityNumber/parse' );

module.exports.parse = parse;

module.exports.validate = function ( input, options ) {
  return parse( input, options ).valid;
};

module.exports.normalise = function ( input, options ) {
  var pn = parse( input, options );
  if ( pn.valid ) return pn.normalised;
  else return false;
};

module.exports.parseCIN = function ( input ) {
  var cin = parseCin( input );
  var pn;

  if ( cin.valid ) return cin;
  else {
    pn = parse( input, { strict: true } );
  }

  if ( pn.valid ) {
    pn.type = 'Enskild firma';
    return pn;
  }

  return cin;
};

module.exports.validateCIN = function ( input ) {
  var cin = parseCin( input );
  var pn;

  if ( cin.valid ) return true;
  else {
    pn = parse( input, { strict: true } );
  }

  if ( pn.valid ) return true;
  return false;
};

module.exports.normaliseCIN = function ( input ) {
  var cin = parseCin( input, { strict: true } );
  var pn;

  if ( cin.valid ) return cin.normalised;
  else {
    pn = parse( input );
  }

  if ( pn.valid ) return pn.normalised;
  return false;
};