import { luhnAlgorithm } from "../luhnAlgorithm";
import { parseDate } from "./parseDate";

import { PersonalNumberOptions, PersonalNumberReturn, BirthPlace, PersonalNumberType, GenderType } from "../types";

function parse(input: string | number, options: PersonalNumberOptions): PersonalNumberReturn {
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
    const reg = /^(\d{2}){0,1}(\d{2})(\d{2})(\d{2})([-|+]{0,1})?(\d{2})(\d{1})(\d{1})$/g;
    const group = reg.exec(input);

    // checks if input is of correct personal number format
    if (!group) {
        return { valid: false, reason: "FORMAT", input: input };
    }

    // unpacks regex groups into letiables
    const centuryNum = group[1];
    const yearNum = group[2];
    const monthNum = group[3];
    const dayNum = group[4];
    let sep = group[5];
    const serialNum = group[6];
    const genderNum = group[7];
    const checkNum = group[8];

    // parses and checks date
    const parsedDate = parseDate(+yearNum, +monthNum, +dayNum, sep, +centuryNum);
    if (!parsedDate.valid) {
        return { valid: false, reason: "INCORRECT_DATE", input: input };
    }
    let date = parsedDate.date as Date;

    // validates control number using luhns algorithm
    if (luhnAlgorithm("" + yearNum + monthNum + dayNum + serialNum + genderNum) !== +checkNum) {
        return { valid: false, reason: "CHECKSUM", input: input };
    }

    // calculates age
    let age = ~~((Date.now() - +date) / 31557600000);

    // if validation is forgiving, i.e. if the user possibly incorrectly used a '+' separator instead of a '-' separator
    // this will in most cases produce an age over 120
    if (options && options.forgiving) {
        if (age < 100 && sep === "+") {
            sep = "-";
        } else if (age >= 100 && sep === "-") {
            sep = "+";
        }

        if (!centuryNum && age > 120) {
            age -= 100;
            sep = "-";
            date = new Date(Date.UTC(date.getFullYear() + 100, date.getMonth(), date.getDate()));
        } else if (centuryNum && age < 0) {
            age += 100;
            sep = "-";
            date = new Date(Date.UTC(date.getFullYear() - 100, date.getMonth(), date.getDate()));
        }
    }

    // if validation is strict, i.e. separator must match the age (this may occur if the user uses a incorrectly separator in addition to specifying the century)
    // the personal number can not be from the future
    // the age can not be greater than 120
    if (options && options.strict) {
        if (!(centuryNum && options.forgiving) && sep && ((age >= 100 && sep === "-") || (age < 100 && sep === "+"))) {
            return { valid: false, reason: "AGE_SEPARATOR_CONTRADICTION", input: input };
        }

        if (date > new Date()) {
            return { valid: false, reason: "BACK_TO_THE_FUTURE", input: input };
        }

        if (age > 120) {
            return { valid: false, reason: "AGE_IS_TOO_OLD", input: input };
        }
    }

    // normalises the personal number to the format year|month|day|serial|gender|checksum
    // e.g. 970214-5641 will become 199702145641
    const normalised = "" + date.getFullYear() + monthNum + dayNum + serialNum + genderNum + checkNum;

    // parses the gender according the personal number definition, if the second last number is even it is a female, otherwise a male
    let gender: GenderType = "MALE";
    if (+genderNum % 2 === 0) {
        gender = "FEMALE";
    }

    // personal numbers before 1990 specify birthplace using the two first serial numbers.
    // each county in Sweden had its own number. ex. Stockholms län had 0-13
    let birthplace: BirthPlace | undefined;
    if (date < new Date(Date.UTC(1990, 0))) {
        birthplace = getBirthplace(+serialNum);
    }

    let type: PersonalNumberType = "PERSONNUMMER";
    if (+dayNum > 60) {
        type = "SAMORDNINGSNUMMER";
    }

    return { valid: true, type: type, input: input, normalised: normalised, date: date, age: age, gender: gender, birthplace: birthplace };
}

const values = [
    [0, 13],
    [14, 15],
    [16, 18],
    [19, 23],
    [24, 26],
    [27, 28],
    [29, 31],
    [32, 32],
    [33, 34],
    [35, 38],
    [39, 45],
    [46, 47],
    [48, 54],
    [55, 58],
    [59, 61],
    [62, 64],
    [65, 65],
    [66, 68],
    [69, 70],
    [71, 73],
    [74, 74],
    [75, 77],
    [78, 81],
    [82, 84],
    [85, 88],
    [89, 92],
    [93, 99],
];

const response = [
    "Stockholms län",
    "Uppsala län",
    "Södermanlands län",
    "Östergötlands län",
    "Jönköpings län",
    "Kronobergs län",
    "Kalmar län",
    "Gotlands län",
    "Blekinge län",
    "Kristianstads län",
    "Malmöhus län",
    "Hallands län",
    "Göteborgs och bohus län",
    "Älvsborgs län",
    "Skaraborgs län",
    "Värmlands län",
    "Extranummer",
    "Örebro län",
    "Västmanlands län",
    "Kopparbergs län",
    "Extranummer",
    "Gävleborgs län",
    "Västernorrlands län",
    "Jämtlands län",
    "Västerbottens län",
    "Norrbottens län",
    "Extranummer (immigrerade)",
];

function getBirthplace(value: number): BirthPlace | undefined {
    let birthPlace: BirthPlace | undefined;

    values.forEach(function (v, i) {
        if (v[0] <= value && value <= v[1]) {
            birthPlace = response[i] as BirthPlace;
        }
    });

    return birthPlace;
}

export { parse };
