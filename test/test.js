/* eslint-disable */

const assert = require( 'assert' );
const luhnAlgorithm = require( './../src/luhnAlgorithm' );
const parseDate = require( './../src/personalNumber/parseDate' );

const personnummer = require( './../index' );

const parse = personnummer.parse;
const validate = personnummer.validate;
const normalise = personnummer.normalise;

const parseCIN = personnummer.parseCIN;
const validateCIN = personnummer.validateCIN;
const normaliseCIN = personnummer.normaliseCIN;

describe( '#luhnAlgorithm()', function () {
  it( 'should return correct: luhn number', function () {
    assert.strictEqual( 6, luhnAlgorithm( 811218987 ) );
    assert.strictEqual( 6, luhnAlgorithm( '000101812' ) );
    assert.strictEqual( 0, luhnAlgorithm( 870723534 ) );
    assert.strictEqual( 2, luhnAlgorithm( '930311420' ) );
  } );
} );

describe( '#parseDate()', function () {
  it( 'should return correct: luhn number', function () {
    assert.strictEqual( 6, luhnAlgorithm( 811218987 ) );
    assert.strictEqual( 6, luhnAlgorithm( '000101812' ) );
    assert.strictEqual( 0, luhnAlgorithm( 870723534 ) );
    assert.strictEqual( 2, luhnAlgorithm( '930311420' ) );
  } );
} );

describe( '#normalise()', function () {
  it( 'should return correct: normalised personal number', function () {
    assert.strictEqual( '194501038220', normalise( '450103-8220' ) );
    assert.strictEqual( '198707235340', normalise( 8707235340 ) );
    assert.strictEqual( '199303114202', normalise( '9303114202' ) );
    assert.strictEqual( '191811293057', normalise( '19181129+3057' ) );
    assert.strictEqual( '200001018126', normalise( '0001018126' ) );
    assert.strictEqual( '200710290024', normalise( '071029-0024' ) );
    assert.strictEqual( '200304059231', normalise( '030405-9231' ) );
  } );
} );

describe( '#validate()', function () {
  it( 'should validate: correct personnummer', function () {
    assert.strictEqual( true, validate( '450103-8220' ) );
    assert.strictEqual( true, validate( '870613-5657' ) );
    assert.strictEqual( true, validate( 9307174459 ) );
    assert.strictEqual( true, validate( '0010237808' ) );
    assert.strictEqual( true, validate( '0512240169' ) );
    assert.strictEqual( true, validate( '150314+5425' ) );
    assert.strictEqual( true, validate( '0512240169' ) );
    assert.strictEqual( true, validate( '19181129+3057' ) );
  } );

  it( 'should not validate: incorrect personnummer dates', function () {
    assert.strictEqual( false, validate( '999999-5476' ) );
    assert.strictEqual( false, validate( '191313-8473' ) );
    assert.strictEqual( false, validate( 1006334351 ) );
    assert.strictEqual( false, validate( '0014234561' ) );
  } );

  it( 'should not validate: incorrect personnummer format or incorrect type', function () {
    assert.strictEqual( false, validate( undefined ) );
    assert.strictEqual( false, validate( null ) );
    assert.strictEqual( false, validate( [] ) );
    assert.strictEqual( false, validate( {} ) );
    assert.strictEqual( false, validate( false ) );
    assert.strictEqual( false, validate( true ) );
    assert.strictEqual( false, validate( 123 ) );
    assert.strictEqual( false, validate( '123' ) );
    assert.strictEqual( false, validate( '123-123' ) );
    assert.strictEqual( false, validate( '123_123' ) );
    assert.strictEqual( false, validate( '123?123' ) );
    assert.strictEqual( false, validate( 'string' ) );
    assert.strictEqual( false, validate( '123-abc' ) );
    assert.strictEqual( false, validate( '670427-554' ) );
    assert.strictEqual( false, validate( '040229-074' ) );
  } );

  it( 'should not validate: incorrect personnummer checksum', function () {
    assert.strictEqual( false, validate( '320323-9325' ) );
    assert.strictEqual( false, validate( '870514-3202' ) );
    assert.strictEqual( false, validate( 0808083469 ) );
    assert.strictEqual( false, validate( 1806282244 ) );
    assert.strictEqual( false, validate( '471224-0907' ) );
  } );

  it( 'should validate: co-ordination numbers', function () {
    assert.strictEqual( true, validate( '0411643844' ) );
    assert.strictEqual( true, validate( 1103784755 ) );
    assert.strictEqual( true, validate( '0311803860' ) );
    assert.strictEqual( true, validate( '430688-0362' ) );
  } );

  it( 'should not validate: incorrect co-ordination numbers', function () {
    assert.strictEqual( false, validate( '370567-4738' ) );
    assert.strictEqual( false, validate( '871161-2345' ) );
    assert.strictEqual( false, validate( 0001877584 ) );
    assert.strictEqual( false, validate( 121272846 ) );
    assert.strictEqual( false, validate( '080690-4857' ) );
  } );

  it( 'should validate: correct leapyear', function () {
    assert.strictEqual( true, validate( '20000229-6127' ) );
    assert.strictEqual( true, validate( 9602296973 ) );
    assert.strictEqual( true, validate( 9202294402 ) );
    assert.strictEqual( true, validate( '960229-6973' ) );
  } );

  it( 'should not validate: incorrect leapyear', function () {
    assert.strictEqual( false, validate( '20010229-2391' ) );
    assert.strictEqual( false, validate( 9802293231 ) );
    assert.strictEqual( false, validate( 200002293243 ) );
    assert.strictEqual( false, validate( '960229-4534' ) );
  } );
} );

describe( '#validateCIN()', function () {
  it( 'should validate correct: corporate identity number', function () {
    assert.strictEqual( true, validateCIN( '502068-4865' ) );
    assert.strictEqual( true, validateCIN( '556754-8283' ) );
    assert.strictEqual( true, validateCIN( '802521-6220' ) );
    assert.strictEqual( true, validateCIN( '802467-7182' ) );
  } );
} );

describe( '#normaliseCIN()', function () {
  it( 'should normalise correct: corporate identity number', function () {
    assert.strictEqual( '165020684865', normaliseCIN( '502068-4865' ) );
    assert.strictEqual( '165567548283', normaliseCIN( '5567548283' ) );
    assert.strictEqual( '168025216220', normaliseCIN( '16802521-6220' ) );
    assert.strictEqual( '168024677182', normaliseCIN( '168024677182' ) );
    assert.strictEqual( '198706135657', normaliseCIN( '870613-5657' ) );
  } );
} );