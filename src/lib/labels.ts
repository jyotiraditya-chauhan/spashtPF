import type { ClaimStatus, RejectionCode } from "./types";
import type { Lang } from "./i18n";

export const statusLabels: Record<Lang, Record<ClaimStatus, string>> = {
  en: {
    Submitted: "Submitted",
    "Under Process": "Under Process",
    Settled: "Settled",
    Rejected: "Rejected",
  },
  hi: {
    Submitted: "प्रस्तुत",
    "Under Process": "प्रक्रिया में",
    Settled: "निपटाया गया",
    Rejected: "अस्वीकृत",
  },
};

export const rejectionCodeLabels: Record<Lang, Record<RejectionCode, string>> = {
  en: {
    NAME_MISMATCH: "Name mismatch",
    DOB_MISMATCH: "Date of birth mismatch",
    DOE_NOT_UPDATED: "Exit date not updated",
    EPS_GAP: "Pension contribution gap",
    ATTESTATION_PENDING: "Employer approval pending",
    BANK_KYC_FAILED: "Bank verification failed",
    INELIGIBLE_CLAIM: "Claim type not applicable yet",
  },
  hi: {
    NAME_MISMATCH: "नाम बेमेल",
    DOB_MISMATCH: "जन्मतिथि बेमेल",
    DOE_NOT_UPDATED: "सेवा समाप्ति तिथि अपडेट नहीं",
    EPS_GAP: "पेंशन अंशदान में कमी",
    ATTESTATION_PENDING: "नियोक्ता अनुमोदन लंबित",
    BANK_KYC_FAILED: "बैंक सत्यापन विफल",
    INELIGIBLE_CLAIM: "दावा प्रकार अभी लागू नहीं",
  },
};
