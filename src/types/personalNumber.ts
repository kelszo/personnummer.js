export interface PersonalNumberOptions {
    normaliseFormat?: string;
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
    gender?: Gender;
    birthplace?: BirthPlace;
    reason?: PersonalNumberErrors;
}

export enum Gender {
    Male = "MALE",
    Female = "FEMALE",
}

export enum PersonalNumberType {
    PersonalNumber = "PERSONNUMMER",
    CoordinationNumber = "SAMORDNINGSNUMMER",
    IndividualCompany = "ENSKILD_FIRMA",
}

export enum BirthPlace {
    Stockholm = "Stockholms län",
    Uppsala = "Uppsala län",
    Sodermansland = "Södermanlands län",
    Ostergotland = "Östergötlands län",
    Jonkoping = "Jönköpings län",
    Kronoberg = "Kronobergs län",
    Kalmar = "Kalmar län",
    Gotland = "Gotlands län",
    Blekinge = "Blekinge län",
    Kristianstad = "Kristianstads län",
    Malmohus = "Malmöhus län",
    Halland = "Hallands län",
    GoteborgBohus = "Göteborgs och bohus län",
    Alvsborg = "Älvsborgs län",
    Skaraborg = "Skaraborgs län",
    Varmland = "Värmlands län",
    Extranummer = "Extranummer",
    Orebro = "Örebro län",
    Vastmanland = "Västmanlands län",
    Kopparberg = "Kopparbergs län",
    Gavleborg = "Gävleborgs län",
    Vasternorrland = "Västernorrlands län",
    Jamtland = "Jämtlands län",
    Vasterbotten = "Västerbottens län",
    Norrbotten = "Norrbottens län",
    ExtranummerImmigrerad = "Extranummer (immigrerade)",
}

export enum PersonalNumberErrors {
    InputType = "INPUT_TYPE",
    Format = "FORMAT",
    Checksum = "CHECKSUM",
    IncorrectDate = "INCORRECT_DATE",
    AgeSeparatorContradiction = "AGE_SEPARATOR_CONTRADICTION",
    BackToTheFuture = "BACK_TO_THE_FUTURE",
}
