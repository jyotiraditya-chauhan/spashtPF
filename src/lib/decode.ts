import type { Claim, RejectionRule } from "./types";
import type { Lang } from "./i18n";

type Decoder = (claim: Claim) => Record<Lang, string>;

const decoders: Record<RejectionRule["code"], Decoder> = {
  NAME_MISMATCH: (claim) => ({
    en: `Your claim was rejected because the name on your bank account ("${claim.bankName}") doesn't exactly match your Aadhaar name ("${claim.aadhaarName}"). EPFO's automated check requires these to match exactly before it will release funds — even a shortened or misspelled name is treated as a mismatch. Fix it by correcting the name on one record so both say the same thing, then resubmit.`,
    hi: `आपका दावा इसलिए अस्वीकृत हुआ क्योंकि आपके बैंक खाते में दर्ज नाम ("${claim.bankName}") आपके आधार में दर्ज नाम ("${claim.aadhaarName}") से पूरी तरह मेल नहीं खाता। EPFO की स्वचालित जांच में दोनों नाम बिल्कुल एक जैसे होने चाहिए। किसी एक रिकॉर्ड में नाम ठीक करवाएँ ताकि दोनों जगह एक ही नाम हो, फिर दोबारा दावा करें।`,
  }),
  DOB_MISMATCH: (claim) => ({
    en: `Your claim was rejected because the date of birth on your UAN record ("${claim.dobUan}") doesn't match your Aadhaar date of birth ("${claim.dobAadhaar}"). This is a common data-entry gap, not a sign of any problem with your eligibility. Correct the date on your UAN profile (or raise a KYC update) so it matches Aadhaar exactly, then resubmit.`,
    hi: `आपका दावा इसलिए अस्वीकृत हुआ क्योंकि आपके UAN रिकॉर्ड में जन्मतिथि ("${claim.dobUan}") आपके आधार में दर्ज जन्मतिथि ("${claim.dobAadhaar}") से मेल नहीं खाती। यह अक्सर डेटा-एंट्री की चूक होती है। अपने UAN प्रोफ़ाइल में जन्मतिथि को आधार के अनुसार ठीक करवाएँ, फिर दोबारा दावा करें।`,
  }),
  DOE_NOT_UPDATED: () => ({
    en: `Your claim was rejected because no "Date of Exit" is recorded for you — normally your last employer updates this, and it's often simply missed. You don't have to wait on them: EPFO's "Mark Exit" self-service lets you declare your own exit date via Aadhaar OTP two months after you actually left. Do that, then resubmit.`,
    hi: `आपका दावा इसलिए अस्वीकृत हुआ क्योंकि आपकी "सेवा समाप्ति तिथि" (Date of Exit) दर्ज नहीं है — यह आमतौर पर आपके नियोक्ता द्वारा अपडेट की जाती है और अक्सर छूट जाती है। आपको इंतज़ार करने की ज़रूरत नहीं — EPFO की "Mark Exit" सुविधा से आप स्वयं आधार OTP से अपनी सेवा समाप्ति तिथि दर्ज कर सकते हैं। यह करें, फिर दोबारा दावा करें।`,
  }),
  EPS_GAP: () => ({
    en: `Your claim was rejected because no pension (EPS) contribution is on record for the period you're claiming. This usually means a contribution period wasn't posted correctly by an employer, not that you're ineligible. Raise this with your last employer to confirm your EPS contributions were filed, then resubmit — or escalate if they don't respond.`,
    hi: `आपका दावा इसलिए अस्वीकृत हुआ क्योंकि दावा की गई अवधि के लिए पेंशन (EPS) अंशदान दर्ज नहीं है। आमतौर पर इसका मतलब यह है कि नियोक्ता ने अंशदान सही तरीके से दर्ज नहीं किया। अपने पिछले नियोक्ता से EPS अंशदान की पुष्टि करवाएँ, फिर दोबारा दावा करें, या जवाब न मिलने पर शिकायत दर्ज करें।`,
  }),
  ATTESTATION_PENDING: () => ({
    en: `Your claim was rejected because your employer hasn't attested (approved) it yet on their end of the portal — EPFO won't process a claim without this sign-off. This isn't something you can fix directly; the quickest path is to follow up with your employer's PF/HR desk, or file a grievance if they're unresponsive.`,
    hi: `आपका दावा इसलिए अस्वीकृत हुआ क्योंकि आपके नियोक्ता ने अभी तक पोर्टल पर इसे सत्यापित (attest) नहीं किया है — इसके बिना EPFO दावे को आगे नहीं बढ़ाता। यह आप सीधे ठीक नहीं कर सकते; अपने नियोक्ता के PF/HR विभाग से संपर्क करें, या जवाब न मिलने पर शिकायत दर्ज करें।`,
  }),
  BANK_KYC_FAILED: () => ({
    en: `Your claim was rejected because your bank account or IFSC code couldn't be verified — often a wrong IFSC, a closed account, or an account not yet linked to your UAN. Check your bank details under KYC on the portal, correct them, and get the correction re-verified before resubmitting.`,
    hi: `आपका दावा इसलिए अस्वीकृत हुआ क्योंकि आपका बैंक खाता या IFSC कोड सत्यापित नहीं हो सका — अक्सर यह गलत IFSC, बंद खाता, या UAN से न जुड़े खाते के कारण होता है। पोर्टल पर KYC में अपने बैंक विवरण जांचें, उन्हें ठीक करें और दोबारा सत्यापन के बाद ही दावा करें।`,
  }),
  INELIGIBLE_CLAIM: () => ({
    en: `Your claim was rejected because EPFO's records still show you as currently employed, and a full & final settlement (Form 19) can only be filed at least two months after your last working day. If you've actually left, this is usually a "Date of Exit" gap — mark your exit first. If you're still employed, this claim type isn't the right one yet.`,
    hi: `आपका दावा इसलिए अस्वीकृत हुआ क्योंकि EPFO के रिकॉर्ड में आप अभी भी कार्यरत दिखाए जा रहे हैं, और पूर्ण निपटान (फॉर्म 19) आपकी अंतिम कार्य तिथि के कम से कम दो महीने बाद ही किया जा सकता है। अगर आपने वाकई नौकरी छोड़ दी है, तो पहले अपनी सेवा समाप्ति तिथि दर्ज करें। अगर आप अभी भी कार्यरत हैं, तो यह दावा प्रकार अभी लागू नहीं होता।`,
  }),
};

/**
 * Rule-based today; the return type/signature is deliberately async so this
 * can be swapped for a live gpt-4o-mini call (spec 8.3) without touching callers.
 */
export async function getDecodeExplanation(
  claim: Claim,
  rule: RejectionRule,
  lang: Lang,
): Promise<string> {
  return decoders[rule.code](claim)[lang];
}

const grievanceTemplates: Record<RejectionRule["code"], (claim: Claim) => Record<Lang, string>> = {
  NAME_MISMATCH: (claim) => ({
    en: `Claim ID ${claim.id} (UAN ${claim.uan}) was rejected with remark "Name as per bank does not match with name as per Aadhaar." My Aadhaar name is "${claim.aadhaarName}" and my bank account name is "${claim.bankName}". I request that this record mismatch be corrected/reviewed so my Form 19 claim can be reprocessed.`,
    hi: `दावा संख्या ${claim.id} (UAN ${claim.uan}) टिप्पणी के साथ अस्वीकृत हुआ: "बैंक में दर्ज नाम आधार से मेल नहीं खाता।" मेरा आधार नाम "${claim.aadhaarName}" है और बैंक खाता नाम "${claim.bankName}" है। कृपया इस बेमेल को ठीक/समीक्षा करें ताकि मेरा फॉर्म 19 दावा पुनः संसाधित हो सके।`,
  }),
  DOB_MISMATCH: (claim) => ({
    en: `Claim ID ${claim.id} (UAN ${claim.uan}) was rejected with remark "Date of birth mismatch between UAN and Aadhaar records." UAN record shows ${claim.dobUan}, Aadhaar shows ${claim.dobAadhaar}. I request correction of my date of birth on my UAN profile.`,
    hi: `दावा संख्या ${claim.id} (UAN ${claim.uan}) टिप्पणी के साथ अस्वीकृत हुआ: "UAN और आधार में जन्मतिथि मेल नहीं खाती।" UAN में ${claim.dobUan} और आधार में ${claim.dobAadhaar} दर्ज है। कृपया मेरे UAN प्रोफ़ाइल में जन्मतिथि सुधारें।`,
  }),
  DOE_NOT_UPDATED: (claim) => ({
    en: `Claim ID ${claim.id} (UAN ${claim.uan}) was rejected with remark "Date of Exit not updated by employer." My employer has not updated my date of exit. I request assistance updating this so my Form 19 claim can proceed, since I am unable to complete self-declaration for this period.`,
    hi: `दावा संख्या ${claim.id} (UAN ${claim.uan}) टिप्पणी के साथ अस्वीकृत हुआ: "नियोक्ता द्वारा सेवा समाप्ति तिथि अपडेट नहीं की गई।" कृपया इसे अपडेट करने में सहायता करें ताकि मेरा फॉर्म 19 दावा आगे बढ़ सके।`,
  }),
  EPS_GAP: (claim) => ({
    en: `Claim ID ${claim.id} (UAN ${claim.uan}) was rejected with remark "EPS contribution not available for claimed period." I request verification of my EPS contribution records for this period, as I believe contributions were made by my employer.`,
    hi: `दावा संख्या ${claim.id} (UAN ${claim.uan}) टिप्पणी के साथ अस्वीकृत हुआ: "दावा की गई अवधि के लिए EPS अंशदान उपलब्ध नहीं है।" कृपया इस अवधि के मेरे EPS अंशदान रिकॉर्ड की पुष्टि करें।`,
  }),
  ATTESTATION_PENDING: (claim) => ({
    en: `Claim ID ${claim.id} (UAN ${claim.uan}) was rejected with remark "Employer verification pending." My employer has not attested my claim. I request follow-up with my employer to complete attestation so my Form 19 claim can be processed.`,
    hi: `दावा संख्या ${claim.id} (UAN ${claim.uan}) टिप्पणी के साथ अस्वीकृत हुआ: "नियोक्ता सत्यापन लंबित है।" कृपया मेरे नियोक्ता से सत्यापन पूरा करवाने में सहायता करें।`,
  }),
  BANK_KYC_FAILED: (claim) => ({
    en: `Claim ID ${claim.id} (UAN ${claim.uan}) was rejected with remark "Bank account/IFSC verification failed." I request assistance verifying my bank account/IFSC details so my Form 19 claim can be reprocessed.`,
    hi: `दावा संख्या ${claim.id} (UAN ${claim.uan}) टिप्पणी के साथ अस्वीकृत हुआ: "बैंक खाता/IFSC सत्यापन विफल रहा।" कृपया मेरे बैंक खाता/IFSC विवरण के सत्यापन में सहायता करें।`,
  }),
  INELIGIBLE_CLAIM: (claim) => ({
    en: `Claim ID ${claim.id} (UAN ${claim.uan}) was rejected with remark "Member currently shown as employed; Form 19 not applicable." I have left my last establishment and request review of my employment status in EPFO records.`,
    hi: `दावा संख्या ${claim.id} (UAN ${claim.uan}) टिप्पणी के साथ अस्वीकृत हुआ: "सदस्य अभी भी कार्यरत दिखाया गया है; फॉर्म 19 लागू नहीं है।" मैं अपनी पिछली संस्था छोड़ चुका/चुकी हूँ, कृपया EPFO रिकॉर्ड में मेरी रोज़गार स्थिति की समीक्षा करें।`,
  }),
};

export async function getGrievanceDraft(
  claim: Claim,
  rule: RejectionRule,
  lang: Lang,
): Promise<string> {
  return grievanceTemplates[rule.code](claim)[lang];
}
