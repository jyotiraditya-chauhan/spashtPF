"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useLanguage, pick, type Lang } from "@/lib/i18n";
import { RequireAuth } from "@/lib/auth";
import { useClaims } from "@/lib/store";
import { rejectionRules } from "@/lib/seed-data";
import type { Claim, RejectionCode } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";

const shellCopy = {
  en: {
    stepOf: (step: number, total: number) => `Step ${step} of ${total}`,
    back: "Back",
    continue: "Continue",
    docTitle: "Upload supporting document",
    docHelper: "Upload a scanned copy of your bank passbook or a cancelled cheque.",
    docCta: "Choose file",
    docSelected: (name: string, kb: string) => `Selected: ${name} (${kb} KB)`,
    docRequired: "Please attach a document before continuing.",
    reviewTitle: "Review before resubmitting",
    reviewSubmit: "Resubmit claim",
    notFound: "We couldn't find that claim.",
    notSelfFixable: "This claim isn't self-fixable — take you to the grievance draft instead.",
    goToEscalate: "Go to grievance draft",
  },
  hi: {
    stepOf: (step: number, total: number) => `चरण ${step} / ${total}`,
    back: "पीछे",
    continue: "जारी रखें",
    docTitle: "सहायक दस्तावेज़ अपलोड करें",
    docHelper: "अपनी बैंक पासबुक की स्कैन कॉपी या रद्द किया गया चेक अपलोड करें।",
    docCta: "फ़ाइल चुनें",
    docSelected: (name: string, kb: string) => `चयनित: ${name} (${kb} KB)`,
    docRequired: "जारी रखने से पहले कृपया दस्तावेज़ संलग्न करें।",
    reviewTitle: "दोबारा जमा करने से पहले समीक्षा करें",
    reviewSubmit: "दावा दोबारा जमा करें",
    notFound: "यह दावा नहीं मिला।",
    notSelfFixable: "यह दावा स्वयं ठीक नहीं किया जा सकता — इसके बजाय शिकायत मसौदे पर जाएँ।",
    goToEscalate: "शिकायत मसौदे पर जाएँ",
  },
};

interface FieldStepCopy {
  question: string;
  helper: string;
  compareTitle: string;
  compareLeft: string;
  compareRight: string;
  confirmLabel: string;
}

function getFieldCopy(code: RejectionCode, claim: Claim, lang: Lang): FieldStepCopy | null {
  const table: Partial<Record<RejectionCode, Record<Lang, FieldStepCopy>>> = {
    NAME_MISMATCH: {
      en: {
        question: "What name is on your bank passbook?",
        helper: "Edit this so it matches your Aadhaar name exactly, including spacing.",
        compareTitle: "Confirm the corrected spelling matches your Aadhaar exactly",
        compareLeft: "Aadhaar name",
        compareRight: "Corrected bank name",
        confirmLabel: "I confirm these match exactly.",
      },
      hi: {
        question: "आपकी बैंक पासबुक पर क्या नाम है?",
        helper: "इसे इस तरह संपादित करें कि यह आपके आधार नाम से पूरी तरह मेल खाए।",
        compareTitle: "पुष्टि करें कि सुधारा गया नाम आधार से पूरी तरह मेल खाता है",
        compareLeft: "आधार नाम",
        compareRight: "सुधारा गया बैंक नाम",
        confirmLabel: "मैं पुष्टि करता/करती हूँ कि ये पूरी तरह मेल खाते हैं।",
      },
    },
    DOB_MISMATCH: {
      en: {
        question: "What is your date of birth per Aadhaar?",
        helper: "This will be updated on your UAN profile.",
        compareTitle: "Confirm the corrected date matches your Aadhaar exactly",
        compareLeft: "Current UAN date of birth",
        compareRight: "Corrected date of birth",
        confirmLabel: "I confirm this matches my Aadhaar exactly.",
      },
      hi: {
        question: "आधार के अनुसार आपकी जन्मतिथि क्या है?",
        helper: "यह आपकी UAN प्रोफ़ाइल में अपडेट की जाएगी।",
        compareTitle: "पुष्टि करें कि सुधारी गई तिथि आधार से पूरी तरह मेल खाती है",
        compareLeft: "वर्तमान UAN जन्मतिथि",
        compareRight: "सुधारी गई जन्मतिथि",
        confirmLabel: "मैं पुष्टि करता/करती हूँ कि यह आधार से मेल खाती है।",
      },
    },
    DOE_NOT_UPDATED: {
      en: {
        question: "What was your last working day at your last establishment?",
        helper: "You're self-declaring this via the same basis as EPFO's Aadhaar-OTP \"Mark Exit\" feature.",
        compareTitle: "Confirm your declared exit date",
        compareLeft: "Claimed employer",
        compareRight: "Declared date of exit",
        confirmLabel: "I confirm this date is correct.",
      },
      hi: {
        question: "अपनी पिछली संस्था में आपका अंतिम कार्य दिवस कब था?",
        helper: "आप यह EPFO की आधार-OTP \"Mark Exit\" सुविधा जैसे आधार पर स्वयं दर्ज कर रहे हैं।",
        compareTitle: "अपनी घोषित सेवा समाप्ति तिथि की पुष्टि करें",
        compareLeft: "दावा किया गया नियोक्ता",
        compareRight: "घोषित सेवा समाप्ति तिथि",
        confirmLabel: "मैं पुष्टि करता/करती हूँ कि यह तिथि सही है।",
      },
    },
    BANK_KYC_FAILED: {
      en: {
        question: "Enter the last 4 digits of your bank account number",
        helper: "This is the same identity check the real EPFO portal uses before releasing funds.",
        compareTitle: "Confirm this matches your bank account on file",
        compareLeft: "Account ending in",
        compareRight: "You entered",
        confirmLabel: "I confirm this is my correct bank account.",
      },
      hi: {
        question: "अपने बैंक खाता संख्या के अंतिम 4 अंक दर्ज करें",
        helper: "यह वही पहचान जांच है जो असली EPFO पोर्टल राशि जारी करने से पहले करता है।",
        compareTitle: "पुष्टि करें कि यह आपके दर्ज बैंक खाते से मेल खाता है",
        compareLeft: "खाता जिससे समाप्त होता है",
        compareRight: "आपने दर्ज किया",
        confirmLabel: "मैं पुष्टि करता/करती हूँ कि यह मेरा सही बैंक खाता है।",
      },
    },
  };
  return table[code]?.[lang] ?? null;
}

function initialValueFor(code: RejectionCode, claim: Claim): string {
  switch (code) {
    case "NAME_MISMATCH":
      return claim.bankName;
    case "DOB_MISMATCH":
      return claim.dobUan;
    case "DOE_NOT_UPDATED":
      return "";
    case "BANK_KYC_FAILED":
      return "";
    default:
      return "";
  }
}

function FixWizardContent() {
  const { lang } = useLanguage();
  const t = pick(lang, shellCopy);
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { getClaim, resubmitClaim, loaded } = useClaims();

  const claim = loaded ? getClaim(params.id) : undefined;
  const rule = claim?.rejectionCode ? rejectionRules.find((r) => r.code === claim.rejectionCode) : undefined;
  const fieldCopy = rule && claim ? getFieldCopy(rule.code, claim, lang) : null;

  const [step, setStep] = React.useState(1);
  const [value, setValue] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);
  const [file, setFile] = React.useState<{ name: string; size: number } | null>(null);
  const [docError, setDocError] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- prefill once the claim loads from the store
    if (rule && claim) setValue(initialValueFor(rule.code, claim));
  }, [rule, claim]);

  if (!loaded) return null;

  if (!claim || !rule) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Alert variant="error">{t.notFound}</Alert>
      </div>
    );
  }

  if (!rule.selfFixable || !fieldCopy) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Alert variant="warning">{t.notSelfFixable}</Alert>
        <Link href={`/claim/${claim.id}/escalate`} className="mt-4 inline-block text-sm text-primary underline">
          {t.goToEscalate}
        </Link>
      </div>
    );
  }

  const totalSteps = 4;

  function handleResubmit() {
    if (!claim || !rule) return;
    let correction: Partial<Claim> = {};
    switch (rule.code) {
      case "NAME_MISMATCH":
        correction = { bankName: value };
        break;
      case "DOB_MISMATCH":
        correction = { dobUan: value };
        break;
      case "DOE_NOT_UPDATED":
        correction = { dateOfExit: value || new Date().toISOString().slice(0, 10) };
        break;
      case "BANK_KYC_FAILED":
        correction = { bankKycVerified: true };
        break;
      default:
        break;
    }
    resubmitClaim(claim.id, correction);
    router.push(`/claim/${claim.id}/resubmit`);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        {t.stepOf(step, totalSteps)}
      </p>
      <div className="mb-6 flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-primary" : "bg-border"}`}
          />
        ))}
      </div>

      <Card>
        <CardContent className="pt-5">
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <Label htmlFor="fixvalue">{fieldCopy.question}</Label>
                <p className="mt-1 text-xs text-muted">{fieldCopy.helper}</p>
              </div>
              <Input
                id="fixvalue"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type={rule.code === "DOE_NOT_UPDATED" || rule.code === "DOB_MISMATCH" ? "date" : "text"}
                maxLength={rule.code === "BANK_KYC_FAILED" ? 4 : undefined}
                autoFocus
              />
              <Button onClick={() => setStep(2)} disabled={!value} className="self-start">
                {t.continue}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="font-medium text-foreground">{fieldCopy.compareTitle}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-md border border-border bg-muted-tint p-3">
                  <p className="text-xs text-muted">{fieldCopy.compareLeft}</p>
                  <p className="mt-1 font-medium text-foreground">
                    {rule.code === "BANK_KYC_FAILED" ? "•••• 4821" : rule.code === "DOE_NOT_UPDATED" ? "—" : rule.code === "NAME_MISMATCH" ? claim.aadhaarName : claim.dobAadhaar}
                  </p>
                </div>
                <div className="rounded-md border border-primary/30 bg-primary-tint p-3">
                  <p className="text-xs text-primary">{fieldCopy.compareRight}</p>
                  <p className="mt-1 font-medium text-primary">{value}</p>
                </div>
              </div>
              <label className="flex min-h-11 items-center gap-2 text-sm text-foreground">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="h-5 w-5 accent-primary"
                />
                {fieldCopy.confirmLabel}
              </label>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(1)}>
                  {t.back}
                </Button>
                <Button onClick={() => setStep(3)} disabled={!confirmed}>
                  {t.continue}
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="font-medium text-foreground">{t.docTitle}</p>
                <p className="mt-1 text-xs text-muted">{t.docHelper}</p>
              </div>
              <label className="flex min-h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border p-6 text-center hover:border-primary">
                <span className="text-sm font-medium text-primary">{t.docCta}</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setFile({ name: f.name, size: f.size });
                      setDocError(false);
                    }
                  }}
                />
              </label>
              {file && (
                <p className="text-sm text-success">{t.docSelected(file.name, (file.size / 1024).toFixed(0))}</p>
              )}
              {docError && <Alert variant="error">{t.docRequired}</Alert>}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(2)}>
                  {t.back}
                </Button>
                <Button
                  onClick={() => {
                    if (!file) {
                      setDocError(true);
                      return;
                    }
                    setStep(4);
                  }}
                >
                  {t.continue}
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <p className="font-medium text-foreground">{t.reviewTitle}</p>
              <div className="rounded-md border border-border p-4 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-muted">{fieldCopy.compareRight}</span>
                  <span className="font-medium text-foreground">{value}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted">{t.docTitle}</span>
                  <span className="font-medium text-foreground">{file?.name}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(3)}>
                  {t.back}
                </Button>
                <Button onClick={handleResubmit}>{t.reviewSubmit}</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function FixWizardClient() {
  return (
    <RequireAuth>
      <FixWizardContent />
    </RequireAuth>
  );
}
