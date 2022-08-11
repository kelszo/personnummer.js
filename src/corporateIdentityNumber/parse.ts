import { luhnAlgorithm } from "../luhnAlgorithm";
import { CorporateIdentityNumberReturn, CorporateIdentity, CorporateIdentityNumberErrors } from "../types";
import { CorporateIdentityOptions } from "../types/corporateIdentityNumber";

const groupNumber: { [key: number]: CorporateIdentity } = {
    1: CorporateIdentity.DeadEstate,
    2: CorporateIdentity.Government,
    3: CorporateIdentity.Foreign,
    5: CorporateIdentity.LimitedCompany,
    6: CorporateIdentity.SimpleCompany,
    7: CorporateIdentity.EconomicAssociation,
    8: CorporateIdentity.NonProfitOrganization,
    9: CorporateIdentity.TradingCompany,
};

function parse(input: string | number, options: CorporateIdentityOptions): CorporateIdentityNumberReturn {
    // checks that the input is of correct type
    if (typeof input !== "number" && typeof input !== "string") {
        return { valid: false, reason: CorporateIdentityNumberErrors.InputType, input: input };
    }

    // coerce input to string
    input = "" + input;

    /** Regex is:
     *  possible 2 digits (16), 6 digits,
     *  possible separator: -
     *  3 digits, 1 digit (checksum used in luhn algorithm)
     */
    // eslint-disable-next-line security/detect-unsafe-regex
    const reg = /^(\d{2}){0,1}(\d{1})(\d{1})(\d{2})(\d{2})([-]{0,1})?(\d{3})(\d{1})$/g;
    const group = reg.exec(input);

    // checks if input is of correct personal number format
    if (!group) {
        return { valid: false, reason: CorporateIdentityNumberErrors.Format, input: input };
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
        return { valid: false, reason: CorporateIdentityNumberErrors.GroupNumber, input: input };
    }

    if (+orgValidation < 20) {
        return { valid: false, reason: CorporateIdentityNumberErrors.ValidationNumber, input: input };
    }

    if (orgIdentifierNum && +orgIdentifierNum !== 16) {
        return { valid: false, reason: CorporateIdentityNumberErrors.NumberIdentifer, input: input };
    }

    // validates control number using luhns algorithm
    if (luhnAlgorithm("" + groupNum + orgNum1 + orgValidation + orgNum3 + orgNum4) !== +checkNum) {
        return { valid: false, reason: CorporateIdentityNumberErrors.Checksum, input: input };
    }

    const type = groupNumber[+groupNum];

    let normalised = "";
    if (options.shortNormalisation) {
        // Format: NNNNNN-NNNN
        normalised = groupNum + orgNum1 + orgValidation + orgNum3 + "-" + orgNum4 + checkNum;
    } else {
        // FORMAT: 16NNNNNNNNNN
        normalised = "16" + groupNum + orgNum1 + orgValidation + orgNum3 + orgNum4 + checkNum;
    }
    return { valid: true, type: type, input: input, normalised: normalised };
}

export { parse };
