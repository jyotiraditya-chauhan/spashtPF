import type { Claim, RejectionCode } from "./types";
import { REQUIRED_MINIMUM_EPS_MONTHS } from "./seed-data";
import { namesFuzzyMatch } from "./levenshtein";

/**
 * Mirrors EPFO's automated matching order (spec 8.2): first mismatch found
 * wins, since that's also the order a citizen would need to fix things in.
 */
export function evaluateClaim(claim: Claim): RejectionCode | null {
  if (!namesFuzzyMatch(claim.aadhaarName, claim.bankName)) {
    return "NAME_MISMATCH";
  }
  if (claim.dobUan !== claim.dobAadhaar) {
    return "DOB_MISMATCH";
  }
  if (!claim.dateOfExit) {
    return "DOE_NOT_UPDATED";
  }
  if (claim.epsServiceMonths < REQUIRED_MINIMUM_EPS_MONTHS) {
    return "EPS_GAP";
  }
  if (!claim.employerAttested) {
    return "ATTESTATION_PENDING";
  }
  if (!claim.bankKycVerified) {
    return "BANK_KYC_FAILED";
  }
  if (claim.employedInEpfoRecords) {
    return "INELIGIBLE_CLAIM";
  }
  return null;
}
