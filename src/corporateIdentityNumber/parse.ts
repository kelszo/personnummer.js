import { luhnAlgorithm } from "../luhnAlgorithm";
import { CorporateIdentityNumberReturn, CorporateIdentityType } from "../types";

const groupNumber: { [key: number]: string } = {
    1: "Dödsbon",
    2: "Stat, landsting, kommuner, församlingar",
    3: "Utländska företag som bedriver näringsverksamhet eller äger fastigheter i Sverige",
    5: "Aktiebolag",
    6: "Enkelt bolag",
    7: "Ekonomiska föreningar",
    8: "Ideella föreningar och stiftelser",
    9: "Handelsbolag, kommanditbolag och enkla bolag",
};

function parse(input: string | number): CorporateIdentityNumberReturn {
    // checks that the input is of correct type
    if (typeof input !== "number" && typeof input !== "string") {
        return { valid: false, reason: "INPUT_TYPE", input: input };
    }

    // coerce input to string
    input = "" + input;

    /** Regex is:
     *  possible 2 digits (century), 2 digits year, 2 digits month, 2 digits date,
     *  possible separator (-|+) (needed if the person is older than 100)
     *  2 digits (birthplace if year < 1990), 1 digit (gender: odd if male, even if female), 1 digit (checksum used in luhn algorithm)
     */
    // eslint-disable-next-line security/detect-unsafe-regex
    const reg = /^(\d{2}){0,1}(\d{1})(\d{1})(\d{2})(\d{2})([-]{0,1})?(\d{3})(\d{1})$/g;
    const group = reg.exec(input);

    // checks if input is of correct personal number format
    if (!group) {
        return { valid: false, reason: "FORMAT", input: input };
    }

    // unpacks regex groups into letiables
    const orgIdentifierNum = group[1]; // in some cases org numbers start with the num 16
    const groupNum = group[2];
    const orgNum1 = group[3];
    const orgValidation = group[4];
    const orgNum3 = group[5];
    // const sep = group[6]
    const orgNum4 = group[7];
    const checkNum = group[8];

    if (+groupNum === 4) {
        return { valid: false, reason: "GROUP_NUMBER", input: input };
    }

    if (+orgValidation < 20) {
        return { valid: false, reason: "ORGANISATIONS_VALIDATION_NUMBER", input: input };
    }

    if (orgIdentifierNum && +orgIdentifierNum !== 16) {
        return { valid: false, reason: "ORGANISATIONS_NUMBER_IDENTIFIER", input: input };
    }

    // validates control number using luhns algorithm
    if (luhnAlgorithm("" + groupNum + orgNum1 + orgValidation + orgNum3 + orgNum4) !== +checkNum) {
        return { valid: false, reason: "CHECKSUM", input: input };
    }

    const type = groupNumber[+groupNum] as CorporateIdentityType;
    const normalised = "16" + groupNum + orgNum1 + orgValidation + orgNum3 + orgNum4 + checkNum;

    return { valid: true, type: type, input: input, normalised: normalised };
}

export { parse };
