export interface CorporateIdentityNumberReturn {
    valid: boolean;
    type?: CorporateIdentityType;
    input: string;
    normalised?: string;
    reason?: CorporateIdentityNumberErrors;
}

export type CorporateIdentityNumberErrors =
    | "INPUT_TYPE"
    | "FORMAT"
    | "CHECKSUM"
    | "GROUP_NUMBER"
    | "ORGANISATIONS_VALIDATION_NUMBER"
    | "ORGANISATIONS_NUMBER_IDENTIFIER";

export type CorporateIdentityType =
    | "Dödsbon"
    | "Stat, landsting, kommuner, församlingar"
    | "Utländska företag som bedriver näringsverksamhet eller äger fastigheter i Sverige"
    | "Aktiebolag"
    | "Enkelt bolag"
    | "Ekonomiska föreningar"
    | "Ideella föreningar och stiftelser"
    | "Handelsbolag, kommanditbolag och enkla bolag";
