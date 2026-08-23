export type ClaimStatus = "Submitted" | "Under Process" | "Settled" | "Rejected";

export type RejectionCode =
  | "NAME_MISMATCH"
  | "DOB_MISMATCH"
  | "DOE_NOT_UPDATED"
  | "EPS_GAP"
  | "ATTESTATION_PENDING"
  | "BANK_KYC_FAILED"
  | "INELIGIBLE_CLAIM";

export type EpfigmsCategory =
  | "Withdrawal/Settlement"
  | "Transfer of PF"
  | "KYC/Bank Account"
  | "Pension Payment";

export interface Claim {
  id: string;
  uan: string;
  claimType: "Form19";
  status: ClaimStatus;
  amount: number;
  filedOn: string;
  aadhaarName: string;
  bankName: string;
  dobUan: string;
  dobAadhaar: string;
  dateOfExit: string | null;
  employerAttested: boolean;
  bankKycVerified: boolean;
  epsServiceMonths: number;
  employedInEpfoRecords: boolean;
  rejectionCode: RejectionCode | null;
}

export interface RejectionRule {
  code: RejectionCode;
  matchCondition: string;
  rawRemarkTemplate: { en: string; hi: string };
  fixFields: string[];
  epfigmsCategory: EpfigmsCategory;
  /** Can the citizen correct this themselves via the wizard, or does it need EPFO/employer action? */
  selfFixable: boolean;
}
