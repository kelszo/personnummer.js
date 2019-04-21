var parse = require( './src/parse' );
var normalise = require( './src/normalise' );
var validate = require( './src/validate' );

module.exports.parse = parse;

module.exports.validate = function ( input, options ) {
  if ( options && options.verbose ) return validate( input, options );
  else return validate( input, options ).valid;
};

module.exports.normalise = normalise;