export interface CorporateIdentityOptions {
    shortNormalisation?: boolean;
}

export interface CorporateIdentityNumberReturn {
    valid: boolean;
    type?: CorporateIdentity;
    input: string;
    normalised?: string;
    reason?: CorporateIdentityNumberErrors;
}

export enum CorporateIdentityNumberErrors {
    InputType = "INPUT_TYPE",
    Format = "FORMAT",
    Checksum = "CHECKSUM",
    GroupNumber = "GROUP_NUMBER",
    ValidationNumber = "ORGANISATIONS_VALIDATION_NUMBER",
    NumberIdentifer = "ORGANISATIONS_NUMBER_IDENTIFIER",
}

export enum CorporateIdentity {
    DeadEstate = "Dödsbon",
    Government = "Stat, landsting, kommuner, församlingar",
    Foreign = "Utländska företag som bedriver näringsverksamhet eller äger fastigheter i Sverige",
    LimitedCompany = "Aktiebolag",
    SimpleCompany = "Enkelt bolag",
    EconomicAssociation = "Ekonomiska föreningar",
    NonProfitOrganization = "Ideella föreningar och stiftelser",
    TradingCompany = "Handelsbolag, kommanditbolag och enkla bolag",
}
