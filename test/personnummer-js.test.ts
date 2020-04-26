/* eslint-disable */

import assert from "assert";

import { luhnAlgorithm } from "../src/luhnAlgorithm";
// import { parseDate } from "../src/personalNumber/parseDate";

import { parse as parsePN, validate as validatePN, normalise as normalisePN, parseCIN, validateCIN, normaliseCIN } from "../src/index";

describe("#luhnAlgorithm()", function () {
    it("should return correct: luhn number", function () {
        assert.strictEqual(6, luhnAlgorithm(811218987));
        assert.strictEqual(6, luhnAlgorithm("000101812"));
        assert.strictEqual(0, luhnAlgorithm(870723534));
        assert.strictEqual(2, luhnAlgorithm("930311420"));
    });
});

describe("#parseDate()", function () {
    it("should return correct: luhn number", function () {
        assert.strictEqual(6, luhnAlgorithm(811218987));
        assert.strictEqual(6, luhnAlgorithm("000101812"));
        assert.strictEqual(0, luhnAlgorithm(870723534));
        assert.strictEqual(2, luhnAlgorithm("930311420"));
    });
});

describe("#normalisePN()", function () {
    it("should return correct: normalised personal number", function () {
        assert.strictEqual("194501038220", normalisePN("450103-8220"));
        assert.strictEqual("198707235340", normalisePN(8707235340));
        assert.strictEqual("199303114202", normalisePN("9303114202"));
        assert.strictEqual("191811293057", normalisePN("19181129+3057"));
        assert.strictEqual("200001018126", normalisePN("0001018126"));
        assert.strictEqual("200710290024", normalisePN("071029-0024"));
        assert.strictEqual("200304059231", normalisePN("030405-9231"));
    });
});

describe("#validatePN()", function () {
    it("should validate: correct personnummer", function () {
        assert.strictEqual(true, validatePN("450103-8220"));
        assert.strictEqual(true, validatePN("870613-5657"));
        assert.strictEqual(true, validatePN(9307174459));
        assert.strictEqual(true, validatePN("0010237808"));
        assert.strictEqual(true, validatePN("0512240169"));
        assert.strictEqual(true, validatePN("150314+5425"));
        assert.strictEqual(true, validatePN("0512240169"));
        assert.strictEqual(true, validatePN("19181129+3057"));
    });

    it("should not validate: incorrect personnummer dates", function () {
        assert.strictEqual(false, validatePN("999999-5476"));
        assert.strictEqual(false, validatePN("191313-8473"));
        assert.strictEqual(false, validatePN(1006334351));
        assert.strictEqual(false, validatePN("0014234561"));
    });

    it("should not validate: incorrect personnummer format or incorrect type", function () {
        assert.strictEqual(false, validatePN(undefined as any));
        assert.strictEqual(false, validatePN(null as any));
        assert.strictEqual(false, validatePN([] as any));
        assert.strictEqual(false, validatePN({} as any));
        assert.strictEqual(false, validatePN(false as any));
        assert.strictEqual(false, validatePN(true as any));
        assert.strictEqual(false, validatePN(123));
        assert.strictEqual(false, validatePN("123"));
        assert.strictEqual(false, validatePN("123-123"));
        assert.strictEqual(false, validatePN("123_123"));
        assert.strictEqual(false, validatePN("123?123"));
        assert.strictEqual(false, validatePN("string"));
        assert.strictEqual(false, validatePN("123-abc"));
        assert.strictEqual(false, validatePN("670427-554"));
        assert.strictEqual(false, validatePN("040229-074"));
    });

    it("should not validate: incorrect personnummer checksum", function () {
        assert.strictEqual(false, validatePN("320323-9325"));
        assert.strictEqual(false, validatePN("870514-3202"));
        assert.strictEqual(false, validatePN(1806282244));
        assert.strictEqual(false, validatePN("471224-0907"));
    });

    it("should validate: co-ordination numbers", function () {
        assert.strictEqual(true, validatePN("0411643844"));
        assert.strictEqual(true, validatePN(1103784755));
        assert.strictEqual(true, validatePN("0311803860"));
        assert.strictEqual(true, validatePN("430688-0362"));
    });

    it("should not validate: incorrect co-ordination numbers", function () {
        assert.strictEqual(false, validatePN("370567-4738"));
        assert.strictEqual(false, validatePN("871161-2345"));
        assert.strictEqual(false, validatePN(121272846));
        assert.strictEqual(false, validatePN("080690-4857"));
    });

    it("should validate: correct leapyear", function () {
        assert.strictEqual(true, validatePN("20000229-6127"));
        assert.strictEqual(true, validatePN(9602296973));
        assert.strictEqual(true, validatePN(9202294402));
        assert.strictEqual(true, validatePN("960229-6973"));
    });

    it("should not validate: incorrect leapyear", function () {
        assert.strictEqual(false, validatePN("20010229-2391"));
        assert.strictEqual(false, validatePN(9802293231));
        assert.strictEqual(false, validatePN(200002293243));
        assert.strictEqual(false, validatePN("960229-4534"));
    });
});

describe("#validateCIN()", function () {
    it("should validate correct: corporate identity number", function () {
        assert.strictEqual(true, validateCIN("502068-4865"));
        assert.strictEqual(true, validateCIN("556754-8283"));
        assert.strictEqual(true, validateCIN("802521-6220"));
        assert.strictEqual(true, validateCIN("802467-7182"));
    });
});

describe("#normaliseCIN()", function () {
    it("should normalise correct: corporate identity number", function () {
        assert.strictEqual("165020684865", normaliseCIN("502068-4865"));
        assert.strictEqual("165567548283", normaliseCIN("5567548283"));
        assert.strictEqual("168025216220", normaliseCIN("16802521-6220"));
        assert.strictEqual("168024677182", normaliseCIN("168024677182"));
        assert.strictEqual("198706135657", normaliseCIN("870613-5657"));
    });
});
