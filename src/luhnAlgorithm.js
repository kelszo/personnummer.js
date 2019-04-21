// this is just Luhn's algorithm, more on wikipedia
module.exports = function luhnAlgorithm( input ) {
  var sum = 0;
  input = '' + input;

  for ( var i = 0, l = input.length; i < l; i++ ) {
    let v = input[ i ];
    v *= 2 - ( i % 2 );
    if ( v > 9 ) v -= 9;
    sum += v;
  }

  return ( 10 - ( sum % 10 ) ) % 10;
};