import type { Claim, RejectionRule } from "./types";

export const REQUIRED_MINIMUM_EPS_MONTHS = 1;

export const rejectionRules: RejectionRule[] = [
  {
    code: "NAME_MISMATCH",
    matchCondition: "Aadhaar name and bank account name do not match (fuzzy compare).",
    rawRemarkTemplate: {
      en: "Claim rejected. Remark: Name as per bank does not match with name as per Aadhaar.",
      hi: "दावा अस्वीकृत। टिप्पणी: बैंक में दर्ज नाम आधार में दर्ज नाम से मेल नहीं खाता।",
    },
    fixFields: ["bankName"],
    epfigmsCategory: "KYC/Bank Account",
    selfFixable: true,
  },
  {
    code: "DOB_MISMATCH",
    matchCondition: "Date of birth in UAN records does not match Aadhaar.",
    rawRemarkTemplate: {
      en: "Claim rejected. Remark: Date of birth mismatch between UAN and Aadhaar records.",
      hi: "दावा अस्वीकृत। टिप्पणी: UAN और आधार रिकॉर्ड में जन्मतिथि मेल नहीं खाती।",
    },
    fixFields: ["dobUan"],
    epfigmsCategory: "KYC/Bank Account",
    selfFixable: true,
  },
  {
    code: "DOE_NOT_UPDATED",
    matchCondition: "Date of exit has not been set by the employer or the member.",
    rawRemarkTemplate: {
      en: "Claim rejected. Remark: Date of Exit not updated by employer.",
      hi: "दावा अस्वीकृत। टिप्पणी: नियोक्ता द्वारा सेवा समाप्ति तिथि अपडेट नहीं की गई।",
    },
    fixFields: ["dateOfExit"],
    epfigmsCategory: "Withdrawal/Settlement",
    selfFixable: true,
  },
  {
    code: "EPS_GAP",
    matchCondition: "No EPS (pension) contribution is on record for the claimed period.",
    rawRemarkTemplate: {
      en: "Claim rejected. Remark: EPS contribution not available for claimed period.",
      hi: "दावा अस्वीकृत। टिप्पणी: दावा की गई अवधि के लिए EPS अंशदान उपलब्ध नहीं है।",
    },
    fixFields: ["epsServiceMonths"],
    epfigmsCategory: "Pension Payment",
    selfFixable: false,
  },
  {
    code: "ATTESTATION_PENDING",
    matchCondition: "The employer has not yet attested/approved the claim.",
    rawRemarkTemplate: {
      en: "Claim rejected. Remark: Employer verification pending.",
      hi: "दावा अस्वीकृत। टिप्पणी: नियोक्ता सत्यापन लंबित है।",
    },
    fixFields: ["employerAttested"],
    epfigmsCategory: "Withdrawal/Settlement",
    selfFixable: false,
  },
  {
    code: "BANK_KYC_FAILED",
    matchCondition: "Bank account / IFSC could not be verified.",
    rawRemarkTemplate: {
      en: "Claim rejected. Remark: Bank account/IFSC verification failed.",
      hi: "दावा अस्वीकृत। टिप्पणी: बैंक खाता/IFSC सत्यापन विफल रहा।",
    },
    fixFields: ["bankKycVerified"],
    epfigmsCategory: "KYC/Bank Account",
    selfFixable: true,
  },
  {
    code: "INELIGIBLE_CLAIM",
    matchCondition: "Member is still shown as employed in EPFO records.",
    rawRemarkTemplate: {
      en: "Claim rejected. Remark: Member currently shown as employed; Form 19 not applicable.",
      hi: "दावा अस्वीकृत। टिप्पणी: सदस्य अभी भी कार्यरत दिखाया गया है; फॉर्म 19 लागू नहीं है।",
    },
    fixFields: ["employedInEpfoRecords"],
    epfigmsCategory: "Withdrawal/Settlement",
    selfFixable: false,
  },
];

export const seedClaims: Claim[] = [
  {
    id: "clm-settled-01",
    uan: "100234567890",
    claimType: "Form19",
    status: "Settled",
    amount: 284650,
    filedOn: "2026-05-12",
    aadhaarName: "Priya Sharma",
    bankName: "Priya Sharma",
    dobUan: "1990-03-14",
    dobAadhaar: "1990-03-14",
    dateOfExit: "2026-04-01",
    employerAttested: true,
    bankKycVerified: true,
    epsServiceMonths: 96,
    employedInEpfoRecords: false,
    rejectionCode: null,
  },
  {
    id: "clm-underprocess-01",
    uan: "100234567890",
    claimType: "Form19",
    status: "Under Process",
    amount: 156200,
    filedOn: "2026-08-02",
    aadhaarName: "Priya Sharma",
    bankName: "Priya Sharma",
    dobUan: "1990-03-14",
    dobAadhaar: "1990-03-14",
    dateOfExit: "2026-07-15",
    employerAttested: true,
    bankKycVerified: true,
    epsServiceMonths: 40,
    employedInEpfoRecords: false,
    rejectionCode: null,
  },
  {
    id: "clm-rejected-01",
    uan: "100234567890",
    claimType: "Form19",
    status: "Rejected",
    amount: 412300,
    filedOn: "2026-07-20",
    aadhaarName: "Ramesh Kumar",
    bankName: "Ramesh K.",
    dobUan: "1985-11-02",
    dobAadhaar: "1985-11-02",
    dateOfExit: "2026-06-10",
    employerAttested: true,
    bankKycVerified: true,
    epsServiceMonths: 132,
    employedInEpfoRecords: false,
    rejectionCode: "NAME_MISMATCH",
  },
];

export const seedClaimIds = seedClaims.map((c) => c.id);
