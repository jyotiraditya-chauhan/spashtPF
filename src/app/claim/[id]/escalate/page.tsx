"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { useLanguage, pick } from "@/lib/i18n";
import { RequireAuth } from "@/lib/auth";
import { useClaims } from "@/lib/store";
import { rejectionRules } from "@/lib/seed-data";
import { getGrievanceDraft } from "@/lib/decode";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

const copy = {
  en: {
    title: "Grievance draft",
    subtitle: "Pre-filled for EPFiGMS, the official grievance portal — mirrors its real fields.",
    category: "Grievance Category",
    description: "Description",
    charCount: (n: number) => `${n} / 5000 characters`,
    checklistTitle: "Attach with your grievance",
    checklist: [
      "Scanned copy of your bank passbook or a cancelled cheque",
      "Copy of your Aadhaar card",
      "Screenshot of the claim rejection remark",
    ],
    checklistNote: "Real EPFiGMS constraint: PDF only, max 1MB per attachment.",
    copy: "Copy grievance text",
    copied: "Copied to clipboard.",
    fileOnEpfigms: "File this on the official EPFiGMS portal ↗",
    fileNote: "Opens epfigms.gov.in in a new tab. SpashtPF does not submit this for you.",
    notFound: "We couldn't find that claim.",
    loading: "Drafting your grievance…",
  },
  hi: {
    title: "शिकायत मसौदा",
    subtitle: "आधिकारिक शिकायत पोर्टल EPFiGMS के लिए पहले से भरा गया — इसके असली फ़ील्ड जैसा।",
    category: "शिकायत श्रेणी",
    description: "विवरण",
    charCount: (n: number) => `${n} / 5000 अक्षर`,
    checklistTitle: "अपनी शिकायत के साथ संलग्न करें",
    checklist: [
      "बैंक पासबुक की स्कैन कॉपी या रद्द किया गया चेक",
      "आधार कार्ड की प्रति",
      "दावा अस्वीकृति टिप्पणी का स्क्रीनशॉट",
    ],
    checklistNote: "असली EPFiGMS सीमा: केवल PDF, प्रति फ़ाइल अधिकतम 1MB।",
    copy: "शिकायत पाठ कॉपी करें",
    copied: "क्लिपबोर्ड पर कॉपी किया गया।",
    fileOnEpfigms: "आधिकारिक EPFiGMS पोर्टल पर दर्ज करें ↗",
    fileNote: "epfigms.gov.in नए टैब में खुलेगा। SpashtPF इसे आपकी ओर से जमा नहीं करता।",
    notFound: "यह दावा नहीं मिला।",
    loading: "आपकी शिकायत तैयार की जा रही है…",
  },
};

function EscalateContent() {
  const { lang } = useLanguage();
  const t = pick(lang, copy);
  const params = useParams<{ id: string }>();
  const { getClaim, loaded } = useClaims();
  const claim = loaded ? getClaim(params.id) : undefined;
  const rule = claim?.rejectionCode ? rejectionRules.find((r) => r.code === claim.rejectionCode) : undefined;

  const [description, setDescription] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    if (claim && rule) {
      getGrievanceDraft(claim, rule, lang).then((text) => {
        if (!cancelled) setDescription(text);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [claim, rule, lang]);

  if (!loaded) return null;

  if (!claim || !rule) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <Alert variant="error">{t.notFound}</Alert>
      </div>
    );
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(description);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard API unavailable — user can still select and copy manually
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-xl font-semibold text-foreground">{t.title}</h1>
      <p className="mt-1 text-sm text-muted">{t.subtitle}</p>

      <Card className="mt-5">
        <CardContent className="flex flex-col gap-4 pt-5">
          <div>
            <Label>{t.category}</Label>
            <div className="mt-1.5 min-h-11 flex items-center rounded-md border border-border bg-muted-tint px-3.5 text-sm font-medium text-foreground">
              {rule.epfigmsCategory}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <Label htmlFor="description">{t.description}</Label>
              <span className="text-xs text-muted">{t.charCount(description.length)}</span>
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 5000))}
              rows={6}
              className="w-full rounded-md border border-border bg-card p-3.5 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">{t.checklistTitle}</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {t.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted">
                  <span className="mt-0.5 text-primary" aria-hidden>
                    •
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted">{t.checklistNote}</p>
          </div>

          {copied && <Alert variant="success">{t.copied}</Alert>}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleCopy} className="flex-1">
              {t.copy}
            </Button>
            <a
              href="https://epfigms.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 flex-1 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-foreground hover:bg-muted-tint"
            >
              {t.fileOnEpfigms}
            </a>
          </div>
          <p className="text-xs text-muted">{t.fileNote}</p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function EscalatePage() {
  return (
    <RequireAuth>
      <EscalateContent />
    </RequireAuth>
  );
}
