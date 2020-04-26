export interface PersonalNumberOptions {
    strict?: boolean;
    forgiving?: boolean;
}

export interface PersonalNumberReturn {
    valid: boolean;
    type?: PersonalNumberType;
    input: string;
    normalised?: string;
    date?: Date;
    age?: number;
    gender?: GenderType;
    birthplace?: BirthPlace;
    reason?: PersonalNumberErrors;
}

export type GenderType = "MALE" | "FEMALE";

export type PersonalNumberType = "PERSONNUMMER" | "SAMORDNINGSNUMMER" | "Enskild firma";

export type BirthPlace =
    | "Stockholms län"
    | "Uppsala län"
    | "Södermanlands län"
    | "Östergötlands län"
    | "Jönköpings län"
    | "Kronobergs län"
    | "Kalmar län"
    | "Gotlands län"
    | "Blekinge län"
    | "Kristianstads län"
    | "Malmöhus län"
    | "Hallands län"
    | "Göteborgs och bohus län"
    | "Älvsborgs län"
    | "Skaraborgs län"
    | "Värmlands län"
    | "Extranummer"
    | "Örebro län"
    | "Västmanlands län"
    | "Kopparbergs län"
    | "Extranummer"
    | "Gävleborgs län"
    | "Västernorrlands län"
    | "Jämtlands län"
    | "Västerbottens län"
    | "Norrbottens län"
    | "Extranummer (immigrerade)";

export type PersonalNumberErrors =
    | "INPUT_TYPE"
    | "FORMAT"
    | "CHECKSUM"
    | "INCORRECT_DATE"
    | "AGE_SEPARATOR_CONTRADICTION"
    | "BACK_TO_THE_FUTURE"
    | "AGE_IS_TOO_OLD";
