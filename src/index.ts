import { parse as parseCINumer } from "./corporateIdentityNumber";
import { parse as parsePN } from "./personalNumber";
import { CorporateIdentityNumberReturn, CorporateIdentityOptions, PersonalNumberOptions, PersonalNumberReturn, PersonalNumberType } from "./types";

export function parse(input: string | number, options?: PersonalNumberOptions): PersonalNumberReturn {
    if (!options) {
        options = {};
    }

    if (options.forgiving === undefined) {
        options.forgiving = true;
    }

    if (options.strict === undefined) {
        options.strict = true;
    }

    if (options.normaliseFormat === undefined) {
        options.normaliseFormat = "YYYYMMDDNNNN";
    }

    return parsePN(input, options);
}

export function validate(input: string | number, options?: Omit<PersonalNumberOptions, "normaliseFormat">): boolean {
    if (!options) {
        options = {};
    }

    if (options.forgiving === undefined) {
        options.forgiving = true;
    }

    if (options.strict === undefined) {
        options.strict = true;
    }

    return parse(input, options).valid;
}

export function normalise(input: string | number, options?: PersonalNumberOptions): string | undefined {
    if (!options) {
        options = {};
    }

    if (options.forgiving === undefined) {
        options.forgiving = true;
    }

    if (options.strict === undefined) {
        options.strict = true;
    }

    if (options.normaliseFormat === undefined) {
        options.normaliseFormat = "YYYYMMDDNNNN";
    }

    const pn = parse(input, options);

    if (pn.valid) {
        return pn.normalised as string;
    }

    return undefined;
}

export function parseCIN(input: string | number, options?: CorporateIdentityOptions): CorporateIdentityNumberReturn | PersonalNumberReturn {
    if (!options) {
        options = {};
    }

    const cin = parseCINumer(input, options);
    let pn;

    if (cin.valid) {
        return cin;
    } else {
        const pnFormat = options.shortNormalisation ? "YYMMDD-NNNN" : "YYYYMMDDNNNN";
        pn = parse(input, { forgiving: true, strict: true, normaliseFormat: pnFormat });
    }

    if (pn.valid) {
        pn.type = PersonalNumberType.IndividualCompany; // Enskild firma
        return pn;
    }

    return cin;
}

export function validateCIN(input: string | number): boolean {
    const cin = parseCINumer(input, {});

    let pn;

    if (cin.valid) {
        return true;
    } else {
        pn = parse(input, { forgiving: true, strict: true });
    }

    if (pn.valid) {
        return true;
    }

    return false;
}

export function normaliseCIN(input: string | number, options?: CorporateIdentityOptions): string | undefined {
    if (!options) {
        options = {};
    }

    const cin = parseCINumer(input, options);

    let pn;

    if (cin.valid) {
        return cin.normalised as string;
    } else {
        const pnFormat = options.shortNormalisation ? "YYMMDD-NNNN" : "YYYYMMDDNNNN";
        pn = parse(input, { forgiving: true, strict: true, normaliseFormat: pnFormat });
    }

    if (pn.valid) {
        return pn.normalised as string;
    }

    return undefined;
}

export default { parse, validate, normalise, parseCIN, validateCIN, normaliseCIN };
export * from "./types";
