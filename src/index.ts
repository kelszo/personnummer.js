import { parse as parsePN } from "./personalNumber";
import { parse as parseCINumer } from "./corporateIdentityNumber";
import { PersonalNumberOptions, CorporateIdentityNumberReturn, PersonalNumberReturn } from "./types";

function parse(input: string | number, options?: PersonalNumberOptions): PersonalNumberReturn {
    if (!options) {
        options = {};
    }

    return parsePN(input, options);
}

function validate(input: string | number, options?: PersonalNumberOptions): boolean {
    if (!options) {
        options = {};
    }

    return parse(input, options).valid;
}

function normalise(input: string | number, options?: PersonalNumberOptions): string {
    if (!options) {
        options = {};
    }

    const pn = parse(input, options);

    if (pn.valid) {
        return pn.normalised as string;
    } else {
        return "";
    }
}

function parseCIN(input: string | number): CorporateIdentityNumberReturn | PersonalNumberReturn {
    const cin = parseCINumer(input);
    let pn;

    if (cin.valid) {
        return cin;
    } else {
        pn = parse(input, { strict: true });
    }

    if (pn.valid) {
        pn.type = "Enskild firma";
        return pn;
    }

    return cin;
}

function validateCIN(input: string | number): boolean {
    const cin = parseCINumer(input);

    let pn;

    if (cin.valid) {
        return true;
    } else {
        pn = parse(input, { strict: true });
    }

    if (pn.valid) {
        return true;
    }

    return false;
}

function normaliseCIN(input: string | number): string {
    const cin = parseCINumer(input);

    let pn;

    if (cin.valid) {
        return cin.normalised as string;
    } else {
        pn = parse(input, { strict: true });
    }

    if (pn.valid) {
        return pn.normalised as string;
    }

    return "";
}

export default { parse, validate, normalise, parseCIN, validateCIN, normaliseCIN };
export { parse, validate, normalise, parseCIN, validateCIN, normaliseCIN };
